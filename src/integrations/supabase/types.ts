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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      admin_credentials: {
        Row: {
          created_at: string | null
          email: string
          full_name: string
          id: string
          is_active: boolean | null
          password_hash: string
          role: string | null
          tenant_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          is_active?: boolean | null
          password_hash: string
          role?: string | null
          tenant_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean | null
          password_hash?: string
          role?: string | null
          tenant_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_credentials_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_profiles: {
        Row: {
          created_at: string
          created_by: string | null
          department: string | null
          full_name: string
          id: string
          is_active: boolean
          last_login_at: string | null
          phone: string | null
          role: Database["public"]["Enums"]["admin_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          department?: string | null
          full_name: string
          id?: string
          is_active?: boolean
          last_login_at?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["admin_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          department?: string | null
          full_name?: string
          id?: string
          is_active?: boolean
          last_login_at?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["admin_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      admin_sessions: {
        Row: {
          admin_user_id: string | null
          created_at: string | null
          expires_at: string
          fingerprint: string | null
          id: string
          ip_address: unknown | null
          is_revoked: boolean | null
          last_activity: string | null
          revoked_at: string | null
          session_secret: string | null
          session_token: string
          user_agent: string | null
        }
        Insert: {
          admin_user_id?: string | null
          created_at?: string | null
          expires_at: string
          fingerprint?: string | null
          id?: string
          ip_address?: unknown | null
          is_revoked?: boolean | null
          last_activity?: string | null
          revoked_at?: string | null
          session_secret?: string | null
          session_token: string
          user_agent?: string | null
        }
        Update: {
          admin_user_id?: string | null
          created_at?: string | null
          expires_at?: string
          fingerprint?: string | null
          id?: string
          ip_address?: unknown | null
          is_revoked?: boolean | null
          last_activity?: string | null
          revoked_at?: string | null
          session_secret?: string | null
          session_token?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_sessions_admin_user_id_fkey"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_active: boolean | null
          last_login_at: string | null
          last_password_change: string | null
          name: string
          password_hash: string
          password_salt: string | null
          role: Database["public"]["Enums"]["user_role"]
          session_secret: string | null
          two_factor_enabled: boolean | null
          two_factor_secret: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          is_active?: boolean | null
          last_login_at?: string | null
          last_password_change?: string | null
          name: string
          password_hash: string
          password_salt?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          session_secret?: string | null
          two_factor_enabled?: boolean | null
          two_factor_secret?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          last_login_at?: string | null
          last_password_change?: string | null
          name?: string
          password_hash?: string
          password_salt?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          session_secret?: string | null
          two_factor_enabled?: boolean | null
          two_factor_secret?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      affiliate_commissions: {
        Row: {
          affiliate_user_id: string
          commission_amount: number
          commission_rate: number
          created_at: string
          id: string
          order_amount: number
          paid_at: string | null
          referred_user_id: string
          service_request_id: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          affiliate_user_id: string
          commission_amount: number
          commission_rate?: number
          created_at?: string
          id?: string
          order_amount: number
          paid_at?: string | null
          referred_user_id: string
          service_request_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          affiliate_user_id?: string
          commission_amount?: number
          commission_rate?: number
          created_at?: string
          id?: string
          order_amount?: number
          paid_at?: string | null
          referred_user_id?: string
          service_request_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_commissions_service_request_id_fkey"
            columns: ["service_request_id"]
            isOneToOne: false
            referencedRelation: "service_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_program: {
        Row: {
          affiliate_code: string
          commission_rate: number | null
          created_at: string
          id: string
          level_name: string | null
          level_threshold: number | null
          status: string | null
          total_earnings: number | null
          total_orders: number | null
          total_referrals: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          affiliate_code: string
          commission_rate?: number | null
          created_at?: string
          id?: string
          level_name?: string | null
          level_threshold?: number | null
          status?: string | null
          total_earnings?: number | null
          total_orders?: number | null
          total_referrals?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          affiliate_code?: string
          commission_rate?: number | null
          created_at?: string
          id?: string
          level_name?: string | null
          level_threshold?: number | null
          status?: string | null
          total_earnings?: number | null
          total_orders?: number | null
          total_referrals?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      affiliate_referrals: {
        Row: {
          affiliate_code: string
          affiliate_user_id: string
          commission_earned: number | null
          created_at: string
          id: string
          order_value: number | null
          referred_user_id: string
          status: string | null
          updated_at: string
        }
        Insert: {
          affiliate_code: string
          affiliate_user_id: string
          commission_earned?: number | null
          created_at?: string
          id?: string
          order_value?: number | null
          referred_user_id: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          affiliate_code?: string
          affiliate_user_id?: string
          commission_earned?: number | null
          created_at?: string
          id?: string
          order_value?: number | null
          referred_user_id?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      ash_otps: {
        Row: {
          attempts: number | null
          code: string
          consumed: boolean | null
          created_at: string | null
          email: string
          expires_at: string
          id: string
          type: string
          user_id: string | null
        }
        Insert: {
          attempts?: number | null
          code: string
          consumed?: boolean | null
          created_at?: string | null
          email: string
          expires_at: string
          id?: string
          type?: string
          user_id?: string | null
        }
        Update: {
          attempts?: number | null
          code?: string
          consumed?: boolean | null
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      auth_diagnostics: {
        Row: {
          created_at: string | null
          email_lower: string
          error_code: string | null
          error_constraint: string | null
          id: string
          ip_address: unknown | null
          result: string
          user_agent: string | null
        }
        Insert: {
          created_at?: string | null
          email_lower: string
          error_code?: string | null
          error_constraint?: string | null
          id?: string
          ip_address?: unknown | null
          result: string
          user_agent?: string | null
        }
        Update: {
          created_at?: string | null
          email_lower?: string
          error_code?: string | null
          error_constraint?: string | null
          id?: string
          ip_address?: unknown | null
          result?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      auth_logs: {
        Row: {
          created_at: string | null
          email_lower: string
          error_code: string | null
          error_constraint: string | null
          id: string
          ip_address: unknown | null
          result: string
          user_agent: string | null
        }
        Insert: {
          created_at?: string | null
          email_lower: string
          error_code?: string | null
          error_constraint?: string | null
          id?: string
          ip_address?: unknown | null
          result: string
          user_agent?: string | null
        }
        Update: {
          created_at?: string | null
          email_lower?: string
          error_code?: string | null
          error_constraint?: string | null
          id?: string
          ip_address?: unknown | null
          result?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      automation_usage: {
        Row: {
          automation_type: string
          created_at: string | null
          id: string
          subscription_id: string | null
          usage_count: number | null
          usage_date: string | null
          user_id: string
        }
        Insert: {
          automation_type: string
          created_at?: string | null
          id?: string
          subscription_id?: string | null
          usage_count?: number | null
          usage_date?: string | null
          user_id: string
        }
        Update: {
          automation_type?: string
          created_at?: string | null
          id?: string
          subscription_id?: string | null
          usage_count?: number | null
          usage_date?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "automation_usage_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      business_contracts: {
        Row: {
          client_id: string | null
          contract_number: string
          contract_value: number | null
          created_at: string | null
          created_by: string | null
          currency: string | null
          description: string | null
          end_date: string | null
          file_url: string | null
          id: string
          quote_id: string | null
          signed_at: string | null
          signed_by_client: string | null
          signed_by_company: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["contract_status"] | null
          terms_conditions: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          contract_number: string
          contract_value?: number | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          description?: string | null
          end_date?: string | null
          file_url?: string | null
          id?: string
          quote_id?: string | null
          signed_at?: string | null
          signed_by_client?: string | null
          signed_by_company?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["contract_status"] | null
          terms_conditions?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          contract_number?: string
          contract_value?: number | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          description?: string | null
          end_date?: string | null
          file_url?: string | null
          id?: string
          quote_id?: string | null
          signed_at?: string | null
          signed_by_client?: string | null
          signed_by_company?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["contract_status"] | null
          terms_conditions?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_contracts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_contracts_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      business_invoice_items: {
        Row: {
          description: string | null
          id: string
          invoice_id: string | null
          name: string
          order_index: number | null
          quantity: number | null
          total_price: number
          unit_price: number
          vat_amount: number | null
          vat_rate: number | null
        }
        Insert: {
          description?: string | null
          id?: string
          invoice_id?: string | null
          name: string
          order_index?: number | null
          quantity?: number | null
          total_price: number
          unit_price: number
          vat_amount?: number | null
          vat_rate?: number | null
        }
        Update: {
          description?: string | null
          id?: string
          invoice_id?: string | null
          name?: string
          order_index?: number | null
          quantity?: number | null
          total_price?: number
          unit_price?: number
          vat_amount?: number | null
          vat_rate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "business_invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "business_invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      business_invoices: {
        Row: {
          client_id: string | null
          contract_id: string | null
          created_at: string | null
          created_by: string | null
          currency: string | null
          due_date: string | null
          id: string
          invoice_number: string
          issue_date: string | null
          notes: string | null
          paid_at: string | null
          payment_terms: string | null
          qr_code: string | null
          quote_id: string | null
          sent_at: string | null
          status: Database["public"]["Enums"]["invoice_status"] | null
          subtotal: number | null
          tenant_id: string | null
          title: string
          total: number | null
          updated_at: string | null
          vat_amount: number | null
          vat_rate: number | null
          zatca_uuid: string | null
        }
        Insert: {
          client_id?: string | null
          contract_id?: string | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          due_date?: string | null
          id?: string
          invoice_number: string
          issue_date?: string | null
          notes?: string | null
          paid_at?: string | null
          payment_terms?: string | null
          qr_code?: string | null
          quote_id?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["invoice_status"] | null
          subtotal?: number | null
          tenant_id?: string | null
          title: string
          total?: number | null
          updated_at?: string | null
          vat_amount?: number | null
          vat_rate?: number | null
          zatca_uuid?: string | null
        }
        Update: {
          client_id?: string | null
          contract_id?: string | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          due_date?: string | null
          id?: string
          invoice_number?: string
          issue_date?: string | null
          notes?: string | null
          paid_at?: string | null
          payment_terms?: string | null
          qr_code?: string | null
          quote_id?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["invoice_status"] | null
          subtotal?: number | null
          tenant_id?: string | null
          title?: string
          total?: number | null
          updated_at?: string | null
          vat_amount?: number | null
          vat_rate?: number | null
          zatca_uuid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_invoices_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "business_contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_invoices_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      business_payments: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          id: string
          invoice_id: string | null
          metadata: Json | null
          notes: string | null
          payment_date: string | null
          payment_method: string
          provider_reference: string | null
          status: Database["public"]["Enums"]["payment_status"] | null
          tenant_id: string | null
          transaction_reference: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          id?: string
          invoice_id?: string | null
          metadata?: Json | null
          notes?: string | null
          payment_date?: string | null
          payment_method: string
          provider_reference?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          tenant_id?: string | null
          transaction_reference?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          id?: string
          invoice_id?: string | null
          metadata?: Json | null
          notes?: string | null
          payment_date?: string | null
          payment_method?: string
          provider_reference?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          tenant_id?: string | null
          transaction_reference?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "business_invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      client_contacts: {
        Row: {
          client_id: string | null
          created_at: string | null
          department: string | null
          email: string
          id: string
          is_billing_contact: boolean | null
          is_primary: boolean | null
          name: string
          phone: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          department?: string | null
          email: string
          id?: string
          is_billing_contact?: boolean | null
          is_primary?: boolean | null
          name: string
          phone?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          department?: string | null
          email?: string
          id?: string
          is_billing_contact?: boolean | null
          is_primary?: boolean | null
          name?: string
          phone?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_contacts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address: string | null
          billing_email: string
          city: string | null
          commercial_register: string | null
          country: string | null
          created_at: string | null
          created_by: string | null
          display_name: string | null
          id: string
          legal_name: string
          logo_url: string | null
          notes: string | null
          phone: string | null
          sector: Database["public"]["Enums"]["client_sector"]
          status: Database["public"]["Enums"]["client_status"]
          tags: string[] | null
          tax_number: string | null
          tenant_id: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          billing_email: string
          city?: string | null
          commercial_register?: string | null
          country?: string | null
          created_at?: string | null
          created_by?: string | null
          display_name?: string | null
          id?: string
          legal_name: string
          logo_url?: string | null
          notes?: string | null
          phone?: string | null
          sector?: Database["public"]["Enums"]["client_sector"]
          status?: Database["public"]["Enums"]["client_status"]
          tags?: string[] | null
          tax_number?: string | null
          tenant_id?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          billing_email?: string
          city?: string | null
          commercial_register?: string | null
          country?: string | null
          created_at?: string | null
          created_by?: string | null
          display_name?: string | null
          id?: string
          legal_name?: string
          logo_url?: string | null
          notes?: string | null
          phone?: string | null
          sector?: Database["public"]["Enums"]["client_sector"]
          status?: Database["public"]["Enums"]["client_status"]
          tags?: string[] | null
          tax_number?: string | null
          tenant_id?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      cms_applications: {
        Row: {
          created_at: string | null
          cv_url: string | null
          email: string
          id: string
          job_id: string | null
          name: string
          notes: string | null
          phone: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          cv_url?: string | null
          email: string
          id?: string
          job_id?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          cv_url?: string | null
          email?: string
          id?: string
          job_id?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cms_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "cms_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_audit_log: {
        Row: {
          action: Database["public"]["Enums"]["audit_action"]
          actor_id: string | null
          created_at: string | null
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          target_id: string | null
          target_table: string | null
          user_agent: string | null
        }
        Insert: {
          action: Database["public"]["Enums"]["audit_action"]
          actor_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          target_id?: string | null
          target_table?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: Database["public"]["Enums"]["audit_action"]
          actor_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          target_id?: string | null
          target_table?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cms_audit_log_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_form_submissions: {
        Row: {
          created_at: string | null
          data: Json
          form_id: string | null
          id: string
          ip_address: unknown | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string | null
          data: Json
          form_id?: string | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string | null
          data?: Json
          form_id?: string | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cms_form_submissions_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "cms_forms"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_forms: {
        Row: {
          created_at: string | null
          created_by: string | null
          fields: Json | null
          id: string
          is_active: boolean | null
          name: string
          notifications_email: string | null
          recaptcha_enabled: boolean | null
          redirect_url: string | null
          slug: string
          store_submissions: boolean | null
          success_message: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          fields?: Json | null
          id?: string
          is_active?: boolean | null
          name: string
          notifications_email?: string | null
          recaptcha_enabled?: boolean | null
          redirect_url?: string | null
          slug: string
          store_submissions?: boolean | null
          success_message?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          fields?: Json | null
          id?: string
          is_active?: boolean | null
          name?: string
          notifications_email?: string | null
          recaptcha_enabled?: boolean | null
          redirect_url?: string | null
          slug?: string
          store_submissions?: boolean | null
          success_message?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cms_forms_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_jobs: {
        Row: {
          contract_type: Database["public"]["Enums"]["contract_type"] | null
          created_at: string | null
          created_by: string | null
          department: string | null
          id: string
          location: string | null
          publish_at: string | null
          requirements: string | null
          responsibilities: string | null
          status: Database["public"]["Enums"]["job_status"] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          contract_type?: Database["public"]["Enums"]["contract_type"] | null
          created_at?: string | null
          created_by?: string | null
          department?: string | null
          id?: string
          location?: string | null
          publish_at?: string | null
          requirements?: string | null
          responsibilities?: string | null
          status?: Database["public"]["Enums"]["job_status"] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          contract_type?: Database["public"]["Enums"]["contract_type"] | null
          created_at?: string | null
          created_by?: string | null
          department?: string | null
          id?: string
          location?: string | null
          publish_at?: string | null
          requirements?: string | null
          responsibilities?: string | null
          status?: Database["public"]["Enums"]["job_status"] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cms_jobs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_media: {
        Row: {
          alt_text: string | null
          created_at: string | null
          file_size: number | null
          file_url: string
          filename: string
          folder: string | null
          id: string
          mime_type: string | null
          title: string | null
          uploaded_by: string | null
          usage_notes: string | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string | null
          file_size?: number | null
          file_url: string
          filename: string
          folder?: string | null
          id?: string
          mime_type?: string | null
          title?: string | null
          uploaded_by?: string | null
          usage_notes?: string | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string | null
          file_size?: number | null
          file_url?: string
          filename?: string
          folder?: string | null
          id?: string
          mime_type?: string | null
          title?: string | null
          uploaded_by?: string | null
          usage_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cms_media_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_news: {
        Row: {
          body: string | null
          cover: string | null
          created_at: string | null
          created_by: string | null
          id: string
          published_at: string | null
          slug: string
          status: Database["public"]["Enums"]["page_status"] | null
          summary: string | null
          tags: string[] | null
          title: string
          type: Database["public"]["Enums"]["news_type"] | null
          updated_at: string | null
        }
        Insert: {
          body?: string | null
          cover?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          published_at?: string | null
          slug: string
          status?: Database["public"]["Enums"]["page_status"] | null
          summary?: string | null
          tags?: string[] | null
          title: string
          type?: Database["public"]["Enums"]["news_type"] | null
          updated_at?: string | null
        }
        Update: {
          body?: string | null
          cover?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          published_at?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["page_status"] | null
          summary?: string | null
          tags?: string[] | null
          title?: string
          type?: Database["public"]["Enums"]["news_type"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cms_news_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_pages: {
        Row: {
          blocks: Json | null
          created_at: string | null
          created_by: string | null
          hero_image: string | null
          hero_subtitle: string | null
          hero_title: string | null
          id: string
          og_image: string | null
          publish_at: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          status: Database["public"]["Enums"]["page_status"] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          blocks?: Json | null
          created_at?: string | null
          created_by?: string | null
          hero_image?: string | null
          hero_subtitle?: string | null
          hero_title?: string | null
          id?: string
          og_image?: string | null
          publish_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          status?: Database["public"]["Enums"]["page_status"] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          blocks?: Json | null
          created_at?: string | null
          created_by?: string | null
          hero_image?: string | null
          hero_subtitle?: string | null
          hero_title?: string | null
          id?: string
          og_image?: string | null
          publish_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["page_status"] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cms_pages_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_revisions: {
        Row: {
          content: Json
          created_at: string | null
          created_by: string | null
          id: string
          target_id: string
          target_table: string
        }
        Insert: {
          content: Json
          created_at?: string | null
          created_by?: string | null
          id?: string
          target_id: string
          target_table: string
        }
        Update: {
          content?: Json
          created_at?: string | null
          created_by?: string | null
          id?: string
          target_id?: string
          target_table?: string
        }
        Relationships: [
          {
            foreignKeyName: "cms_revisions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_settings: {
        Row: {
          description: string | null
          id: string
          key: string
          updated_at: string | null
          updated_by: string | null
          value: Json | null
        }
        Insert: {
          description?: string | null
          id?: string
          key: string
          updated_at?: string | null
          updated_by?: string | null
          value?: Json | null
        }
        Update: {
          description?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "cms_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_subsidiaries: {
        Row: {
          banner: string | null
          created_at: string | null
          created_by: string | null
          email: string | null
          gallery: string[] | null
          id: string
          logo: string | null
          name: string
          order_index: number | null
          services: string[] | null
          short_desc: string | null
          slug: string
          social_links: Json | null
          status: Database["public"]["Enums"]["page_status"] | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          banner?: string | null
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          gallery?: string[] | null
          id?: string
          logo?: string | null
          name: string
          order_index?: number | null
          services?: string[] | null
          short_desc?: string | null
          slug: string
          social_links?: Json | null
          status?: Database["public"]["Enums"]["page_status"] | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          banner?: string | null
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          gallery?: string[] | null
          id?: string
          logo?: string | null
          name?: string
          order_index?: number | null
          services?: string[] | null
          short_desc?: string | null
          slug?: string
          social_links?: Json | null
          status?: Database["public"]["Enums"]["page_status"] | null
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cms_subsidiaries_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      contracts: {
        Row: {
          authorized_person: string | null
          client_address: string | null
          client_approved: boolean | null
          client_approved_at: string | null
          client_email: string
          client_id_number: string | null
          client_name: string
          client_phone: string
          client_type: string
          commercial_register: string | null
          company_approved: boolean | null
          company_approved_at: string | null
          contract_duration: string | null
          contract_number: string
          contract_pdf_url: string | null
          created_at: string
          currency: string
          end_date: string | null
          id: string
          nafath_request_id: string | null
          nafath_verified: boolean | null
          nafath_verified_at: string | null
          payment_terms: string | null
          service_description: string | null
          service_price: number
          service_type: string
          start_date: string | null
          status: string
          tax_number: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          authorized_person?: string | null
          client_address?: string | null
          client_approved?: boolean | null
          client_approved_at?: string | null
          client_email: string
          client_id_number?: string | null
          client_name: string
          client_phone: string
          client_type: string
          commercial_register?: string | null
          company_approved?: boolean | null
          company_approved_at?: string | null
          contract_duration?: string | null
          contract_number: string
          contract_pdf_url?: string | null
          created_at?: string
          currency?: string
          end_date?: string | null
          id?: string
          nafath_request_id?: string | null
          nafath_verified?: boolean | null
          nafath_verified_at?: string | null
          payment_terms?: string | null
          service_description?: string | null
          service_price: number
          service_type: string
          start_date?: string | null
          status?: string
          tax_number?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          authorized_person?: string | null
          client_address?: string | null
          client_approved?: boolean | null
          client_approved_at?: string | null
          client_email?: string
          client_id_number?: string | null
          client_name?: string
          client_phone?: string
          client_type?: string
          commercial_register?: string | null
          company_approved?: boolean | null
          company_approved_at?: string | null
          contract_duration?: string | null
          contract_number?: string
          contract_pdf_url?: string | null
          created_at?: string
          currency?: string
          end_date?: string | null
          id?: string
          nafath_request_id?: string | null
          nafath_verified?: boolean | null
          nafath_verified_at?: string | null
          payment_terms?: string | null
          service_description?: string | null
          service_price?: number
          service_type?: string
          start_date?: string | null
          status?: string
          tax_number?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      customer_wallets: {
        Row: {
          balance: number
          created_at: string
          currency: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string
          currency?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          currency?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      email_jobs: {
        Row: {
          created_at: string
          id: string
          job_type: string
          payload: Json
          processed_at: string | null
          retries: number
          scheduled_at: string
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          job_type?: string
          payload: Json
          processed_at?: string | null
          retries?: number
          scheduled_at?: string
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          job_type?: string
          payload?: Json
          processed_at?: string | null
          retries?: number
          scheduled_at?: string
          status?: string
        }
        Relationships: []
      }
      email_outbox: {
        Row: {
          created_at: string
          id: string
          idempotency_key: string
          last_error: string | null
          provider: string
          provider_msg_id: string | null
          retries: number
          status: string
          subject: string
          template_key: string
          to_email: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          idempotency_key: string
          last_error?: string | null
          provider?: string
          provider_msg_id?: string | null
          retries?: number
          status?: string
          subject: string
          template_key: string
          to_email: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          idempotency_key?: string
          last_error?: string | null
          provider?: string
          provider_msg_id?: string | null
          retries?: number
          status?: string
          subject?: string
          template_key?: string
          to_email?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          created_at: string
          html_template: string
          id: string
          is_active: boolean
          subject_template: string
          template_key: string
          updated_at: string
          variables: Json
        }
        Insert: {
          created_at?: string
          html_template: string
          id?: string
          is_active?: boolean
          subject_template: string
          template_key: string
          updated_at?: string
          variables?: Json
        }
        Update: {
          created_at?: string
          html_template?: string
          id?: string
          is_active?: boolean
          subject_template?: string
          template_key?: string
          updated_at?: string
          variables?: Json
        }
        Relationships: []
      }
      invoice_counters: {
        Row: {
          counter: number
          created_at: string
          tenant_id: string | null
          updated_at: string
          year: number
        }
        Insert: {
          counter?: number
          created_at?: string
          tenant_id?: string | null
          updated_at?: string
          year: number
        }
        Update: {
          counter?: number
          created_at?: string
          tenant_id?: string | null
          updated_at?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_counters_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount: number
          client_id: string | null
          created_at: string
          currency: string | null
          customer_email: string
          customer_name: string
          customer_phone: string | null
          due_date: string | null
          id: string
          invoice_number: string
          issue_date: string
          notes: string | null
          offer_title: string
          payment_method: string | null
          payment_status: string | null
          status: string
          tenant_id: string | null
          transaction_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          client_id?: string | null
          created_at?: string
          currency?: string | null
          customer_email: string
          customer_name: string
          customer_phone?: string | null
          due_date?: string | null
          id?: string
          invoice_number: string
          issue_date?: string
          notes?: string | null
          offer_title: string
          payment_method?: string | null
          payment_status?: string | null
          status?: string
          tenant_id?: string | null
          transaction_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          client_id?: string | null
          created_at?: string
          currency?: string | null
          customer_email?: string
          customer_name?: string
          customer_phone?: string | null
          due_date?: string | null
          id?: string
          invoice_number?: string
          issue_date?: string
          notes?: string | null
          offer_title?: string
          payment_method?: string | null
          payment_status?: string | null
          status?: string
          tenant_id?: string | null
          transaction_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      job_applicants: {
        Row: {
          applied_at: string | null
          cover_letter: string | null
          cv_url: string | null
          email: string
          id: string
          interview_notes: string | null
          job_id: string | null
          name: string
          phone: string | null
          rating: number | null
          recruiter_notes: string | null
          stage: Database["public"]["Enums"]["applicant_stage"] | null
          updated_at: string | null
        }
        Insert: {
          applied_at?: string | null
          cover_letter?: string | null
          cv_url?: string | null
          email: string
          id?: string
          interview_notes?: string | null
          job_id?: string | null
          name: string
          phone?: string | null
          rating?: number | null
          recruiter_notes?: string | null
          stage?: Database["public"]["Enums"]["applicant_stage"] | null
          updated_at?: string | null
        }
        Update: {
          applied_at?: string | null
          cover_letter?: string | null
          cv_url?: string | null
          email?: string
          id?: string
          interview_notes?: string | null
          job_id?: string | null
          name?: string
          phone?: string | null
          rating?: number | null
          recruiter_notes?: string | null
          stage?: Database["public"]["Enums"]["applicant_stage"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_applicants_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_postings"
            referencedColumns: ["id"]
          },
        ]
      }
      job_applications: {
        Row: {
          city: string | null
          cover_letter: string | null
          created_at: string
          cv_file_name: string | null
          cv_file_size: number | null
          education: string | null
          email: string
          experience: string | null
          full_name: string
          id: string
          phone: string
          position: string
          status: string | null
          updated_at: string
        }
        Insert: {
          city?: string | null
          cover_letter?: string | null
          created_at?: string
          cv_file_name?: string | null
          cv_file_size?: number | null
          education?: string | null
          email: string
          experience?: string | null
          full_name: string
          id?: string
          phone: string
          position: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          city?: string | null
          cover_letter?: string | null
          created_at?: string
          cv_file_name?: string | null
          cv_file_size?: number | null
          education?: string | null
          email?: string
          experience?: string | null
          full_name?: string
          id?: string
          phone?: string
          position?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      job_postings: {
        Row: {
          benefits: string | null
          benefits_ar: string | null
          created_at: string | null
          created_by: string | null
          department: string | null
          description: string
          description_ar: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          job_type: Database["public"]["Enums"]["job_type"] | null
          location: string | null
          requirements: string | null
          requirements_ar: string | null
          salary_range: string | null
          title: string
          title_ar: string | null
          updated_at: string | null
        }
        Insert: {
          benefits?: string | null
          benefits_ar?: string | null
          created_at?: string | null
          created_by?: string | null
          department?: string | null
          description: string
          description_ar?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          job_type?: Database["public"]["Enums"]["job_type"] | null
          location?: string | null
          requirements?: string | null
          requirements_ar?: string | null
          salary_range?: string | null
          title: string
          title_ar?: string | null
          updated_at?: string | null
        }
        Update: {
          benefits?: string | null
          benefits_ar?: string | null
          created_at?: string | null
          created_by?: string | null
          department?: string | null
          description?: string
          description_ar?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          job_type?: Database["public"]["Enums"]["job_type"] | null
          location?: string | null
          requirements?: string | null
          requirements_ar?: string | null
          salary_range?: string | null
          title?: string
          title_ar?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      media_library: {
        Row: {
          alt_text: string | null
          caption: string | null
          created_at: string | null
          file_size: number | null
          file_url: string
          filename: string
          folder: string | null
          id: string
          mime_type: string | null
          original_filename: string
          tags: string[] | null
          uploaded_by: string | null
        }
        Insert: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string | null
          file_size?: number | null
          file_url: string
          filename: string
          folder?: string | null
          id?: string
          mime_type?: string | null
          original_filename: string
          tags?: string[] | null
          uploaded_by?: string | null
        }
        Update: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string | null
          file_size?: number | null
          file_url?: string
          filename?: string
          folder?: string | null
          id?: string
          mime_type?: string | null
          original_filename?: string
          tags?: string[] | null
          uploaded_by?: string | null
        }
        Relationships: []
      }
      meeting_minutes: {
        Row: {
          action_items: Json | null
          agenda: string | null
          attachments: Json | null
          attendees: string[] | null
          created_at: string | null
          created_by: string | null
          id: string
          meeting_date: string
          notes: string | null
          project_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          action_items?: Json | null
          agenda?: string | null
          attachments?: Json | null
          attendees?: string[] | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          meeting_date: string
          notes?: string | null
          project_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          action_items?: Json | null
          agenda?: string | null
          attachments?: Json | null
          attendees?: string[] | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          meeting_date?: string
          notes?: string | null
          project_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meeting_minutes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscriptions: {
        Row: {
          email: string
          id: string
          is_active: boolean
          name: string | null
          subscribed_at: string
          unsubscribed_at: string | null
        }
        Insert: {
          email: string
          id?: string
          is_active?: boolean
          name?: string | null
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Update: {
          email?: string
          id?: string
          is_active?: boolean
          name?: string | null
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          channel: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          metadata: Json | null
          sent_at: string | null
          title: string
          type: string | null
          user_id: string | null
        }
        Insert: {
          channel?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          metadata?: Json | null
          sent_at?: string | null
          title: string
          type?: string | null
          user_id?: string | null
        }
        Update: {
          channel?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          metadata?: Json | null
          sent_at?: string | null
          title?: string
          type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      order_communications: {
        Row: {
          attachments: Json | null
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          order_id: string
          sender_id: string
          sender_name: string
          sender_type: string
        }
        Insert: {
          attachments?: Json | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          order_id: string
          sender_id: string
          sender_name: string
          sender_type?: string
        }
        Update: {
          attachments?: Json | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          order_id?: string
          sender_id?: string
          sender_name?: string
          sender_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_communications_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_files: {
        Row: {
          created_at: string | null
          file_name: string
          file_size: string | null
          file_type: string | null
          file_url: string
          id: string
          order_id: string
          uploaded_by: string
          uploaded_by_type: string
        }
        Insert: {
          created_at?: string | null
          file_name: string
          file_size?: string | null
          file_type?: string | null
          file_url: string
          id?: string
          order_id: string
          uploaded_by: string
          uploaded_by_type?: string
        }
        Update: {
          created_at?: string | null
          file_name?: string
          file_size?: string | null
          file_type?: string | null
          file_url?: string
          id?: string
          order_id?: string
          uploaded_by?: string
          uploaded_by_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_files_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_timeline: {
        Row: {
          actor_name: string | null
          actor_type: string
          completed_date: string | null
          created_at: string | null
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
          created_at?: string | null
          description?: string | null
          id?: string
          order_id: string
          scheduled_date?: string | null
          status?: string
          title: string
        }
        Update: {
          actor_name?: string | null
          actor_type?: string
          completed_date?: string | null
          created_at?: string | null
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
          assigned_to: string | null
          client_email: string
          client_name: string
          client_phone: string | null
          client_university: string | null
          created_at: string | null
          currency: string | null
          deadline_date: string | null
          description: string | null
          id: string
          order_number: string
          paid_amount: number | null
          priority: string
          progress_percentage: number | null
          service_title: string
          service_type: string
          status: string
          total_price: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          client_email: string
          client_name: string
          client_phone?: string | null
          client_university?: string | null
          created_at?: string | null
          currency?: string | null
          deadline_date?: string | null
          description?: string | null
          id?: string
          order_number: string
          paid_amount?: number | null
          priority?: string
          progress_percentage?: number | null
          service_title: string
          service_type: string
          status?: string
          total_price: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          client_email?: string
          client_name?: string
          client_phone?: string | null
          client_university?: string | null
          created_at?: string | null
          currency?: string | null
          deadline_date?: string | null
          description?: string | null
          id?: string
          order_number?: string
          paid_amount?: number | null
          priority?: string
          progress_percentage?: number | null
          service_title?: string
          service_type?: string
          status?: string
          total_price?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      pages: {
        Row: {
          author_id: string | null
          content: Json | null
          created_at: string | null
          featured_image: string | null
          id: string
          language: string | null
          meta_description: string | null
          meta_keywords: string[] | null
          meta_title: string | null
          published_at: string | null
          slug: string
          status: string | null
          title: string
          title_ar: string | null
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          content?: Json | null
          created_at?: string | null
          featured_image?: string | null
          id?: string
          language?: string | null
          meta_description?: string | null
          meta_keywords?: string[] | null
          meta_title?: string | null
          published_at?: string | null
          slug: string
          status?: string | null
          title: string
          title_ar?: string | null
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          content?: Json | null
          created_at?: string | null
          featured_image?: string | null
          id?: string
          language?: string | null
          meta_description?: string | null
          meta_keywords?: string[] | null
          meta_title?: string | null
          published_at?: string | null
          slug?: string
          status?: string | null
          title?: string
          title_ar?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      password_reset_tokens: {
        Row: {
          created_at: string
          email: string
          expires_at: string
          id: string
          token: string
          used: boolean
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          expires_at: string
          id?: string
          token: string
          used?: boolean
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          token?: string
          used?: boolean
          user_id?: string
        }
        Relationships: []
      }
      payment_history: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          id: string
          invoice_id: string | null
          notes: string | null
          payment_date: string | null
          payment_method: string
          reference_number: string | null
          status: string
          transaction_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          id?: string
          invoice_id?: string | null
          notes?: string | null
          payment_date?: string | null
          payment_method: string
          reference_number?: string | null
          status: string
          transaction_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          id?: string
          invoice_id?: string | null
          notes?: string | null
          payment_date?: string | null
          payment_method?: string
          reference_number?: string | null
          status?: string
          transaction_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_history_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_methods: {
        Row: {
          api_key: string | null
          configuration: Json | null
          created_at: string
          icon_name: string
          id: string
          is_active: boolean
          is_live_mode: boolean
          name: string
          name_ar: string
          provider: string
          secret_key: string | null
          updated_at: string
          webhook_secret: string | null
        }
        Insert: {
          api_key?: string | null
          configuration?: Json | null
          created_at?: string
          icon_name?: string
          id?: string
          is_active?: boolean
          is_live_mode?: boolean
          name: string
          name_ar: string
          provider: string
          secret_key?: string | null
          updated_at?: string
          webhook_secret?: string | null
        }
        Update: {
          api_key?: string | null
          configuration?: Json | null
          created_at?: string
          icon_name?: string
          id?: string
          is_active?: boolean
          is_live_mode?: boolean
          name?: string
          name_ar?: string
          provider?: string
          secret_key?: string | null
          updated_at?: string
          webhook_secret?: string | null
        }
        Relationships: []
      }
      payment_transactions: {
        Row: {
          amount: number
          contract_id: string | null
          created_at: string | null
          currency: string | null
          customer_email: string
          customer_name: string
          customer_phone: string | null
          description: string | null
          id: string
          invoice_number: string | null
          metadata: Json | null
          offer_title: string | null
          payment_date: string | null
          payment_method: string
          status: string | null
          tenant_id: string | null
          transaction_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          contract_id?: string | null
          created_at?: string | null
          currency?: string | null
          customer_email: string
          customer_name: string
          customer_phone?: string | null
          description?: string | null
          id?: string
          invoice_number?: string | null
          metadata?: Json | null
          offer_title?: string | null
          payment_date?: string | null
          payment_method?: string
          status?: string | null
          tenant_id?: string | null
          transaction_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          contract_id?: string | null
          created_at?: string | null
          currency?: string | null
          customer_email?: string
          customer_name?: string
          customer_phone?: string | null
          description?: string | null
          id?: string
          invoice_number?: string | null
          metadata?: Json | null
          offer_title?: string | null
          payment_date?: string | null
          payment_method?: string
          status?: string | null
          tenant_id?: string | null
          transaction_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      product_orders: {
        Row: {
          created_at: string
          currency: string
          customer_email: string
          customer_name: string
          customer_phone: string | null
          id: string
          notes: string | null
          order_number: string | null
          payment_method: string | null
          payment_reference: string | null
          product_id: number
          product_name: string
          product_price: number
          product_version: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          currency?: string
          customer_email: string
          customer_name: string
          customer_phone?: string | null
          id?: string
          notes?: string | null
          order_number?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          product_id: number
          product_name: string
          product_price: number
          product_version?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          currency?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string | null
          id?: string
          notes?: string | null
          order_number?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          product_id?: number
          product_name?: string
          product_price?: number
          product_version?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          account_number: string | null
          client_id: string | null
          company: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string | null
          user_id: string
          user_role: string | null
        }
        Insert: {
          account_number?: string | null
          client_id?: string | null
          company?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
          user_id: string
          user_role?: string | null
        }
        Update: {
          account_number?: string | null
          client_id?: string | null
          company?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
          user_id?: string
          user_role?: string | null
        }
        Relationships: []
      }
      project_notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string | null
          notification_type: string
          project_id: string
          recipient_email: string
          sent_via_email: boolean | null
          title: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          notification_type: string
          project_id: string
          recipient_email: string
          sent_via_email?: boolean | null
          title: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          notification_type?: string
          project_id?: string
          recipient_email?: string
          sent_via_email?: boolean | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_notifications_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_phases: {
        Row: {
          created_at: string | null
          description: string | null
          end_date: string | null
          estimated_duration_days: number | null
          id: string
          notes: string | null
          phase_name: string
          phase_number: number
          progress_percentage: number | null
          project_id: string
          start_date: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          estimated_duration_days?: number | null
          id?: string
          notes?: string | null
          phase_name: string
          phase_number: number
          progress_percentage?: number | null
          project_id: string
          start_date?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          estimated_duration_days?: number | null
          id?: string
          notes?: string | null
          phase_name?: string
          phase_number?: number
          progress_percentage?: number | null
          project_id?: string
          start_date?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_phases_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_stages: {
        Row: {
          completion_percentage: number | null
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          order_index: number | null
          project_id: string | null
          start_date: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          completion_percentage?: number | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          order_index?: number | null
          project_id?: string | null
          start_date?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          completion_percentage?: number | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          order_index?: number | null
          project_id?: string | null
          start_date?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_stages_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_tasks: {
        Row: {
          actual_hours: number | null
          assignee_id: string | null
          completion_percentage: number | null
          created_at: string | null
          description: string | null
          due_date: string | null
          estimated_hours: number | null
          id: string
          priority: string | null
          project_id: string | null
          stage_id: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          actual_hours?: number | null
          assignee_id?: string | null
          completion_percentage?: number | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          priority?: string | null
          project_id?: string | null
          stage_id?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          actual_hours?: number | null
          assignee_id?: string | null
          completion_percentage?: number | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          priority?: string | null
          project_id?: string | null
          stage_id?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_tasks_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "project_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      project_timeline: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_visible_to_client: boolean | null
          new_status: string | null
          old_status: string | null
          phase_id: string | null
          progress_after: number | null
          progress_before: number | null
          project_id: string
          title: string
          update_type: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_visible_to_client?: boolean | null
          new_status?: string | null
          old_status?: string | null
          phase_id?: string | null
          progress_after?: number | null
          progress_before?: number | null
          project_id: string
          title: string
          update_type?: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_visible_to_client?: boolean | null
          new_status?: string | null
          old_status?: string | null
          phase_id?: string | null
          progress_after?: number | null
          progress_before?: number | null
          project_id?: string
          title?: string
          update_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_timeline_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "project_phases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_timeline_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          assigned_manager: string | null
          budget: number | null
          client_id: string | null
          completion_date: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          due_date: string | null
          id: string
          metadata: Json | null
          name: string
          progress_percentage: number | null
          project_number: string | null
          project_type: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["project_status"] | null
          tags: string[] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          assigned_manager?: string | null
          budget?: number | null
          client_id?: string | null
          completion_date?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          metadata?: Json | null
          name: string
          progress_percentage?: number | null
          project_number?: string | null
          project_type?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          assigned_manager?: string | null
          budget?: number | null
          client_id?: string | null
          completion_date?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          progress_percentage?: number | null
          project_number?: string | null
          project_type?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_items: {
        Row: {
          description: string | null
          id: string
          name: string
          order_index: number | null
          quantity: number | null
          quote_id: string | null
          total_price: number
          unit_price: number
        }
        Insert: {
          description?: string | null
          id?: string
          name: string
          order_index?: number | null
          quantity?: number | null
          quote_id?: string | null
          total_price: number
          unit_price: number
        }
        Update: {
          description?: string | null
          id?: string
          name?: string
          order_index?: number | null
          quantity?: number | null
          quote_id?: string | null
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "quote_items_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          accepted_at: string | null
          client_id: string | null
          created_at: string | null
          created_by: string | null
          currency: string | null
          description: string | null
          expire_date: string | null
          id: string
          issue_date: string | null
          notes: string | null
          quote_number: string
          status: Database["public"]["Enums"]["quote_status"] | null
          subtotal: number | null
          tenant_id: string | null
          terms_conditions: string | null
          title: string
          total: number | null
          updated_at: string | null
          vat_amount: number | null
          vat_rate: number | null
        }
        Insert: {
          accepted_at?: string | null
          client_id?: string | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          description?: string | null
          expire_date?: string | null
          id?: string
          issue_date?: string | null
          notes?: string | null
          quote_number: string
          status?: Database["public"]["Enums"]["quote_status"] | null
          subtotal?: number | null
          tenant_id?: string | null
          terms_conditions?: string | null
          title: string
          total?: number | null
          updated_at?: string | null
          vat_amount?: number | null
          vat_rate?: number | null
        }
        Update: {
          accepted_at?: string | null
          client_id?: string | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          description?: string | null
          expire_date?: string | null
          id?: string
          issue_date?: string | null
          notes?: string | null
          quote_number?: string
          status?: Database["public"]["Enums"]["quote_status"] | null
          subtotal?: number | null
          tenant_id?: string | null
          terms_conditions?: string | null
          title?: string
          total?: number | null
          updated_at?: string | null
          vat_amount?: number | null
          vat_rate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "quotes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      rate_limits: {
        Row: {
          action_type: string
          count: number | null
          created_at: string | null
          id: string
          identifier: string
          window_start: string | null
        }
        Insert: {
          action_type: string
          count?: number | null
          created_at?: string | null
          id?: string
          identifier: string
          window_start?: string | null
        }
        Update: {
          action_type?: string
          count?: number | null
          created_at?: string | null
          id?: string
          identifier?: string
          window_start?: string | null
        }
        Relationships: []
      }
      security_audit_logs: {
        Row: {
          action: string
          created_at: string | null
          event_type: string
          id: string
          ip_address: unknown | null
          metadata: Json | null
          resource_id: string | null
          resource_type: string | null
          risk_level: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string | null
          risk_level?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string | null
          risk_level?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      sensitive_data_audit: {
        Row: {
          access_type: string
          created_at: string | null
          data_classification: string
          id: string
          metadata: Json | null
          resource_id: string | null
          resource_type: string
          risk_score: number | null
          success: boolean
          user_id: string | null
        }
        Insert: {
          access_type: string
          created_at?: string | null
          data_classification: string
          id?: string
          metadata?: Json | null
          resource_id?: string | null
          resource_type: string
          risk_score?: number | null
          success: boolean
          user_id?: string | null
        }
        Update: {
          access_type?: string
          created_at?: string | null
          data_classification?: string
          id?: string
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string
          risk_score?: number | null
          success?: boolean
          user_id?: string | null
        }
        Relationships: []
      }
      service_categories: {
        Row: {
          color: string | null
          created_at: string | null
          description_ar: string | null
          description_en: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name_ar: string
          name_en: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description_ar?: string | null
          description_en?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name_ar: string
          name_en: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description_ar?: string | null
          description_en?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name_ar?: string
          name_en?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      service_requests: {
        Row: {
          actual_cost: number | null
          actual_delivery_date: string | null
          admin_notes: string | null
          attachments: Json | null
          client_id: string | null
          created_at: string | null
          description: string | null
          estimated_cost: number | null
          estimated_delivery_date: string | null
          id: string
          notes: string | null
          priority: string | null
          service_type: string
          status: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          actual_cost?: number | null
          actual_delivery_date?: string | null
          admin_notes?: string | null
          attachments?: Json | null
          client_id?: string | null
          created_at?: string | null
          description?: string | null
          estimated_cost?: number | null
          estimated_delivery_date?: string | null
          id?: string
          notes?: string | null
          priority?: string | null
          service_type: string
          status?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          actual_cost?: number | null
          actual_delivery_date?: string | null
          admin_notes?: string | null
          attachments?: Json | null
          client_id?: string | null
          created_at?: string | null
          description?: string | null
          estimated_cost?: number | null
          estimated_delivery_date?: string | null
          id?: string
          notes?: string | null
          priority?: string | null
          service_type?: string
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          base_price: number | null
          category_id: string
          created_at: string | null
          delivery_time_days: number | null
          description_ar: string | null
          description_en: string | null
          features_ar: string[] | null
          features_en: string[] | null
          id: string
          image_url: string | null
          is_active: boolean | null
          max_units: number | null
          min_units: number | null
          name_ar: string
          name_en: string
          price_per_unit: number | null
          rush_delivery_available: boolean | null
          rush_delivery_multiplier: number | null
          show_to_clients: boolean | null
          sort_order: number | null
          unit_type: string | null
          updated_at: string | null
        }
        Insert: {
          base_price?: number | null
          category_id: string
          created_at?: string | null
          delivery_time_days?: number | null
          description_ar?: string | null
          description_en?: string | null
          features_ar?: string[] | null
          features_en?: string[] | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          max_units?: number | null
          min_units?: number | null
          name_ar: string
          name_en: string
          price_per_unit?: number | null
          rush_delivery_available?: boolean | null
          rush_delivery_multiplier?: number | null
          show_to_clients?: boolean | null
          sort_order?: number | null
          unit_type?: string | null
          updated_at?: string | null
        }
        Update: {
          base_price?: number | null
          category_id?: string
          created_at?: string | null
          delivery_time_days?: number | null
          description_ar?: string | null
          description_en?: string | null
          features_ar?: string[] | null
          features_en?: string[] | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          max_units?: number | null
          min_units?: number | null
          name_ar?: string
          name_en?: string
          price_per_unit?: number | null
          rush_delivery_available?: boolean | null
          rush_delivery_multiplier?: number | null
          show_to_clients?: boolean | null
          sort_order?: number | null
          unit_type?: string | null
          updated_at?: string | null
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
      subscription_plans: {
        Row: {
          billing_interval: string
          created_at: string | null
          currency: string
          custom_integrations: boolean | null
          description: string | null
          description_ar: string | null
          features: Json
          id: string
          is_active: boolean | null
          max_automations: number | null
          max_workflows: number | null
          name: string
          name_ar: string
          price: number
          priority_support: boolean | null
          updated_at: string | null
        }
        Insert: {
          billing_interval?: string
          created_at?: string | null
          currency?: string
          custom_integrations?: boolean | null
          description?: string | null
          description_ar?: string | null
          features?: Json
          id?: string
          is_active?: boolean | null
          max_automations?: number | null
          max_workflows?: number | null
          name: string
          name_ar: string
          price: number
          priority_support?: boolean | null
          updated_at?: string | null
        }
        Update: {
          billing_interval?: string
          created_at?: string | null
          currency?: string
          custom_integrations?: boolean | null
          description?: string | null
          description_ar?: string | null
          features?: Json
          id?: string
          is_active?: boolean | null
          max_automations?: number | null
          max_workflows?: number | null
          name?: string
          name_ar?: string
          price?: number
          priority_support?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          cancelled_at: string | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          paylink_transaction_id: string | null
          payment_status: string | null
          plan_id: string
          status: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          cancelled_at?: string | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          paylink_transaction_id?: string | null
          payment_status?: string | null
          plan_id: string
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          cancel_at_period_end?: boolean | null
          cancelled_at?: string | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          paylink_transaction_id?: string | null
          payment_status?: string | null
          plan_id?: string
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      subsidiaries: {
        Row: {
          created_at: string | null
          description: string | null
          description_ar: string | null
          id: string
          is_published: boolean | null
          logo_url: string | null
          management_team: Json | null
          name: string
          name_ar: string | null
          order_index: number | null
          services: string[] | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          description_ar?: string | null
          id?: string
          is_published?: boolean | null
          logo_url?: string | null
          management_team?: Json | null
          name: string
          name_ar?: string | null
          order_index?: number | null
          services?: string[] | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          description_ar?: string | null
          id?: string
          is_published?: boolean | null
          logo_url?: string | null
          management_team?: Json | null
          name?: string
          name_ar?: string | null
          order_index?: number | null
          services?: string[] | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          assignee_id: string | null
          category: string | null
          client_id: string | null
          created_at: string | null
          description: string
          first_response_at: string | null
          id: string
          priority: Database["public"]["Enums"]["ticket_priority"] | null
          requester_email: string | null
          requester_name: string | null
          requester_phone: string | null
          resolution_notes: string | null
          resolved_at: string | null
          sla_due_date: string | null
          status: Database["public"]["Enums"]["ticket_status"] | null
          subject: string
          tenant_id: string | null
          ticket_number: string
          updated_at: string | null
        }
        Insert: {
          assignee_id?: string | null
          category?: string | null
          client_id?: string | null
          created_at?: string | null
          description: string
          first_response_at?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["ticket_priority"] | null
          requester_email?: string | null
          requester_name?: string | null
          requester_phone?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          sla_due_date?: string | null
          status?: Database["public"]["Enums"]["ticket_status"] | null
          subject: string
          tenant_id?: string | null
          ticket_number: string
          updated_at?: string | null
        }
        Update: {
          assignee_id?: string | null
          category?: string | null
          client_id?: string | null
          created_at?: string | null
          description?: string
          first_response_at?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["ticket_priority"] | null
          requester_email?: string | null
          requester_name?: string | null
          requester_phone?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          sla_due_date?: string | null
          status?: Database["public"]["Enums"]["ticket_status"] | null
          subject?: string
          tenant_id?: string | null
          ticket_number?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      system_settings: {
        Row: {
          category: string | null
          description: string | null
          id: string
          key: string
          tenant_id: string | null
          updated_at: string | null
          updated_by: string | null
          value: Json
        }
        Insert: {
          category?: string | null
          description?: string | null
          id?: string
          key: string
          tenant_id?: string | null
          updated_at?: string | null
          updated_by?: string | null
          value: Json
        }
        Update: {
          category?: string | null
          description?: string | null
          id?: string
          key?: string
          tenant_id?: string | null
          updated_at?: string | null
          updated_by?: string | null
          value?: Json
        }
        Relationships: [
          {
            foreignKeyName: "system_settings_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          code: string
          created_at: string | null
          database_url: string | null
          domain: string
          id: string
          is_active: boolean | null
          name: string
          settings: Json | null
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          database_url?: string | null
          domain: string
          id?: string
          is_active?: boolean | null
          name: string
          settings?: Json | null
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          database_url?: string | null
          domain?: string
          id?: string
          is_active?: boolean | null
          name?: string
          settings?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      ticket_messages: {
        Row: {
          attachments: Json | null
          created_at: string | null
          id: string
          is_internal: boolean | null
          message: string
          ticket_id: string
          user_id: string
        }
        Insert: {
          attachments?: Json | null
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          message: string
          ticket_id: string
          user_id: string
        }
        Update: {
          attachments?: Json | null
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          message?: string
          ticket_id?: string
          user_id?: string
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
      ticket_replies: {
        Row: {
          attachments: Json | null
          body: string
          created_at: string | null
          id: string
          is_internal: boolean | null
          sender_email: string | null
          sender_id: string | null
          sender_name: string | null
          sender_type: string
          ticket_id: string | null
        }
        Insert: {
          attachments?: Json | null
          body: string
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          sender_email?: string | null
          sender_id?: string | null
          sender_name?: string | null
          sender_type: string
          ticket_id?: string | null
        }
        Update: {
          attachments?: Json | null
          body?: string
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          sender_email?: string | null
          sender_id?: string | null
          sender_name?: string | null
          sender_type?: string
          ticket_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ticket_replies_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          assigned_to: string | null
          category: string
          created_at: string | null
          description: string
          id: string
          priority: string
          resolved_at: string | null
          status: string
          tenant_id: string | null
          ticket_number: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          category?: string
          created_at?: string | null
          description: string
          id?: string
          priority?: string
          resolved_at?: string | null
          status?: string
          tenant_id?: string | null
          ticket_number: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          category?: string
          created_at?: string | null
          description?: string
          id?: string
          priority?: string
          resolved_at?: string | null
          status?: string
          tenant_id?: string | null
          ticket_number?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      unauthorized_access_logs: {
        Row: {
          additional_metadata: Json | null
          attempted_path: string
          blocked_reason: string | null
          created_at: string | null
          id: string
          ip_address: unknown | null
          referer: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
          user_role: string | null
        }
        Insert: {
          additional_metadata?: Json | null
          attempted_path: string
          blocked_reason?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          referer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
          user_role?: string | null
        }
        Update: {
          additional_metadata?: Json | null
          attempted_path?: string
          blocked_reason?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          referer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
          user_role?: string | null
        }
        Relationships: []
      }
      update_reads: {
        Row: {
          id: string
          read_at: string
          update_id: string
          user_id: string
        }
        Insert: {
          id?: string
          read_at?: string
          update_id: string
          user_id: string
        }
        Update: {
          id?: string
          read_at?: string
          update_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "update_reads_update_id_fkey"
            columns: ["update_id"]
            isOneToOne: false
            referencedRelation: "updates"
            referencedColumns: ["id"]
          },
        ]
      }
      updates: {
        Row: {
          content: string
          created_at: string
          created_by: string
          email_sent: boolean
          id: string
          is_published: boolean
          priority: string
          publish_date: string | null
          target_audience: string
          target_client_id: string | null
          title: string
          update_type: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          created_by: string
          email_sent?: boolean
          id?: string
          is_published?: boolean
          priority?: string
          publish_date?: string | null
          target_audience?: string
          target_client_id?: string | null
          title: string
          update_type?: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string
          email_sent?: boolean
          id?: string
          is_published?: boolean
          priority?: string
          publish_date?: string | null
          target_audience?: string
          target_client_id?: string | null
          title?: string
          update_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_activity_logs: {
        Row: {
          activity_type: string
          created_at: string | null
          description: string | null
          id: string
          ip_address: unknown | null
          metadata: Json | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          description?: string | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          description?: string | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string
          password_hash: string
          phone: string | null
          role: string
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          name: string
          password_hash: string
          phone?: string | null
          role?: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          password_hash?: string
          phone?: string | null
          role?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      verification_codes: {
        Row: {
          code: string
          created_at: string | null
          email: string
          expires_at: string
          id: string
          type: string
          used: boolean | null
          used_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          email: string
          expires_at: string
          id?: string
          type: string
          used?: boolean | null
          used_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          type?: string
          used?: boolean | null
          used_at?: string | null
        }
        Relationships: []
      }
      wallet_transactions: {
        Row: {
          amount: number
          balance_after: number
          balance_before: number
          created_at: string
          customer_email: string | null
          customer_name: string | null
          customer_phone: string | null
          description: string | null
          id: string
          metadata: Json | null
          payment_method: string | null
          payment_reference: string | null
          reference_id: string | null
          status: string
          transaction_type: string
          updated_at: string | null
          user_id: string
          wallet_id: string | null
        }
        Insert: {
          amount: number
          balance_after: number
          balance_before: number
          created_at?: string
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          payment_reference?: string | null
          reference_id?: string | null
          status?: string
          transaction_type: string
          updated_at?: string | null
          user_id: string
          wallet_id?: string | null
        }
        Update: {
          amount?: number
          balance_after?: number
          balance_before?: number
          created_at?: string
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          payment_reference?: string | null
          reference_id?: string | null
          status?: string
          transaction_type?: string
          updated_at?: string | null
          user_id?: string
          wallet_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wallet_transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "customer_wallets"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_login: {
        Args: {
          user_agent?: string
          user_email: string
          user_ip?: unknown
          user_password: string
        }
        Returns: Json
      }
      auth_create_test_user: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      auth_diagnostic_check: {
        Args: { p_email: string; p_password: string }
        Returns: Json
      }
      auth_hotfix_auto_repair: {
        Args: {
          admin_user_id?: string
          email_input: string
          plain_password: string
        }
        Returns: Json
      }
      auth_hotfix_diagnose: {
        Args: {
          admin_user_id?: string
          email_input: string
          plain_password?: string
        }
        Returns: Json
      }
      calculate_affiliate_level: {
        Args: { user_id: string }
        Returns: string
      }
      check_automation_limit: {
        Args: { p_automation_type: string; p_user_id: string }
        Returns: boolean
      }
      check_contract_rate_limit: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      check_rate_limit: {
        Args: {
          p_action_type: string
          p_identifier: string
          p_limit?: number
          p_window_minutes?: number
        }
        Returns: boolean
      }
      check_recent_job_application: {
        Args: { applicant_email: string }
        Returns: boolean
      }
      check_recent_newsletter_subscription: {
        Args: { subscriber_email: string }
        Returns: boolean
      }
      check_sensitive_operation_limit: {
        Args: { p_operation_type: string; p_user_id: string }
        Returns: boolean
      }
      cleanup_expired_reset_tokens: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_expired_verification_codes: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      confirm_user_after_verification: {
        Args: { user_email: string }
        Returns: boolean
      }
      create_admin_session: {
        Args: { admin_user_id: string; user_agent?: string; user_ip?: unknown }
        Returns: string
      }
      create_otp_code: {
        Args: { p_email: string; p_type: string; p_user_id: string }
        Returns: string
      }
      create_secure_admin_password: {
        Args: { plain_password: string }
        Returns: Json
      }
      create_secure_admin_password_v2: {
        Args: { plain_password: string }
        Returns: Json
      }
      create_secure_admin_session: {
        Args:
          | { admin_user_id: string; session_data?: Json }
          | { admin_user_id: string; user_agent?: string; user_ip?: unknown }
        Returns: string
      }
      create_secure_password_hash: {
        Args: { plain_password: string }
        Returns: Json
      }
      create_secure_password_hash_v2: {
        Args: { password_text: string }
        Returns: Json
      }
      create_ultra_secure_admin_session: {
        Args: {
          additional_entropy?: string
          admin_user_id: string
          user_agent?: string
          user_ip?: unknown
        }
        Returns: Json
      }
      decrypt_sensitive_admin_data: {
        Args: { encrypted_data: string }
        Returns: string
      }
      emergency_lock_customer_data: {
        Args: { reason?: string }
        Returns: boolean
      }
      encrypt_admin_password: {
        Args: { plain_password: string }
        Returns: Json
      }
      encrypt_sensitive_admin_data: {
        Args: { data_text: string }
        Returns: string
      }
      enhanced_admin_rate_limit_check: {
        Args: {
          p_action_type: string
          p_admin_id: string
          p_limit?: number
          p_window_minutes?: number
        }
        Returns: boolean
      }
      enhanced_rate_limit_check: {
        Args: {
          p_action_type: string
          p_identifier: string
          p_limit?: number
          p_window_minutes?: number
        }
        Returns: boolean
      }
      ensure_user_wallet: {
        Args: { p_user_id: string }
        Returns: string
      }
      fix_legacy_data: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_account_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_affiliate_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_business_contract_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_business_invoice_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_client_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_contract_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_invoice_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_order_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_project_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_quote_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_random_invoice_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_ticket_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_admin_role: {
        Args: { user_id?: string }
        Returns: Database["public"]["Enums"]["admin_role"]
      }
      get_auth_statistics: {
        Args: { p_limit?: number }
        Returns: {
          email_lower: string
          failure_count: number
          last_attempt: string
          last_success: string
          success_count: number
          total_attempts: number
        }[]
      }
      get_auth_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          failed_logins_today: number
          pending_users: number
          successful_verifications_today: number
          total_users: number
          verified_users: number
        }[]
      }
      get_current_admin_user: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_ash_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_new_invoice_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_quick_auth_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          stat_name: string
          stat_value: number
        }[]
      }
      get_unique_invoice_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_contracts: {
        Args: { requesting_user_id?: string }
        Returns: {
          client_email: string
          client_name: string
          client_phone: string
          contract_number: string
          created_at: string
          id: string
          masked_data: boolean
          service_price: number
          service_type: string
          status: string
        }[]
      }
      has_admin_role: {
        Args:
          | {
              _required_role?: Database["public"]["Enums"]["admin_role"]
              _user_id: string
            }
          | {
              required_role?: Database["public"]["Enums"]["user_role"]
              user_id: string
            }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: {
        Args: { user_id?: string }
        Returns: boolean
      }
      is_admin_user: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      log_auth_attempt: {
        Args:
          | {
              action_param: string
              email_lower_param: string
              error_code_param?: string
              metadata_param?: Json
              probe_result_param?: Json
              status_param: string
              user_id_param?: string
            }
          | {
              p_email_lower: string
              p_error_code?: string
              p_error_constraint?: string
              p_ip_address?: string
              p_result: string
              p_user_agent?: string
            }
          | {
              p_email_lower: string
              p_error_code?: string
              p_error_constraint?: string
              p_ip_address?: unknown
              p_result: string
              p_user_agent?: string
            }
        Returns: undefined
      }
      log_sensitive_data_access: {
        Args: {
          p_access_type: string
          p_classification: string
          p_metadata?: Json
          p_resource_id: string
          p_resource_type: string
          p_success: boolean
        }
        Returns: undefined
      }
      log_unauthorized_access: {
        Args: {
          _additional_data?: Json
          _attempted_path: string
          _blocked_reason?: string
          _ip_address?: unknown
          _user_agent?: string
          _user_id?: string
        }
        Returns: undefined
      }
      make_user_admin: {
        Args: { target_email: string }
        Returns: boolean
      }
      mask_customer_email: {
        Args: { email_input: string; user_requesting?: string }
        Returns: string
      }
      mask_customer_phone: {
        Args: { phone_input: string; user_requesting?: string }
        Returns: string
      }
      mask_email: {
        Args: { email_input: string; user_requesting?: string }
        Returns: string
      }
      mask_id_number: {
        Args: { id_input: string; user_requesting?: string }
        Returns: string
      }
      mask_phone: {
        Args: { phone_input: string; user_requesting?: string }
        Returns: string
      }
      mask_sensitive_email: {
        Args: { email_input: string; user_requesting?: string }
        Returns: string
      }
      mask_sensitive_phone: {
        Args: { phone_input: string; user_requesting?: string }
        Returns: string
      }
      migrate_tenant_data: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      normalize_digits: {
        Args: { input_text: string }
        Returns: string
      }
      normalize_email: {
        Args: { email_input: string }
        Returns: string
      }
      normalize_email_enhanced: {
        Args: { email_input: string }
        Returns: string
      }
      owns_payment_transaction: {
        Args: { transaction_user_id: string }
        Returns: boolean
      }
      process_wallet_transaction: {
        Args:
          | {
              p_amount: number
              p_description: string
              p_metadata?: Json
              p_reference_id?: string
              p_transaction_type: string
              p_user_id: string
            }
          | {
              p_amount: number
              p_description?: string
              p_payment_method?: string
              p_payment_reference?: string
              p_transaction_type: string
              p_user_id: string
            }
        Returns: string
      }
      record_automation_usage: {
        Args: { p_automation_type: string; p_count?: number; p_user_id: string }
        Returns: undefined
      }
      simple_authenticate_user: {
        Args: { email_lower_param: string; plain_password: string }
        Returns: Json
      }
      simple_authenticate_user_enhanced: {
        Args: { p_email: string; p_password: string }
        Returns: {
          email_lower: string
          error_code: string
          message: string
          role: string
          status: string
          success: boolean
          user_id: string
        }[]
      }
      simulate_user_activities: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_user_last_activity: {
        Args: { user_id_param: string }
        Returns: undefined
      }
      validate_admin_session: {
        Args: { session_id: string } | { token: string; user_agent?: string }
        Returns: Json
      }
      validate_email: {
        Args: { email_input: string }
        Returns: Json
      }
      validate_password: {
        Args: { password_input: string }
        Returns: Json
      }
      validate_ultra_secure_admin_session: {
        Args: { token: string; user_agent?: string; user_ip?: unknown }
        Returns: Json
      }
      verify_admin_login: {
        Args: { email_input: string; password_input: string }
        Returns: Json
      }
      verify_admin_password: {
        Args:
          | { plain_password: string; stored_hash: string; stored_salt: string }
          | { plain_password: string; stored_password: string }
        Returns: boolean
      }
      verify_otp_code: {
        Args: { p_code: string; p_email: string; p_type: string }
        Returns: boolean
      }
      verify_otp_code_enhanced: {
        Args: { p_code: string; p_email: string; p_type: string }
        Returns: Json
      }
      verify_password: {
        Args: { password_text: string; stored_hash: string }
        Returns: boolean
      }
      verify_password_enhanced: {
        Args: {
          hash_version?: string
          password_text: string
          stored_hash: string
          stored_salt?: string
        }
        Returns: boolean
      }
      verify_secure_admin_password: {
        Args: {
          plain_password: string
          stored_encrypted_salt: string
          stored_hash: string
        }
        Returns: boolean
      }
    }
    Enums: {
      admin_role: "owner" | "admin" | "editor"
      app_role: "admin" | "user"
      applicant_stage:
        | "applied"
        | "screening"
        | "interview"
        | "offer"
        | "hired"
        | "rejected"
      audit_action:
        | "create"
        | "update"
        | "delete"
        | "publish"
        | "unpublish"
        | "login"
        | "logout"
      client_sector: "government" | "private" | "semi_government"
      client_status: "prospect" | "active" | "inactive" | "blocked"
      contract_status:
        | "draft"
        | "sent"
        | "signed"
        | "active"
        | "completed"
        | "terminated"
      contract_type: "full_time" | "part_time" | "contract" | "internship"
      invoice_status: "draft" | "sent" | "paid" | "overdue" | "cancelled"
      job_status: "open" | "closed"
      job_type: "full_time" | "part_time" | "contract" | "internship"
      news_type: "news" | "press"
      page_status: "draft" | "published"
      password_algorithm: "sha256_v1" | "bcrypt_v1" | "argon2id_v1" | "md5_v1"
      payment_status: "pending" | "completed" | "failed" | "refunded"
      project_status:
        | "planning"
        | "in_progress"
        | "review"
        | "completed"
        | "cancelled"
      quote_status: "draft" | "sent" | "accepted" | "rejected" | "expired"
      ticket_priority: "low" | "medium" | "high" | "urgent"
      ticket_status:
        | "open"
        | "in_progress"
        | "waiting_client"
        | "resolved"
        | "closed"
      user_role: "owner" | "admin" | "editor"
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
      admin_role: ["owner", "admin", "editor"],
      app_role: ["admin", "user"],
      applicant_stage: [
        "applied",
        "screening",
        "interview",
        "offer",
        "hired",
        "rejected",
      ],
      audit_action: [
        "create",
        "update",
        "delete",
        "publish",
        "unpublish",
        "login",
        "logout",
      ],
      client_sector: ["government", "private", "semi_government"],
      client_status: ["prospect", "active", "inactive", "blocked"],
      contract_status: [
        "draft",
        "sent",
        "signed",
        "active",
        "completed",
        "terminated",
      ],
      contract_type: ["full_time", "part_time", "contract", "internship"],
      invoice_status: ["draft", "sent", "paid", "overdue", "cancelled"],
      job_status: ["open", "closed"],
      job_type: ["full_time", "part_time", "contract", "internship"],
      news_type: ["news", "press"],
      page_status: ["draft", "published"],
      password_algorithm: ["sha256_v1", "bcrypt_v1", "argon2id_v1", "md5_v1"],
      payment_status: ["pending", "completed", "failed", "refunded"],
      project_status: [
        "planning",
        "in_progress",
        "review",
        "completed",
        "cancelled",
      ],
      quote_status: ["draft", "sent", "accepted", "rejected", "expired"],
      ticket_priority: ["low", "medium", "high", "urgent"],
      ticket_status: [
        "open",
        "in_progress",
        "waiting_client",
        "resolved",
        "closed",
      ],
      user_role: ["owner", "admin", "editor"],
    },
  },
} as const
