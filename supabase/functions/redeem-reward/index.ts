// Redeem a gamification reward atomically: spend points, create user_reward, optionally credit wallet.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;

    // Validate user
    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: 'invalid_token' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const userId = userData.user.id;

    const body = await req.json().catch(() => ({}));
    const rewardId = String(body.reward_id || '');
    if (!rewardId) {
      return new Response(JSON.stringify({ error: 'reward_id required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);

    // Fetch reward
    const { data: reward, error: rErr } = await admin
      .from('gamification_rewards').select('*').eq('id', rewardId).maybeSingle();
    if (rErr || !reward) {
      return new Response(JSON.stringify({ error: 'reward_not_found' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (!reward.is_active) {
      return new Response(JSON.stringify({ error: 'reward_inactive' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (reward.total_stock !== null && reward.total_redeemed >= reward.total_stock) {
      return new Response(JSON.stringify({ error: 'out_of_stock' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check user points
    const { data: pts } = await admin
      .from('user_points').select('total_points, current_level_id').eq('user_id', userId).maybeSingle();
    const total = pts?.total_points ?? 0;

    if (total < reward.cost_points) {
      return new Response(JSON.stringify({ error: 'insufficient_points', total, required: reward.cost_points }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Per-user limit
    if (reward.max_redemptions_per_user !== null) {
      const { count } = await admin
        .from('user_rewards')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('reward_id', rewardId);
      if ((count ?? 0) >= reward.max_redemptions_per_user) {
        return new Response(JSON.stringify({ error: 'limit_reached' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Level requirement
    if (reward.level_required_id) {
      const { data: needLevel } = await admin
        .from('gamification_levels').select('required_points').eq('id', reward.level_required_id).maybeSingle();
      if (needLevel && total < (needLevel.required_points ?? 0)) {
        return new Response(JSON.stringify({ error: 'level_required' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Spend points (negative). award_points handles balance update via trigger.
    const redemptionKey = `${rewardId}-${Date.now()}`;
    const { error: spendErr } = await admin.rpc('award_points', {
      _user_id: userId,
      _base_points: -reward.cost_points,
      _source_type: 'reward_redeemed',
      _source_id: redemptionKey,
      _description: `استبدال مكافأة: ${reward.title_ar}`,
      _apply_multiplier: false,
      _metadata: { reward_id: rewardId },
    });
    if (spendErr) {
      return new Response(JSON.stringify({ error: 'spend_failed', detail: spendErr.message }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create user_reward
    const expiresAt = reward.expires_in_days
      ? new Date(Date.now() + reward.expires_in_days * 86400_000).toISOString()
      : null;

    const { data: ur, error: urErr } = await admin
      .from('user_rewards')
      .insert({
        user_id: userId,
        reward_id: rewardId,
        status: 'available',
        expires_at: expiresAt,
        metadata: { redemption_key: redemptionKey, value: reward.value, type: reward.type },
      })
      .select('*')
      .single();

    if (urErr) {
      // Rollback points
      await admin.rpc('award_points', {
        _user_id: userId,
        _base_points: reward.cost_points,
        _source_type: 'reward_rollback',
        _source_id: redemptionKey,
        _description: 'استرجاع نقاط (فشل الاستبدال)',
        _apply_multiplier: false,
        _metadata: { reward_id: rewardId, error: urErr.message },
      });
      return new Response(JSON.stringify({ error: 'create_failed', detail: urErr.message }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Increment redeemed counter
    await admin
      .from('gamification_rewards')
      .update({ total_redeemed: (reward.total_redeemed ?? 0) + 1 })
      .eq('id', rewardId);

    // If reward is wallet credit → credit wallet
    if (reward.type === 'wallet' && reward.value > 0) {
      const { data: wallet } = await admin.from('wallets').select('id').eq('user_id', userId).maybeSingle();
      let walletId = wallet?.id;
      if (!walletId) {
        const { data: nw } = await admin.from('wallets').insert({ user_id: userId }).select('id').single();
        walletId = nw?.id;
      }
      if (walletId) {
        await admin.from('wallet_transactions').insert({
          wallet_id: walletId,
          user_id: userId,
          type: 'deposit',
          amount: reward.value,
          description: `مكافأة Gamification: ${reward.title_ar}`,
          reference_type: 'gamification_reward',
          reference_id: ur.id,
        });
        await admin.from('user_rewards').update({ status: 'used', used_at: new Date().toISOString() }).eq('id', ur.id);
      }
    }

    // Notify user
    await admin.from('user_notifications').insert({
      user_id: userId,
      title: '🎁 تم استبدال مكافأة',
      message: `حصلت على "${reward.title_ar}" مقابل ${reward.cost_points} نقطة`,
      type: 'gamification',
      link: '/rewards',
    });

    return new Response(JSON.stringify({ ok: true, user_reward: ur }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'internal', detail: String(e?.message || e) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
