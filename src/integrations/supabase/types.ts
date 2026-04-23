export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      academic_cvs: {
        Row: {
          created_at: string
          data: Json
          exports_count: number
          id: string
          language: string
          last_exported_at: string | null
          locked_template_key: string | null
          paid_amount: number | null
          paid_at: string | null
          purchase_id: string | null
          status: string
          template_key: string
          template_swap_deadline: string | null
          template_swap_used: boolean
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json
          exports_count?: number
          id?: string
          language?: string
          last_exported_at?: string | null
          locked_template_key?: string | null
          paid_amount?: number | null
          paid_at?: string | null
          purchase_id?: string | null
          status?: string
          template_key?: string
          template_swap_deadline?: string | null
          template_swap_used?: boolean
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json
          exports_count?: number
          id?: string
          language?: string
          last_exported_at?: string | null
          locked_template_key?: string | null
          paid_amount?: number | null
          paid_at?: string | null
          purchase_id?: string | null
          status?: string
          template_key?: string
          template_swap_deadline?: string | null
          template_swap_used?: boolean
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      assessment_answers: {
        Row: {
          answered_at: string
          attempt_id: string
          id: string
          is_correct: boolean
          question_id: string
          selected_option_id: string | null
        }
        Insert: {
          answered_at?: string
          attempt_id: string
          id?: string
          is_correct?: boolean
          question_id: string
          selected_option_id?: string | null
        }
        Update: {
          answered_at?: string
          attempt_id?: string
          id?: string
          is_correct?: boolean
          question_id?: string
          selected_option_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assessment_answers_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "assessment_attempts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessment_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "assessment_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessment_answers_selected_option_id_fkey"
            columns: ["selected_option_id"]
            isOneToOne: false
            referencedRelation: "assessment_options"
            referencedColumns: ["id"]
          },
        ]
      }
      assessment_attempts: {
        Row: {
          anonymous_id: string | null
          assessment_id: string
          completed_at: string | null
          correct_count: number
          id: string
          level_result: string | null
          share_xp_awarded: number
          shared_at: string | null
          skill_breakdown: Json
          started_at: string
          status: string
          time_spent_seconds: number
          total_questions: number
          total_score: number
          user_id: string | null
          xp_awarded: number
        }
        Insert: {
          anonymous_id?: string | null
          assessment_id: string
          completed_at?: string | null
          correct_count?: number
          id?: string
          level_result?: string | null
          share_xp_awarded?: number
          shared_at?: string | null
          skill_breakdown?: Json
          started_at?: string
          status?: string
          time_spent_seconds?: number
          total_questions?: number
          total_score?: number
          user_id?: string | null
          xp_awarded?: number
        }
        Update: {
          anonymous_id?: string | null
          assessment_id?: string
          completed_at?: string | null
          correct_count?: number
          id?: string
          level_result?: string | null
          share_xp_awarded?: number
          shared_at?: string | null
          skill_breakdown?: Json
          started_at?: string
          status?: string
          time_spent_seconds?: number
          total_questions?: number
          total_score?: number
          user_id?: string | null
          xp_awarded?: number
        }
        Relationships: [
          {
            foreignKeyName: "assessment_attempts_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      assessment_options: {
        Row: {
          created_at: string
          id: string
          is_correct: boolean
          option_text: string
          order_index: number
          question_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_correct?: boolean
          option_text: string
          order_index?: number
          question_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_correct?: boolean
          option_text?: string
          order_index?: number
          question_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessment_options_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "assessment_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      assessment_questions: {
        Row: {
          assessment_id: string
          created_at: string
          difficulty: string
          explanation: string | null
          id: string
          order_index: number
          question_text: string
          skill_tag: string
        }
        Insert: {
          assessment_id: string
          created_at?: string
          difficulty?: string
          explanation?: string | null
          id?: string
          order_index?: number
          question_text: string
          skill_tag?: string
        }
        Update: {
          assessment_id?: string
          created_at?: string
          difficulty?: string
          explanation?: string | null
          id?: string
          order_index?: number
          question_text?: string
          skill_tag?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessment_questions_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      assessments: {
        Row: {
          category: string
          cover_emoji: string | null
          created_at: string
          description: string | null
          difficulty_profile: Json
          id: string
          is_active: boolean
          slug: string
          sort_order: number
          time_limit_seconds: number
          title: string
          updated_at: string
          xp_completion: number
          xp_share: number
        }
        Insert: {
          category?: string
          cover_emoji?: string | null
          created_at?: string
          description?: string | null
          difficulty_profile?: Json
          id?: string
          is_active?: boolean
          slug: string
          sort_order?: number
          time_limit_seconds?: number
          title: string
          updated_at?: string
          xp_completion?: number
          xp_share?: number
        }
        Update: {
          category?: string
          cover_emoji?: string | null
          created_at?: string
          description?: string | null
          difficulty_profile?: Json
          id?: string
          is_active?: boolean
          slug?: string
          sort_order?: number
          time_limit_seconds?: number
          title?: string
          updated_at?: string
          xp_completion?: number
          xp_share?: number
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: string | null
          new_data: Json | null
          old_data: Json | null
          record_id: string | null
          table_name: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      auth_phone_lockouts: {
        Row: {
          created_at: string
          id: string
          locked_at: string
          locked_until: string
          phone: string
          reason: string
        }
        Insert: {
          created_at?: string
          id?: string
          locked_at?: string
          locked_until: string
          phone: string
          reason?: string
        }
        Update: {
          created_at?: string
          id?: string
          locked_at?: string
          locked_until?: string
          phone?: string
          reason?: string
        }
        Relationships: []
      }
      auth_whatsapp_otp: {
        Row: {
          attempts: number
          code_hash: string
          consumed_at: string | null
          created_at: string
          expires_at: string
          full_name: string | null
          id: string
          ip_address: string | null
          max_attempts: number
          phone: string
          purpose: string
          user_agent: string | null
        }
        Insert: {
          attempts?: number
          code_hash: string
          consumed_at?: string | null
          created_at?: string
          expires_at: string
          full_name?: string | null
          id?: string
          ip_address?: string | null
          max_attempts?: number
          phone: string
          purpose?: string
          user_agent?: string | null
        }
        Update: {
          attempts?: number
          code_hash?: string
          consumed_at?: string | null
          created_at?: string
          expires_at?: string
          full_name?: string | null
          id?: string
          ip_address?: string | null
          max_attempts?: number
          phone?: string
          purpose?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      automation_actions_log: {
        Row: {
          action_payload: Json
          action_type: string
          created_at: string
          created_by: string | null
          id: string
          insight_id: string | null
          note: string | null
          status: string
        }
        Insert: {
          action_payload?: Json
          action_type: string
          created_at?: string
          created_by?: string | null
          id?: string
          insight_id?: string | null
          note?: string | null
          status?: string
        }
        Update: {
          action_payload?: Json
          action_type?: string
          created_at?: string
          created_by?: string | null
          id?: string
          insight_id?: string | null
          note?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "automation_actions_log_insight_id_fkey"
            columns: ["insight_id"]
            isOneToOne: false
            referencedRelation: "automation_insights"
            referencedColumns: ["id"]
          },
        ]
      }
      automation_insights: {
        Row: {
          comparison_value: number | null
          context_data: Json
          created_at: string
          dedupe_key: string
          delta_percentage: number | null
          description: string
          detected_at: string
          dismissed_at: string | null
          id: string
          insight_type: string
          last_seen_at: string
          metric_key: string
          metric_value: number | null
          recommendation: string
          resolved_at: string | null
          severity: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          comparison_value?: number | null
          context_data?: Json
          created_at?: string
          dedupe_key: string
          delta_percentage?: number | null
          description: string
          detected_at?: string
          dismissed_at?: string | null
          id?: string
          insight_type: string
          last_seen_at?: string
          metric_key: string
          metric_value?: number | null
          recommendation: string
          resolved_at?: string | null
          severity: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          comparison_value?: number | null
          context_data?: Json
          created_at?: string
          dedupe_key?: string
          delta_percentage?: number | null
          description?: string
          detected_at?: string
          dismissed_at?: string | null
          id?: string
          insight_type?: string
          last_seen_at?: string
          metric_key?: string
          metric_value?: number | null
          recommendation?: string
          resolved_at?: string | null
          severity?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      automation_rules: {
        Row: {
          comparison_operator: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          lookback_days: number
          recommendation_template: string
          rule_group: string
          rule_key: string
          rule_name: string
          threshold_value: number
          updated_at: string
        }
        Insert: {
          comparison_operator?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          lookback_days?: number
          recommendation_template: string
          rule_group: string
          rule_key: string
          rule_name: string
          threshold_value: number
          updated_at?: string
        }
        Update: {
          comparison_operator?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          lookback_days?: number
          recommendation_template?: string
          rule_group?: string
          rule_key?: string
          rule_name?: string
          threshold_value?: number
          updated_at?: string
        }
        Relationships: []
      }
      automation_snapshots: {
        Row: {
          created_at: string
          id: string
          metrics_payload: Json
          snapshot_date: string
        }
        Insert: {
          created_at?: string
          id?: string
          metrics_payload?: Json
          snapshot_date: string
        }
        Update: {
          created_at?: string
          id?: string
          metrics_payload?: Json
          snapshot_date?: string
        }
        Relationships: []
      }
      battle_quiz_1v1_friend_invites: {
        Row: {
          accepted_at: string | null
          category: string
          created_at: string
          expires_at: string
          id: string
          invite_code: string
          invitee_id: string | null
          inviter_id: string
          match_id: string | null
          mode: Database["public"]["Enums"]["bq_1v1_mode"]
          status: string
          updated_at: string
        }
        Insert: {
          accepted_at?: string | null
          category?: string
          created_at?: string
          expires_at?: string
          id?: string
          invite_code: string
          invitee_id?: string | null
          inviter_id: string
          match_id?: string | null
          mode?: Database["public"]["Enums"]["bq_1v1_mode"]
          status?: string
          updated_at?: string
        }
        Update: {
          accepted_at?: string | null
          category?: string
          created_at?: string
          expires_at?: string
          id?: string
          invite_code?: string
          invitee_id?: string | null
          inviter_id?: string
          match_id?: string | null
          mode?: Database["public"]["Enums"]["bq_1v1_mode"]
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "battle_quiz_1v1_friend_invites_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "battle_quiz_1v1_matches"
            referencedColumns: ["id"]
          },
        ]
      }
      battle_quiz_1v1_matches: {
        Row: {
          category: string
          created_at: string
          finalized_at: string | null
          id: string
          invite_id: string | null
          mode: Database["public"]["Enums"]["bq_1v1_mode"]
          player_a_attempt_id: string | null
          player_a_correct: number
          player_a_finished_at: string | null
          player_a_id: string
          player_a_last_seen: string
          player_a_score: number
          player_a_time_ms: number
          player_b_attempt_id: string | null
          player_b_correct: number
          player_b_finished_at: string | null
          player_b_id: string
          player_b_last_seen: string
          player_b_score: number
          player_b_time_ms: number
          rating_delta: number
          rematch_of_match_id: string | null
          rematch_request_by: string | null
          room_id: string
          started_at: string
          status: Database["public"]["Enums"]["bq_1v1_match_status"]
          updated_at: string
          winner_id: string | null
        }
        Insert: {
          category?: string
          created_at?: string
          finalized_at?: string | null
          id?: string
          invite_id?: string | null
          mode?: Database["public"]["Enums"]["bq_1v1_mode"]
          player_a_attempt_id?: string | null
          player_a_correct?: number
          player_a_finished_at?: string | null
          player_a_id: string
          player_a_last_seen?: string
          player_a_score?: number
          player_a_time_ms?: number
          player_b_attempt_id?: string | null
          player_b_correct?: number
          player_b_finished_at?: string | null
          player_b_id: string
          player_b_last_seen?: string
          player_b_score?: number
          player_b_time_ms?: number
          rating_delta?: number
          rematch_of_match_id?: string | null
          rematch_request_by?: string | null
          room_id: string
          started_at?: string
          status?: Database["public"]["Enums"]["bq_1v1_match_status"]
          updated_at?: string
          winner_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          finalized_at?: string | null
          id?: string
          invite_id?: string | null
          mode?: Database["public"]["Enums"]["bq_1v1_mode"]
          player_a_attempt_id?: string | null
          player_a_correct?: number
          player_a_finished_at?: string | null
          player_a_id?: string
          player_a_last_seen?: string
          player_a_score?: number
          player_a_time_ms?: number
          player_b_attempt_id?: string | null
          player_b_correct?: number
          player_b_finished_at?: string | null
          player_b_id?: string
          player_b_last_seen?: string
          player_b_score?: number
          player_b_time_ms?: number
          rating_delta?: number
          rematch_of_match_id?: string | null
          rematch_request_by?: string | null
          room_id?: string
          started_at?: string
          status?: Database["public"]["Enums"]["bq_1v1_match_status"]
          updated_at?: string
          winner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "battle_quiz_1v1_matches_rematch_of_match_id_fkey"
            columns: ["rematch_of_match_id"]
            isOneToOne: false
            referencedRelation: "battle_quiz_1v1_matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "battle_quiz_1v1_matches_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "battle_quiz_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      battle_quiz_1v1_queue: {
        Row: {
          category: string
          created_at: string
          id: string
          match_id: string | null
          matched_with_user_id: string | null
          status: Database["public"]["Enums"]["bq_1v1_queue_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          created_at?: string
          id?: string
          match_id?: string | null
          matched_with_user_id?: string | null
          status?: Database["public"]["Enums"]["bq_1v1_queue_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          match_id?: string | null
          matched_with_user_id?: string | null
          status?: Database["public"]["Enums"]["bq_1v1_queue_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      battle_quiz_1v1_ratings: {
        Row: {
          best_streak: number
          current_streak: number
          draws: number
          last_match_at: string | null
          losses: number
          matches_played: number
          rating: number
          updated_at: string
          user_id: string
          wins: number
        }
        Insert: {
          best_streak?: number
          current_streak?: number
          draws?: number
          last_match_at?: string | null
          losses?: number
          matches_played?: number
          rating?: number
          updated_at?: string
          user_id: string
          wins?: number
        }
        Update: {
          best_streak?: number
          current_streak?: number
          draws?: number
          last_match_at?: string | null
          losses?: number
          matches_played?: number
          rating?: number
          updated_at?: string
          user_id?: string
          wins?: number
        }
        Relationships: []
      }
      battle_quiz_answers: {
        Row: {
          attempt_id: string
          awarded_points: number
          created_at: string
          id: string
          is_correct: boolean
          question_id: string
          response_time_ms: number
          selected_choice_id: string | null
        }
        Insert: {
          attempt_id: string
          awarded_points?: number
          created_at?: string
          id?: string
          is_correct?: boolean
          question_id: string
          response_time_ms?: number
          selected_choice_id?: string | null
        }
        Update: {
          attempt_id?: string
          awarded_points?: number
          created_at?: string
          id?: string
          is_correct?: boolean
          question_id?: string
          response_time_ms?: number
          selected_choice_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "battle_quiz_answers_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "battle_quiz_attempts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "battle_quiz_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "battle_quiz_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "battle_quiz_answers_selected_choice_id_fkey"
            columns: ["selected_choice_id"]
            isOneToOne: false
            referencedRelation: "battle_quiz_choices"
            referencedColumns: ["id"]
          },
        ]
      }
      battle_quiz_attempts: {
        Row: {
          completed_at: string | null
          correct_count: number
          created_at: string
          id: string
          question_order: Json
          reward_amount: number | null
          room_id: string
          score: number
          started_at: string
          status: Database["public"]["Enums"]["battle_quiz_attempt_status"]
          suspicious_score: number
          total_questions: number
          total_time_ms: number
          user_id: string
          xp_earned: number
        }
        Insert: {
          completed_at?: string | null
          correct_count?: number
          created_at?: string
          id?: string
          question_order?: Json
          reward_amount?: number | null
          room_id: string
          score?: number
          started_at?: string
          status?: Database["public"]["Enums"]["battle_quiz_attempt_status"]
          suspicious_score?: number
          total_questions?: number
          total_time_ms?: number
          user_id: string
          xp_earned?: number
        }
        Update: {
          completed_at?: string | null
          correct_count?: number
          created_at?: string
          id?: string
          question_order?: Json
          reward_amount?: number | null
          room_id?: string
          score?: number
          started_at?: string
          status?: Database["public"]["Enums"]["battle_quiz_attempt_status"]
          suspicious_score?: number
          total_questions?: number
          total_time_ms?: number
          user_id?: string
          xp_earned?: number
        }
        Relationships: [
          {
            foreignKeyName: "battle_quiz_attempts_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "battle_quiz_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      battle_quiz_choices: {
        Row: {
          choice_text: string
          created_at: string
          id: string
          is_correct: boolean
          order_index: number
          question_id: string
        }
        Insert: {
          choice_text: string
          created_at?: string
          id?: string
          is_correct?: boolean
          order_index?: number
          question_id: string
        }
        Update: {
          choice_text?: string
          created_at?: string
          id?: string
          is_correct?: boolean
          order_index?: number
          question_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "battle_quiz_choices_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "battle_quiz_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      battle_quiz_daily_limits: {
        Row: {
          created_at: string
          daily_attempts_count: number
          quiz_date: string
          reward_eligible_count: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          daily_attempts_count?: number
          quiz_date: string
          reward_eligible_count?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          daily_attempts_count?: number
          quiz_date?: string
          reward_eligible_count?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      battle_quiz_daily_missions: {
        Row: {
          created_at: string
          description_ar: string | null
          icon: string | null
          id: string
          is_active: boolean
          mission_type: string
          scope: string
          slug: string
          sort_order: number
          target_value: number
          title_ar: string
          updated_at: string
          xp_reward: number
        }
        Insert: {
          created_at?: string
          description_ar?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          mission_type: string
          scope?: string
          slug: string
          sort_order?: number
          target_value?: number
          title_ar: string
          updated_at?: string
          xp_reward?: number
        }
        Update: {
          created_at?: string
          description_ar?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          mission_type?: string
          scope?: string
          slug?: string
          sort_order?: number
          target_value?: number
          title_ar?: string
          updated_at?: string
          xp_reward?: number
        }
        Relationships: []
      }
      battle_quiz_flags: {
        Row: {
          attempt_id: string | null
          created_at: string
          flag_reason: string | null
          flag_type: string
          id: string
          metadata: Json | null
          risk_score: number
          user_id: string
        }
        Insert: {
          attempt_id?: string | null
          created_at?: string
          flag_reason?: string | null
          flag_type: string
          id?: string
          metadata?: Json | null
          risk_score?: number
          user_id: string
        }
        Update: {
          attempt_id?: string | null
          created_at?: string
          flag_reason?: string | null
          flag_type?: string
          id?: string
          metadata?: Json | null
          risk_score?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "battle_quiz_flags_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "battle_quiz_attempts"
            referencedColumns: ["id"]
          },
        ]
      }
      battle_quiz_leaderboards: {
        Row: {
          attempt_id: string | null
          created_at: string
          id: string
          rank_position: number | null
          reward_status:
            | Database["public"]["Enums"]["battle_quiz_reward_status"]
            | null
          room_id: string
          total_correct: number
          total_score: number
          total_time_ms: number
          updated_at: string
          user_id: string
        }
        Insert: {
          attempt_id?: string | null
          created_at?: string
          id?: string
          rank_position?: number | null
          reward_status?:
            | Database["public"]["Enums"]["battle_quiz_reward_status"]
            | null
          room_id: string
          total_correct?: number
          total_score?: number
          total_time_ms?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          attempt_id?: string | null
          created_at?: string
          id?: string
          rank_position?: number | null
          reward_status?:
            | Database["public"]["Enums"]["battle_quiz_reward_status"]
            | null
          room_id?: string
          total_correct?: number
          total_score?: number
          total_time_ms?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "battle_quiz_leaderboards_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "battle_quiz_attempts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "battle_quiz_leaderboards_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "battle_quiz_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      battle_quiz_questions: {
        Row: {
          anti_cheat_type: Database["public"]["Enums"]["battle_quiz_anti_cheat_type"]
          created_at: string
          difficulty: Database["public"]["Enums"]["battle_quiz_difficulty"]
          explanation: string | null
          id: string
          order_index: number
          question_bank_id: string | null
          question_text: string
          question_type: string
          room_id: string
          time_limit_seconds: number
        }
        Insert: {
          anti_cheat_type?: Database["public"]["Enums"]["battle_quiz_anti_cheat_type"]
          created_at?: string
          difficulty?: Database["public"]["Enums"]["battle_quiz_difficulty"]
          explanation?: string | null
          id?: string
          order_index?: number
          question_bank_id?: string | null
          question_text: string
          question_type?: string
          room_id: string
          time_limit_seconds?: number
        }
        Update: {
          anti_cheat_type?: Database["public"]["Enums"]["battle_quiz_anti_cheat_type"]
          created_at?: string
          difficulty?: Database["public"]["Enums"]["battle_quiz_difficulty"]
          explanation?: string | null
          id?: string
          order_index?: number
          question_bank_id?: string | null
          question_text?: string
          question_type?: string
          room_id?: string
          time_limit_seconds?: number
        }
        Relationships: [
          {
            foreignKeyName: "battle_quiz_questions_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "battle_quiz_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      battle_quiz_rewards: {
        Row: {
          attempt_id: string | null
          created_at: string
          id: string
          metadata: Json | null
          reward_type: Database["public"]["Enums"]["battle_quiz_reward_type"]
          reward_value: number
          room_id: string
          status: Database["public"]["Enums"]["battle_quiz_reward_status"]
          user_id: string
        }
        Insert: {
          attempt_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          reward_type?: Database["public"]["Enums"]["battle_quiz_reward_type"]
          reward_value?: number
          room_id: string
          status?: Database["public"]["Enums"]["battle_quiz_reward_status"]
          user_id: string
        }
        Update: {
          attempt_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          reward_type?: Database["public"]["Enums"]["battle_quiz_reward_type"]
          reward_value?: number
          room_id?: string
          status?: Database["public"]["Enums"]["battle_quiz_reward_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "battle_quiz_rewards_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "battle_quiz_attempts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "battle_quiz_rewards_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "battle_quiz_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      battle_quiz_rooms: {
        Row: {
          category: string
          cover_emoji: string | null
          created_at: string
          created_by: string | null
          description: string | null
          ends_at: string | null
          id: string
          is_reward_eligible: boolean
          mode: Database["public"]["Enums"]["battle_quiz_mode"]
          question_count: number
          starts_at: string | null
          status: Database["public"]["Enums"]["battle_quiz_room_status"]
          time_limit_per_question: number
          title: string
          updated_at: string
          xp_completion_bonus: number
          xp_per_correct: number
          xp_top_bonus: number
        }
        Insert: {
          category?: string
          cover_emoji?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          ends_at?: string | null
          id?: string
          is_reward_eligible?: boolean
          mode?: Database["public"]["Enums"]["battle_quiz_mode"]
          question_count?: number
          starts_at?: string | null
          status?: Database["public"]["Enums"]["battle_quiz_room_status"]
          time_limit_per_question?: number
          title: string
          updated_at?: string
          xp_completion_bonus?: number
          xp_per_correct?: number
          xp_top_bonus?: number
        }
        Update: {
          category?: string
          cover_emoji?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          ends_at?: string | null
          id?: string
          is_reward_eligible?: boolean
          mode?: Database["public"]["Enums"]["battle_quiz_mode"]
          question_count?: number
          starts_at?: string | null
          status?: Database["public"]["Enums"]["battle_quiz_room_status"]
          time_limit_per_question?: number
          title?: string
          updated_at?: string
          xp_completion_bonus?: number
          xp_per_correct?: number
          xp_top_bonus?: number
        }
        Relationships: []
      }
      battle_quiz_user_missions: {
        Row: {
          claimed_at: string | null
          completed_at: string | null
          created_at: string
          id: string
          is_claimed: boolean
          is_completed: boolean
          mission_date: string
          mission_id: string
          progress: number
          updated_at: string
          user_id: string
        }
        Insert: {
          claimed_at?: string | null
          completed_at?: string | null
          created_at?: string
          id?: string
          is_claimed?: boolean
          is_completed?: boolean
          mission_date?: string
          mission_id: string
          progress?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          claimed_at?: string | null
          completed_at?: string | null
          created_at?: string
          id?: string
          is_claimed?: boolean
          is_completed?: boolean
          mission_date?: string
          mission_id?: string
          progress?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "battle_quiz_user_missions_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "battle_quiz_daily_missions"
            referencedColumns: ["id"]
          },
        ]
      }
      challenge_achievements: {
        Row: {
          badge_color: string | null
          created_at: string
          criteria_type: string
          criteria_value: number
          description_ar: string | null
          icon: string | null
          id: string
          is_active: boolean
          name_ar: string
          rarity: string
          slug: string
          sort_order: number
          xp_bonus: number
        }
        Insert: {
          badge_color?: string | null
          created_at?: string
          criteria_type: string
          criteria_value?: number
          description_ar?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name_ar: string
          rarity?: string
          slug: string
          sort_order?: number
          xp_bonus?: number
        }
        Update: {
          badge_color?: string | null
          created_at?: string
          criteria_type?: string
          criteria_value?: number
          description_ar?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name_ar?: string
          rarity?: string
          slug?: string
          sort_order?: number
          xp_bonus?: number
        }
        Relationships: []
      }
      challenge_attempts: {
        Row: {
          answers: Json
          attempt_number: number
          challenge_id: string
          completed_at: string | null
          correct_count: number
          id: string
          is_perfect: boolean
          score: number
          started_at: string
          status: string
          time_taken_seconds: number | null
          total_questions: number
          user_id: string
          xp_awarded: number
        }
        Insert: {
          answers?: Json
          attempt_number?: number
          challenge_id: string
          completed_at?: string | null
          correct_count?: number
          id?: string
          is_perfect?: boolean
          score?: number
          started_at?: string
          status?: string
          time_taken_seconds?: number | null
          total_questions?: number
          user_id: string
          xp_awarded?: number
        }
        Update: {
          answers?: Json
          attempt_number?: number
          challenge_id?: string
          completed_at?: string | null
          correct_count?: number
          id?: string
          is_perfect?: boolean
          score?: number
          started_at?: string
          status?: string
          time_taken_seconds?: number | null
          total_questions?: number
          user_id?: string
          xp_awarded?: number
        }
        Relationships: [
          {
            foreignKeyName: "challenge_attempts_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "daily_challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      challenge_daily_challenges: {
        Row: {
          action_target: string | null
          action_type: string | null
          category: string | null
          challenge_date: string
          correct_answer: string | null
          created_at: string
          description_ar: string | null
          difficulty: string
          explanation_ar: string | null
          icon: string | null
          id: string
          is_active: boolean
          options: Json | null
          question_ar: string | null
          title_ar: string
          type: string
          updated_at: string
          xp_reward: number
        }
        Insert: {
          action_target?: string | null
          action_type?: string | null
          category?: string | null
          challenge_date: string
          correct_answer?: string | null
          created_at?: string
          description_ar?: string | null
          difficulty?: string
          explanation_ar?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          options?: Json | null
          question_ar?: string | null
          title_ar: string
          type: string
          updated_at?: string
          xp_reward?: number
        }
        Update: {
          action_target?: string | null
          action_type?: string | null
          category?: string | null
          challenge_date?: string
          correct_answer?: string | null
          created_at?: string
          description_ar?: string | null
          difficulty?: string
          explanation_ar?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          options?: Json | null
          question_ar?: string | null
          title_ar?: string
          type?: string
          updated_at?: string
          xp_reward?: number
        }
        Relationships: []
      }
      challenge_levels: {
        Row: {
          badge_color: string | null
          badge_label: string | null
          created_at: string
          icon: string | null
          id: string
          is_active: boolean
          name_ar: string
          name_en: string | null
          perks_json: Json
          required_xp: number
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          badge_color?: string | null
          badge_label?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          is_active?: boolean
          name_ar: string
          name_en?: string | null
          perks_json?: Json
          required_xp?: number
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          badge_color?: string | null
          badge_label?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          is_active?: boolean
          name_ar?: string
          name_en?: string | null
          perks_json?: Json
          required_xp?: number
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      challenge_questions: {
        Row: {
          challenge_id: string
          correct_answer: string
          created_at: string
          explanation: string | null
          id: string
          options: Json
          question: string
          sort_order: number
        }
        Insert: {
          challenge_id: string
          correct_answer: string
          created_at?: string
          explanation?: string | null
          id?: string
          options?: Json
          question: string
          sort_order?: number
        }
        Update: {
          challenge_id?: string
          correct_answer?: string
          created_at?: string
          explanation?: string | null
          id?: string
          options?: Json
          question?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "challenge_questions_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "daily_challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      challenge_streaks: {
        Row: {
          current_streak: number
          last_activity_date: string | null
          longest_streak: number
          total_active_days: number
          updated_at: string
          user_id: string
        }
        Insert: {
          current_streak?: number
          last_activity_date?: string | null
          longest_streak?: number
          total_active_days?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          current_streak?: number
          last_activity_date?: string | null
          longest_streak?: number
          total_active_days?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      challenge_submissions: {
        Row: {
          answer: string | null
          challenge_id: string
          id: string
          is_correct: boolean | null
          submitted_at: string
          user_id: string
          xp_awarded: number
        }
        Insert: {
          answer?: string | null
          challenge_id: string
          id?: string
          is_correct?: boolean | null
          submitted_at?: string
          user_id: string
          xp_awarded?: number
        }
        Update: {
          answer?: string | null
          challenge_id?: string
          id?: string
          is_correct?: boolean | null
          submitted_at?: string
          user_id?: string
          xp_awarded?: number
        }
        Relationships: [
          {
            foreignKeyName: "challenge_submissions_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenge_daily_challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      challenge_user_achievements: {
        Row: {
          achievement_id: string
          id: string
          progress: number
          unlocked_at: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          id?: string
          progress?: number
          unlocked_at?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          id?: string
          progress?: number
          unlocked_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenge_user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "challenge_achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      challenge_user_xp: {
        Row: {
          current_level_id: string | null
          last_monthly_reset: string
          last_weekly_reset: string
          lifetime_xp: number
          monthly_xp: number
          total_xp: number
          updated_at: string
          user_id: string
          weekly_xp: number
        }
        Insert: {
          current_level_id?: string | null
          last_monthly_reset?: string
          last_weekly_reset?: string
          lifetime_xp?: number
          monthly_xp?: number
          total_xp?: number
          updated_at?: string
          user_id: string
          weekly_xp?: number
        }
        Update: {
          current_level_id?: string | null
          last_monthly_reset?: string
          last_weekly_reset?: string
          lifetime_xp?: number
          monthly_xp?: number
          total_xp?: number
          updated_at?: string
          user_id?: string
          weekly_xp?: number
        }
        Relationships: [
          {
            foreignKeyName: "challenge_user_xp_current_level_id_fkey"
            columns: ["current_level_id"]
            isOneToOne: false
            referencedRelation: "challenge_levels"
            referencedColumns: ["id"]
          },
        ]
      }
      challenge_xp_transactions: {
        Row: {
          balance_after: number | null
          created_at: string
          description: string | null
          id: string
          source_id: string | null
          source_type: string
          user_id: string
          xp_amount: number
        }
        Insert: {
          balance_after?: number | null
          created_at?: string
          description?: string | null
          id?: string
          source_id?: string | null
          source_type: string
          user_id: string
          xp_amount: number
        }
        Update: {
          balance_after?: number | null
          created_at?: string
          description?: string | null
          id?: string
          source_id?: string | null
          source_type?: string
          user_id?: string
          xp_amount?: number
        }
        Relationships: []
      }
      chat_conversations: {
        Row: {
          admin_id: string | null
          created_at: string
          id: string
          last_message: string | null
          last_message_at: string | null
          status: string
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_id?: string | null
          created_at?: string
          id?: string
          last_message?: string | null
          last_message_at?: string | null
          status?: string
          subject?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_id?: string | null
          created_at?: string
          id?: string
          last_message?: string | null
          last_message_at?: string | null
          status?: string
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          read_at: string | null
          sender_id: string
          sender_type: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          read_at?: string | null
          sender_id: string
          sender_type?: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          read_at?: string | null
          sender_id?: string
          sender_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      contract_evidence: {
        Row: {
          accepted_terms: Json | null
          content_sha256: string
          content_snapshot: string | null
          contract_id: string
          contract_version_id: string | null
          created_at: string
          evidence_sha256: string | null
          id: string
          ip_address: string | null
          metadata: Json
          pdf_sha256: string | null
          pdf_storage_path: string | null
          signature_id: string | null
          signed_at: string
          signer_email: string | null
          signer_id_number: string | null
          signer_name: string
          signer_user_id: string | null
          user_agent: string | null
          verification_token: string
        }
        Insert: {
          accepted_terms?: Json | null
          content_sha256: string
          content_snapshot?: string | null
          contract_id: string
          contract_version_id?: string | null
          created_at?: string
          evidence_sha256?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json
          pdf_sha256?: string | null
          pdf_storage_path?: string | null
          signature_id?: string | null
          signed_at: string
          signer_email?: string | null
          signer_id_number?: string | null
          signer_name: string
          signer_user_id?: string | null
          user_agent?: string | null
          verification_token: string
        }
        Update: {
          accepted_terms?: Json | null
          content_sha256?: string
          content_snapshot?: string | null
          contract_id?: string
          contract_version_id?: string | null
          created_at?: string
          evidence_sha256?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json
          pdf_sha256?: string | null
          pdf_storage_path?: string | null
          signature_id?: string | null
          signed_at?: string
          signer_email?: string | null
          signer_id_number?: string | null
          signer_name?: string
          signer_user_id?: string | null
          user_agent?: string | null
          verification_token?: string
        }
        Relationships: [
          {
            foreignKeyName: "contract_evidence_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contract_evidence_contract_version_id_fkey"
            columns: ["contract_version_id"]
            isOneToOne: false
            referencedRelation: "contract_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contract_evidence_signature_id_fkey"
            columns: ["signature_id"]
            isOneToOne: false
            referencedRelation: "contract_signatures"
            referencedColumns: ["id"]
          },
        ]
      }
      contract_otp_codes: {
        Row: {
          attempts: number
          code_hash: string
          contract_id: string
          created_at: string
          email: string
          expires_at: string
          id: string
          used: boolean
        }
        Insert: {
          attempts?: number
          code_hash: string
          contract_id: string
          created_at?: string
          email: string
          expires_at: string
          id?: string
          used?: boolean
        }
        Update: {
          attempts?: number
          code_hash?: string
          contract_id?: string
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          used?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "contract_otp_codes_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      contract_signatures: {
        Row: {
          accepted_terms: Json | null
          comments: string | null
          contract_id: string
          id: string
          ip_address: string | null
          signature_image: string | null
          signature_text: string
          signed_at: string
          signer_email: string | null
          signer_id_number: string | null
          signer_name: string
          signer_user_id: string | null
          user_agent: string | null
        }
        Insert: {
          accepted_terms?: Json | null
          comments?: string | null
          contract_id: string
          id?: string
          ip_address?: string | null
          signature_image?: string | null
          signature_text: string
          signed_at?: string
          signer_email?: string | null
          signer_id_number?: string | null
          signer_name: string
          signer_user_id?: string | null
          user_agent?: string | null
        }
        Update: {
          accepted_terms?: Json | null
          comments?: string | null
          contract_id?: string
          id?: string
          ip_address?: string | null
          signature_image?: string | null
          signature_text?: string
          signed_at?: string
          signer_email?: string | null
          signer_id_number?: string | null
          signer_name?: string
          signer_user_id?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contract_signatures_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: true
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      contract_timeline: {
        Row: {
          action_label: string
          action_type: string
          actor_id: string | null
          actor_type: string
          contract_id: string
          created_at: string
          description: string | null
          id: string
          metadata: Json | null
        }
        Insert: {
          action_label: string
          action_type: string
          actor_id?: string | null
          actor_type?: string
          contract_id: string
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
        }
        Update: {
          action_label?: string
          action_type?: string
          actor_id?: string | null
          actor_type?: string
          contract_id?: string
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "contract_timeline_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      contract_versions: {
        Row: {
          based_on_signature_id: string | null
          content_sha256: string | null
          content_snapshot: string | null
          contract_id: string
          generated_at: string
          generated_by: string | null
          generator: string
          id: string
          is_current: boolean
          metadata: Json
          output_type: string
          pdf_size_bytes: number | null
          pdf_storage_path: string | null
          version_no: number
        }
        Insert: {
          based_on_signature_id?: string | null
          content_sha256?: string | null
          content_snapshot?: string | null
          contract_id: string
          generated_at?: string
          generated_by?: string | null
          generator?: string
          id?: string
          is_current?: boolean
          metadata?: Json
          output_type: string
          pdf_size_bytes?: number | null
          pdf_storage_path?: string | null
          version_no?: number
        }
        Update: {
          based_on_signature_id?: string | null
          content_sha256?: string | null
          content_snapshot?: string | null
          contract_id?: string
          generated_at?: string
          generated_by?: string | null
          generator?: string
          id?: string
          is_current?: boolean
          metadata?: Json
          output_type?: string
          pdf_size_bytes?: number | null
          pdf_storage_path?: string | null
          version_no?: number
        }
        Relationships: [
          {
            foreignKeyName: "contract_versions_based_on_signature_id_fkey"
            columns: ["based_on_signature_id"]
            isOneToOne: false
            referencedRelation: "contract_signatures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contract_versions_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      contracts: {
        Row: {
          cancellation_reason: string | null
          cancelled_by: string | null
          client_email: string | null
          client_full_name: string | null
          client_id_number: string | null
          client_phone: string | null
          content: string | null
          content_sha256: string | null
          contract_number: string
          created_at: string
          currency: string | null
          current_version_id: string | null
          customer_id: string | null
          delivery_date: string | null
          evidence_id: string | null
          expires_at: string | null
          id: string
          locked_at: string | null
          metadata: Json | null
          order_id: string | null
          parent_contract_id: string | null
          payment_terms: string | null
          publication_id: string | null
          sent_at: string | null
          service_name: string | null
          service_order_id: string | null
          service_type: string | null
          signed_at: string | null
          signed_pdf_generated_at: string | null
          signed_pdf_path: string | null
          status: string | null
          template_type: string | null
          title: string
          total_amount: number | null
          updated_at: string
          user_id: string | null
          variables: Json | null
          verification_token: string
          version: number
        }
        Insert: {
          cancellation_reason?: string | null
          cancelled_by?: string | null
          client_email?: string | null
          client_full_name?: string | null
          client_id_number?: string | null
          client_phone?: string | null
          content?: string | null
          content_sha256?: string | null
          contract_number?: string
          created_at?: string
          currency?: string | null
          current_version_id?: string | null
          customer_id?: string | null
          delivery_date?: string | null
          evidence_id?: string | null
          expires_at?: string | null
          id?: string
          locked_at?: string | null
          metadata?: Json | null
          order_id?: string | null
          parent_contract_id?: string | null
          payment_terms?: string | null
          publication_id?: string | null
          sent_at?: string | null
          service_name?: string | null
          service_order_id?: string | null
          service_type?: string | null
          signed_at?: string | null
          signed_pdf_generated_at?: string | null
          signed_pdf_path?: string | null
          status?: string | null
          template_type?: string | null
          title: string
          total_amount?: number | null
          updated_at?: string
          user_id?: string | null
          variables?: Json | null
          verification_token?: string
          version?: number
        }
        Update: {
          cancellation_reason?: string | null
          cancelled_by?: string | null
          client_email?: string | null
          client_full_name?: string | null
          client_id_number?: string | null
          client_phone?: string | null
          content?: string | null
          content_sha256?: string | null
          contract_number?: string
          created_at?: string
          currency?: string | null
          current_version_id?: string | null
          customer_id?: string | null
          delivery_date?: string | null
          evidence_id?: string | null
          expires_at?: string | null
          id?: string
          locked_at?: string | null
          metadata?: Json | null
          order_id?: string | null
          parent_contract_id?: string | null
          payment_terms?: string | null
          publication_id?: string | null
          sent_at?: string | null
          service_name?: string | null
          service_order_id?: string | null
          service_type?: string | null
          signed_at?: string | null
          signed_pdf_generated_at?: string | null
          signed_pdf_path?: string | null
          status?: string | null
          template_type?: string | null
          title?: string
          total_amount?: number | null
          updated_at?: string
          user_id?: string | null
          variables?: Json | null
          verification_token?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "contracts_current_version_id_fkey"
            columns: ["current_version_id"]
            isOneToOne: false
            referencedRelation: "contract_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "service_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_parent_contract_id_fkey"
            columns: ["parent_contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "research_publications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_service_order_id_fkey"
            columns: ["service_order_id"]
            isOneToOne: false
            referencedRelation: "service_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          company: string | null
          created_at: string
          customer_code: string | null
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          referral_code: string | null
          status: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          customer_code?: string | null
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          referral_code?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string
          customer_code?: string | null
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          referral_code?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      cv_purchases: {
        Row: {
          amount: number
          created_at: string
          cv_id: string
          free_reason: string | null
          id: string
          metadata: Json
          payment_intent_id: string | null
          payment_method: string
          status: string
          template_key: string
          user_id: string
          wallet_transaction_id: string | null
          was_free: boolean
        }
        Insert: {
          amount?: number
          created_at?: string
          cv_id: string
          free_reason?: string | null
          id?: string
          metadata?: Json
          payment_intent_id?: string | null
          payment_method?: string
          status?: string
          template_key: string
          user_id: string
          wallet_transaction_id?: string | null
          was_free?: boolean
        }
        Update: {
          amount?: number
          created_at?: string
          cv_id?: string
          free_reason?: string | null
          id?: string
          metadata?: Json
          payment_intent_id?: string | null
          payment_method?: string
          status?: string
          template_key?: string
          user_id?: string
          wallet_transaction_id?: string | null
          was_free?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "cv_purchases_cv_id_fkey"
            columns: ["cv_id"]
            isOneToOne: true
            referencedRelation: "academic_cvs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cv_purchases_payment_intent_id_fkey"
            columns: ["payment_intent_id"]
            isOneToOne: false
            referencedRelation: "payment_intents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cv_purchases_wallet_transaction_id_fkey"
            columns: ["wallet_transaction_id"]
            isOneToOne: false
            referencedRelation: "wallet_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_challenges: {
        Row: {
          challenge_date: string
          completion_bonus: number
          cover_emoji: string | null
          created_at: string
          description: string | null
          duration_minutes: number
          id: string
          is_active: boolean
          perfect_bonus: number
          retry_xp_multiplier: number
          title: string
          updated_at: string
          xp_per_correct: number
        }
        Insert: {
          challenge_date: string
          completion_bonus?: number
          cover_emoji?: string | null
          created_at?: string
          description?: string | null
          duration_minutes?: number
          id?: string
          is_active?: boolean
          perfect_bonus?: number
          retry_xp_multiplier?: number
          title: string
          updated_at?: string
          xp_per_correct?: number
        }
        Update: {
          challenge_date?: string
          completion_bonus?: number
          cover_emoji?: string | null
          created_at?: string
          description?: string | null
          duration_minutes?: number
          id?: string
          is_active?: boolean
          perfect_bonus?: number
          retry_xp_multiplier?: number
          title?: string
          updated_at?: string
          xp_per_correct?: number
        }
        Relationships: []
      }
      daily_growth_metrics: {
        Row: {
          active_users: number
          challenges_completed: number
          computed_at: string
          conversions: number
          date: string
          new_users: number
          referrals_completed: number
          referrals_count: number
          retention_rate: number
          shares_count: number
        }
        Insert: {
          active_users?: number
          challenges_completed?: number
          computed_at?: string
          conversions?: number
          date: string
          new_users?: number
          referrals_completed?: number
          referrals_count?: number
          retention_rate?: number
          shares_count?: number
        }
        Update: {
          active_users?: number
          challenges_completed?: number
          computed_at?: string
          conversions?: number
          date?: string
          new_users?: number
          referrals_completed?: number
          referrals_count?: number
          retention_rate?: number
          shares_count?: number
        }
        Relationships: []
      }
      deadline_reminders: {
        Row: {
          channel: string
          created_at: string
          deadline_at: string
          due_at: string
          error_message: string | null
          id: string
          reminder_type: string
          sent: boolean
          sent_at: string | null
          service_order_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          channel?: string
          created_at?: string
          deadline_at: string
          due_at: string
          error_message?: string | null
          id?: string
          reminder_type: string
          sent?: boolean
          sent_at?: string | null
          service_order_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          channel?: string
          created_at?: string
          deadline_at?: string
          due_at?: string
          error_message?: string | null
          id?: string
          reminder_type?: string
          sent?: boolean
          sent_at?: string | null
          service_order_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "deadline_reminders_service_order_id_fkey"
            columns: ["service_order_id"]
            isOneToOne: false
            referencedRelation: "service_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          body: string
          created_at: string
          id: string
          is_active: boolean | null
          name: string
          subject: string
          updated_at: string
          variables: Json | null
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          name: string
          subject: string
          updated_at?: string
          variables?: Json | null
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
          subject?: string
          updated_at?: string
          variables?: Json | null
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      experiment_assignments: {
        Row: {
          anonymous_id: string | null
          assigned_at: string
          experiment_id: string
          id: string
          source_context: Json
          user_id: string | null
          variant_id: string
        }
        Insert: {
          anonymous_id?: string | null
          assigned_at?: string
          experiment_id: string
          id?: string
          source_context?: Json
          user_id?: string | null
          variant_id: string
        }
        Update: {
          anonymous_id?: string | null
          assigned_at?: string
          experiment_id?: string
          id?: string
          source_context?: Json
          user_id?: string | null
          variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "experiment_assignments_experiment_id_fkey"
            columns: ["experiment_id"]
            isOneToOne: false
            referencedRelation: "experiments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "experiment_assignments_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "experiment_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      experiment_audit_logs: {
        Row: {
          action_type: string
          actor_user_id: string | null
          after_state: Json | null
          before_state: Json | null
          created_at: string
          experiment_id: string | null
          id: string
          note: string | null
        }
        Insert: {
          action_type: string
          actor_user_id?: string | null
          after_state?: Json | null
          before_state?: Json | null
          created_at?: string
          experiment_id?: string | null
          id?: string
          note?: string | null
        }
        Update: {
          action_type?: string
          actor_user_id?: string | null
          after_state?: Json | null
          before_state?: Json | null
          created_at?: string
          experiment_id?: string | null
          id?: string
          note?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "experiment_audit_logs_experiment_id_fkey"
            columns: ["experiment_id"]
            isOneToOne: false
            referencedRelation: "experiments"
            referencedColumns: ["id"]
          },
        ]
      }
      experiment_events: {
        Row: {
          anonymous_id: string | null
          created_at: string
          event_type: string
          experiment_id: string
          id: string
          metadata: Json
          metric_value: number | null
          user_id: string | null
          variant_id: string
        }
        Insert: {
          anonymous_id?: string | null
          created_at?: string
          event_type: string
          experiment_id: string
          id?: string
          metadata?: Json
          metric_value?: number | null
          user_id?: string | null
          variant_id: string
        }
        Update: {
          anonymous_id?: string | null
          created_at?: string
          event_type?: string
          experiment_id?: string
          id?: string
          metadata?: Json
          metric_value?: number | null
          user_id?: string | null
          variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "experiment_events_experiment_id_fkey"
            columns: ["experiment_id"]
            isOneToOne: false
            referencedRelation: "experiments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "experiment_events_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "experiment_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      experiment_results_snapshots: {
        Row: {
          created_at: string
          experiment_id: string
          id: string
          results_payload: Json
          snapshot_at: string
        }
        Insert: {
          created_at?: string
          experiment_id: string
          id?: string
          results_payload?: Json
          snapshot_at?: string
        }
        Update: {
          created_at?: string
          experiment_id?: string
          id?: string
          results_payload?: Json
          snapshot_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "experiment_results_snapshots_experiment_id_fkey"
            columns: ["experiment_id"]
            isOneToOne: false
            referencedRelation: "experiments"
            referencedColumns: ["id"]
          },
        ]
      }
      experiment_variants: {
        Row: {
          allocation_percentage: number
          config_payload: Json
          created_at: string
          experiment_id: string
          id: string
          is_control: boolean
          name: string
          updated_at: string
          variant_key: string
        }
        Insert: {
          allocation_percentage: number
          config_payload?: Json
          created_at?: string
          experiment_id: string
          id?: string
          is_control?: boolean
          name: string
          updated_at?: string
          variant_key: string
        }
        Update: {
          allocation_percentage?: number
          config_payload?: Json
          created_at?: string
          experiment_id?: string
          id?: string
          is_control?: boolean
          name?: string
          updated_at?: string
          variant_key?: string
        }
        Relationships: [
          {
            foreignKeyName: "experiment_variants_experiment_id_fkey"
            columns: ["experiment_id"]
            isOneToOne: false
            referencedRelation: "experiments"
            referencedColumns: ["id"]
          },
        ]
      }
      experiments: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          end_at: string | null
          experiment_key: string
          hypothesis: string | null
          id: string
          min_sample_size: number
          name: string
          primary_metric: string
          secondary_metrics: Json
          start_at: string | null
          status: Database["public"]["Enums"]["experiment_status"]
          target_area: Database["public"]["Enums"]["experiment_target_area"]
          traffic_allocation_percentage: number
          updated_at: string
          winner_variant_id: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_at?: string | null
          experiment_key: string
          hypothesis?: string | null
          id?: string
          min_sample_size?: number
          name: string
          primary_metric: string
          secondary_metrics?: Json
          start_at?: string | null
          status?: Database["public"]["Enums"]["experiment_status"]
          target_area: Database["public"]["Enums"]["experiment_target_area"]
          traffic_allocation_percentage?: number
          updated_at?: string
          winner_variant_id?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_at?: string | null
          experiment_key?: string
          hypothesis?: string | null
          id?: string
          min_sample_size?: number
          name?: string
          primary_metric?: string
          secondary_metrics?: Json
          start_at?: string | null
          status?: Database["public"]["Enums"]["experiment_status"]
          target_area?: Database["public"]["Enums"]["experiment_target_area"]
          traffic_allocation_percentage?: number
          updated_at?: string
          winner_variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "experiments_winner_variant_fk"
            columns: ["winner_variant_id"]
            isOneToOne: false
            referencedRelation: "experiment_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      gamification_levels: {
        Row: {
          badge_color: string | null
          badge_label: string | null
          created_at: string
          icon: string | null
          id: string
          is_active: boolean
          name_ar: string
          name_en: string
          perks_json: Json
          required_points: number
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          badge_color?: string | null
          badge_label?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          is_active?: boolean
          name_ar: string
          name_en: string
          perks_json?: Json
          required_points?: number
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          badge_color?: string | null
          badge_label?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          is_active?: boolean
          name_ar?: string
          name_en?: string
          perks_json?: Json
          required_points?: number
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      gamification_rewards: {
        Row: {
          badge_color: string | null
          cost_points: number
          created_at: string
          description_ar: string | null
          expires_in_days: number | null
          icon: string | null
          id: string
          is_active: boolean
          level_required_id: string | null
          max_redemptions_per_user: number | null
          metadata: Json
          sort_order: number
          title_ar: string
          title_en: string | null
          total_redeemed: number
          total_stock: number | null
          type: string
          updated_at: string
          value: number
        }
        Insert: {
          badge_color?: string | null
          cost_points?: number
          created_at?: string
          description_ar?: string | null
          expires_in_days?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean
          level_required_id?: string | null
          max_redemptions_per_user?: number | null
          metadata?: Json
          sort_order?: number
          title_ar: string
          title_en?: string | null
          total_redeemed?: number
          total_stock?: number | null
          type: string
          updated_at?: string
          value?: number
        }
        Update: {
          badge_color?: string | null
          cost_points?: number
          created_at?: string
          description_ar?: string | null
          expires_in_days?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean
          level_required_id?: string | null
          max_redemptions_per_user?: number | null
          metadata?: Json
          sort_order?: number
          title_ar?: string
          title_en?: string | null
          total_redeemed?: number
          total_stock?: number | null
          type?: string
          updated_at?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "gamification_rewards_level_required_id_fkey"
            columns: ["level_required_id"]
            isOneToOne: false
            referencedRelation: "gamification_levels"
            referencedColumns: ["id"]
          },
        ]
      }
      gateway_webhooks: {
        Row: {
          created_at: string
          error_message: string | null
          event_type: string | null
          external_transaction_no: string | null
          headers: Json | null
          id: string
          internal_order_number: string | null
          ip_address: string | null
          payload: Json
          payment_intent_id: string | null
          processed: boolean
          processed_at: string | null
          provider: string
          signature_status: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          event_type?: string | null
          external_transaction_no?: string | null
          headers?: Json | null
          id?: string
          internal_order_number?: string | null
          ip_address?: string | null
          payload: Json
          payment_intent_id?: string | null
          processed?: boolean
          processed_at?: string | null
          provider?: string
          signature_status?: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          event_type?: string | null
          external_transaction_no?: string | null
          headers?: Json | null
          id?: string
          internal_order_number?: string | null
          ip_address?: string | null
          payload?: Json
          payment_intent_id?: string | null
          processed?: boolean
          processed_at?: string | null
          provider?: string
          signature_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "gateway_webhooks_payment_intent_id_fkey"
            columns: ["payment_intent_id"]
            isOneToOne: false
            referencedRelation: "payment_intents"
            referencedColumns: ["id"]
          },
        ]
      }
      group_order_audit: {
        Row: {
          action_type: string
          actor_id: string | null
          created_at: string
          description: string | null
          group_order_id: string
          id: string
          metadata: Json
        }
        Insert: {
          action_type: string
          actor_id?: string | null
          created_at?: string
          description?: string | null
          group_order_id: string
          id?: string
          metadata?: Json
        }
        Update: {
          action_type?: string
          actor_id?: string | null
          created_at?: string
          description?: string | null
          group_order_id?: string
          id?: string
          metadata?: Json
        }
        Relationships: [
          {
            foreignKeyName: "group_order_audit_group_order_id_fkey"
            columns: ["group_order_id"]
            isOneToOne: false
            referencedRelation: "group_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      group_order_members: {
        Row: {
          amount_due: number
          amount_paid: number
          group_order_id: string
          id: string
          is_creator: boolean
          joined_at: string
          paid_at: string | null
          paid_via: string | null
          payment_intent_id: string | null
          refunded_at: string | null
          status: Database["public"]["Enums"]["group_member_status"]
          user_id: string
          wallet_transaction_id: string | null
        }
        Insert: {
          amount_due: number
          amount_paid?: number
          group_order_id: string
          id?: string
          is_creator?: boolean
          joined_at?: string
          paid_at?: string | null
          paid_via?: string | null
          payment_intent_id?: string | null
          refunded_at?: string | null
          status?: Database["public"]["Enums"]["group_member_status"]
          user_id: string
          wallet_transaction_id?: string | null
        }
        Update: {
          amount_due?: number
          amount_paid?: number
          group_order_id?: string
          id?: string
          is_creator?: boolean
          joined_at?: string
          paid_at?: string | null
          paid_via?: string | null
          payment_intent_id?: string | null
          refunded_at?: string | null
          status?: Database["public"]["Enums"]["group_member_status"]
          user_id?: string
          wallet_transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_order_members_group_order_id_fkey"
            columns: ["group_order_id"]
            isOneToOne: false
            referencedRelation: "group_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_order_members_payment_intent_id_fkey"
            columns: ["payment_intent_id"]
            isOneToOne: false
            referencedRelation: "payment_intents"
            referencedColumns: ["id"]
          },
        ]
      }
      group_orders: {
        Row: {
          cancelled_at: string | null
          created_at: string
          creator_id: string
          currency: string
          deadline: string | null
          description: string | null
          id: string
          invite_code: string
          max_members: number
          metadata: Json
          min_members: number
          seat_price: number
          service_id: string
          service_name: string | null
          service_order_id: string | null
          started_at: string | null
          status: Database["public"]["Enums"]["group_order_status"]
          title: string
          updated_at: string
        }
        Insert: {
          cancelled_at?: string | null
          created_at?: string
          creator_id: string
          currency?: string
          deadline?: string | null
          description?: string | null
          id?: string
          invite_code: string
          max_members: number
          metadata?: Json
          min_members?: number
          seat_price: number
          service_id: string
          service_name?: string | null
          service_order_id?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["group_order_status"]
          title: string
          updated_at?: string
        }
        Update: {
          cancelled_at?: string | null
          created_at?: string
          creator_id?: string
          currency?: string
          deadline?: string | null
          description?: string | null
          id?: string
          invite_code?: string
          max_members?: number
          metadata?: Json
          min_members?: number
          seat_price?: number
          service_id?: string
          service_name?: string | null
          service_order_id?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["group_order_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_orders_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_orders_service_order_id_fkey"
            columns: ["service_order_id"]
            isOneToOne: false
            referencedRelation: "service_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      growth_events: {
        Row: {
          created_at: string
          dedupe_key: string | null
          event_type: string
          id: string
          metadata: Json
          source: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          dedupe_key?: string | null
          event_type: string
          id?: string
          metadata?: Json
          source?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          dedupe_key?: string | null
          event_type?: string
          id?: string
          metadata?: Json
          source?: string
          user_id?: string | null
        }
        Relationships: []
      }
      inbox_messages: {
        Row: {
          assigned_to: string | null
          created_at: string
          form_type: string
          id: string
          is_archived: boolean
          is_pinned: boolean
          is_starred: boolean
          last_activity_at: string
          message: string
          metadata: Json
          priority: string
          read_at: string | null
          reply_count: number
          sender_email: string
          sender_name: string
          sender_phone: string | null
          service_type: string | null
          source_page: string | null
          status: string
          subject: string | null
          tags: string[]
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          form_type?: string
          id?: string
          is_archived?: boolean
          is_pinned?: boolean
          is_starred?: boolean
          last_activity_at?: string
          message: string
          metadata?: Json
          priority?: string
          read_at?: string | null
          reply_count?: number
          sender_email: string
          sender_name: string
          sender_phone?: string | null
          service_type?: string | null
          source_page?: string | null
          status?: string
          subject?: string | null
          tags?: string[]
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          form_type?: string
          id?: string
          is_archived?: boolean
          is_pinned?: boolean
          is_starred?: boolean
          last_activity_at?: string
          message?: string
          metadata?: Json
          priority?: string
          read_at?: string | null
          reply_count?: number
          sender_email?: string
          sender_name?: string
          sender_phone?: string | null
          service_type?: string | null
          source_page?: string | null
          status?: string
          subject?: string | null
          tags?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      inbox_notes: {
        Row: {
          admin_id: string | null
          admin_name: string | null
          body: string
          created_at: string
          id: string
          message_id: string
        }
        Insert: {
          admin_id?: string | null
          admin_name?: string | null
          body: string
          created_at?: string
          id?: string
          message_id: string
        }
        Update: {
          admin_id?: string | null
          admin_name?: string | null
          body?: string
          created_at?: string
          id?: string
          message_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inbox_notes_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "inbox_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      inbox_replies: {
        Row: {
          admin_email: string | null
          admin_id: string | null
          admin_name: string | null
          body: string
          created_at: string
          delivery_error: string | null
          delivery_status: string
          external_message_id: string | null
          id: string
          message_id: string
        }
        Insert: {
          admin_email?: string | null
          admin_id?: string | null
          admin_name?: string | null
          body: string
          created_at?: string
          delivery_error?: string | null
          delivery_status?: string
          external_message_id?: string | null
          id?: string
          message_id: string
        }
        Update: {
          admin_email?: string | null
          admin_id?: string | null
          admin_name?: string | null
          body?: string
          created_at?: string
          delivery_error?: string | null
          delivery_status?: string
          external_message_id?: string | null
          id?: string
          message_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inbox_replies_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "inbox_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      inbox_reply_templates: {
        Row: {
          body: string
          category: string | null
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean
          shortcut: string | null
          title: string
          updated_at: string
          use_count: number
        }
        Insert: {
          body: string
          category?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          shortcut?: string | null
          title: string
          updated_at?: string
          use_count?: number
        }
        Update: {
          body?: string
          category?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          shortcut?: string | null
          title?: string
          updated_at?: string
          use_count?: number
        }
        Relationships: []
      }
      invoice_items: {
        Row: {
          created_at: string
          description: string | null
          discount_amount: number | null
          discount_percentage: number | null
          id: string
          invoice_id: string
          item_name: string
          quantity: number | null
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          discount_amount?: number | null
          discount_percentage?: number | null
          id?: string
          invoice_id: string
          item_name: string
          quantity?: number | null
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string
          description?: string | null
          discount_amount?: number | null
          discount_percentage?: number | null
          id?: string
          invoice_id?: string
          item_name?: string
          quantity?: number | null
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_payments: {
        Row: {
          amount: number
          created_at: string
          created_by: string | null
          id: string
          invoice_id: string
          notes: string | null
          payment_date: string
          payment_intent_id: string | null
          payment_method: string
          reference_number: string | null
          status: string
        }
        Insert: {
          amount: number
          created_at?: string
          created_by?: string | null
          id?: string
          invoice_id: string
          notes?: string | null
          payment_date?: string
          payment_intent_id?: string | null
          payment_method?: string
          reference_number?: string | null
          status?: string
        }
        Update: {
          amount?: number
          created_at?: string
          created_by?: string | null
          id?: string
          invoice_id?: string
          notes?: string | null
          payment_date?: string
          payment_intent_id?: string | null
          payment_method?: string
          reference_number?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoice_payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_payments_payment_intent_id_fkey"
            columns: ["payment_intent_id"]
            isOneToOne: false
            referencedRelation: "payment_intents"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_timeline: {
        Row: {
          action_description: string | null
          action_label: string
          action_type: string
          actor_user_id: string | null
          created_at: string
          id: string
          invoice_id: string
          metadata: Json | null
        }
        Insert: {
          action_description?: string | null
          action_label: string
          action_type: string
          actor_user_id?: string | null
          created_at?: string
          id?: string
          invoice_id: string
          metadata?: Json | null
        }
        Update: {
          action_description?: string | null
          action_label?: string
          action_type?: string
          actor_user_id?: string | null
          created_at?: string
          id?: string
          invoice_id?: string
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_timeline_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          created_at: string
          currency: string
          customer_email: string | null
          customer_id: string | null
          customer_name: string | null
          customer_phone: string | null
          discount_amount: number | null
          due_date: string | null
          id: string
          invoice_number: string
          issue_date: string
          notes: string | null
          order_id: string | null
          paid_amount: number
          paid_at: string | null
          pdf_generated_at: string | null
          pdf_storage_path: string | null
          publication_id: string | null
          remaining_amount: number | null
          sent_at: string | null
          status: string | null
          subtotal: number | null
          tax_amount: number | null
          terms: string | null
          total_amount: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          currency?: string
          customer_email?: string | null
          customer_id?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          discount_amount?: number | null
          due_date?: string | null
          id?: string
          invoice_number?: string
          issue_date?: string
          notes?: string | null
          order_id?: string | null
          paid_amount?: number
          paid_at?: string | null
          pdf_generated_at?: string | null
          pdf_storage_path?: string | null
          publication_id?: string | null
          remaining_amount?: number | null
          sent_at?: string | null
          status?: string | null
          subtotal?: number | null
          tax_amount?: number | null
          terms?: string | null
          total_amount?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          currency?: string
          customer_email?: string | null
          customer_id?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          discount_amount?: number | null
          due_date?: string | null
          id?: string
          invoice_number?: string
          issue_date?: string
          notes?: string | null
          order_id?: string | null
          paid_amount?: number
          paid_at?: string | null
          pdf_generated_at?: string | null
          pdf_storage_path?: string | null
          publication_id?: string | null
          remaining_amount?: number | null
          sent_at?: string | null
          status?: string | null
          subtotal?: number | null
          tax_amount?: number | null
          terms?: string | null
          total_amount?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "service_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "research_publications"
            referencedColumns: ["id"]
          },
        ]
      }
      library_categories: {
        Row: {
          color: string | null
          created_at: string
          description_ar: string | null
          icon: string | null
          id: string
          is_active: boolean
          name_ar: string
          name_en: string | null
          parent_id: string | null
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description_ar?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name_ar: string
          name_en?: string | null
          parent_id?: string | null
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description_ar?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name_ar?: string
          name_en?: string | null
          parent_id?: string | null
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "library_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "library_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      marketing_assets: {
        Row: {
          caption_template: string | null
          created_at: string
          id: string
          image_url: string | null
          is_active: boolean
          platform: string
          service_type: string
          title: string
          updated_at: string
        }
        Insert: {
          caption_template?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          platform: string
          service_type: string
          title: string
          updated_at?: string
        }
        Update: {
          caption_template?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          platform?: string
          service_type?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      marketplace_funnel_events: {
        Row: {
          anonymous_id: string | null
          created_at: string
          event_type: string
          id: string
          item_id: string | null
          metadata: Json
          session_id: string | null
          user_id: string | null
          variant_key: string | null
        }
        Insert: {
          anonymous_id?: string | null
          created_at?: string
          event_type: string
          id?: string
          item_id?: string | null
          metadata?: Json
          session_id?: string | null
          user_id?: string | null
          variant_key?: string | null
        }
        Update: {
          anonymous_id?: string | null
          created_at?: string
          event_type?: string
          id?: string
          item_id?: string | null
          metadata?: Json
          session_id?: string | null
          user_id?: string | null
          variant_key?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_funnel_events_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "marketplace_items"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_item_views: {
        Row: {
          anonymous_id: string | null
          created_at: string
          id: string
          item_id: string
          user_id: string | null
          variant_key: string | null
        }
        Insert: {
          anonymous_id?: string | null
          created_at?: string
          id?: string
          item_id: string
          user_id?: string | null
          variant_key?: string | null
        }
        Update: {
          anonymous_id?: string | null
          created_at?: string
          id?: string
          item_id?: string
          user_id?: string | null
          variant_key?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_item_views_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "marketplace_items"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_items: {
        Row: {
          allow_payment_methods: string[]
          badge_color: string | null
          category: string
          created_at: string
          description_ar: string | null
          icon: string | null
          id: string
          is_active: boolean
          is_featured: boolean
          max_per_user: number | null
          min_level: number
          price_sar: number | null
          reward_payload: Json
          slug: string
          sort_order: number
          stock: number | null
          title_ar: string
          total_purchased: number
          type: string
          updated_at: string
          xp_cost: number
          xp_to_sar_rate: number
        }
        Insert: {
          allow_payment_methods?: string[]
          badge_color?: string | null
          category?: string
          created_at?: string
          description_ar?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          is_featured?: boolean
          max_per_user?: number | null
          min_level?: number
          price_sar?: number | null
          reward_payload?: Json
          slug: string
          sort_order?: number
          stock?: number | null
          title_ar: string
          total_purchased?: number
          type: string
          updated_at?: string
          xp_cost: number
          xp_to_sar_rate?: number
        }
        Update: {
          allow_payment_methods?: string[]
          badge_color?: string | null
          category?: string
          created_at?: string
          description_ar?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          is_featured?: boolean
          max_per_user?: number | null
          min_level?: number
          price_sar?: number | null
          reward_payload?: Json
          slug?: string
          sort_order?: number
          stock?: number | null
          title_ar?: string
          total_purchased?: number
          type?: string
          updated_at?: string
          xp_cost?: number
          xp_to_sar_rate?: number
        }
        Relationships: []
      }
      marketplace_price_experiments: {
        Row: {
          allocation_percent: number
          created_at: string
          id: string
          is_active: boolean
          item_id: string
          variant_key: string
          xp_cost: number
        }
        Insert: {
          allocation_percent?: number
          created_at?: string
          id?: string
          is_active?: boolean
          item_id: string
          variant_key: string
          xp_cost: number
        }
        Update: {
          allocation_percent?: number
          created_at?: string
          id?: string
          is_active?: boolean
          item_id?: string
          variant_key?: string
          xp_cost?: number
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_price_experiments_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "marketplace_items"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_purchase_failures: {
        Row: {
          created_at: string
          error_code: string
          error_detail: Json
          id: string
          item_id: string | null
          item_slug: string | null
          item_type: string | null
          user_id: string | null
          xp_available: number | null
          xp_required: number | null
        }
        Insert: {
          created_at?: string
          error_code: string
          error_detail?: Json
          id?: string
          item_id?: string | null
          item_slug?: string | null
          item_type?: string | null
          user_id?: string | null
          xp_available?: number | null
          xp_required?: number | null
        }
        Update: {
          created_at?: string
          error_code?: string
          error_detail?: Json
          id?: string
          item_id?: string | null
          item_slug?: string | null
          item_type?: string | null
          user_id?: string | null
          xp_available?: number | null
          xp_required?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_purchase_failures_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "marketplace_items"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_purchase_limits: {
        Row: {
          description: string | null
          max_per_day: number
          max_xp_per_day: number
          type: string
        }
        Insert: {
          description?: string | null
          max_per_day: number
          max_xp_per_day: number
          type: string
        }
        Update: {
          description?: string | null
          max_per_day?: number
          max_xp_per_day?: number
          type?: string
        }
        Relationships: []
      }
      marketplace_purchases: {
        Row: {
          created_at: string
          fulfillment_data: Json
          id: string
          ip_address: string | null
          item_id: string
          item_slug: string
          item_type: string
          original_xp_cost: number | null
          paid_amount_sar: number | null
          payment_intent_id: string | null
          payment_method: string
          promo_code: string | null
          reward_payload: Json
          status: string
          user_id: string
          xp_discount: number
          xp_spent: number
        }
        Insert: {
          created_at?: string
          fulfillment_data?: Json
          id?: string
          ip_address?: string | null
          item_id: string
          item_slug: string
          item_type: string
          original_xp_cost?: number | null
          paid_amount_sar?: number | null
          payment_intent_id?: string | null
          payment_method?: string
          promo_code?: string | null
          reward_payload?: Json
          status?: string
          user_id: string
          xp_discount?: number
          xp_spent: number
        }
        Update: {
          created_at?: string
          fulfillment_data?: Json
          id?: string
          ip_address?: string | null
          item_id?: string
          item_slug?: string
          item_type?: string
          original_xp_cost?: number | null
          paid_amount_sar?: number | null
          payment_intent_id?: string | null
          payment_method?: string
          promo_code?: string | null
          reward_payload?: Json
          status?: string
          user_id?: string
          xp_discount?: number
          xp_spent?: number
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_purchases_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "marketplace_items"
            referencedColumns: ["id"]
          },
        ]
      }
      member_referrals: {
        Row: {
          commission_amount: number
          commission_paid_at: string | null
          created_at: string
          id: string
          membership_id: string | null
          notes: string | null
          plan_id: string | null
          referral_code: string
          referred_user_id: string
          referrer_user_id: string
          status: string
          updated_at: string
          wallet_transaction_id: string | null
        }
        Insert: {
          commission_amount?: number
          commission_paid_at?: string | null
          created_at?: string
          id?: string
          membership_id?: string | null
          notes?: string | null
          plan_id?: string | null
          referral_code: string
          referred_user_id: string
          referrer_user_id: string
          status?: string
          updated_at?: string
          wallet_transaction_id?: string | null
        }
        Update: {
          commission_amount?: number
          commission_paid_at?: string | null
          created_at?: string
          id?: string
          membership_id?: string | null
          notes?: string | null
          plan_id?: string | null
          referral_code?: string
          referred_user_id?: string
          referrer_user_id?: string
          status?: string
          updated_at?: string
          wallet_transaction_id?: string | null
        }
        Relationships: []
      }
      membership_history: {
        Row: {
          action: string
          actor_id: string | null
          actor_type: string
          created_at: string
          description: string | null
          id: string
          membership_id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          actor_type?: string
          created_at?: string
          description?: string | null
          id?: string
          membership_id: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          actor_type?: string
          created_at?: string
          description?: string | null
          id?: string
          membership_id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "membership_history_membership_id_fkey"
            columns: ["membership_id"]
            isOneToOne: false
            referencedRelation: "user_memberships"
            referencedColumns: ["id"]
          },
        ]
      }
      membership_plans: {
        Row: {
          badge_color: string | null
          benefits: Json | null
          cashback_amount: number
          code: string
          created_at: string
          currency: string
          description: string | null
          discount_percentage: number
          duration_months: number
          id: string
          is_active: boolean
          name_ar: string
          name_en: string
          price: number
          priority_level: number
          referral_commission_fixed: number
          referral_commission_percentage: number
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          badge_color?: string | null
          benefits?: Json | null
          cashback_amount?: number
          code: string
          created_at?: string
          currency?: string
          description?: string | null
          discount_percentage?: number
          duration_months?: number
          id?: string
          is_active?: boolean
          name_ar: string
          name_en: string
          price?: number
          priority_level?: number
          referral_commission_fixed?: number
          referral_commission_percentage?: number
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          badge_color?: string | null
          benefits?: Json | null
          cashback_amount?: number
          code?: string
          created_at?: string
          currency?: string
          description?: string | null
          discount_percentage?: number
          duration_months?: number
          id?: string
          is_active?: boolean
          name_ar?: string
          name_en?: string
          price?: number
          priority_level?: number
          referral_commission_fixed?: number
          referral_commission_percentage?: number
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      mind_map_usage: {
        Row: {
          created_at: string
          exported_pdf: boolean
          exported_png: boolean
          id: string
          input_length: number | null
          is_premium_user: boolean
          language: string
          saved: boolean
          usage_date: string
          user_id: string
        }
        Insert: {
          created_at?: string
          exported_pdf?: boolean
          exported_png?: boolean
          id?: string
          input_length?: number | null
          is_premium_user?: boolean
          language: string
          saved?: boolean
          usage_date?: string
          user_id: string
        }
        Update: {
          created_at?: string
          exported_pdf?: boolean
          exported_png?: boolean
          id?: string
          input_length?: number | null
          is_premium_user?: boolean
          language?: string
          saved?: boolean
          usage_date?: string
          user_id?: string
        }
        Relationships: []
      }
      mind_maps: {
        Row: {
          created_at: string
          id: string
          is_premium_generation: boolean
          language: string
          map_data: Json
          source_text: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_premium_generation?: boolean
          language?: string
          map_data: Json
          source_text: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_premium_generation?: boolean
          language?: string
          map_data?: Json
          source_text?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          message: string | null
          target_audience: string | null
          title: string
          type: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          message?: string | null
          target_audience?: string | null
          title: string
          type?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          message?: string | null
          target_audience?: string | null
          title?: string
          type?: string | null
        }
        Relationships: []
      }
      order_attachments: {
        Row: {
          created_at: string
          file_name: string
          file_size: number
          file_type: string | null
          id: string
          is_delivery: boolean
          order_id: string
          service_order_id: string | null
          storage_path: string
          uploaded_by_admin: boolean
          user_id: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_size: number
          file_type?: string | null
          id?: string
          is_delivery?: boolean
          order_id: string
          service_order_id?: string | null
          storage_path: string
          uploaded_by_admin?: boolean
          user_id: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_size?: number
          file_type?: string | null
          id?: string
          is_delivery?: boolean
          order_id?: string
          service_order_id?: string | null
          storage_path?: string
          uploaded_by_admin?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_attachments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "service_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_timeline: {
        Row: {
          actor_name: string | null
          actor_type: string
          completed_date: string | null
          created_at: string
          description: string | null
          id: string
          order_id: string
          scheduled_date: string | null
          status: string
          title: string
        }
        Insert: {
          actor_name?: string | null
          actor_type?: string
          completed_date?: string | null
          created_at?: string
          description?: string | null
          id?: string
          order_id: string
          scheduled_date?: string | null
          status: string
          title?: string
        }
        Update: {
          actor_name?: string | null
          actor_type?: string
          completed_date?: string | null
          created_at?: string
          description?: string | null
          id?: string
          order_id?: string
          scheduled_date?: string | null
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_timeline_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          assistance_type: string | null
          client_email: string
          client_name: string
          client_phone: string
          created_at: string
          current_status: string | null
          degree: string
          description: string | null
          estimated_delivery: string | null
          id: string
          phone_last_four: string
          service_type: string
          title: string
          tracking_id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          assistance_type?: string | null
          client_email: string
          client_name: string
          client_phone: string
          created_at?: string
          current_status?: string | null
          degree?: string
          description?: string | null
          estimated_delivery?: string | null
          id?: string
          phone_last_four: string
          service_type?: string
          title: string
          tracking_id?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          assistance_type?: string | null
          client_email?: string
          client_name?: string
          client_phone?: string
          created_at?: string
          current_status?: string | null
          degree?: string
          description?: string | null
          estimated_delivery?: string | null
          id?: string
          phone_last_four?: string
          service_type?: string
          title?: string
          tracking_id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      payment_attempts: {
        Row: {
          action: string
          attempt_no: number
          created_at: string
          error_message: string | null
          http_status: number | null
          id: string
          payment_intent_id: string
          request_payload: Json | null
          response_payload: Json | null
          status: string
        }
        Insert: {
          action: string
          attempt_no?: number
          created_at?: string
          error_message?: string | null
          http_status?: number | null
          id?: string
          payment_intent_id: string
          request_payload?: Json | null
          response_payload?: Json | null
          status?: string
        }
        Update: {
          action?: string
          attempt_no?: number
          created_at?: string
          error_message?: string | null
          http_status?: number | null
          id?: string
          payment_intent_id?: string
          request_payload?: Json | null
          response_payload?: Json | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_attempts_payment_intent_id_fkey"
            columns: ["payment_intent_id"]
            isOneToOne: false
            referencedRelation: "payment_intents"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_intents: {
        Row: {
          amount: number
          callback_url: string | null
          checkout_url: string | null
          contract_id: string | null
          created_at: string
          currency: string
          expires_at: string | null
          external_invoice_id: string | null
          external_transaction_no: string | null
          failed_at: string | null
          failure_reason: string | null
          id: string
          internal_order_number: string
          invoice_id: string | null
          metadata: Json
          payment_method_type: string | null
          provider: string
          provider_mode: string
          purpose: string
          return_url: string | null
          service_order_id: string | null
          status: string
          succeeded_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          callback_url?: string | null
          checkout_url?: string | null
          contract_id?: string | null
          created_at?: string
          currency?: string
          expires_at?: string | null
          external_invoice_id?: string | null
          external_transaction_no?: string | null
          failed_at?: string | null
          failure_reason?: string | null
          id?: string
          internal_order_number: string
          invoice_id?: string | null
          metadata?: Json
          payment_method_type?: string | null
          provider?: string
          provider_mode?: string
          purpose: string
          return_url?: string | null
          service_order_id?: string | null
          status?: string
          succeeded_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          callback_url?: string | null
          checkout_url?: string | null
          contract_id?: string | null
          created_at?: string
          currency?: string
          expires_at?: string | null
          external_invoice_id?: string | null
          external_transaction_no?: string | null
          failed_at?: string | null
          failure_reason?: string | null
          id?: string
          internal_order_number?: string
          invoice_id?: string | null
          metadata?: Json
          payment_method_type?: string | null
          provider?: string
          provider_mode?: string
          purpose?: string
          return_url?: string | null
          service_order_id?: string | null
          status?: string
          succeeded_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      payment_reconciliation_items: {
        Row: {
          actual_amount: number | null
          actual_status: string | null
          created_at: string
          expected_amount: number | null
          expected_status: string | null
          external_transaction_no: string | null
          id: string
          internal_order_number: string | null
          matched: boolean
          mismatch_reason: string | null
          payment_intent_id: string | null
          raw_external: Json | null
          run_id: string
        }
        Insert: {
          actual_amount?: number | null
          actual_status?: string | null
          created_at?: string
          expected_amount?: number | null
          expected_status?: string | null
          external_transaction_no?: string | null
          id?: string
          internal_order_number?: string | null
          matched?: boolean
          mismatch_reason?: string | null
          payment_intent_id?: string | null
          raw_external?: Json | null
          run_id: string
        }
        Update: {
          actual_amount?: number | null
          actual_status?: string | null
          created_at?: string
          expected_amount?: number | null
          expected_status?: string | null
          external_transaction_no?: string | null
          id?: string
          internal_order_number?: string | null
          matched?: boolean
          mismatch_reason?: string | null
          payment_intent_id?: string | null
          raw_external?: Json | null
          run_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_reconciliation_items_payment_intent_id_fkey"
            columns: ["payment_intent_id"]
            isOneToOne: false
            referencedRelation: "payment_intents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_reconciliation_items_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "payment_reconciliation_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_reconciliation_runs: {
        Row: {
          created_at: string
          created_by: string | null
          finished_at: string | null
          id: string
          provider: string
          run_type: string
          started_at: string
          status: string
          summary: Json | null
          total_checked: number
          total_matched: number
          total_mismatched: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          finished_at?: string | null
          id?: string
          provider?: string
          run_type?: string
          started_at?: string
          status?: string
          summary?: Json | null
          total_checked?: number
          total_matched?: number
          total_mismatched?: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          finished_at?: string | null
          id?: string
          provider?: string
          run_type?: string
          started_at?: string
          status?: string
          summary?: Json | null
          total_checked?: number
          total_matched?: number
          total_mismatched?: number
        }
        Relationships: []
      }
      payment_transactions: {
        Row: {
          amount: number
          balance_after: number | null
          created_at: string
          description: string | null
          id: string
          invoice_id: string | null
          reference: string | null
          status: string | null
          type: string
          user_id: string | null
        }
        Insert: {
          amount: number
          balance_after?: number | null
          created_at?: string
          description?: string | null
          id?: string
          invoice_id?: string | null
          reference?: string | null
          status?: string | null
          type: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          balance_after?: number | null
          created_at?: string
          description?: string | null
          id?: string
          invoice_id?: string | null
          reference?: string | null
          status?: string | null
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      point_transactions: {
        Row: {
          balance_after: number | null
          base_points: number | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          metadata: Json
          multiplier: number
          points: number
          source_id: string | null
          source_type: string
          type: string
          user_id: string
        }
        Insert: {
          balance_after?: number | null
          base_points?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          metadata?: Json
          multiplier?: number
          points: number
          source_id?: string | null
          source_type: string
          type: string
          user_id: string
        }
        Update: {
          balance_after?: number | null
          base_points?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          metadata?: Json
          multiplier?: number
          points?: number
          source_id?: string | null
          source_type?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      question_bank_attempts: {
        Row: {
          choice_id: string | null
          created_at: string
          difficulty: string | null
          id: string
          is_correct: boolean
          question_id: string
          subject_id: string | null
          time_spent_seconds: number | null
          user_id: string
          xp_awarded: number
        }
        Insert: {
          choice_id?: string | null
          created_at?: string
          difficulty?: string | null
          id?: string
          is_correct?: boolean
          question_id: string
          subject_id?: string | null
          time_spent_seconds?: number | null
          user_id: string
          xp_awarded?: number
        }
        Update: {
          choice_id?: string | null
          created_at?: string
          difficulty?: string | null
          id?: string
          is_correct?: boolean
          question_id?: string
          subject_id?: string | null
          time_spent_seconds?: number | null
          user_id?: string
          xp_awarded?: number
        }
        Relationships: []
      }
      question_bank_plans: {
        Row: {
          created_at: string
          daily_question_limit: number | null
          description_ar: string | null
          duration_days: number
          features: Json
          id: string
          is_active: boolean
          name_ar: string
          name_en: string | null
          price_sar: number
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          daily_question_limit?: number | null
          description_ar?: string | null
          duration_days?: number
          features?: Json
          id?: string
          is_active?: boolean
          name_ar: string
          name_en?: string | null
          price_sar?: number
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          daily_question_limit?: number | null
          description_ar?: string | null
          duration_days?: number
          features?: Json
          id?: string
          is_active?: boolean
          name_ar?: string
          name_en?: string | null
          price_sar?: number
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      question_bank_session_history: {
        Row: {
          category_id: string | null
          completed_at: string
          correct_count: number
          difficulty: string | null
          duration_seconds: number | null
          id: string
          subject_id: string | null
          total_questions: number
          user_id: string
          xp_earned: number
        }
        Insert: {
          category_id?: string | null
          completed_at?: string
          correct_count?: number
          difficulty?: string | null
          duration_seconds?: number | null
          id?: string
          subject_id?: string | null
          total_questions?: number
          user_id: string
          xp_earned?: number
        }
        Update: {
          category_id?: string | null
          completed_at?: string
          correct_count?: number
          difficulty?: string | null
          duration_seconds?: number | null
          id?: string
          subject_id?: string | null
          total_questions?: number
          user_id?: string
          xp_earned?: number
        }
        Relationships: []
      }
      question_bank_sessions: {
        Row: {
          answered_question_ids: string[]
          current_index: number
          filter_category_id: string | null
          filter_difficulty: string | null
          filter_subject_id: string | null
          question_ids: string[]
          session_xp: number
          streak: number
          updated_at: string
          user_id: string
        }
        Insert: {
          answered_question_ids?: string[]
          current_index?: number
          filter_category_id?: string | null
          filter_difficulty?: string | null
          filter_subject_id?: string | null
          question_ids?: string[]
          session_xp?: number
          streak?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          answered_question_ids?: string[]
          current_index?: number
          filter_category_id?: string | null
          filter_difficulty?: string | null
          filter_subject_id?: string | null
          question_ids?: string[]
          session_xp?: number
          streak?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      question_bank_subscriptions: {
        Row: {
          amount_paid: number
          created_at: string
          expires_at: string | null
          id: string
          payment_method: string | null
          payment_reference: string | null
          plan_id: string
          started_at: string
          status: string
          user_id: string
        }
        Insert: {
          amount_paid?: number
          created_at?: string
          expires_at?: string | null
          id?: string
          payment_method?: string | null
          payment_reference?: string | null
          plan_id: string
          started_at?: string
          status?: string
          user_id: string
        }
        Update: {
          amount_paid?: number
          created_at?: string
          expires_at?: string | null
          id?: string
          payment_method?: string | null
          payment_reference?: string | null
          plan_id?: string
          started_at?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_bank_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "question_bank_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      question_categories: {
        Row: {
          created_at: string
          icon: string | null
          id: string
          is_active: boolean
          name_ar: string
          name_en: string | null
          parent_id: string | null
          sort_order: number
        }
        Insert: {
          created_at?: string
          icon?: string | null
          id?: string
          is_active?: boolean
          name_ar: string
          name_en?: string | null
          parent_id?: string | null
          sort_order?: number
        }
        Update: {
          created_at?: string
          icon?: string | null
          id?: string
          is_active?: boolean
          name_ar?: string
          name_en?: string | null
          parent_id?: string | null
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "question_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "question_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      question_choices: {
        Row: {
          choice_text: string
          created_at: string
          id: string
          is_correct: boolean
          order_index: number
          question_id: string
        }
        Insert: {
          choice_text: string
          created_at?: string
          id?: string
          is_correct?: boolean
          order_index?: number
          question_id: string
        }
        Update: {
          choice_text?: string
          created_at?: string
          id?: string
          is_correct?: boolean
          order_index?: number
          question_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_choices_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      question_tags: {
        Row: {
          id: string
          question_id: string
          tag: string
        }
        Insert: {
          id?: string
          question_id: string
          tag: string
        }
        Update: {
          id?: string
          question_id?: string
          tag?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_tags_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          created_at: string
          created_by: string | null
          difficulty: string
          explanation: string | null
          id: string
          is_active: boolean
          linked_assessment_id: string | null
          question_text: string
          question_type: string
          subject_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          difficulty?: string
          explanation?: string | null
          id?: string
          is_active?: boolean
          linked_assessment_id?: string | null
          question_text: string
          question_type?: string
          subject_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          difficulty?: string
          explanation?: string | null
          id?: string
          is_active?: boolean
          linked_assessment_id?: string | null
          question_text?: string
          question_type?: string
          subject_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_linked_assessment_id_fkey"
            columns: ["linked_assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      referral_audit_logs: {
        Row: {
          action_type: string
          amount: number | null
          created_at: string
          id: string
          membership_id: string | null
          metadata: Json | null
          reason: string | null
          referral_id: string | null
          referred_user_id: string | null
          referrer_user_id: string | null
        }
        Insert: {
          action_type: string
          amount?: number | null
          created_at?: string
          id?: string
          membership_id?: string | null
          metadata?: Json | null
          reason?: string | null
          referral_id?: string | null
          referred_user_id?: string | null
          referrer_user_id?: string | null
        }
        Update: {
          action_type?: string
          amount?: number | null
          created_at?: string
          id?: string
          membership_id?: string | null
          metadata?: Json | null
          reason?: string | null
          referral_id?: string | null
          referred_user_id?: string | null
          referrer_user_id?: string | null
        }
        Relationships: []
      }
      referral_clicks: {
        Row: {
          created_at: string
          id: string
          ip: string | null
          ref_code: string
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          ip?: string | null
          ref_code: string
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          ip?: string | null
          ref_code?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referral_clicks_ref_code_fkey"
            columns: ["ref_code"]
            isOneToOne: false
            referencedRelation: "user_referrals"
            referencedColumns: ["ref_code"]
          },
        ]
      }
      referral_conversions: {
        Row: {
          created_at: string
          id: string
          order_id: string | null
          ref_code: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          order_id?: string | null
          ref_code: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string | null
          ref_code?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "referral_conversions_ref_code_fkey"
            columns: ["ref_code"]
            isOneToOne: false
            referencedRelation: "user_referrals"
            referencedColumns: ["ref_code"]
          },
        ]
      }
      referral_events: {
        Row: {
          created_at: string
          id: string
          ip_address: string | null
          ref_code: string
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          ip_address?: string | null
          ref_code: string
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          ip_address?: string | null
          ref_code?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      referral_rewards: {
        Row: {
          created_at: string
          id: string
          referral_id: string | null
          reward_type: string
          user_id: string
          xp_amount: number
        }
        Insert: {
          created_at?: string
          id?: string
          referral_id?: string | null
          reward_type: string
          user_id: string
          xp_amount: number
        }
        Update: {
          created_at?: string
          id?: string
          referral_id?: string | null
          reward_type?: string
          user_id?: string
          xp_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "referral_rewards_referral_id_fkey"
            columns: ["referral_id"]
            isOneToOne: false
            referencedRelation: "referrals"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          referral_code: string
          referred_user_id: string
          referrer_user_id: string
          status: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          referral_code: string
          referred_user_id: string
          referrer_user_id: string
          status?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          referral_code?: string
          referred_user_id?: string
          referrer_user_id?: string
          status?: string
        }
        Relationships: []
      }
      research_publication_messages: {
        Row: {
          attachments: Json | null
          created_at: string
          id: string
          message: string
          publication_id: string
          read_at: string | null
          sender_id: string
          sender_type: string
        }
        Insert: {
          attachments?: Json | null
          created_at?: string
          id?: string
          message: string
          publication_id: string
          read_at?: string | null
          sender_id: string
          sender_type?: string
        }
        Update: {
          attachments?: Json | null
          created_at?: string
          id?: string
          message?: string
          publication_id?: string
          read_at?: string | null
          sender_id?: string
          sender_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "research_publication_messages_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "research_publications"
            referencedColumns: ["id"]
          },
        ]
      }
      research_publication_quotes: {
        Row: {
          amount: number
          created_at: string
          created_by: string | null
          currency: string
          description: string | null
          id: string
          publication_id: string
          quote_number: string
          status: string
          tax_amount: number
          total_amount: number
          updated_at: string
          valid_until: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          created_by?: string | null
          currency?: string
          description?: string | null
          id?: string
          publication_id: string
          quote_number?: string
          status?: string
          tax_amount?: number
          total_amount: number
          updated_at?: string
          valid_until?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          created_by?: string | null
          currency?: string
          description?: string | null
          id?: string
          publication_id?: string
          quote_number?: string
          status?: string
          tax_amount?: number
          total_amount?: number
          updated_at?: string
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "research_publication_quotes_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "research_publications"
            referencedColumns: ["id"]
          },
        ]
      }
      research_publications: {
        Row: {
          abstract: string
          admin_notes: string | null
          assigned_to: string | null
          attachments: Json
          authors: string | null
          client_email: string | null
          client_name: string
          client_phone: string
          created_at: string
          estimated_amount: number | null
          expected_delivery_date: string | null
          field: string
          file_url: string | null
          final_amount: number | null
          id: string
          journal_rank: string | null
          keywords: string | null
          language: string
          notes: string | null
          page_count: number | null
          priority: string
          request_number: string
          service_type: string
          status: string
          target_journal: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          abstract: string
          admin_notes?: string | null
          assigned_to?: string | null
          attachments?: Json
          authors?: string | null
          client_email?: string | null
          client_name: string
          client_phone: string
          created_at?: string
          estimated_amount?: number | null
          expected_delivery_date?: string | null
          field: string
          file_url?: string | null
          final_amount?: number | null
          id?: string
          journal_rank?: string | null
          keywords?: string | null
          language?: string
          notes?: string | null
          page_count?: number | null
          priority?: string
          request_number?: string
          service_type?: string
          status?: string
          target_journal?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          abstract?: string
          admin_notes?: string | null
          assigned_to?: string | null
          attachments?: Json
          authors?: string | null
          client_email?: string | null
          client_name?: string
          client_phone?: string
          created_at?: string
          estimated_amount?: number | null
          expected_delivery_date?: string | null
          field?: string
          file_url?: string | null
          final_amount?: number | null
          id?: string
          journal_rank?: string | null
          keywords?: string | null
          language?: string
          notes?: string | null
          page_count?: number | null
          priority?: string
          request_number?: string
          service_type?: string
          status?: string
          target_journal?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      service_categories: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_active: boolean
          name: string
          name_ar: string | null
          parent_id: string | null
          slug: string | null
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name: string
          name_ar?: string | null
          parent_id?: string | null
          slug?: string | null
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name?: string
          name_ar?: string | null
          parent_id?: string | null
          slug?: string | null
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      service_order_admin_notes: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: string
          order_id: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: string
          order_id: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          order_id?: string
        }
        Relationships: []
      }
      service_order_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          order_id: string
          read_at: string | null
          sender_id: string
          sender_type: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          order_id: string
          read_at?: string | null
          sender_id: string
          sender_type?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          order_id?: string
          read_at?: string | null
          sender_id?: string
          sender_type?: string
        }
        Relationships: []
      }
      service_order_timeline: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          note: string | null
          order_id: string
          status: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          note?: string | null
          order_id: string
          status: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          note?: string | null
          order_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_order_timeline_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "service_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      service_orders: {
        Row: {
          active_invoice_id: string | null
          admin_approved_price: number | null
          assistance_type: string | null
          cancelled_at: string | null
          client_confirmed_at: string | null
          client_estimated_price: number | null
          completed_at: string | null
          contract_pending_at: string | null
          contract_signature_deadline: string | null
          contract_signed_at: string | null
          created_at: string
          current_status: string | null
          customer_id: string | null
          deadline: string | null
          delivered_at: string | null
          estimated_amount: number | null
          execution_started_at: string | null
          id: string
          lifecycle_status: Database["public"]["Enums"]["order_lifecycle_status"]
          metadata: Json
          notes: string | null
          paid_amount: number | null
          payment_completed_at: string | null
          payment_deadline: string | null
          preferred_language: string | null
          price_approval_note: string | null
          price_approval_requested_at: string | null
          price_approval_status: string
          price_approved_at: string | null
          price_reviewed_by: string | null
          priority: string | null
          progress_percentage: number
          quantity: number | null
          quantity_unit: string | null
          quote_notes: string | null
          quote_response_deadline: string | null
          quote_sent_at: string | null
          quote_status: string | null
          service_id: string | null
          service_name: string | null
          signed_contract_id: string | null
          total_amount: number | null
          tracking_id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          active_invoice_id?: string | null
          admin_approved_price?: number | null
          assistance_type?: string | null
          cancelled_at?: string | null
          client_confirmed_at?: string | null
          client_estimated_price?: number | null
          completed_at?: string | null
          contract_pending_at?: string | null
          contract_signature_deadline?: string | null
          contract_signed_at?: string | null
          created_at?: string
          current_status?: string | null
          customer_id?: string | null
          deadline?: string | null
          delivered_at?: string | null
          estimated_amount?: number | null
          execution_started_at?: string | null
          id?: string
          lifecycle_status?: Database["public"]["Enums"]["order_lifecycle_status"]
          metadata?: Json
          notes?: string | null
          paid_amount?: number | null
          payment_completed_at?: string | null
          payment_deadline?: string | null
          preferred_language?: string | null
          price_approval_note?: string | null
          price_approval_requested_at?: string | null
          price_approval_status?: string
          price_approved_at?: string | null
          price_reviewed_by?: string | null
          priority?: string | null
          progress_percentage?: number
          quantity?: number | null
          quantity_unit?: string | null
          quote_notes?: string | null
          quote_response_deadline?: string | null
          quote_sent_at?: string | null
          quote_status?: string | null
          service_id?: string | null
          service_name?: string | null
          signed_contract_id?: string | null
          total_amount?: number | null
          tracking_id?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          active_invoice_id?: string | null
          admin_approved_price?: number | null
          assistance_type?: string | null
          cancelled_at?: string | null
          client_confirmed_at?: string | null
          client_estimated_price?: number | null
          completed_at?: string | null
          contract_pending_at?: string | null
          contract_signature_deadline?: string | null
          contract_signed_at?: string | null
          created_at?: string
          current_status?: string | null
          customer_id?: string | null
          deadline?: string | null
          delivered_at?: string | null
          estimated_amount?: number | null
          execution_started_at?: string | null
          id?: string
          lifecycle_status?: Database["public"]["Enums"]["order_lifecycle_status"]
          metadata?: Json
          notes?: string | null
          paid_amount?: number | null
          payment_completed_at?: string | null
          payment_deadline?: string | null
          preferred_language?: string | null
          price_approval_note?: string | null
          price_approval_requested_at?: string | null
          price_approval_status?: string
          price_approved_at?: string | null
          price_reviewed_by?: string | null
          priority?: string | null
          progress_percentage?: number
          quantity?: number | null
          quantity_unit?: string | null
          quote_notes?: string | null
          quote_response_deadline?: string | null
          quote_sent_at?: string | null
          quote_status?: string | null
          service_id?: string | null
          service_name?: string | null
          signed_contract_id?: string | null
          total_amount?: number | null
          tracking_id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_orders_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          category_id: string | null
          created_at: string
          default_quantity: number
          description: string | null
          description_ar: string | null
          dynamic_fields: Json
          group_max_members: number
          group_min_members: number
          group_seat_price: number | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_featured: boolean
          is_group_eligible: boolean
          name: string
          name_ar: string | null
          price: number | null
          quantity_unit_label: string | null
          slug: string | null
          sort_order: number
          subcategory_id: string | null
          unit: string | null
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          default_quantity?: number
          description?: string | null
          description_ar?: string | null
          dynamic_fields?: Json
          group_max_members?: number
          group_min_members?: number
          group_seat_price?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean
          is_group_eligible?: boolean
          name: string
          name_ar?: string | null
          price?: number | null
          quantity_unit_label?: string | null
          slug?: string | null
          sort_order?: number
          subcategory_id?: string | null
          unit?: string | null
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          default_quantity?: number
          description?: string | null
          description_ar?: string | null
          dynamic_fields?: Json
          group_max_members?: number
          group_min_members?: number
          group_seat_price?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean
          is_group_eligible?: boolean
          name?: string
          name_ar?: string | null
          price?: number | null
          quantity_unit_label?: string | null
          slug?: string | null
          sort_order?: number
          subcategory_id?: string | null
          unit?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      smart_editor_usage: {
        Row: {
          cost: number
          created_at: string
          id: string
          input_length: number
          mode: string
          operation: string
          output_length: number
          user_id: string
          wallet_transaction_id: string | null
          was_free: boolean
        }
        Insert: {
          cost?: number
          created_at?: string
          id?: string
          input_length?: number
          mode?: string
          operation: string
          output_length?: number
          user_id: string
          wallet_transaction_id?: string | null
          was_free?: boolean
        }
        Update: {
          cost?: number
          created_at?: string
          id?: string
          input_length?: number
          mode?: string
          operation?: string
          output_length?: number
          user_id?: string
          wallet_transaction_id?: string | null
          was_free?: boolean
        }
        Relationships: []
      }
      spin_attempts: {
        Row: {
          claimed: boolean | null
          created_at: string
          email: string | null
          id: string
          phone: string | null
          prize: string | null
          user_id: string | null
        }
        Insert: {
          claimed?: boolean | null
          created_at?: string
          email?: string | null
          id?: string
          phone?: string | null
          prize?: string | null
          user_id?: string | null
        }
        Update: {
          claimed?: boolean | null
          created_at?: string
          email?: string | null
          id?: string
          phone?: string | null
          prize?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      statistical_analyses: {
        Row: {
          analysis_params: Json | null
          analysis_type: string | null
          assumptions: Json | null
          column_count: number | null
          columns_meta: Json
          created_at: string
          data_sample: Json | null
          file_name: string | null
          file_size: number | null
          id: string
          interpretation_ar: string | null
          interpretation_en: string | null
          is_paid: boolean
          language: string
          pdf_exports_count: number
          pdf_purchased: boolean
          results: Json | null
          row_count: number | null
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          analysis_params?: Json | null
          analysis_type?: string | null
          assumptions?: Json | null
          column_count?: number | null
          columns_meta?: Json
          created_at?: string
          data_sample?: Json | null
          file_name?: string | null
          file_size?: number | null
          id?: string
          interpretation_ar?: string | null
          interpretation_en?: string | null
          is_paid?: boolean
          language?: string
          pdf_exports_count?: number
          pdf_purchased?: boolean
          results?: Json | null
          row_count?: number | null
          status?: string
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          analysis_params?: Json | null
          analysis_type?: string | null
          assumptions?: Json | null
          column_count?: number | null
          columns_meta?: Json
          created_at?: string
          data_sample?: Json | null
          file_name?: string | null
          file_size?: number | null
          id?: string
          interpretation_ar?: string | null
          interpretation_en?: string | null
          is_paid?: boolean
          language?: string
          pdf_exports_count?: number
          pdf_purchased?: boolean
          results?: Json | null
          row_count?: number | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      student_ai_usage: {
        Row: {
          created_at: string
          id: string
          input_length: number | null
          is_premium_user: boolean
          metadata: Json
          output_length: number | null
          tool_type: string
          usage_date: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          input_length?: number | null
          is_premium_user?: boolean
          metadata?: Json
          output_length?: number | null
          tool_type: string
          usage_date?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          input_length?: number | null
          is_premium_user?: boolean
          metadata?: Json
          output_length?: number | null
          tool_type?: string
          usage_date?: string
          user_id?: string
        }
        Relationships: []
      }
      student_daily_tasks: {
        Row: {
          action_link: string | null
          action_type: string
          code: string
          created_at: string
          daily_limit: number
          description_ar: string | null
          icon: string | null
          id: string
          is_active: boolean
          points_reward: number
          sort_order: number
          title_ar: string
          updated_at: string
        }
        Insert: {
          action_link?: string | null
          action_type: string
          code: string
          created_at?: string
          daily_limit?: number
          description_ar?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          points_reward?: number
          sort_order?: number
          title_ar: string
          updated_at?: string
        }
        Update: {
          action_link?: string | null
          action_type?: string
          code?: string
          created_at?: string
          daily_limit?: number
          description_ar?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          points_reward?: number
          sort_order?: number
          title_ar?: string
          updated_at?: string
        }
        Relationships: []
      }
      student_resources: {
        Row: {
          author: string | null
          category: string | null
          category_id: string | null
          content_html: string | null
          cover_image_url: string | null
          created_at: string
          created_by: string | null
          description: string | null
          difficulty: string | null
          download_count: number
          duration_minutes: number | null
          file_size_kb: number | null
          id: string
          is_featured: boolean | null
          is_premium: boolean
          is_published: boolean
          long_description: string | null
          resource_type: string
          sort_order: number
          subcategory_id: string | null
          tags: string[] | null
          title: string
          updated_at: string
          url: string
          views_count: number
        }
        Insert: {
          author?: string | null
          category?: string | null
          category_id?: string | null
          content_html?: string | null
          cover_image_url?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          difficulty?: string | null
          download_count?: number
          duration_minutes?: number | null
          file_size_kb?: number | null
          id?: string
          is_featured?: boolean | null
          is_premium?: boolean
          is_published?: boolean
          long_description?: string | null
          resource_type: string
          sort_order?: number
          subcategory_id?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          url: string
          views_count?: number
        }
        Update: {
          author?: string | null
          category?: string | null
          category_id?: string | null
          content_html?: string | null
          cover_image_url?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          difficulty?: string | null
          download_count?: number
          duration_minutes?: number | null
          file_size_kb?: number | null
          id?: string
          is_featured?: boolean | null
          is_premium?: boolean
          is_published?: boolean
          long_description?: string | null
          resource_type?: string
          sort_order?: number
          subcategory_id?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          url?: string
          views_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "student_resources_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "library_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_resources_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "library_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      student_task_completions: {
        Row: {
          completion_date: string
          created_at: string
          id: string
          metadata: Json
          points_awarded: number
          task_code: string
          task_id: string
          user_id: string
        }
        Insert: {
          completion_date?: string
          created_at?: string
          id?: string
          metadata?: Json
          points_awarded?: number
          task_code: string
          task_id: string
          user_id: string
        }
        Update: {
          completion_date?: string
          created_at?: string
          id?: string
          metadata?: Json
          points_awarded?: number
          task_code?: string
          task_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_task_completions_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "student_daily_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          category_id: string
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_active: boolean
          name_ar: string
          name_en: string | null
          sort_order: number
        }
        Insert: {
          category_id: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name_ar: string
          name_en?: string | null
          sort_order?: number
        }
        Update: {
          category_id?: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name_ar?: string
          name_en?: string | null
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "subjects_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "question_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      support_kb_articles: {
        Row: {
          category: string
          content: string
          created_at: string
          helpful_count: number
          id: string
          is_published: boolean
          sort_order: number
          tags: string[] | null
          title: string
          updated_at: string
          views: number
        }
        Insert: {
          category?: string
          content: string
          created_at?: string
          helpful_count?: number
          id?: string
          is_published?: boolean
          sort_order?: number
          tags?: string[] | null
          title: string
          updated_at?: string
          views?: number
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          helpful_count?: number
          id?: string
          is_published?: boolean
          sort_order?: number
          tags?: string[] | null
          title?: string
          updated_at?: string
          views?: number
        }
        Relationships: []
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      ticket_attachments: {
        Row: {
          created_at: string
          file_name: string
          file_size: number
          file_type: string | null
          id: string
          storage_path: string
          ticket_id: string
          uploaded_by_admin: boolean
          user_id: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_size: number
          file_type?: string | null
          id?: string
          storage_path: string
          ticket_id: string
          uploaded_by_admin?: boolean
          user_id: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_size?: number
          file_type?: string | null
          id?: string
          storage_path?: string
          ticket_id?: string
          uploaded_by_admin?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_attachments_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          read_at: string | null
          sender_id: string
          sender_type: string
          ticket_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          read_at?: string | null
          sender_id: string
          sender_type?: string
          ticket_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          read_at?: string | null
          sender_id?: string
          sender_type?: string
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_presence: {
        Row: {
          display_name: string | null
          last_seen_at: string
          ticket_id: string
          user_id: string
          user_type: string
        }
        Insert: {
          display_name?: string | null
          last_seen_at?: string
          ticket_id: string
          user_id: string
          user_type: string
        }
        Update: {
          display_name?: string | null
          last_seen_at?: string
          ticket_id?: string
          user_id?: string
          user_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_presence_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_quick_replies: {
        Row: {
          category: string | null
          content: string
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean
          sort_order: number
          title: string
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          sort_order?: number
          title: string
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          sort_order?: number
          title?: string
        }
        Relationships: []
      }
      ticket_timeline: {
        Row: {
          action_label: string
          action_type: string
          actor_id: string | null
          actor_type: string
          created_at: string
          description: string | null
          id: string
          metadata: Json | null
          ticket_id: string
        }
        Insert: {
          action_label: string
          action_type: string
          actor_id?: string | null
          actor_type?: string
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          ticket_id: string
        }
        Update: {
          action_label?: string
          action_type?: string
          actor_id?: string | null
          actor_type?: string
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_timeline_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_typing: {
        Row: {
          is_typing: boolean
          ticket_id: string
          updated_at: string
          user_id: string
          user_type: string
        }
        Insert: {
          is_typing?: boolean
          ticket_id: string
          updated_at?: string
          user_id: string
          user_type: string
        }
        Update: {
          is_typing?: boolean
          ticket_id?: string
          updated_at?: string
          user_id?: string
          user_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_typing_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          assigned_admin_id: string | null
          assigned_to: string | null
          auto_created: boolean
          category: string | null
          closed_at: string | null
          created_at: string
          csat_comment: string | null
          csat_rating: number | null
          csat_submitted_at: string | null
          customer_id: string | null
          description: string | null
          first_response_at: string | null
          id: string
          last_message_at: string | null
          priority: string | null
          related_contract_id: string | null
          related_invoice_id: string | null
          related_order_id: string | null
          related_payment_id: string | null
          resolved_at: string | null
          sla_due_at: string | null
          source: string
          status: string | null
          subject: string
          tags: string[] | null
          ticket_number: string
          unread_for_admin: number
          unread_for_client: number
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_admin_id?: string | null
          assigned_to?: string | null
          auto_created?: boolean
          category?: string | null
          closed_at?: string | null
          created_at?: string
          csat_comment?: string | null
          csat_rating?: number | null
          csat_submitted_at?: string | null
          customer_id?: string | null
          description?: string | null
          first_response_at?: string | null
          id?: string
          last_message_at?: string | null
          priority?: string | null
          related_contract_id?: string | null
          related_invoice_id?: string | null
          related_order_id?: string | null
          related_payment_id?: string | null
          resolved_at?: string | null
          sla_due_at?: string | null
          source?: string
          status?: string | null
          subject: string
          tags?: string[] | null
          ticket_number?: string
          unread_for_admin?: number
          unread_for_client?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_admin_id?: string | null
          assigned_to?: string | null
          auto_created?: boolean
          category?: string | null
          closed_at?: string | null
          created_at?: string
          csat_comment?: string | null
          csat_rating?: number | null
          csat_submitted_at?: string | null
          customer_id?: string | null
          description?: string | null
          first_response_at?: string | null
          id?: string
          last_message_at?: string | null
          priority?: string | null
          related_contract_id?: string | null
          related_invoice_id?: string | null
          related_order_id?: string | null
          related_payment_id?: string | null
          resolved_at?: string | null
          sla_due_at?: string | null
          source?: string
          status?: string | null
          subject?: string
          tags?: string[] | null
          ticket_number?: string
          unread_for_admin?: number
          unread_for_client?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tickets_related_contract_id_fkey"
            columns: ["related_contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_related_invoice_id_fkey"
            columns: ["related_invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_related_order_id_fkey"
            columns: ["related_order_id"]
            isOneToOne: false
            referencedRelation: "service_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_related_payment_id_fkey"
            columns: ["related_payment_id"]
            isOneToOne: false
            referencedRelation: "invoice_payments"
            referencedColumns: ["id"]
          },
        ]
      }
      track_tool_usage_logs: {
        Row: {
          cost: number
          created_at: string
          id: string
          metadata: Json
          tool_id: string
          track_id: string
          user_id: string
          wallet_transaction_id: string | null
          was_free: boolean
        }
        Insert: {
          cost?: number
          created_at?: string
          id?: string
          metadata?: Json
          tool_id: string
          track_id: string
          user_id: string
          wallet_transaction_id?: string | null
          was_free?: boolean
        }
        Update: {
          cost?: number
          created_at?: string
          id?: string
          metadata?: Json
          tool_id?: string
          track_id?: string
          user_id?: string
          wallet_transaction_id?: string | null
          was_free?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "track_tool_usage_logs_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "track_tools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "track_tool_usage_logs_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      track_tools: {
        Row: {
          action_link: string | null
          badge: string | null
          created_at: string
          description_ar: string | null
          free_daily_quota: number
          icon: string | null
          id: string
          is_active: boolean
          is_premium: boolean
          metadata: Json
          name_ar: string
          name_en: string | null
          price: number
          slug: string
          sort_order: number
          tool_type: string
          track_id: string
          updated_at: string
        }
        Insert: {
          action_link?: string | null
          badge?: string | null
          created_at?: string
          description_ar?: string | null
          free_daily_quota?: number
          icon?: string | null
          id?: string
          is_active?: boolean
          is_premium?: boolean
          metadata?: Json
          name_ar: string
          name_en?: string | null
          price?: number
          slug: string
          sort_order?: number
          tool_type?: string
          track_id: string
          updated_at?: string
        }
        Update: {
          action_link?: string | null
          badge?: string | null
          created_at?: string
          description_ar?: string | null
          free_daily_quota?: number
          icon?: string | null
          id?: string
          is_active?: boolean
          is_premium?: boolean
          metadata?: Json
          name_ar?: string
          name_en?: string | null
          price?: number
          slug?: string
          sort_order?: number
          tool_type?: string
          track_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "track_tools_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      tracks: {
        Row: {
          color: string | null
          cover_image_url: string | null
          created_at: string
          description_ar: string | null
          icon: string | null
          id: string
          is_active: boolean
          name_ar: string
          name_en: string | null
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          color?: string | null
          cover_image_url?: string | null
          created_at?: string
          description_ar?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name_ar: string
          name_en?: string | null
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          color?: string | null
          cover_image_url?: string | null
          created_at?: string
          description_ar?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name_ar?: string
          name_en?: string | null
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      translation_file_analyses: {
        Row: {
          admin_notes: string | null
          analysis_method: string
          analysis_notes: string | null
          approval_status: string
          approved_at: string | null
          approved_by: string | null
          approved_price_sar: number | null
          arabic_ratio: number | null
          character_count: number
          confidence_level: string
          created_at: string
          detected_language: string
          domain: string
          domain_confidence: number | null
          domain_multiplier: number
          domain_source: string
          english_ratio: number | null
          estimated_pages: number
          estimated_price_sar: number
          file_name: string
          file_size_bytes: number
          file_type: string
          id: string
          is_fallback: boolean
          per_word_rate_sar: number
          service_order_id: string | null
          text_sample: string | null
          updated_at: string
          urgency_multiplier: number
          user_id: string
          word_count: number
          words_per_page_standard: number
        }
        Insert: {
          admin_notes?: string | null
          analysis_method?: string
          analysis_notes?: string | null
          approval_status?: string
          approved_at?: string | null
          approved_by?: string | null
          approved_price_sar?: number | null
          arabic_ratio?: number | null
          character_count?: number
          confidence_level?: string
          created_at?: string
          detected_language?: string
          domain?: string
          domain_confidence?: number | null
          domain_multiplier?: number
          domain_source?: string
          english_ratio?: number | null
          estimated_pages?: number
          estimated_price_sar?: number
          file_name: string
          file_size_bytes?: number
          file_type: string
          id?: string
          is_fallback?: boolean
          per_word_rate_sar?: number
          service_order_id?: string | null
          text_sample?: string | null
          updated_at?: string
          urgency_multiplier?: number
          user_id: string
          word_count?: number
          words_per_page_standard?: number
        }
        Update: {
          admin_notes?: string | null
          analysis_method?: string
          analysis_notes?: string | null
          approval_status?: string
          approved_at?: string | null
          approved_by?: string | null
          approved_price_sar?: number | null
          arabic_ratio?: number | null
          character_count?: number
          confidence_level?: string
          created_at?: string
          detected_language?: string
          domain?: string
          domain_confidence?: number | null
          domain_multiplier?: number
          domain_source?: string
          english_ratio?: number | null
          estimated_pages?: number
          estimated_price_sar?: number
          file_name?: string
          file_size_bytes?: number
          file_type?: string
          id?: string
          is_fallback?: boolean
          per_word_rate_sar?: number
          service_order_id?: string | null
          text_sample?: string | null
          updated_at?: string
          urgency_multiplier?: number
          user_id?: string
          word_count?: number
          words_per_page_standard?: number
        }
        Relationships: [
          {
            foreignKeyName: "translation_file_analyses_service_order_id_fkey"
            columns: ["service_order_id"]
            isOneToOne: false
            referencedRelation: "service_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      user_answers: {
        Row: {
          answered_at: string
          id: string
          is_correct: boolean
          question_id: string
          selected_choice_id: string | null
          time_spent_seconds: number | null
          user_id: string
        }
        Insert: {
          answered_at?: string
          id?: string
          is_correct?: boolean
          question_id: string
          selected_choice_id?: string | null
          time_spent_seconds?: number | null
          user_id: string
        }
        Update: {
          answered_at?: string
          id?: string
          is_correct?: boolean
          question_id?: string
          selected_choice_id?: string | null
          time_spent_seconds?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_answers_selected_choice_id_fkey"
            columns: ["selected_choice_id"]
            isOneToOne: false
            referencedRelation: "question_choices"
            referencedColumns: ["id"]
          },
        ]
      }
      user_discount_coupons: {
        Row: {
          applies_to: string
          code: string
          created_at: string
          discount_type: string
          discount_value: number
          expires_at: string | null
          id: string
          max_uses: number
          source_purchase_id: string | null
          status: string
          used_at: string | null
          used_count: number
          used_on_purchase_id: string | null
          user_id: string
        }
        Insert: {
          applies_to?: string
          code: string
          created_at?: string
          discount_type: string
          discount_value: number
          expires_at?: string | null
          id?: string
          max_uses?: number
          source_purchase_id?: string | null
          status?: string
          used_at?: string | null
          used_count?: number
          used_on_purchase_id?: string | null
          user_id: string
        }
        Update: {
          applies_to?: string
          code?: string
          created_at?: string
          discount_type?: string
          discount_value?: number
          expires_at?: string | null
          id?: string
          max_uses?: number
          source_purchase_id?: string | null
          status?: string
          used_at?: string | null
          used_count?: number
          used_on_purchase_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_discount_coupons_source_purchase_id_fkey"
            columns: ["source_purchase_id"]
            isOneToOne: false
            referencedRelation: "marketplace_purchases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_discount_coupons_used_on_purchase_id_fkey"
            columns: ["used_on_purchase_id"]
            isOneToOne: false
            referencedRelation: "marketplace_purchases"
            referencedColumns: ["id"]
          },
        ]
      }
      user_memberships: {
        Row: {
          activated_by: string | null
          amount_paid: number
          cancelled_at: string | null
          cashback_credited: boolean
          created_at: string
          expires_at: string | null
          id: string
          invoice_id: string | null
          notes: string | null
          payment_method: string | null
          plan_id: string
          referral_code_used: string | null
          referred_by: string | null
          starts_at: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          activated_by?: string | null
          amount_paid?: number
          cancelled_at?: string | null
          cashback_credited?: boolean
          created_at?: string
          expires_at?: string | null
          id?: string
          invoice_id?: string | null
          notes?: string | null
          payment_method?: string | null
          plan_id: string
          referral_code_used?: string | null
          referred_by?: string | null
          starts_at?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          activated_by?: string | null
          amount_paid?: number
          cancelled_at?: string | null
          cashback_credited?: boolean
          created_at?: string
          expires_at?: string | null
          id?: string
          invoice_id?: string | null
          notes?: string | null
          payment_method?: string | null
          plan_id?: string
          referral_code_used?: string | null
          referred_by?: string | null
          starts_at?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_memberships_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_memberships_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "membership_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      user_notifications: {
        Row: {
          created_at: string
          id: string
          link: string | null
          message: string | null
          read_at: string | null
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          link?: string | null
          message?: string | null
          read_at?: string | null
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          link?: string | null
          message?: string | null
          read_at?: string | null
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_points: {
        Row: {
          created_at: string
          current_level_id: string | null
          level_reached_at: string | null
          lifetime_earned: number
          lifetime_spent: number
          total_points: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_level_id?: string | null
          level_reached_at?: string | null
          lifetime_earned?: number
          lifetime_spent?: number
          total_points?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_level_id?: string | null
          level_reached_at?: string | null
          lifetime_earned?: number
          lifetime_spent?: number
          total_points?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_points_current_level_id_fkey"
            columns: ["current_level_id"]
            isOneToOne: false
            referencedRelation: "gamification_levels"
            referencedColumns: ["id"]
          },
        ]
      }
      user_referral_codes: {
        Row: {
          code: string
          created_at: string
          user_id: string
        }
        Insert: {
          code: string
          created_at?: string
          user_id: string
        }
        Update: {
          code?: string
          created_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_referrals: {
        Row: {
          created_at: string
          id: string
          ref_code: string
          total_clicks: number
          total_orders: number
          total_signups: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          ref_code: string
          total_clicks?: number
          total_orders?: number
          total_signups?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          ref_code?: string
          total_clicks?: number
          total_orders?: number
          total_signups?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_rewards: {
        Row: {
          awarded_at: string
          created_at: string
          expires_at: string | null
          id: string
          metadata: Json
          point_transaction_id: string | null
          redemption_code: string | null
          reward_id: string
          source: string
          status: string
          updated_at: string
          used_at: string | null
          user_id: string
        }
        Insert: {
          awarded_at?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          metadata?: Json
          point_transaction_id?: string | null
          redemption_code?: string | null
          reward_id: string
          source?: string
          status?: string
          updated_at?: string
          used_at?: string | null
          user_id: string
        }
        Update: {
          awarded_at?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          metadata?: Json
          point_transaction_id?: string | null
          redemption_code?: string | null
          reward_id?: string
          source?: string
          status?: string
          updated_at?: string
          used_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_rewards_point_transaction_id_fkey"
            columns: ["point_transaction_id"]
            isOneToOne: false
            referencedRelation: "point_transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_rewards_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "gamification_rewards"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_unlocked_features: {
        Row: {
          created_at: string
          expires_at: string | null
          feature_key: string
          id: string
          payload: Json
          source: string
          source_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          feature_key: string
          id?: string
          payload?: Json
          source?: string
          source_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          feature_key?: string
          id?: string
          payload?: Json
          source?: string
          source_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_xp_wallet: {
        Row: {
          current_level: number
          lifetime_xp: number
          total_xp: number
          updated_at: string
          user_id: string
          xp_to_next_level: number
        }
        Insert: {
          current_level?: number
          lifetime_xp?: number
          total_xp?: number
          updated_at?: string
          user_id: string
          xp_to_next_level?: number
        }
        Update: {
          current_level?: number
          lifetime_xp?: number
          total_xp?: number
          updated_at?: string
          user_id?: string
          xp_to_next_level?: number
        }
        Relationships: []
      }
      wallet_topup_requests: {
        Row: {
          admin_notes: string | null
          amount: number
          created_at: string
          id: string
          notes: string | null
          payment_method: string
          receipt_path: string | null
          reference_number: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          updated_at: string
          user_id: string
          wallet_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          amount: number
          created_at?: string
          id?: string
          notes?: string | null
          payment_method?: string
          receipt_path?: string | null
          reference_number?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
          user_id: string
          wallet_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          amount?: number
          created_at?: string
          id?: string
          notes?: string | null
          payment_method?: string
          receipt_path?: string | null
          reference_number?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          wallet_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wallet_topup_requests_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      wallet_transactions: {
        Row: {
          amount: number
          balance_after: number
          balance_before: number | null
          created_at: string
          created_by: string | null
          currency: string
          description: string | null
          fee_amount: number
          gateway_ref: string | null
          id: string
          ip_address: string | null
          masked_account: string | null
          metadata: Json | null
          payment_intent_id: string | null
          payment_method: string | null
          receipt_generated_at: string | null
          receipt_number: string | null
          receipt_pdf_path: string | null
          reconciled: boolean
          reconciled_at: string | null
          reference_id: string | null
          reference_type: string | null
          signature_hash: string | null
          signed_at: string
          type: string
          user_id: string
          vat_amount: number
          wallet_id: string
        }
        Insert: {
          amount: number
          balance_after?: number
          balance_before?: number | null
          created_at?: string
          created_by?: string | null
          currency?: string
          description?: string | null
          fee_amount?: number
          gateway_ref?: string | null
          id?: string
          ip_address?: string | null
          masked_account?: string | null
          metadata?: Json | null
          payment_intent_id?: string | null
          payment_method?: string | null
          receipt_generated_at?: string | null
          receipt_number?: string | null
          receipt_pdf_path?: string | null
          reconciled?: boolean
          reconciled_at?: string | null
          reference_id?: string | null
          reference_type?: string | null
          signature_hash?: string | null
          signed_at?: string
          type: string
          user_id: string
          vat_amount?: number
          wallet_id: string
        }
        Update: {
          amount?: number
          balance_after?: number
          balance_before?: number | null
          created_at?: string
          created_by?: string | null
          currency?: string
          description?: string | null
          fee_amount?: number
          gateway_ref?: string | null
          id?: string
          ip_address?: string | null
          masked_account?: string | null
          metadata?: Json | null
          payment_intent_id?: string | null
          payment_method?: string | null
          receipt_generated_at?: string | null
          receipt_number?: string | null
          receipt_pdf_path?: string | null
          reconciled?: boolean
          reconciled_at?: string | null
          reference_id?: string | null
          reference_type?: string | null
          signature_hash?: string | null
          signed_at?: string
          type?: string
          user_id?: string
          vat_amount?: number
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallet_transactions_payment_intent_id_fkey"
            columns: ["payment_intent_id"]
            isOneToOne: false
            referencedRelation: "payment_intents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wallet_transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      wallets: {
        Row: {
          balance: number
          created_at: string
          currency: string
          id: string
          status: string
          total_deposited: number
          total_spent: number
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string
          currency?: string
          id?: string
          status?: string
          total_deposited?: number
          total_spent?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          currency?: string
          id?: string
          status?: string
          total_deposited?: number
          total_spent?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      whatsapp_bot_sessions: {
        Row: {
          created_at: string
          customer_id: string | null
          failed_attempts: number
          human_takeover: boolean
          human_takeover_at: string | null
          human_takeover_reason: string | null
          id: string
          inbox_message_id: string | null
          is_registered: boolean
          last_bot_reply_at: string | null
          last_message: string | null
          last_message_at: string | null
          phone: string
          state: string
          state_data: Json
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          failed_attempts?: number
          human_takeover?: boolean
          human_takeover_at?: string | null
          human_takeover_reason?: string | null
          id?: string
          inbox_message_id?: string | null
          is_registered?: boolean
          last_bot_reply_at?: string | null
          last_message?: string | null
          last_message_at?: string | null
          phone: string
          state?: string
          state_data?: Json
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          failed_attempts?: number
          human_takeover?: boolean
          human_takeover_at?: string | null
          human_takeover_reason?: string | null
          id?: string
          inbox_message_id?: string | null
          is_registered?: boolean
          last_bot_reply_at?: string | null
          last_message?: string | null
          last_message_at?: string | null
          phone?: string
          state?: string
          state_data?: Json
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      whatsapp_campaign_recipients: {
        Row: {
          campaign_id: string
          created_at: string
          customer_id: string | null
          error_message: string | null
          id: string
          name: string | null
          phone: string
          read_at: string | null
          replied_at: string | null
          send_log_id: string | null
          sent_at: string | null
          status: string
          user_id: string | null
          variables: Json
        }
        Insert: {
          campaign_id: string
          created_at?: string
          customer_id?: string | null
          error_message?: string | null
          id?: string
          name?: string | null
          phone: string
          read_at?: string | null
          replied_at?: string | null
          send_log_id?: string | null
          sent_at?: string | null
          status?: string
          user_id?: string | null
          variables?: Json
        }
        Update: {
          campaign_id?: string
          created_at?: string
          customer_id?: string | null
          error_message?: string | null
          id?: string
          name?: string | null
          phone?: string
          read_at?: string | null
          replied_at?: string | null
          send_log_id?: string | null
          sent_at?: string | null
          status?: string
          user_id?: string | null
          variables?: Json
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_campaign_recipients_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_campaigns: {
        Row: {
          audience_filter: Json
          completed_at: string | null
          created_at: string
          created_by: string | null
          description: string | null
          failed_count: number
          id: string
          message_body: string
          name: string
          read_count: number
          reply_count: number
          scheduled_at: string | null
          sent_count: number
          started_at: string | null
          status: string
          template_id: string | null
          total_recipients: number
          updated_at: string
          variables_map: Json
        }
        Insert: {
          audience_filter?: Json
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          failed_count?: number
          id?: string
          message_body: string
          name: string
          read_count?: number
          reply_count?: number
          scheduled_at?: string | null
          sent_count?: number
          started_at?: string | null
          status?: string
          template_id?: string | null
          total_recipients?: number
          updated_at?: string
          variables_map?: Json
        }
        Update: {
          audience_filter?: Json
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          failed_count?: number
          id?: string
          message_body?: string
          name?: string
          read_count?: number
          reply_count?: number
          scheduled_at?: string | null
          sent_count?: number
          started_at?: string | null
          status?: string
          template_id?: string | null
          total_recipients?: number
          updated_at?: string
          variables_map?: Json
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_campaigns_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_conversation_notes: {
        Row: {
          admin_id: string | null
          admin_name: string | null
          body: string
          conversation_id: string
          created_at: string
          id: string
        }
        Insert: {
          admin_id?: string | null
          admin_name?: string | null
          body: string
          conversation_id: string
          created_at?: string
          id?: string
        }
        Update: {
          admin_id?: string | null
          admin_name?: string | null
          body?: string
          conversation_id?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_conversation_notes_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_conversations: {
        Row: {
          assigned_to: string | null
          created_at: string
          customer_id: string | null
          customer_name: string | null
          human_takeover: boolean
          id: string
          is_pinned: boolean
          is_starred: boolean
          last_admin_read_at: string | null
          last_inbound_at: string | null
          last_message: string | null
          last_message_at: string | null
          metadata: Json
          phone: string
          status: string
          tags: string[]
          unread_count: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          customer_id?: string | null
          customer_name?: string | null
          human_takeover?: boolean
          id?: string
          is_pinned?: boolean
          is_starred?: boolean
          last_admin_read_at?: string | null
          last_inbound_at?: string | null
          last_message?: string | null
          last_message_at?: string | null
          metadata?: Json
          phone: string
          status?: string
          tags?: string[]
          unread_count?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          customer_id?: string | null
          customer_name?: string | null
          human_takeover?: boolean
          id?: string
          is_pinned?: boolean
          is_starred?: boolean
          last_admin_read_at?: string | null
          last_inbound_at?: string | null
          last_message?: string | null
          last_message_at?: string | null
          metadata?: Json
          phone?: string
          status?: string
          tags?: string[]
          unread_count?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      whatsapp_inbound_messages: {
        Row: {
          bot_handled: boolean
          bot_reply: string | null
          created_at: string
          forwarded_to_human: boolean
          id: string
          inbox_message_id: string | null
          message_body: string | null
          message_type: string | null
          phone: string
          raw_payload: Json | null
        }
        Insert: {
          bot_handled?: boolean
          bot_reply?: string | null
          created_at?: string
          forwarded_to_human?: boolean
          id?: string
          inbox_message_id?: string | null
          message_body?: string | null
          message_type?: string | null
          phone: string
          raw_payload?: Json | null
        }
        Update: {
          bot_handled?: boolean
          bot_reply?: string | null
          created_at?: string
          forwarded_to_human?: boolean
          id?: string
          inbox_message_id?: string | null
          message_body?: string | null
          message_type?: string | null
          phone?: string
          raw_payload?: Json | null
        }
        Relationships: []
      }
      whatsapp_messages: {
        Row: {
          body: string
          conversation_id: string
          created_at: string
          delivery_status: string
          direction: string
          error_message: string | null
          id: string
          media_filename: string | null
          media_url: string | null
          message_type: string
          metadata: Json
          phone: string
          provider_message_id: string | null
          read_by_admin_at: string | null
          read_by_customer_at: string | null
          sender_id: string | null
          sender_name: string | null
          sender_type: string
        }
        Insert: {
          body: string
          conversation_id: string
          created_at?: string
          delivery_status?: string
          direction: string
          error_message?: string | null
          id?: string
          media_filename?: string | null
          media_url?: string | null
          message_type?: string
          metadata?: Json
          phone: string
          provider_message_id?: string | null
          read_by_admin_at?: string | null
          read_by_customer_at?: string | null
          sender_id?: string | null
          sender_name?: string | null
          sender_type: string
        }
        Update: {
          body?: string
          conversation_id?: string
          created_at?: string
          delivery_status?: string
          direction?: string
          error_message?: string | null
          id?: string
          media_filename?: string | null
          media_url?: string | null
          message_type?: string
          metadata?: Json
          phone?: string
          provider_message_id?: string | null
          read_by_admin_at?: string | null
          read_by_customer_at?: string | null
          sender_id?: string | null
          sender_name?: string | null
          sender_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_otp_codes: {
        Row: {
          attempts: number
          code_hash: string
          created_at: string
          expires_at: string
          id: string
          ip_address: string | null
          phone: string
          purpose: string
          used: boolean
        }
        Insert: {
          attempts?: number
          code_hash: string
          created_at?: string
          expires_at: string
          id?: string
          ip_address?: string | null
          phone: string
          purpose?: string
          used?: boolean
        }
        Update: {
          attempts?: number
          code_hash?: string
          created_at?: string
          expires_at?: string
          id?: string
          ip_address?: string | null
          phone?: string
          purpose?: string
          used?: boolean
        }
        Relationships: []
      }
      whatsapp_quick_replies: {
        Row: {
          body: string
          category: string | null
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean
          shortcut: string | null
          title: string
          updated_at: string
          use_count: number
        }
        Insert: {
          body: string
          category?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          shortcut?: string | null
          title: string
          updated_at?: string
          use_count?: number
        }
        Update: {
          body?: string
          category?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          shortcut?: string | null
          title?: string
          updated_at?: string
          use_count?: number
        }
        Relationships: []
      }
      whatsapp_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          event_key: string | null
          id: string
          message_body: string | null
          provider_message_id: string | null
          related_entity_id: string | null
          related_entity_type: string | null
          status: string
          to_phone: string
          user_id: string | null
          variables: Json | null
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          event_key?: string | null
          id?: string
          message_body?: string | null
          provider_message_id?: string | null
          related_entity_id?: string | null
          related_entity_type?: string | null
          status?: string
          to_phone: string
          user_id?: string | null
          variables?: Json | null
        }
        Update: {
          created_at?: string
          error_message?: string | null
          event_key?: string | null
          id?: string
          message_body?: string | null
          provider_message_id?: string | null
          related_entity_id?: string | null
          related_entity_type?: string | null
          status?: string
          to_phone?: string
          user_id?: string | null
          variables?: Json | null
        }
        Relationships: []
      }
      whatsapp_settings: {
        Row: {
          default_country_code: string
          events_enabled: Json
          id: number
          is_enabled: boolean
          test_phone: string | null
          updated_at: string
        }
        Insert: {
          default_country_code?: string
          events_enabled?: Json
          id?: number
          is_enabled?: boolean
          test_phone?: string | null
          updated_at?: string
        }
        Update: {
          default_country_code?: string
          events_enabled?: Json
          id?: number
          is_enabled?: boolean
          test_phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      whatsapp_templates: {
        Row: {
          body_text: string
          created_at: string
          event_key: string
          id: string
          is_active: boolean
          title: string
          updated_at: string
          variables: Json
        }
        Insert: {
          body_text: string
          created_at?: string
          event_key: string
          id?: string
          is_active?: boolean
          title: string
          updated_at?: string
          variables?: Json
        }
        Update: {
          body_text?: string
          created_at?: string
          event_key?: string
          id?: string
          is_active?: boolean
          title?: string
          updated_at?: string
          variables?: Json
        }
        Relationships: []
      }
      workspace_notes: {
        Row: {
          content: string
          created_at: string
          id: string
          source_type: string | null
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string
          created_at?: string
          id?: string
          source_type?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          source_type?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      xp_daily_limits: {
        Row: {
          description: string | null
          max_per_day: number
          max_xp_per_day: number
          source_type: string
        }
        Insert: {
          description?: string | null
          max_per_day: number
          max_xp_per_day: number
          source_type: string
        }
        Update: {
          description?: string | null
          max_per_day?: number
          max_xp_per_day?: number
          source_type?: string
        }
        Relationships: []
      }
      xp_levels: {
        Row: {
          badge_color: string | null
          created_at: string
          icon: string | null
          level: number
          name_ar: string
          required_xp_total: number
          reward_payload: Json
          reward_type: string | null
        }
        Insert: {
          badge_color?: string | null
          created_at?: string
          icon?: string | null
          level: number
          name_ar: string
          required_xp_total: number
          reward_payload?: Json
          reward_type?: string | null
        }
        Update: {
          badge_color?: string | null
          created_at?: string
          icon?: string | null
          level?: number
          name_ar?: string
          required_xp_total?: number
          reward_payload?: Json
          reward_type?: string | null
        }
        Relationships: []
      }
      xp_rewards_claims: {
        Row: {
          claimed_at: string
          id: string
          level: number
          reward_payload: Json
          reward_type: string | null
          user_id: string
        }
        Insert: {
          claimed_at?: string
          id?: string
          level: number
          reward_payload?: Json
          reward_type?: string | null
          user_id: string
        }
        Update: {
          claimed_at?: string
          id?: string
          level?: number
          reward_payload?: Json
          reward_type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      xp_transactions: {
        Row: {
          amount: number
          balance_after: number
          created_at: string
          description: string | null
          id: string
          metadata: Json
          source_id: string | null
          source_type: string
          user_id: string
        }
        Insert: {
          amount: number
          balance_after: number
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json
          source_id?: string | null
          source_type: string
          user_id: string
        }
        Update: {
          amount?: number
          balance_after?: number
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json
          source_id?: string | null
          source_type?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_service_quote: { Args: { _order_id: string }; Returns: Json }
      aggregate_daily_growth_metrics: {
        Args: { p_date?: string }
        Returns: {
          active_users: number
          challenges_completed: number
          computed_at: string
          conversions: number
          date: string
          new_users: number
          referrals_completed: number
          referrals_count: number
          retention_rate: number
          shares_count: number
        }
        SetofOptions: {
          from: "*"
          to: "daily_growth_metrics"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      analyze_growth_insights: { Args: never; Returns: Json }
      archive_experiment: {
        Args: { p_experiment_id: string }
        Returns: {
          created_at: string
          created_by: string | null
          description: string | null
          end_at: string | null
          experiment_key: string
          hypothesis: string | null
          id: string
          min_sample_size: number
          name: string
          primary_metric: string
          secondary_metrics: Json
          start_at: string | null
          status: Database["public"]["Enums"]["experiment_status"]
          target_area: Database["public"]["Enums"]["experiment_target_area"]
          traffic_allocation_percentage: number
          updated_at: string
          winner_variant_id: string | null
        }
        SetofOptions: {
          from: "*"
          to: "experiments"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      assign_experiment_variant: {
        Args: {
          p_anonymous_id?: string
          p_context?: Json
          p_experiment_key: string
          p_user_id?: string
        }
        Returns: {
          config_payload: Json
          is_control: boolean
          variant_id: string
          variant_key: string
        }[]
      }
      award_assessment_share_xp: {
        Args: { p_attempt_id: string }
        Returns: Json
      }
      award_points: {
        Args: {
          _apply_multiplier?: boolean
          _base_points: number
          _description?: string
          _metadata?: Json
          _source_id?: string
          _source_type: string
          _user_id: string
        }
        Returns: string
      }
      award_xp: {
        Args: {
          p_amount: number
          p_description?: string
          p_metadata?: Json
          p_source_id?: string
          p_source_type: string
          p_user_id: string
        }
        Returns: Json
      }
      bq_1v1_accept_friend_invite: {
        Args: { p_invite_code: string }
        Returns: Json
      }
      bq_1v1_cancel_queue: { Args: never; Returns: Json }
      bq_1v1_create_friend_invite: {
        Args: {
          p_category?: string
          p_mode?: Database["public"]["Enums"]["bq_1v1_mode"]
        }
        Returns: Json
      }
      bq_1v1_enqueue: { Args: { p_category?: string }; Returns: Json }
      bq_1v1_finalize: { Args: { p_match_id: string }; Returns: Json }
      bq_1v1_get_leaderboard: {
        Args: { p_limit?: number }
        Returns: {
          avatar_url: string
          best_streak: number
          current_streak: number
          display_name: string
          draws: number
          losses: number
          matches_played: number
          rank: number
          rating: number
          user_id: string
          wins: number
        }[]
      }
      bq_1v1_heartbeat: { Args: { p_match_id: string }; Returns: undefined }
      bq_1v1_request_rematch: { Args: { p_match_id: string }; Returns: Json }
      bq_1v1_submit_score: {
        Args: {
          p_attempt_id: string
          p_correct: number
          p_match_id: string
          p_score: number
          p_total_time_ms: number
        }
        Returns: Json
      }
      bq_claim_daily_mission: {
        Args: { p_user_mission_id: string }
        Returns: Json
      }
      bq_get_daily_missions: {
        Args: never
        Returns: {
          description_ar: string
          icon: string
          is_claimed: boolean
          is_completed: boolean
          mission_id: string
          mission_type: string
          progress: number
          scope: string
          slug: string
          target_value: number
          title_ar: string
          user_mission_id: string
          xp_reward: number
        }[]
      }
      bq_is_admin: { Args: never; Returns: boolean }
      build_growth_snapshot: { Args: never; Returns: Json }
      cancel_group_order: {
        Args: { _group_order_id: string; _reason?: string }
        Returns: Json
      }
      challenge_award_xp: {
        Args: {
          p_description?: string
          p_source: string
          p_source_id?: string
          p_user_id: string
          p_xp: number
        }
        Returns: number
      }
      challenge_submit: {
        Args: { p_answer: string; p_challenge_id: string; p_user_id: string }
        Returns: Json
      }
      challenge_update_streak: {
        Args: { p_user_id: string }
        Returns: {
          current_streak: number
          longest_streak: number
        }[]
      }
      claim_referral: { Args: { _ref_code: string }; Returns: Json }
      claim_xp_reward: { Args: { p_level: number }; Returns: Json }
      classify_severity: { Args: { _delta_pct: number }; Returns: string }
      client_confirm_delivery: { Args: { _order_id: string }; Returns: Json }
      complete_battle_quiz_attempt: {
        Args: { p_attempt_id: string }
        Returns: Json
      }
      complete_daily_task: {
        Args: { _metadata?: Json; _task_code: string }
        Returns: Json
      }
      complete_experiment: {
        Args: {
          p_experiment_id: string
          p_note?: string
          p_winner_variant_id?: string
        }
        Returns: {
          created_at: string
          created_by: string | null
          description: string | null
          end_at: string | null
          experiment_key: string
          hypothesis: string | null
          id: string
          min_sample_size: number
          name: string
          primary_metric: string
          secondary_metrics: Json
          start_at: string | null
          status: Database["public"]["Enums"]["experiment_status"]
          target_area: Database["public"]["Enums"]["experiment_target_area"]
          traffic_allocation_percentage: number
          updated_at: string
          winner_variant_id: string | null
        }
        SetofOptions: {
          from: "*"
          to: "experiments"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      compute_experiment_results: {
        Args: { p_experiment_id: string }
        Returns: Json
      }
      compute_level_for_points: { Args: { _points: number }; Returns: string }
      compute_order_countdown: { Args: { _order_id: string }; Returns: Json }
      compute_ticket_sla: {
        Args: { _created: string; _priority: string }
        Returns: string
      }
      confirm_marketplace_gateway_purchase: {
        Args: {
          p_item_id: string
          p_paid_sar: number
          p_payment_intent_id: string
          p_user_id: string
        }
        Returns: Json
      }
      create_group_order: {
        Args: {
          _deadline?: string
          _description: string
          _max_members: number
          _service_id: string
          _title: string
        }
        Returns: string
      }
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      dismiss_automation_insight: {
        Args: { _id: string; _note?: string }
        Returns: Json
      }
      dispatch_document_send: {
        Args: { _id: string; _kind: string }
        Returns: undefined
      }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      ensure_referral_code: { Args: { _user_id: string }; Returns: string }
      flag_battle_quiz_event: {
        Args: {
          p_attempt_id: string
          p_flag_type: string
          p_metadata?: Json
          p_risk_score: number
        }
        Returns: Json
      }
      generate_customer_code: { Args: never; Returns: string }
      generate_group_invite_code: { Args: never; Returns: string }
      generate_internal_order_number: { Args: never; Returns: string }
      generate_receipt_number: { Args: never; Returns: string }
      generate_referral_code: { Args: never; Returns: string }
      generate_short_ref_code: { Args: never; Returns: string }
      get_active_membership: {
        Args: { _user_id: string }
        Returns: {
          badge_color: string
          cashback_amount: number
          discount_percentage: number
          expires_at: string
          membership_id: string
          plan_code: string
          plan_id: string
          plan_name_ar: string
          priority_level: number
        }[]
      }
      get_active_question_bank_subscription: {
        Args: { _user_id: string }
        Returns: {
          daily_question_limit: number
          expires_at: string
          plan_id: string
          plan_name: string
          plan_slug: string
          started_at: string
          status: string
          subscription_id: string
        }[]
      }
      get_ai_usage_today: { Args: { _tool_type: string }; Returns: number }
      get_battle_quiz_leaderboard: {
        Args: { p_limit?: number; p_room_id: string }
        Returns: {
          avatar_url: string
          display_name: string
          rank: number
          total_correct: number
          total_score: number
          total_time_ms: number
          user_id: string
        }[]
      }
      get_challenge_leaderboard: {
        Args: { p_limit?: number; p_period?: string }
        Returns: {
          avatar_url: string
          full_name: string
          level_color: string
          level_icon: string
          level_name: string
          monthly_xp: number
          rank: number
          total_xp: number
          user_id: string
          weekly_xp: number
        }[]
      }
      get_daily_assessment_questions: {
        Args: { p_assessment_id: string; p_limit?: number }
        Returns: {
          assessment_id: string
          difficulty: string
          explanation: string
          id: string
          order_index: number
          question_text: string
          skill_tag: string
        }[]
      }
      get_growth_daily_series: {
        Args: { p_days?: number }
        Returns: {
          active_users: number
          challenges_completed: number
          date: string
          new_users: number
          referrals_completed: number
          referrals_count: number
          retention_rate: number
          shares_count: number
        }[]
      }
      get_growth_funnel: { Args: { p_days?: number }; Returns: Json }
      get_growth_overview: { Args: { p_days?: number }; Returns: Json }
      get_growth_sources: {
        Args: { p_days?: number }
        Returns: {
          percentage: number
          source: string
          users: number
        }[]
      }
      get_marketplace_funnel_report: {
        Args: { p_days?: number }
        Returns: Json
      }
      get_marketplace_item_pricing: {
        Args: { p_item_id: string }
        Returns: Json
      }
      get_marketplace_metrics: { Args: { p_days?: number }; Returns: Json }
      get_membership_points_multiplier: {
        Args: { _user_id: string }
        Returns: number
      }
      get_mind_map_usage_today: { Args: never; Returns: number }
      get_question_bank_stats: { Args: { p_user_id?: string }; Returns: Json }
      get_referral_leaderboard: {
        Args: { p_limit?: number }
        Returns: {
          completed_invites: number
          conversion_rate: number
          referrer_name: string
          referrer_user_id: string
          total_invites: number
        }[]
      }
      get_referrer_by_code: {
        Args: { _code: string }
        Returns: {
          customer_id: string
          name: string
          user_id: string
        }[]
      }
      get_retention_cohort: { Args: { p_days?: number }; Returns: Json }
      get_today_any_assessment_attempt: {
        Args: { p_anonymous_id?: string; p_user_id?: string }
        Returns: {
          assessment_id: string
          assessment_slug: string
          assessment_title: string
          attempt_id: string
          completed_at: string
          next_available_at: string
        }[]
      }
      get_today_assessment_attempt: {
        Args: {
          p_anonymous_id?: string
          p_assessment_id: string
          p_user_id?: string
        }
        Returns: string
      }
      get_today_student_tasks: {
        Args: never
        Returns: {
          action_link: string
          action_type: string
          code: string
          completed_at: string
          description_ar: string
          icon: string
          id: string
          is_completed: boolean
          points_reward: number
          title_ar: string
        }[]
      }
      get_top_challenges: {
        Args: { p_days?: number; p_limit?: number }
        Returns: {
          attempts: number
          challenge_id: string
          perfect: number
          shares: number
          title: string
        }[]
      }
      get_user_whatsapp_phone: { Args: { _user_id: string }; Returns: string }
      get_user_xp_summary: { Args: { p_user_id?: string }; Returns: Json }
      get_xp_conversion_report: { Args: { p_days?: number }; Returns: Json }
      grant_referral_xp: {
        Args: {
          _description: string
          _referral_id: string
          _reward_type: string
          _user_id: string
          _xp: number
        }
        Returns: undefined
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      insert_audit_log: {
        Args: {
          _action: string
          _new_data?: Json
          _old_data?: Json
          _record_id?: string
          _table_name: string
        }
        Returns: undefined
      }
      is_valid_lifecycle_transition: {
        Args: {
          _from: Database["public"]["Enums"]["order_lifecycle_status"]
          _to: Database["public"]["Enums"]["order_lifecycle_status"]
        }
        Returns: boolean
      }
      join_group_order: { Args: { _invite_code: string }; Returns: string }
      launch_experiment: {
        Args: { p_experiment_id: string }
        Returns: {
          created_at: string
          created_by: string | null
          description: string | null
          end_at: string | null
          experiment_key: string
          hypothesis: string | null
          id: string
          min_sample_size: number
          name: string
          primary_metric: string
          secondary_metrics: Json
          start_at: string | null
          status: Database["public"]["Enums"]["experiment_status"]
          target_area: Database["public"]["Enums"]["experiment_target_area"]
          traffic_allocation_percentage: number
          updated_at: string
          winner_variant_id: string | null
        }
        SetofOptions: {
          from: "*"
          to: "experiments"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      lifecycle_progress: {
        Args: { _status: Database["public"]["Enums"]["order_lifecycle_status"] }
        Returns: number
      }
      lifecycle_status_ar: { Args: { p_status: string }; Returns: string }
      link_anonymous_assessment_attempts: {
        Args: { p_anonymous_id: string }
        Returns: number
      }
      log_smart_editor_usage: {
        Args: {
          _cost: number
          _input_length: number
          _mode: string
          _operation: string
          _output_length: number
          _wallet_transaction_id?: string
          _was_free: boolean
        }
        Returns: string
      }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      notify_whatsapp_event: {
        Args: {
          _event_key: string
          _related_entity_id?: string
          _related_entity_type?: string
          _to: string
          _user_id?: string
          _variables?: Json
        }
        Returns: undefined
      }
      pause_experiment: {
        Args: { p_experiment_id: string; p_note?: string }
        Returns: {
          created_at: string
          created_by: string | null
          description: string | null
          end_at: string | null
          experiment_key: string
          hypothesis: string | null
          id: string
          min_sample_size: number
          name: string
          primary_metric: string
          secondary_metrics: Json
          start_at: string | null
          status: Database["public"]["Enums"]["experiment_status"]
          target_area: Database["public"]["Enums"]["experiment_target_area"]
          traffic_allocation_percentage: number
          updated_at: string
          winner_variant_id: string | null
        }
        SetofOptions: {
          from: "*"
          to: "experiments"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      pay_group_seat_with_wallet: {
        Args: { _group_order_id: string }
        Returns: Json
      }
      purchase_cv: {
        Args: { _cv_id: string; _template_key: string }
        Returns: Json
      }
      purchase_cv_export: { Args: { _cv_id: string }; Returns: Json }
      purchase_marketplace_item:
        | { Args: { p_item_id: string }; Returns: Json }
        | { Args: { p_item_id: string; p_promo_code: string }; Returns: Json }
        | {
            Args: { p_item_id: string; p_promo_codes: string[] }
            Returns: Json
          }
      purchase_marketplace_with_wallet: {
        Args: { p_item_id: string }
        Returns: Json
      }
      purchase_stat_analysis: { Args: { _analysis_id: string }; Returns: Json }
      purchase_stat_pdf: { Args: { _analysis_id: string }; Returns: Json }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
      record_cv_export: { Args: { _cv_id: string }; Returns: Json }
      record_growth_event: {
        Args: {
          p_dedupe_key?: string
          p_event_type: string
          p_metadata?: Json
          p_source?: string
        }
        Returns: string
      }
      resolve_automation_insight: {
        Args: { _id: string; _note?: string }
        Returns: Json
      }
      reward_viral_share: { Args: never; Returns: Json }
      sign_contract_with_otp: {
        Args: {
          _accepted_terms?: Json
          _comments?: string
          _contract_id: string
          _ip?: string
          _otp_code: string
          _signature_image?: string
          _signature_text: string
          _signer_id_number?: string
          _signer_name?: string
          _ua?: string
        }
        Returns: Json
      }
      start_battle_quiz_1v1_attempt: {
        Args: { p_match_id: string }
        Returns: Json
      }
      start_battle_quiz_attempt: { Args: { p_room_id: string }; Returns: Json }
      start_daily_challenge_attempt: {
        Args: { p_challenge_id: string; p_user_id: string }
        Returns: Json
      }
      submit_assessment_attempt: {
        Args: { p_answers: Json; p_attempt_id: string; p_time_spent?: number }
        Returns: Json
      }
      submit_battle_quiz_answer: {
        Args: {
          p_attempt_id: string
          p_choice_id: string
          p_question_id: string
          p_response_time_ms: number
        }
        Returns: Json
      }
      submit_daily_challenge_attempt: {
        Args: {
          p_answers: Json
          p_attempt_id: string
          p_time_taken_seconds: number
          p_user_id: string
        }
        Returns: Json
      }
      submit_question_answer: {
        Args: {
          p_choice_id: string
          p_question_id: string
          p_time_spent?: number
        }
        Returns: Json
      }
      swap_cv_template: {
        Args: { _cv_id: string; _new_template_key: string }
        Returns: Json
      }
      test_start_battle_quiz_1v1_attempt: { Args: never; Returns: Json }
      track_experiment_event: {
        Args: {
          p_anonymous_id?: string
          p_event_type: string
          p_experiment_key: string
          p_metadata?: Json
          p_metric_value?: number
          p_user_id?: string
        }
        Returns: undefined
      }
      track_marketplace_event: {
        Args: {
          p_anonymous_id?: string
          p_event_type: string
          p_item_id?: string
          p_metadata?: Json
          p_session_id?: string
          p_variant_key?: string
        }
        Returns: string
      }
      track_marketplace_view: {
        Args: {
          p_anonymous_id?: string
          p_item_id: string
          p_variant_key?: string
        }
        Returns: undefined
      }
      track_order: {
        Args: { _phone_last_four: string; _tracking_id: string }
        Returns: {
          assistance_type: string | null
          client_email: string
          client_name: string
          client_phone: string
          created_at: string
          current_status: string | null
          degree: string
          description: string | null
          estimated_delivery: string | null
          id: string
          phone_last_four: string
          service_type: string
          title: string
          tracking_id: string
          updated_at: string
          user_id: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "orders"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      transition_order_lifecycle: {
        Args: {
          _note?: string
          _order_id: string
          _to_status: Database["public"]["Enums"]["order_lifecycle_status"]
        }
        Returns: Json
      }
      upsert_insight: {
        Args: {
          _comparison_value: number
          _context: Json
          _dedupe_key: string
          _delta_pct: number
          _description: string
          _metric_key: string
          _metric_value: number
          _recommendation: string
          _severity: string
          _title: string
          _type: string
        }
        Returns: string
      }
      use_smart_editor: {
        Args: { _input_length: number; _mode: string; _operation: string }
        Returns: Json
      }
      use_track_tool:
        | { Args: { _tool_id: string }; Returns: Json }
        | { Args: { _mode: string; _tool_id: string }; Returns: Json }
      validate_promo_code: {
        Args: { p_code: string; p_item_id: string }
        Returns: Json
      }
      validate_promo_code_on_base: {
        Args: { p_base_xp: number; p_code: string; p_item_id: string }
        Returns: Json
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      battle_quiz_anti_cheat_type:
        | "logic"
        | "case"
        | "scenario"
        | "visual_hint"
        | "speed"
        | "standard"
      battle_quiz_attempt_status:
        | "in_progress"
        | "completed"
        | "flagged"
        | "invalidated"
        | "approved"
      battle_quiz_difficulty: "easy" | "medium" | "hard"
      battle_quiz_mode: "daily" | "sprint" | "ranked" | "practice"
      battle_quiz_reward_status: "pending" | "approved" | "paid" | "rejected"
      battle_quiz_reward_type: "xp" | "badge" | "coupon" | "wallet"
      battle_quiz_room_status:
        | "draft"
        | "scheduled"
        | "active"
        | "locked"
        | "completed"
        | "rewards_pending"
        | "archived"
      bq_1v1_match_status: "active" | "completed" | "abandoned" | "expired"
      bq_1v1_mode: "classic" | "blitz"
      bq_1v1_queue_status: "waiting" | "matched" | "cancelled" | "expired"
      experiment_status:
        | "draft"
        | "running"
        | "paused"
        | "completed"
        | "archived"
      experiment_target_area:
        | "challenge_result_screen"
        | "referral_page"
        | "onboarding_flow"
        | "share_cta"
      group_member_status: "joined" | "paid" | "refunded" | "left"
      group_order_status:
        | "open"
        | "partially_paid"
        | "full"
        | "in_progress"
        | "completed"
        | "cancelled"
        | "expired"
      order_lifecycle_status:
        | "received"
        | "under_review"
        | "quote_sent"
        | "quote_accepted"
        | "contract_pending"
        | "contract_signed"
        | "payment_pending"
        | "paid"
        | "in_progress"
        | "delivered"
        | "completed"
        | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      battle_quiz_anti_cheat_type: [
        "logic",
        "case",
        "scenario",
        "visual_hint",
        "speed",
        "standard",
      ],
      battle_quiz_attempt_status: [
        "in_progress",
        "completed",
        "flagged",
        "invalidated",
        "approved",
      ],
      battle_quiz_difficulty: ["easy", "medium", "hard"],
      battle_quiz_mode: ["daily", "sprint", "ranked", "practice"],
      battle_quiz_reward_status: ["pending", "approved", "paid", "rejected"],
      battle_quiz_reward_type: ["xp", "badge", "coupon", "wallet"],
      battle_quiz_room_status: [
        "draft",
        "scheduled",
        "active",
        "locked",
        "completed",
        "rewards_pending",
        "archived",
      ],
      bq_1v1_match_status: ["active", "completed", "abandoned", "expired"],
      bq_1v1_mode: ["classic", "blitz"],
      bq_1v1_queue_status: ["waiting", "matched", "cancelled", "expired"],
      experiment_status: [
        "draft",
        "running",
        "paused",
        "completed",
        "archived",
      ],
      experiment_target_area: [
        "challenge_result_screen",
        "referral_page",
        "onboarding_flow",
        "share_cta",
      ],
      group_member_status: ["joined", "paid", "refunded", "left"],
      group_order_status: [
        "open",
        "partially_paid",
        "full",
        "in_progress",
        "completed",
        "cancelled",
        "expired",
      ],
      order_lifecycle_status: [
        "received",
        "under_review",
        "quote_sent",
        "quote_accepted",
        "contract_pending",
        "contract_signed",
        "payment_pending",
        "paid",
        "in_progress",
        "delivered",
        "completed",
        "cancelled",
      ],
    },
  },
} as const
