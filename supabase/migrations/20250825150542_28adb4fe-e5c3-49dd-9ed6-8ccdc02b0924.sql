-- Comprehensive Security Fixes for All Sensitive Tables

-- First, create enhanced data masking functions
CREATE OR REPLACE FUNCTION public.mask_sensitive_email(email_input text, user_requesting uuid DEFAULT auth.uid())
RETURNS text
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Only show full email to admins
  IF public.has_role(user_requesting, 'admin'::app_role) THEN
    RETURN email_input;
  END IF;
  
  -- Mask email for others: show first 2 chars + *** + domain
  IF email_input IS NOT NULL AND email_input != '' THEN
    RETURN LEFT(email_input, 2) || '***@' || SPLIT_PART(email_input, '@', 2);
  END IF;
  
  RETURN NULL;
END;
$$;

CREATE OR REPLACE FUNCTION public.mask_sensitive_phone(phone_input text, user_requesting uuid DEFAULT auth.uid())
RETURNS text
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Only show full phone to admins
  IF public.has_role(user_requesting, 'admin'::app_role) THEN
    RETURN phone_input;
  END IF;
  
  -- Mask phone: show only last 4 digits
  IF phone_input IS NOT NULL AND LENGTH(phone_input) > 4 THEN
    RETURN '***-' || RIGHT(phone_input, 4);
  END IF;
  
  RETURN NULL;
END;
$$;

-- Enhanced audit logging function for sensitive data access
CREATE OR REPLACE FUNCTION public.log_sensitive_table_access()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Log access to all sensitive tables
  INSERT INTO public.security_audit_logs (
    event_type,
    user_id,
    action,
    resource_type,
    resource_id,
    risk_level,
    metadata
  ) VALUES (
    'sensitive_data_access',
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE 
      WHEN TG_TABLE_NAME IN ('payment_transactions', 'business_payments', 'job_applicants') THEN 'critical'
      WHEN TG_TABLE_NAME IN ('client_contacts', 'business_invoices', 'support_tickets') THEN 'high'
      ELSE 'medium'
    END,
    jsonb_build_object(
      'table', TG_TABLE_NAME,
      'operation', TG_OP,
      'user_role', CASE 
        WHEN public.has_role(auth.uid(), 'admin'::app_role) THEN 'admin'
        ELSE 'user'
      END,
      'timestamp', now(),
      'ip_address', inet_client_addr()
    )
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- DROP existing overly permissive policies and create secure ones

-- CLIENT_CONTACTS: Secure access to client contact information
DROP POLICY IF EXISTS "client_contacts_admin_full_access" ON public.client_contacts;
DROP POLICY IF EXISTS "client_contacts_owner_access" ON public.client_contacts;

CREATE POLICY "client_contacts_admin_access" ON public.client_contacts
FOR ALL USING (
  public.has_role(auth.uid(), 'admin'::app_role) AND auth.uid() IS NOT NULL
)
WITH CHECK (
  public.has_role(auth.uid(), 'admin'::app_role) AND auth.uid() IS NOT NULL
);

CREATE POLICY "client_contacts_owner_access" ON public.client_contacts
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.clients 
    WHERE clients.id = client_contacts.client_id 
    AND clients.created_by = auth.uid() 
    AND auth.uid() IS NOT NULL
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.clients 
    WHERE clients.id = client_contacts.client_id 
    AND clients.created_by = auth.uid() 
    AND auth.uid() IS NOT NULL
  )
);

-- BUSINESS_INVOICES: Secure invoice access
DROP POLICY IF EXISTS "Admin can manage all business invoices" ON public.business_invoices;
DROP POLICY IF EXISTS "Users can manage invoices for their clients" ON public.business_invoices;

CREATE POLICY "business_invoices_admin_access" ON public.business_invoices
FOR ALL USING (
  public.has_role(auth.uid(), 'admin'::app_role) AND auth.uid() IS NOT NULL
)
WITH CHECK (
  public.has_role(auth.uid(), 'admin'::app_role) AND auth.uid() IS NOT NULL
);

CREATE POLICY "business_invoices_creator_access" ON public.business_invoices
FOR ALL USING (
  created_by = auth.uid() AND auth.uid() IS NOT NULL
)
WITH CHECK (
  created_by = auth.uid() AND auth.uid() IS NOT NULL
);

-- JOB_APPLICANTS: Admin-only access with rate limiting
DROP POLICY IF EXISTS "job_applicants_admin_only_access" ON public.job_applicants;
DROP POLICY IF EXISTS "job_applicants_rate_limited_insert" ON public.job_applicants;

CREATE POLICY "job_applicants_admin_only" ON public.job_applicants
FOR ALL USING (
  public.has_role(auth.uid(), 'admin'::app_role) AND auth.uid() IS NOT NULL
)
WITH CHECK (
  public.has_role(auth.uid(), 'admin'::app_role) AND auth.uid() IS NOT NULL
);

-- PAYMENT_TRANSACTIONS: Strict owner and admin access
DROP POLICY IF EXISTS "Allow public insert for payment transactions" ON public.payment_transactions;
DROP POLICY IF EXISTS "Allow select for admins only" ON public.payment_transactions;
DROP POLICY IF EXISTS "payment_transactions_delete_admin_only" ON public.payment_transactions;
DROP POLICY IF EXISTS "payment_transactions_insert_own_only" ON public.payment_transactions;
DROP POLICY IF EXISTS "payment_transactions_select_own_only" ON public.payment_transactions;
DROP POLICY IF EXISTS "payment_transactions_update_own_only" ON public.payment_transactions;

CREATE POLICY "payment_transactions_admin_full_access" ON public.payment_transactions
FOR ALL USING (
  public.has_role(auth.uid(), 'admin'::app_role) AND auth.uid() IS NOT NULL
)
WITH CHECK (
  public.has_role(auth.uid(), 'admin'::app_role) AND auth.uid() IS NOT NULL
);

CREATE POLICY "payment_transactions_owner_access" ON public.payment_transactions
FOR SELECT USING (
  user_id = auth.uid() AND auth.uid() IS NOT NULL
);

CREATE POLICY "payment_transactions_secure_insert" ON public.payment_transactions
FOR INSERT WITH CHECK (
  user_id = auth.uid() 
  AND auth.uid() IS NOT NULL 
  AND public.enhanced_rate_limit_check(
    auth.uid()::text, 
    'payment_transaction', 
    2, 
    60
  )
);

-- SUPPORT_TICKETS: Secure ticket access
DROP POLICY IF EXISTS "support_tickets_admin_access" ON public.support_tickets;
DROP POLICY IF EXISTS "support_tickets_assignee_access" ON public.support_tickets;
DROP POLICY IF EXISTS "support_tickets_client_owner_view" ON public.support_tickets;

CREATE POLICY "support_tickets_admin_access" ON public.support_tickets
FOR ALL USING (
  public.has_role(auth.uid(), 'admin'::app_role) AND auth.uid() IS NOT NULL
)
WITH CHECK (
  public.has_role(auth.uid(), 'admin'::app_role) AND auth.uid() IS NOT NULL
);

CREATE POLICY "support_tickets_assignee_access" ON public.support_tickets
FOR ALL USING (
  assignee_id = auth.uid() AND auth.uid() IS NOT NULL
)
WITH CHECK (
  assignee_id = auth.uid() AND auth.uid() IS NOT NULL
);

-- QUOTES: Secure quote access
DROP POLICY IF EXISTS "Admin can manage all quotes" ON public.quotes;
DROP POLICY IF EXISTS "Secure: Admin can manage all quotes" ON public.quotes;
DROP POLICY IF EXISTS "Secure: Users can manage their own quotes only" ON public.quotes;
DROP POLICY IF EXISTS "Users can manage quotes for their clients" ON public.quotes;

CREATE POLICY "quotes_admin_access" ON public.quotes
FOR ALL USING (
  public.has_role(auth.uid(), 'admin'::app_role) AND auth.uid() IS NOT NULL
)
WITH CHECK (
  public.has_role(auth.uid(), 'admin'::app_role) AND auth.uid() IS NOT NULL
);

CREATE POLICY "quotes_creator_access" ON public.quotes
FOR ALL USING (
  created_by = auth.uid() AND auth.uid() IS NOT NULL
)
WITH CHECK (
  created_by = auth.uid() AND auth.uid() IS NOT NULL
);

-- INVOICES: Secure general invoice access
DROP POLICY IF EXISTS "Secure: Admin can manage all invoices" ON public.invoices;
DROP POLICY IF EXISTS "Secure: Users can manage their own invoices only" ON public.invoices;

CREATE POLICY "invoices_admin_access" ON public.invoices
FOR ALL USING (
  public.has_role(auth.uid(), 'admin'::app_role) AND auth.uid() IS NOT NULL
)
WITH CHECK (
  public.has_role(auth.uid(), 'admin'::app_role) AND auth.uid() IS NOT NULL
);

CREATE POLICY "invoices_owner_access" ON public.invoices
FOR ALL USING (
  user_id = auth.uid() AND auth.uid() IS NOT NULL
)
WITH CHECK (
  user_id = auth.uid() AND auth.uid() IS NOT NULL
);

-- Add audit triggers to all sensitive tables
DROP TRIGGER IF EXISTS audit_client_contacts ON public.client_contacts;
CREATE TRIGGER audit_client_contacts
    AFTER INSERT OR UPDATE OR DELETE ON public.client_contacts
    FOR EACH ROW EXECUTE FUNCTION public.log_sensitive_table_access();

DROP TRIGGER IF EXISTS audit_business_invoices ON public.business_invoices;
CREATE TRIGGER audit_business_invoices
    AFTER INSERT OR UPDATE OR DELETE ON public.business_invoices
    FOR EACH ROW EXECUTE FUNCTION public.log_sensitive_table_access();

DROP TRIGGER IF EXISTS audit_job_applicants ON public.job_applicants;
CREATE TRIGGER audit_job_applicants
    AFTER INSERT OR UPDATE OR DELETE ON public.job_applicants
    FOR EACH ROW EXECUTE FUNCTION public.log_sensitive_table_access();

DROP TRIGGER IF EXISTS audit_payment_transactions ON public.payment_transactions;
CREATE TRIGGER audit_payment_transactions
    AFTER INSERT OR UPDATE OR DELETE ON public.payment_transactions
    FOR EACH ROW EXECUTE FUNCTION public.log_sensitive_table_access();

DROP TRIGGER IF EXISTS audit_support_tickets ON public.support_tickets;
CREATE TRIGGER audit_support_tickets
    AFTER INSERT OR UPDATE OR DELETE ON public.support_tickets
    FOR EACH ROW EXECUTE FUNCTION public.log_sensitive_table_access();

-- Enhanced rate limiting for sensitive operations
CREATE OR REPLACE FUNCTION public.check_sensitive_operation_limit(p_user_id uuid, p_operation_type text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  user_identifier TEXT;
  rate_limit_passed BOOLEAN;
BEGIN
  user_identifier := COALESCE(p_user_id::text, 'anonymous');
  
  -- Stricter limits for sensitive operations
  SELECT public.enhanced_rate_limit_check(
    user_identifier,
    p_operation_type,
    CASE 
      WHEN p_operation_type IN ('payment_transaction', 'job_application') THEN 2
      WHEN p_operation_type IN ('invoice_creation', 'contract_creation') THEN 5
      ELSE 10
    END,
    60 -- Per hour
  ) INTO rate_limit_passed;
  
  IF NOT rate_limit_passed THEN
    INSERT INTO public.security_audit_logs (
      event_type,
      user_id,
      action,
      risk_level,
      metadata
    ) VALUES (
      'rate_limit_exceeded',
      p_user_id,
      p_operation_type || '_rate_limit_exceeded',
      'high',
      jsonb_build_object(
        'operation_type', p_operation_type,
        'timestamp', now(),
        'user_id', p_user_id::text
      )
    );
    
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$;