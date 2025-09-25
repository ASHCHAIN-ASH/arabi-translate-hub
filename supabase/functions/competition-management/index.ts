import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    console.log(`Competition Management API - Action: ${action}`);

    switch (action) {
      case 'list-competitions': {
        const status = url.searchParams.get('status');
        const type = url.searchParams.get('type');
        
        let query = supabaseClient
          .from('academic_competitions')
          .select(`
            *,
            participants:competition_participants(count),
            winners:competition_winners(*)
          `)
          .order('created_at', { ascending: false });

        if (status) {
          query = query.eq('status', status);
        }

        if (type) {
          query = query.eq('type', type);
        }

        const { data: competitions, error } = await query;

        if (error) {
          console.error('Error fetching competitions:', error);
          return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Get statistics for each competition
        const competitionsWithStats = await Promise.all(
          competitions.map(async (competition) => {
            const { data: stats } = await supabaseClient.rpc('get_competition_stats', {
              competition_uuid: competition.id
            });

            return {
              ...competition,
              stats: stats || {
                total_participants: 0,
                submitted_count: 0,
                average_score: 0,
                top_score: 0
              }
            };
          })
        );

        return new Response(JSON.stringify({ 
          success: true, 
          competitions: competitionsWithStats 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'get-competition': {
        const competitionId = url.searchParams.get('id');
        
        if (!competitionId) {
          return new Response(JSON.stringify({ error: 'Competition ID is required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const { data: competition, error } = await supabaseClient
          .from('academic_competitions')
          .select(`
            *,
            participants:competition_participants(
              id,
              user_id,
              status,
              score,
              rank,
              registration_date,
              submission_date
            ),
            winners:competition_winners(*),
            votes:competition_votes(count)
          `)
          .eq('id', competitionId)
          .single();

        if (error) {
          console.error('Error fetching competition:', error);
          return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Get detailed statistics
        const { data: stats } = await supabaseClient.rpc('get_competition_stats', {
          competition_uuid: competitionId
        });

        const { data: votingStats } = await supabaseClient.rpc('get_voting_stats', {
          p_competition_id: competitionId
        });

        return new Response(JSON.stringify({ 
          success: true, 
          competition: {
            ...competition,
            stats: stats || {},
            voting_stats: votingStats || []
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'register': {
        const requestBody = await req.json();
        const { competition_id, user_id, metadata = {} } = requestBody;

        if (!competition_id || !user_id) {
          return new Response(JSON.stringify({ 
            error: 'Competition ID and User ID are required' 
          }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const { data: result, error } = await supabaseClient.rpc('register_competition_participation', {
          p_competition_id: competition_id,
          p_user_id: user_id,
          p_metadata: metadata
        });

        if (error) {
          console.error('Error registering participation:', error);
          return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify({ 
          success: true, 
          result: result 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'validate-participation': {
        const competitionId = url.searchParams.get('competition_id');
        const userId = url.searchParams.get('user_id');

        if (!competitionId || !userId) {
          return new Response(JSON.stringify({ 
            error: 'Competition ID and User ID are required' 
          }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const { data: result, error } = await supabaseClient.rpc('validate_competition_participation', {
          p_competition_id: competitionId,
          p_user_id: userId
        });

        if (error) {
          console.error('Error validating participation:', error);
          return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify({ 
          success: true, 
          validation: result 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'vote': {
        const requestBody = await req.json();
        const { competition_id, participant_id, voter_email, vote_value = 1 } = requestBody;

        if (!competition_id || !participant_id || !voter_email) {
          return new Response(JSON.stringify({ 
            error: 'Competition ID, Participant ID, and Voter Email are required' 
          }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const { data: result, error } = await supabaseClient.rpc('add_competition_vote', {
          p_competition_id: competition_id,
          p_participant_id: participant_id,
          p_voter_email: voter_email,
          p_vote_value: vote_value
        });

        if (error) {
          console.error('Error adding vote:', error);
          return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify({ 
          success: true, 
          result: result 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'leaderboard': {
        const competitionId = url.searchParams.get('competition_id');
        const limit = parseInt(url.searchParams.get('limit') || '10');

        if (!competitionId) {
          return new Response(JSON.stringify({ 
            error: 'Competition ID is required' 
          }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const { data: leaderboard, error } = await supabaseClient
          .from('competition_participants')
          .select(`
            id,
            user_id,
            score,
            rank,
            status,
            submission_date,
            votes:competition_votes(count)
          `)
          .eq('competition_id', competitionId)
          .not('score', 'is', null)
          .order('rank', { ascending: true })
          .limit(limit);

        if (error) {
          console.error('Error fetching leaderboard:', error);
          return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify({ 
          success: true, 
          leaderboard: leaderboard || [] 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'submit': {
        const requestBody = await req.json();
        const { 
          participation_id, 
          submission_content, 
          submission_file_url, 
          quiz_answers,
          metadata = {}
        } = requestBody;

        if (!participation_id) {
          return new Response(JSON.stringify({ 
            error: 'Participation ID is required' 
          }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const updateData: any = {
          status: 'submitted',
          submission_date: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        if (submission_content) updateData.submission_content = submission_content;
        if (submission_file_url) updateData.submission_file_url = submission_file_url;
        if (quiz_answers) updateData.quiz_answers = quiz_answers;
        if (metadata) updateData.submission_metadata = metadata;

        const { data: result, error } = await supabaseClient
          .from('competition_participants')
          .update(updateData)
          .eq('id', participation_id)
          .select()
          .single();

        if (error) {
          console.error('Error submitting participation:', error);
          return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify({ 
          success: true, 
          submission: result 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default: {
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }
  } catch (error) {
    console.error('Error in competition-management function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});