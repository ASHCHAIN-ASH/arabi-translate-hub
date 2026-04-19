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
            isOneToOne: false
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
      contracts: {
        Row: {
          client_email: string | null
          client_full_name: string | null
          client_id_number: string | null
          client_phone: string | null
          content: string | null
          contract_number: string
          created_at: string
          currency: string | null
          customer_id: string | null
          delivery_date: string | null
          expires_at: string | null
          id: string
          metadata: Json | null
          order_id: string | null
          payment_terms: string | null
          sent_at: string | null
          service_name: string | null
          service_order_id: string | null
          service_type: string | null
          signed_at: string | null
          signed_pdf_generated_at: string | null
          signed_pdf_path: string | null
          status: string | null
          title: string
          total_amount: number | null
          updated_at: string
          user_id: string | null
          variables: Json | null
        }
        Insert: {
          client_email?: string | null
          client_full_name?: string | null
          client_id_number?: string | null
          client_phone?: string | null
          content?: string | null
          contract_number?: string
          created_at?: string
          currency?: string | null
          customer_id?: string | null
          delivery_date?: string | null
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          order_id?: string | null
          payment_terms?: string | null
          sent_at?: string | null
          service_name?: string | null
          service_order_id?: string | null
          service_type?: string | null
          signed_at?: string | null
          signed_pdf_generated_at?: string | null
          signed_pdf_path?: string | null
          status?: string | null
          title: string
          total_amount?: number | null
          updated_at?: string
          user_id?: string | null
          variables?: Json | null
        }
        Update: {
          client_email?: string | null
          client_full_name?: string | null
          client_id_number?: string | null
          client_phone?: string | null
          content?: string | null
          contract_number?: string
          created_at?: string
          currency?: string | null
          customer_id?: string | null
          delivery_date?: string | null
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          order_id?: string | null
          payment_terms?: string | null
          sent_at?: string | null
          service_name?: string | null
          service_order_id?: string | null
          service_type?: string | null
          signed_at?: string | null
          signed_pdf_generated_at?: string | null
          signed_pdf_path?: string | null
          status?: string | null
          title?: string
          total_amount?: number | null
          updated_at?: string
          user_id?: string | null
          variables?: Json | null
        }
        Relationships: [
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
          assistance_type: string | null
          cancelled_at: string | null
          client_confirmed_at: string | null
          completed_at: string | null
          contract_pending_at: string | null
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
          preferred_language: string | null
          priority: string | null
          progress_percentage: number
          quantity: number | null
          quantity_unit: string | null
          quote_notes: string | null
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
          assistance_type?: string | null
          cancelled_at?: string | null
          client_confirmed_at?: string | null
          completed_at?: string | null
          contract_pending_at?: string | null
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
          preferred_language?: string | null
          priority?: string | null
          progress_percentage?: number
          quantity?: number | null
          quantity_unit?: string | null
          quote_notes?: string | null
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
          assistance_type?: string | null
          cancelled_at?: string | null
          client_confirmed_at?: string | null
          completed_at?: string | null
          contract_pending_at?: string | null
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
          preferred_language?: string | null
          priority?: string | null
          progress_percentage?: number
          quantity?: number | null
          quantity_unit?: string | null
          quote_notes?: string | null
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
          description: string | null
          description_ar: string | null
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
          slug: string | null
          sort_order: number
          subcategory_id: string | null
          unit: string | null
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          description_ar?: string | null
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
          slug?: string | null
          sort_order?: number
          subcategory_id?: string | null
          unit?: string | null
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          description_ar?: string | null
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
      tickets: {
        Row: {
          assigned_to: string | null
          category: string | null
          created_at: string
          customer_id: string | null
          description: string | null
          id: string
          last_message_at: string | null
          priority: string | null
          related_invoice_id: string | null
          related_order_id: string | null
          resolved_at: string | null
          status: string | null
          subject: string
          ticket_number: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          category?: string | null
          created_at?: string
          customer_id?: string | null
          description?: string | null
          id?: string
          last_message_at?: string | null
          priority?: string | null
          related_invoice_id?: string | null
          related_order_id?: string | null
          resolved_at?: string | null
          status?: string | null
          subject: string
          ticket_number?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          category?: string | null
          created_at?: string
          customer_id?: string | null
          description?: string | null
          id?: string
          last_message_at?: string | null
          priority?: string | null
          related_invoice_id?: string | null
          related_order_id?: string | null
          resolved_at?: string | null
          status?: string | null
          subject?: string
          ticket_number?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
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
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          metadata: Json | null
          payment_intent_id: string | null
          reference_id: string | null
          reference_type: string | null
          type: string
          user_id: string
          wallet_id: string
        }
        Insert: {
          amount: number
          balance_after?: number
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          payment_intent_id?: string | null
          reference_id?: string | null
          reference_type?: string | null
          type: string
          user_id: string
          wallet_id: string
        }
        Update: {
          amount?: number
          balance_after?: number
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          payment_intent_id?: string | null
          reference_id?: string | null
          reference_type?: string | null
          type?: string
          user_id?: string
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_service_quote: { Args: { _order_id: string }; Returns: Json }
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
      cancel_group_order: {
        Args: { _group_order_id: string; _reason?: string }
        Returns: Json
      }
      client_confirm_delivery: { Args: { _order_id: string }; Returns: Json }
      complete_daily_task: {
        Args: { _metadata?: Json; _task_code: string }
        Returns: Json
      }
      compute_level_for_points: { Args: { _points: number }; Returns: string }
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
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      generate_customer_code: { Args: never; Returns: string }
      generate_group_invite_code: { Args: never; Returns: string }
      generate_internal_order_number: { Args: never; Returns: string }
      generate_referral_code: { Args: never; Returns: string }
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
      get_ai_usage_today: { Args: { _tool_type: string }; Returns: number }
      get_membership_points_multiplier: {
        Args: { _user_id: string }
        Returns: number
      }
      get_mind_map_usage_today: { Args: never; Returns: number }
      get_referrer_by_code: {
        Args: { _code: string }
        Returns: {
          customer_id: string
          name: string
          user_id: string
        }[]
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
      join_group_order: { Args: { _invite_code: string }; Returns: string }
      lifecycle_progress: {
        Args: { _status: Database["public"]["Enums"]["order_lifecycle_status"] }
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
      pay_group_seat_with_wallet: {
        Args: { _group_order_id: string }
        Returns: Json
      }
      purchase_cv: {
        Args: { _cv_id: string; _template_key: string }
        Returns: Json
      }
      purchase_cv_export: { Args: { _cv_id: string }; Returns: Json }
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
      sign_contract_with_otp: {
        Args: {
          _contract_id: string
          _ip?: string
          _otp_code: string
          _signature_text: string
          _signer_name?: string
          _ua?: string
        }
        Returns: Json
      }
      swap_cv_template: {
        Args: { _cv_id: string; _new_template_key: string }
        Returns: Json
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
      use_smart_editor: {
        Args: { _input_length: number; _mode: string; _operation: string }
        Returns: Json
      }
      use_track_tool:
        | { Args: { _tool_id: string }; Returns: Json }
        | { Args: { _mode: string; _tool_id: string }; Returns: Json }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
