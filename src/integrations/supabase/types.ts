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
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
          name_ar: string | null
          sort_order: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          name_ar?: string | null
          sort_order?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          name_ar?: string | null
          sort_order?: number | null
        }
        Relationships: []
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
          created_at: string
          current_status: string | null
          customer_id: string | null
          deadline: string | null
          id: string
          notes: string | null
          paid_amount: number | null
          priority: string | null
          quote_notes: string | null
          quote_sent_at: string | null
          quote_status: string | null
          service_id: string | null
          service_name: string | null
          total_amount: number | null
          tracking_id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          current_status?: string | null
          customer_id?: string | null
          deadline?: string | null
          id?: string
          notes?: string | null
          paid_amount?: number | null
          priority?: string | null
          quote_notes?: string | null
          quote_sent_at?: string | null
          quote_status?: string | null
          service_id?: string | null
          service_name?: string | null
          total_amount?: number | null
          tracking_id?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          current_status?: string | null
          customer_id?: string | null
          deadline?: string | null
          id?: string
          notes?: string | null
          paid_amount?: number | null
          priority?: string | null
          quote_notes?: string | null
          quote_sent_at?: string | null
          quote_status?: string | null
          service_id?: string | null
          service_name?: string | null
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
          id: string
          is_active: boolean | null
          name: string
          name_ar: string | null
          price: number | null
          unit: string | null
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          name_ar?: string | null
          price?: number | null
          unit?: string | null
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          name_ar?: string | null
          price?: number | null
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
        ]
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
          reference_id?: string | null
          reference_type?: string | null
          type?: string
          user_id?: string
          wallet_id?: string
        }
        Relationships: [
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      generate_customer_code: { Args: never; Returns: string }
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
      get_referrer_by_code: {
        Args: { _code: string }
        Returns: {
          customer_id: string
          name: string
          user_id: string
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
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
      track_order: {
        Args: { _phone_last_four: string; _tracking_id: string }
        Returns: {
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
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
    },
  },
} as const
