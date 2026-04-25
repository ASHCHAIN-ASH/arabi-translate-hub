import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const userClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const adminUserId = userData.user.id;

    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // Verify admin role
    const { data: roleRow } = await admin
      .from('user_roles')
      .select('role')
      .eq('user_id', adminUserId)
      .eq('role', 'admin')
      .maybeSingle();
    if (!roleRow) {
      return new Response(JSON.stringify({ error: 'Forbidden: admin only' }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json().catch(() => ({}));
    const redemptionId = String(body?.redemption_id || '');
    const action = String(body?.action || ''); // approve | reject | mark_paid
    const reviewNotes = body?.notes ? String(body.notes).slice(0, 500) : null;

    if (!redemptionId || !['approve', 'reject', 'mark_paid'].includes(action)) {
      return new Response(JSON.stringify({ error: 'Invalid input' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: redemption, error: rErr } = await admin
      .from('reward_redemptions')
      .select('*')
      .eq('id', redemptionId)
      .maybeSingle();
    if (rErr) throw rErr;
    if (!redemption) {
      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: wallet } = await admin
      .from('student_wallets')
      .select('*')
      .eq('id', redemption.wallet_id)
      .maybeSingle();
    if (!wallet) throw new Error('Wallet not found');

    const now = new Date().toISOString();

    if (action === 'reject') {
      if (redemption.status !== 'pending') {
        return new Response(JSON.stringify({ error: 'Already reviewed' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      // Refund points
      await admin
        .from('student_wallets')
        .update({
          points_balance: (wallet.points_balance || 0) + redemption.points_spent,
          pending_points: Math.max(0, (wallet.pending_points || 0) - redemption.points_spent),
        })
        .eq('id', wallet.id);

      await admin
        .from('reward_redemptions')
        .update({ status: 'rejected', reviewed_at: now, reviewed_by: adminUserId, notes: reviewNotes ?? redemption.notes })
        .eq('id', redemption.id);

      await admin
        .from('student_wallet_transactions')
        .update({ status: 'reversed' })
        .eq('source_id', redemption.id)
        .eq('user_id', redemption.user_id)
        .eq('transaction_type', 'redeem');

      // Reversal record
      await admin.from('student_wallet_transactions').insert({
        user_id: redemption.user_id,
        wallet_id: wallet.id,
        transaction_type: 'reverse',
        source_type: 'admin_adjustment',
        source_id: redemption.id,
        points_amount: redemption.points_spent,
        status: 'completed',
        description: 'استرجاع نقاط بعد رفض الاستبدال',
        metadata: { redemption_id: redemption.id, reviewed_by: adminUserId },
      });
    } else {
      // approve or mark_paid
      const newStatus = action === 'mark_paid' ? 'paid' : 'approved';
      if (redemption.status === 'rejected') {
        return new Response(JSON.stringify({ error: 'Cannot approve a rejected redemption' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Move from pending_points to redeemed_points (only on first approval)
      if (redemption.status === 'pending') {
        await admin
          .from('student_wallets')
          .update({
            pending_points: Math.max(0, (wallet.pending_points || 0) - redemption.points_spent),
            redeemed_points: (wallet.redeemed_points || 0) + redemption.points_spent,
          })
          .eq('id', wallet.id);

        await admin
          .from('student_wallet_transactions')
          .update({ status: 'completed' })
          .eq('source_id', redemption.id)
          .eq('user_id', redemption.user_id)
          .eq('transaction_type', 'redeem');
      }

      await admin
        .from('reward_redemptions')
        .update({ status: newStatus, reviewed_at: now, reviewed_by: adminUserId, notes: reviewNotes ?? redemption.notes })
        .eq('id', redemption.id);
    }

    await admin.from('student_activity_logs').insert({
      user_id: redemption.user_id,
      action: 'redemption_reviewed',
      metadata: { redemption_id: redemption.id, action, reviewed_by: adminUserId },
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('admin_review_redemption error', e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
