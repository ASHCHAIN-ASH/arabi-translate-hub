COMMENT ON SCHEMA public IS 'standard public schema';

CREATE TABLE public.daily_growth_metrics (
    date date NOT NULL,
    new_users integer DEFAULT 0 NOT NULL,
    active_users integer DEFAULT 0 NOT NULL,
    challenges_completed integer DEFAULT 0 NOT NULL,
    shares_count integer DEFAULT 0 NOT NULL,
    referrals_count integer DEFAULT 0 NOT NULL,
    referrals_completed integer DEFAULT 0 NOT NULL,
    conversions integer DEFAULT 0 NOT NULL,
    retention_rate numeric(5,2) DEFAULT 0 NOT NULL,
    computed_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.experiments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    experiment_key text NOT NULL,
    name text NOT NULL,
    description text,
    hypothesis text,
    status public.experiment_status DEFAULT 'draft'::public.experiment_status NOT NULL,
    target_area public.experiment_target_area NOT NULL,
    traffic_allocation_percentage numeric(5,2) DEFAULT 100 NOT NULL,
    primary_metric text NOT NULL,
    secondary_metrics jsonb DEFAULT '[]'::jsonb NOT NULL,
    start_at timestamp with time zone,
    end_at timestamp with time zone,
    winner_variant_id uuid,
    min_sample_size integer DEFAULT 100 NOT NULL,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT experiments_traffic_allocation_percentage_check CHECK (((traffic_allocation_percentage > (0)::numeric) AND (traffic_allocation_percentage <= (100)::numeric)))
);

CREATE TABLE public.orders (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tracking_id text DEFAULT ('TR'::text || lpad((floor((random() * (1000000)::double precision)))::text, 6, '0'::text)) NOT NULL,
    phone_last_four text NOT NULL,
    title text NOT NULL,
    degree text DEFAULT ''::text NOT NULL,
    service_type text DEFAULT 'general'::text NOT NULL,
    description text,
    current_status text DEFAULT 'received'::text,
    estimated_delivery date,
    client_name text NOT NULL,
    client_phone text NOT NULL,
    client_email text NOT NULL,
    user_id uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    assistance_type text
);

COMMENT ON COLUMN public.orders.assistance_type IS 'نوع المساعدة الأكاديمية: review, proofreading, improvement, guidance, analysis, structuring';

CREATE TABLE public.assessment_answers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    attempt_id uuid NOT NULL,
    question_id uuid NOT NULL,
    selected_option_id uuid,
    is_correct boolean DEFAULT false NOT NULL,
    answered_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.assessment_attempts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    assessment_id uuid NOT NULL,
    user_id uuid,
    anonymous_id text,
    status text DEFAULT 'in_progress'::text NOT NULL,
    total_questions integer DEFAULT 0 NOT NULL,
    correct_count integer DEFAULT 0 NOT NULL,
    total_score integer DEFAULT 0 NOT NULL,
    level_result text,
    skill_breakdown jsonb DEFAULT '{}'::jsonb NOT NULL,
    time_spent_seconds integer DEFAULT 0 NOT NULL,
    xp_awarded integer DEFAULT 0 NOT NULL,
    shared_at timestamp with time zone,
    share_xp_awarded integer DEFAULT 0 NOT NULL,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    completed_at timestamp with time zone,
    CONSTRAINT assessment_attempts_status_check CHECK ((status = ANY (ARRAY['in_progress'::text, 'completed'::text, 'abandoned'::text]))),
    CONSTRAINT attempt_owner CHECK (((user_id IS NOT NULL) OR (anonymous_id IS NOT NULL)))
);

CREATE TABLE public.assessment_options (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    question_id uuid NOT NULL,
    option_text text NOT NULL,
    is_correct boolean DEFAULT false NOT NULL,
    order_index integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.assessment_questions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    assessment_id uuid NOT NULL,
    question_text text NOT NULL,
    difficulty text DEFAULT 'medium'::text NOT NULL,
    skill_tag text DEFAULT 'general'::text NOT NULL,
    explanation text,
    order_index integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT assessment_questions_difficulty_check CHECK ((difficulty = ANY (ARRAY['easy'::text, 'medium'::text, 'hard'::text])))
);

CREATE TABLE public.assessments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    slug text NOT NULL,
    title text NOT NULL,
    description text,
    category text DEFAULT 'general'::text NOT NULL,
    difficulty_profile jsonb DEFAULT '{"easy": 4, "hard": 2, "medium": 4}'::jsonb NOT NULL,
    time_limit_seconds integer DEFAULT 420 NOT NULL,
    xp_completion integer DEFAULT 50 NOT NULL,
    xp_share integer DEFAULT 25 NOT NULL,
    cover_emoji text DEFAULT '🎯'::text,
    is_active boolean DEFAULT true NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.audit_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    action text NOT NULL,
    table_name text,
    record_id uuid,
    old_data jsonb,
    new_data jsonb,
    ip_address text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.auth_phone_lockouts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    phone text NOT NULL,
    locked_at timestamp with time zone DEFAULT now() NOT NULL,
    locked_until timestamp with time zone NOT NULL,
    reason text DEFAULT 'too_many_otp_attempts'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.auth_whatsapp_otp (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    phone text NOT NULL,
    code_hash text NOT NULL,
    purpose text DEFAULT 'login'::text NOT NULL,
    full_name text,
    attempts integer DEFAULT 0 NOT NULL,
    max_attempts integer DEFAULT 5 NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    consumed_at timestamp with time zone,
    ip_address text,
    user_agent text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.automation_actions_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    insight_id uuid,
    action_type text NOT NULL,
    action_payload jsonb DEFAULT '{}'::jsonb NOT NULL,
    note text,
    status text DEFAULT 'success'::text NOT NULL,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.automation_insights (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    insight_type text NOT NULL,
    severity text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    recommendation text NOT NULL,
    metric_key text NOT NULL,
    metric_value numeric,
    comparison_value numeric,
    delta_percentage numeric,
    context_data jsonb DEFAULT '{}'::jsonb NOT NULL,
    status text DEFAULT 'active'::text NOT NULL,
    dedupe_key text NOT NULL,
    detected_at timestamp with time zone DEFAULT now() NOT NULL,
    resolved_at timestamp with time zone,
    dismissed_at timestamp with time zone,
    last_seen_at timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT automation_insights_severity_check CHECK ((severity = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text, 'critical'::text]))),
    CONSTRAINT automation_insights_status_check CHECK ((status = ANY (ARRAY['active'::text, 'dismissed'::text, 'resolved'::text])))
);

CREATE TABLE public.automation_rules (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    rule_key text NOT NULL,
    rule_name text NOT NULL,
    rule_group text NOT NULL,
    threshold_value numeric NOT NULL,
    comparison_operator text DEFAULT '<'::text NOT NULL,
    lookback_days integer DEFAULT 7 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    recommendation_template text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT automation_rules_comparison_operator_check CHECK ((comparison_operator = ANY (ARRAY['<'::text, '<='::text, '>'::text, '>='::text, '='::text]))),
    CONSTRAINT automation_rules_lookback_days_check CHECK (((lookback_days >= 1) AND (lookback_days <= 90)))
);

CREATE TABLE public.automation_snapshots (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    snapshot_date date NOT NULL,
    metrics_payload jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.blog_posts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    slug text NOT NULL,
    title text NOT NULL,
    excerpt text,
    content text NOT NULL,
    cover_image text,
    category text DEFAULT 'general'::text NOT NULL,
    tags text[] DEFAULT '{}'::text[],
    author_name text DEFAULT 'MasterEduPath'::text NOT NULL,
    author_id uuid,
    status text DEFAULT 'draft'::text NOT NULL,
    published_at timestamp with time zone,
    meta_title text,
    meta_description text,
    reading_minutes integer DEFAULT 5,
    view_count integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT blog_posts_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'published'::text, 'archived'::text])))
);

CREATE TABLE public.bonus_drop_views (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bonus_drop_id uuid NOT NULL,
    user_id uuid NOT NULL,
    seen_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.bonus_drops (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    subtitle text,
    notification_message text DEFAULT '🔥 الساعة الذهبية بدأت!'::text NOT NULL,
    multiplier_type text DEFAULT 'both'::text NOT NULL,
    multiplier_value numeric(4,2) DEFAULT 2.0 NOT NULL,
    starts_at timestamp with time zone NOT NULL,
    ends_at timestamp with time zone NOT NULL,
    banner_color text DEFAULT 'gradient-amber'::text NOT NULL,
    emoji text DEFAULT '🔥'::text NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT bonus_drops_multiplier_type_check CHECK ((multiplier_type = ANY (ARRAY['xp'::text, 'points'::text, 'both'::text]))),
    CONSTRAINT bonus_drops_multiplier_value_check CHECK (((multiplier_value >= (1)::numeric) AND (multiplier_value <= (10)::numeric)))
);

CREATE TABLE public.chat_conversations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    admin_id uuid,
    subject text DEFAULT 'محادثة جديدة'::text NOT NULL,
    status text DEFAULT 'open'::text NOT NULL,
    last_message text,
    last_message_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.chat_messages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    conversation_id uuid NOT NULL,
    sender_id uuid NOT NULL,
    sender_type text DEFAULT 'client'::text NOT NULL,
    content text NOT NULL,
    read_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.contract_evidence (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    contract_id uuid NOT NULL,
    signature_id uuid,
    contract_version_id uuid,
    signed_at timestamp with time zone NOT NULL,
    signer_name text NOT NULL,
    signer_email text,
    signer_id_number text,
    signer_user_id uuid,
    ip_address text,
    user_agent text,
    accepted_terms jsonb,
    content_snapshot text,
    content_sha256 text NOT NULL,
    pdf_storage_path text,
    pdf_sha256 text,
    evidence_sha256 text,
    verification_token text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL
);

CREATE TABLE public.contract_otp_codes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    contract_id uuid NOT NULL,
    email text NOT NULL,
    code_hash text NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    attempts integer DEFAULT 0 NOT NULL,
    used boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.contract_signatures (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    contract_id uuid NOT NULL,
    signer_user_id uuid,
    signer_name text NOT NULL,
    signer_email text,
    signer_id_number text,
    signature_text text NOT NULL,
    ip_address text,
    user_agent text,
    accepted_terms jsonb DEFAULT '[]'::jsonb,
    comments text,
    signed_at timestamp with time zone DEFAULT now() NOT NULL,
    signature_image text
);

CREATE TABLE public.contract_timeline (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    contract_id uuid NOT NULL,
    actor_id uuid,
    actor_type text DEFAULT 'system'::text NOT NULL,
    action_type text NOT NULL,
    action_label text NOT NULL,
    description text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.contract_versions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    contract_id uuid NOT NULL,
    version_no integer DEFAULT 1 NOT NULL,
    output_type text NOT NULL,
    content_snapshot text,
    content_sha256 text,
    pdf_storage_path text,
    pdf_size_bytes bigint,
    generator text DEFAULT 'browserless'::text NOT NULL,
    generated_at timestamp with time zone DEFAULT now() NOT NULL,
    generated_by uuid,
    based_on_signature_id uuid,
    is_current boolean DEFAULT false NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    CONSTRAINT contract_versions_output_type_check CHECK ((output_type = ANY (ARRAY['draft'::text, 'preview'::text, 'signed_final'::text])))
);

CREATE TABLE public.contracts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    contract_number text DEFAULT ('CTR-'::text || lpad((floor((random() * (100000)::double precision)))::text, 5, '0'::text)) NOT NULL,
    order_id uuid,
    user_id uuid,
    title text NOT NULL,
    content text,
    status text DEFAULT 'draft'::text,
    signed_at timestamp with time zone,
    expires_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    service_order_id uuid,
    customer_id uuid,
    service_name text,
    service_type text,
    total_amount numeric DEFAULT 0,
    currency text DEFAULT 'SAR'::text,
    payment_terms text,
    delivery_date date,
    client_full_name text,
    client_id_number text,
    client_email text,
    client_phone text,
    sent_at timestamp with time zone,
    variables jsonb DEFAULT '{}'::jsonb,
    metadata jsonb DEFAULT '{}'::jsonb,
    signed_pdf_path text,
    signed_pdf_generated_at timestamp with time zone,
    template_type text DEFAULT 'academic'::text,
    version integer DEFAULT 1 NOT NULL,
    parent_contract_id uuid,
    content_sha256 text,
    locked_at timestamp with time zone,
    evidence_id uuid,
    cancellation_reason text,
    cancelled_by uuid,
    current_version_id uuid,
    verification_token text DEFAULT encode(extensions.gen_random_bytes(16), 'hex'::text) NOT NULL,
    publication_id uuid,
    CONSTRAINT contracts_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'pending_signature'::text, 'signed'::text, 'active'::text, 'completed'::text, 'cancelled'::text, 'expired'::text]))),
    CONSTRAINT contracts_template_type_check CHECK ((template_type = ANY (ARRAY['academic'::text, 'translation'::text, 'consulting'::text, 'corporate'::text, 'financing'::text])))
);

CREATE TABLE public.customers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    name text NOT NULL,
    email text,
    phone text,
    company text,
    notes text,
    status text DEFAULT 'active'::text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    customer_code text,
    referral_code text,
    CONSTRAINT customers_status_check CHECK ((status = ANY (ARRAY['active'::text, 'inactive'::text, 'blocked'::text])))
);

CREATE TABLE public.cv_purchases (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    cv_id uuid NOT NULL,
    template_key text NOT NULL,
    amount numeric(10,2) DEFAULT 0 NOT NULL,
    was_free boolean DEFAULT false NOT NULL,
    free_reason text,
    payment_method text DEFAULT 'wallet'::text NOT NULL,
    wallet_transaction_id uuid,
    payment_intent_id uuid,
    status text DEFAULT 'completed'::text NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT cv_purchases_payment_method_check CHECK ((payment_method = ANY (ARRAY['wallet'::text, 'gateway'::text, 'manual'::text]))),
    CONSTRAINT cv_purchases_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'completed'::text, 'refunded'::text, 'failed'::text])))
);

CREATE TABLE public.deadline_reminders (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    service_order_id uuid NOT NULL,
    deadline_at timestamp with time zone NOT NULL,
    reminder_type text NOT NULL,
    due_at timestamp with time zone NOT NULL,
    sent boolean DEFAULT false NOT NULL,
    sent_at timestamp with time zone,
    channel text DEFAULT 'in_app'::text NOT NULL,
    error_message text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT deadline_reminders_channel_check CHECK ((channel = ANY (ARRAY['in_app'::text, 'email'::text, 'both'::text]))),
    CONSTRAINT deadline_reminders_reminder_type_check CHECK ((reminder_type = ANY (ARRAY['3_days'::text, '1_day'::text, '3_hours'::text, 'overdue'::text])))
);

CREATE TABLE public.email_send_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    message_id text,
    template_name text NOT NULL,
    recipient_email text NOT NULL,
    status text NOT NULL,
    error_message text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT email_send_log_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'sent'::text, 'suppressed'::text, 'failed'::text, 'bounced'::text, 'complained'::text, 'dlq'::text])))
);

CREATE TABLE public.email_send_state (
    id integer DEFAULT 1 NOT NULL,
    retry_after_until timestamp with time zone,
    batch_size integer DEFAULT 10 NOT NULL,
    send_delay_ms integer DEFAULT 200 NOT NULL,
    auth_email_ttl_minutes integer DEFAULT 15 NOT NULL,
    transactional_email_ttl_minutes integer DEFAULT 60 NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT email_send_state_id_check CHECK ((id = 1))
);

CREATE TABLE public.email_templates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    subject text NOT NULL,
    body text NOT NULL,
    variables jsonb DEFAULT '[]'::jsonb,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.email_unsubscribe_tokens (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    token text NOT NULL,
    email text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    used_at timestamp with time zone
);

CREATE TABLE public.experiment_assignments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    experiment_id uuid NOT NULL,
    variant_id uuid NOT NULL,
    user_id uuid,
    anonymous_id text,
    assigned_at timestamp with time zone DEFAULT now() NOT NULL,
    source_context jsonb DEFAULT '{}'::jsonb NOT NULL,
    CONSTRAINT experiment_assignments_check CHECK (((user_id IS NOT NULL) OR (anonymous_id IS NOT NULL)))
);

CREATE TABLE public.experiment_audit_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    experiment_id uuid,
    action_type text NOT NULL,
    actor_user_id uuid,
    before_state jsonb,
    after_state jsonb,
    note text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.experiment_events (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    experiment_id uuid NOT NULL,
    variant_id uuid NOT NULL,
    user_id uuid,
    anonymous_id text,
    event_type text NOT NULL,
    metric_value numeric,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.experiment_results_snapshots (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    experiment_id uuid NOT NULL,
    snapshot_at timestamp with time zone DEFAULT now() NOT NULL,
    results_payload jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.experiment_variants (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    experiment_id uuid NOT NULL,
    variant_key text NOT NULL,
    name text NOT NULL,
    is_control boolean DEFAULT false NOT NULL,
    allocation_percentage numeric(5,2) NOT NULL,
    config_payload jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT experiment_variants_allocation_percentage_check CHECK (((allocation_percentage >= (0)::numeric) AND (allocation_percentage <= (100)::numeric)))
);

CREATE TABLE public.financing_acknowledgments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    application_id uuid NOT NULL,
    user_id uuid NOT NULL,
    ack_type text NOT NULL,
    ack_title text NOT NULL,
    signer_name text NOT NULL,
    signer_id_number text,
    accepted_clauses jsonb DEFAULT '[]'::jsonb NOT NULL,
    signature_text text NOT NULL,
    signed_at timestamp with time zone DEFAULT now() NOT NULL,
    ip_address text,
    user_agent text,
    evidence_sha256 text NOT NULL,
    locked boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.financing_applications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    order_id uuid,
    invoice_id uuid,
    total_amount numeric(12,2) NOT NULL,
    down_payment numeric(12,2) DEFAULT 0 NOT NULL,
    remaining_amount numeric(12,2) DEFAULT 0 NOT NULL,
    monthly_installment numeric(12,2) DEFAULT 0 NOT NULL,
    duration_months integer DEFAULT 12 NOT NULL,
    funding_type text DEFAULT 'wallet_credit'::text NOT NULL,
    status public.financing_status DEFAULT 'draft'::public.financing_status NOT NULL,
    score integer DEFAULT 0,
    risk_level public.financing_risk_level DEFAULT 'unknown'::public.financing_risk_level NOT NULL,
    applicant_full_name text,
    applicant_id_number text,
    applicant_phone text,
    applicant_email text,
    employer_name text,
    monthly_income numeric(12,2),
    monthly_commitments numeric(12,2),
    city text,
    notes text,
    approved_at timestamp with time zone,
    approved_by uuid,
    rejected_at timestamp with time zone,
    rejection_reason text,
    activated_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    contract_id uuid,
    contract_pdf_url text,
    has_guarantor boolean DEFAULT false NOT NULL,
    guarantor_full_name text,
    guarantor_id_number text,
    guarantor_phone text,
    guarantor_relation text,
    guarantor_employer text,
    guarantor_monthly_income numeric(12,2),
    guarantor_city text,
    guarantor_consent boolean DEFAULT false NOT NULL,
    auto_debit_enabled boolean DEFAULT true NOT NULL,
    ai_risk_score integer,
    ai_risk_analysis jsonb DEFAULT '{}'::jsonb,
    ai_scored_at timestamp with time zone,
    client_signature_data text,
    client_signed_at timestamp with time zone,
    client_signed_ip text,
    CONSTRAINT financing_applications_duration_months_check CHECK ((duration_months > 0)),
    CONSTRAINT financing_applications_total_amount_check CHECK ((total_amount >= (2500)::numeric))
);

CREATE TABLE public.financing_contracts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    application_id uuid NOT NULL,
    contract_number text NOT NULL,
    contract_text text,
    signed_at timestamp with time zone,
    signed_ip text,
    signed_user_agent text,
    status public.financing_contract_status DEFAULT 'draft'::public.financing_contract_status NOT NULL,
    pdf_storage_path text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.financing_documents (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    application_id uuid NOT NULL,
    document_type public.financing_doc_type NOT NULL,
    file_url text NOT NULL,
    file_name text,
    mime_type text,
    status public.financing_doc_status DEFAULT 'pending'::public.financing_doc_status NOT NULL,
    review_note text,
    reviewed_by uuid,
    reviewed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    ai_extracted_data jsonb DEFAULT '{}'::jsonb,
    ai_extracted_at timestamp with time zone
);

CREATE TABLE public.financing_installments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    application_id uuid NOT NULL,
    month_number integer NOT NULL,
    amount numeric(12,2) NOT NULL,
    due_date date NOT NULL,
    status public.financing_installment_status DEFAULT 'pending'::public.financing_installment_status NOT NULL,
    paid_at timestamp with time zone,
    paid_amount numeric(12,2),
    wallet_transaction_id uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.financing_payment_receipts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    application_id uuid NOT NULL,
    user_id uuid NOT NULL,
    payment_method text NOT NULL,
    amount numeric(12,2) NOT NULL,
    bank_name text,
    reference_number text,
    transfer_date date,
    receipt_file_url text,
    receipt_file_name text,
    status text DEFAULT 'pending'::text NOT NULL,
    reviewer_note text,
    reviewed_by uuid,
    reviewed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT financing_payment_receipts_amount_check CHECK ((amount > (0)::numeric)),
    CONSTRAINT financing_payment_receipts_payment_method_check CHECK ((payment_method = ANY (ARRAY['wallet'::text, 'bank_transfer'::text]))),
    CONSTRAINT financing_payment_receipts_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text])))
);

CREATE TABLE public.financing_status_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    application_id uuid NOT NULL,
    old_status public.financing_status,
    new_status public.financing_status NOT NULL,
    changed_by uuid,
    note text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.financing_whatsapp_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    application_id uuid,
    message_type text NOT NULL,
    recipient_phone text NOT NULL,
    message_body text,
    delivery_status text DEFAULT 'queued'::text NOT NULL,
    error_message text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.gateway_webhooks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    provider text DEFAULT 'paylink'::text NOT NULL,
    event_type text,
    external_transaction_no text,
    internal_order_number text,
    payment_intent_id uuid,
    payload jsonb NOT NULL,
    headers jsonb,
    signature_status text DEFAULT 'unverified'::text NOT NULL,
    processed boolean DEFAULT false NOT NULL,
    processed_at timestamp with time zone,
    error_message text,
    ip_address text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.group_order_audit (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    group_order_id uuid NOT NULL,
    actor_id uuid,
    action_type text NOT NULL,
    description text,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.group_order_members (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    group_order_id uuid NOT NULL,
    user_id uuid NOT NULL,
    status public.group_member_status DEFAULT 'joined'::public.group_member_status NOT NULL,
    amount_due numeric(12,2) NOT NULL,
    amount_paid numeric(12,2) DEFAULT 0 NOT NULL,
    paid_via text,
    wallet_transaction_id uuid,
    payment_intent_id uuid,
    joined_at timestamp with time zone DEFAULT now() NOT NULL,
    paid_at timestamp with time zone,
    refunded_at timestamp with time zone,
    is_creator boolean DEFAULT false NOT NULL
);

CREATE TABLE public.group_orders (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    creator_id uuid NOT NULL,
    service_id uuid NOT NULL,
    service_name text,
    title text NOT NULL,
    description text,
    seat_price numeric(12,2) NOT NULL,
    currency text DEFAULT 'SAR'::text NOT NULL,
    max_members integer NOT NULL,
    min_members integer DEFAULT 2 NOT NULL,
    invite_code text NOT NULL,
    status public.group_order_status DEFAULT 'open'::public.group_order_status NOT NULL,
    deadline timestamp with time zone,
    service_order_id uuid,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    started_at timestamp with time zone,
    cancelled_at timestamp with time zone,
    CONSTRAINT group_orders_max_members_check CHECK (((max_members >= 2) AND (max_members <= 50))),
    CONSTRAINT group_orders_min_members_check CHECK ((min_members >= 2)),
    CONSTRAINT group_orders_seat_price_check CHECK ((seat_price > (0)::numeric))
);

CREATE TABLE public.growth_events (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    event_type text NOT NULL,
    source text DEFAULT 'direct'::text NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    dedupe_key text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.inbox_messages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    sender_name text NOT NULL,
    sender_email text NOT NULL,
    sender_phone text,
    subject text,
    message text NOT NULL,
    form_type text DEFAULT 'contact'::text NOT NULL,
    service_type text,
    source_page text,
    status text DEFAULT 'new'::text NOT NULL,
    priority text DEFAULT 'normal'::text NOT NULL,
    assigned_to uuid,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    reply_count integer DEFAULT 0 NOT NULL,
    last_activity_at timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    is_pinned boolean DEFAULT false NOT NULL,
    is_starred boolean DEFAULT false NOT NULL,
    is_archived boolean DEFAULT false NOT NULL,
    read_at timestamp with time zone,
    tags text[] DEFAULT '{}'::text[] NOT NULL
);

CREATE TABLE public.inbox_notes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    message_id uuid NOT NULL,
    admin_id uuid,
    admin_name text,
    body text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.inbox_replies (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    message_id uuid NOT NULL,
    admin_id uuid,
    admin_name text,
    admin_email text,
    body text NOT NULL,
    delivery_status text DEFAULT 'pending'::text NOT NULL,
    delivery_error text,
    external_message_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.inbox_reply_templates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    body text NOT NULL,
    category text,
    shortcut text,
    use_count integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.invoice_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    invoice_id uuid NOT NULL,
    item_name text NOT NULL,
    description text,
    quantity integer DEFAULT 1,
    unit_price numeric(12,2) NOT NULL,
    discount_percentage numeric(5,2) DEFAULT 0,
    discount_amount numeric(12,2) DEFAULT 0,
    total_price numeric(12,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.invoice_payments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    invoice_id uuid NOT NULL,
    amount numeric NOT NULL,
    payment_method text DEFAULT 'bank_transfer'::text NOT NULL,
    payment_date date DEFAULT CURRENT_DATE NOT NULL,
    reference_number text,
    status text DEFAULT 'completed'::text NOT NULL,
    notes text,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    payment_intent_id uuid,
    CONSTRAINT invoice_payments_amount_check CHECK ((amount > (0)::numeric))
);

CREATE TABLE public.invoice_timeline (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    invoice_id uuid NOT NULL,
    action_type text NOT NULL,
    action_label text NOT NULL,
    action_description text,
    actor_user_id uuid,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.invoices (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    invoice_number text DEFAULT ('INV-'::text || lpad((floor((random() * (1000000)::double precision)))::text, 6, '0'::text)) NOT NULL,
    order_id uuid,
    user_id uuid,
    customer_id uuid,
    subtotal numeric(12,2) DEFAULT 0,
    tax_amount numeric(12,2) DEFAULT 0,
    discount_amount numeric(12,2) DEFAULT 0,
    total_amount numeric(12,2) DEFAULT 0,
    status text DEFAULT 'draft'::text,
    due_date date,
    paid_at timestamp with time zone,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    issue_date date DEFAULT CURRENT_DATE NOT NULL,
    paid_amount numeric DEFAULT 0 NOT NULL,
    currency text DEFAULT 'SAR'::text NOT NULL,
    terms text,
    customer_name text,
    customer_email text,
    customer_phone text,
    sent_at timestamp with time zone,
    remaining_amount numeric GENERATED ALWAYS AS ((COALESCE(total_amount, (0)::numeric) - COALESCE(paid_amount, (0)::numeric))) STORED,
    pdf_storage_path text,
    pdf_generated_at timestamp with time zone,
    publication_id uuid,
    CONSTRAINT invoices_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'pending'::text, 'sent'::text, 'partially_paid'::text, 'paid'::text, 'overdue'::text, 'cancelled'::text])))
);

CREATE TABLE public.member_referrals (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    referrer_user_id uuid NOT NULL,
    referred_user_id uuid NOT NULL,
    referral_code text NOT NULL,
    membership_id uuid,
    plan_id uuid,
    status text DEFAULT 'pending'::text NOT NULL,
    commission_amount numeric DEFAULT 0 NOT NULL,
    commission_paid_at timestamp with time zone,
    wallet_transaction_id uuid,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.membership_history (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    membership_id uuid NOT NULL,
    user_id uuid NOT NULL,
    action text NOT NULL,
    actor_id uuid,
    actor_type text DEFAULT 'system'::text NOT NULL,
    description text,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.membership_plans (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code text NOT NULL,
    name_ar text NOT NULL,
    name_en text NOT NULL,
    description text,
    price numeric DEFAULT 0 NOT NULL,
    currency text DEFAULT 'SAR'::text NOT NULL,
    duration_months integer DEFAULT 12 NOT NULL,
    discount_percentage numeric DEFAULT 0 NOT NULL,
    cashback_amount numeric DEFAULT 0 NOT NULL,
    priority_level integer DEFAULT 0 NOT NULL,
    badge_color text,
    benefits jsonb DEFAULT '[]'::jsonb,
    is_active boolean DEFAULT true NOT NULL,
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    referral_commission_percentage numeric DEFAULT 10 NOT NULL,
    referral_commission_fixed numeric DEFAULT 0 NOT NULL
);

CREATE TABLE public.notifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    message text,
    type text DEFAULT 'info'::text,
    target_audience text DEFAULT 'all'::text,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT notifications_type_check CHECK ((type = ANY (ARRAY['info'::text, 'success'::text, 'warning'::text, 'error'::text])))
);

CREATE TABLE public.order_attachments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_id uuid NOT NULL,
    user_id uuid NOT NULL,
    file_name text NOT NULL,
    file_size integer NOT NULL,
    file_type text,
    storage_path text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    is_delivery boolean DEFAULT false NOT NULL,
    uploaded_by_admin boolean DEFAULT false NOT NULL,
    service_order_id uuid
);

CREATE TABLE public.order_timeline (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_id uuid NOT NULL,
    title text DEFAULT ''::text NOT NULL,
    description text,
    status text NOT NULL,
    scheduled_date date,
    completed_date date,
    actor_type text DEFAULT 'system'::text NOT NULL,
    actor_name text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.payment_attempts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    payment_intent_id uuid NOT NULL,
    attempt_no integer DEFAULT 1 NOT NULL,
    action text NOT NULL,
    request_payload jsonb,
    response_payload jsonb,
    http_status integer,
    status text DEFAULT 'pending'::text NOT NULL,
    error_message text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.payment_intents (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    service_order_id uuid,
    invoice_id uuid,
    contract_id uuid,
    provider text DEFAULT 'paylink'::text NOT NULL,
    provider_mode text DEFAULT 'hosted'::text NOT NULL,
    internal_order_number text NOT NULL,
    external_transaction_no text,
    external_invoice_id text,
    amount numeric(14,2) NOT NULL,
    currency text DEFAULT 'SAR'::text NOT NULL,
    status text DEFAULT 'created'::text NOT NULL,
    purpose text NOT NULL,
    payment_method_type text,
    checkout_url text,
    return_url text,
    callback_url text,
    expires_at timestamp with time zone,
    succeeded_at timestamp with time zone,
    failed_at timestamp with time zone,
    failure_reason text,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT payment_intents_amount_check CHECK ((amount > (0)::numeric))
);

CREATE TABLE public.payment_reconciliation_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    run_id uuid NOT NULL,
    payment_intent_id uuid,
    external_transaction_no text,
    internal_order_number text,
    expected_amount numeric(14,2),
    actual_amount numeric(14,2),
    expected_status text,
    actual_status text,
    matched boolean DEFAULT false NOT NULL,
    mismatch_reason text,
    raw_external jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.payment_reconciliation_runs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    provider text DEFAULT 'paylink'::text NOT NULL,
    run_type text DEFAULT 'manual'::text NOT NULL,
    status text DEFAULT 'running'::text NOT NULL,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    finished_at timestamp with time zone,
    total_checked integer DEFAULT 0 NOT NULL,
    total_matched integer DEFAULT 0 NOT NULL,
    total_mismatched integer DEFAULT 0 NOT NULL,
    summary jsonb,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.payment_transactions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    invoice_id uuid,
    type text NOT NULL,
    amount numeric(12,2) NOT NULL,
    balance_after numeric(12,2),
    description text,
    status text DEFAULT 'completed'::text,
    reference text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT payment_transactions_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'completed'::text, 'failed'::text, 'reversed'::text]))),
    CONSTRAINT payment_transactions_type_check CHECK ((type = ANY (ARRAY['credit'::text, 'debit'::text, 'refund'::text])))
);

CREATE TABLE public.point_transactions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    points integer NOT NULL,
    type text NOT NULL,
    source_type text NOT NULL,
    source_id text,
    description text,
    multiplier numeric DEFAULT 1.0 NOT NULL,
    base_points integer,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    balance_after integer,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT point_transactions_type_check CHECK ((type = ANY (ARRAY['earn'::text, 'spend'::text, 'bonus'::text, 'penalty'::text, 'adjustment'::text, 'refund'::text])))
);

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    full_name text,
    phone text,
    avatar_url text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.question_categories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name_ar text NOT NULL,
    name_en text,
    parent_id uuid,
    icon text,
    sort_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.question_choices (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    question_id uuid NOT NULL,
    choice_text text NOT NULL,
    is_correct boolean DEFAULT false NOT NULL,
    order_index integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.question_tags (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    question_id uuid NOT NULL,
    tag text NOT NULL
);

CREATE TABLE public.questions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    subject_id uuid NOT NULL,
    question_text text NOT NULL,
    explanation text,
    question_type text DEFAULT 'mcq'::text NOT NULL,
    difficulty text DEFAULT 'medium'::text NOT NULL,
    linked_assessment_id uuid,
    is_active boolean DEFAULT true NOT NULL,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT questions_difficulty_check CHECK ((difficulty = ANY (ARRAY['easy'::text, 'medium'::text, 'hard'::text]))),
    CONSTRAINT questions_question_type_check CHECK ((question_type = ANY (ARRAY['mcq'::text, 'true_false'::text])))
);

CREATE SEQUENCE public.receipt_no_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE public.referral_audit_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    action_type text NOT NULL,
    referral_id uuid,
    referrer_user_id uuid,
    referred_user_id uuid,
    membership_id uuid,
    amount numeric DEFAULT 0,
    reason text,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.referral_clicks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    ref_code text NOT NULL,
    ip text,
    user_agent text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    session_id text,
    tracking_started_at timestamp with time zone
);

CREATE TABLE public.referral_conversions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    ref_code text NOT NULL,
    user_id uuid NOT NULL,
    order_id uuid,
    type text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT referral_conversions_type_check CHECK ((type = ANY (ARRAY['signup'::text, 'order'::text])))
);

CREATE TABLE public.referral_events (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    ref_code text NOT NULL,
    ip_address text,
    user_agent text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.referral_viral_rewards (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    referral_id uuid NOT NULL,
    referrer_user_id uuid NOT NULL,
    referred_user_id uuid NOT NULL,
    reward_type text NOT NULL,
    points_awarded integer DEFAULT 0 NOT NULL,
    xp_awarded integer DEFAULT 0 NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.referrals (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    referrer_user_id uuid NOT NULL,
    referred_user_id uuid NOT NULL,
    referral_code text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    completed_at timestamp with time zone,
    CONSTRAINT no_self_referral CHECK ((referrer_user_id <> referred_user_id)),
    CONSTRAINT referrals_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'completed'::text, 'invalid'::text])))
);

CREATE TABLE public.research_publication_messages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    publication_id uuid NOT NULL,
    sender_id uuid NOT NULL,
    sender_type text DEFAULT 'client'::text NOT NULL,
    message text NOT NULL,
    attachments jsonb DEFAULT '[]'::jsonb,
    read_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.research_publication_quotes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    publication_id uuid NOT NULL,
    quote_number text DEFAULT ((('QT-'::text || to_char(now(), 'YYMMDD'::text)) || '-'::text) || substr((gen_random_uuid())::text, 1, 6)) NOT NULL,
    amount numeric(12,2) NOT NULL,
    tax_amount numeric(12,2) DEFAULT 0 NOT NULL,
    total_amount numeric(12,2) NOT NULL,
    currency text DEFAULT 'SAR'::text NOT NULL,
    description text,
    valid_until date,
    status text DEFAULT 'draft'::text NOT NULL,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT research_publication_quotes_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'sent'::text, 'accepted'::text, 'rejected'::text, 'expired'::text])))
);

CREATE TABLE public.research_publications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    request_number text DEFAULT ((('RP-'::text || to_char(now(), 'YYMMDD'::text)) || '-'::text) || substr((gen_random_uuid())::text, 1, 6)) NOT NULL,
    title text NOT NULL,
    field text NOT NULL,
    language text DEFAULT 'ar'::text NOT NULL,
    service_type text DEFAULT 'publication'::text NOT NULL,
    target_journal text,
    journal_rank text,
    abstract text NOT NULL,
    keywords text,
    authors text,
    page_count integer,
    file_url text,
    notes text,
    client_name text NOT NULL,
    client_phone text NOT NULL,
    client_email text,
    status text DEFAULT 'new'::text NOT NULL,
    priority text DEFAULT 'normal'::text NOT NULL,
    estimated_amount numeric(12,2),
    final_amount numeric(12,2),
    expected_delivery_date date,
    admin_notes text,
    assigned_to uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    attachments jsonb DEFAULT '[]'::jsonb NOT NULL
);

CREATE TABLE public.service_categories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    name_ar text,
    description text,
    icon text,
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    parent_id uuid,
    slug text,
    color text,
    is_active boolean DEFAULT true NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.service_order_admin_notes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_id uuid NOT NULL,
    author_id uuid NOT NULL,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.service_order_messages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_id uuid NOT NULL,
    sender_id uuid NOT NULL,
    sender_type text DEFAULT 'client'::text NOT NULL,
    content text NOT NULL,
    read_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.service_order_timeline (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_id uuid NOT NULL,
    status text NOT NULL,
    note text,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.service_orders (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tracking_id text DEFAULT ('ORD-'::text || lpad((floor((random() * (1000000)::double precision)))::text, 6, '0'::text)) NOT NULL,
    user_id uuid,
    customer_id uuid,
    service_id uuid,
    service_name text,
    current_status text DEFAULT 'pending'::text,
    priority text DEFAULT 'normal'::text,
    total_amount numeric(12,2) DEFAULT 0,
    paid_amount numeric(12,2) DEFAULT 0,
    notes text,
    deadline timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    quote_status text,
    quote_notes text,
    quote_sent_at timestamp with time zone,
    assistance_type text,
    lifecycle_status public.order_lifecycle_status DEFAULT 'received'::public.order_lifecycle_status NOT NULL,
    signed_contract_id uuid,
    active_invoice_id uuid,
    progress_percentage integer DEFAULT 0 NOT NULL,
    client_confirmed_at timestamp with time zone,
    contract_pending_at timestamp with time zone,
    contract_signed_at timestamp with time zone,
    payment_completed_at timestamp with time zone,
    execution_started_at timestamp with time zone,
    delivered_at timestamp with time zone,
    completed_at timestamp with time zone,
    cancelled_at timestamp with time zone,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    estimated_amount numeric,
    quantity numeric,
    quantity_unit text,
    preferred_language text,
    quote_response_deadline timestamp with time zone,
    contract_signature_deadline timestamp with time zone,
    payment_deadline timestamp with time zone,
    price_approval_status text DEFAULT 'not_requested'::text NOT NULL,
    client_estimated_price numeric(12,2),
    admin_approved_price numeric(12,2),
    price_approval_requested_at timestamp with time zone,
    price_approved_at timestamp with time zone,
    price_approval_note text,
    price_reviewed_by uuid,
    CONSTRAINT service_orders_price_approval_status_check CHECK ((price_approval_status = ANY (ARRAY['not_requested'::text, 'pending'::text, 'approved'::text, 'rejected'::text]))),
    CONSTRAINT service_orders_priority_check CHECK ((priority = ANY (ARRAY['low'::text, 'normal'::text, 'high'::text, 'urgent'::text])))
);

COMMENT ON COLUMN public.service_orders.assistance_type IS 'نوع المساعدة الأكاديمية: review, proofreading, improvement, guidance, analysis, structuring';

CREATE TABLE public.services (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    category_id uuid,
    name text NOT NULL,
    name_ar text,
    description text,
    price numeric(12,2),
    unit text DEFAULT 'page'::text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    is_group_eligible boolean DEFAULT false NOT NULL,
    group_min_members integer DEFAULT 2 NOT NULL,
    group_max_members integer DEFAULT 10 NOT NULL,
    group_seat_price numeric(12,2),
    slug text,
    image_url text,
    is_featured boolean DEFAULT false NOT NULL,
    description_ar text,
    subcategory_id uuid,
    sort_order integer DEFAULT 0 NOT NULL,
    dynamic_fields jsonb DEFAULT '[]'::jsonb NOT NULL,
    quantity_unit_label text,
    default_quantity integer DEFAULT 1 NOT NULL
);

CREATE TABLE public.smart_editor_usage (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    operation text NOT NULL,
    mode text DEFAULT 'standard'::text NOT NULL,
    input_length integer DEFAULT 0 NOT NULL,
    output_length integer DEFAULT 0 NOT NULL,
    cost numeric DEFAULT 0 NOT NULL,
    was_free boolean DEFAULT false NOT NULL,
    wallet_transaction_id uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT smart_editor_usage_mode_check CHECK ((mode = ANY (ARRAY['standard'::text, 'pro'::text]))),
    CONSTRAINT smart_editor_usage_operation_check CHECK ((operation = ANY (ARRAY['correct'::text, 'rephrase'::text, 'academic'::text, 'shorten'::text, 'expand'::text])))
);

CREATE TABLE public.spin_attempts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    email text,
    phone text,
    prize text,
    claimed boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.statistical_analyses (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    title text DEFAULT 'تحليل إحصائي'::text NOT NULL,
    file_name text,
    file_size integer,
    row_count integer DEFAULT 0,
    column_count integer DEFAULT 0,
    columns_meta jsonb DEFAULT '[]'::jsonb NOT NULL,
    data_sample jsonb DEFAULT '[]'::jsonb,
    analysis_type text,
    analysis_params jsonb DEFAULT '{}'::jsonb,
    results jsonb DEFAULT '{}'::jsonb,
    assumptions jsonb DEFAULT '{}'::jsonb,
    interpretation_ar text,
    interpretation_en text,
    language text DEFAULT 'ar'::text NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    is_paid boolean DEFAULT false NOT NULL,
    pdf_purchased boolean DEFAULT false NOT NULL,
    pdf_exports_count integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.study_challenge_attempts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    status text DEFAULT 'in_progress'::text NOT NULL,
    current_day integer DEFAULT 0 NOT NULL,
    streak integer DEFAULT 0 NOT NULL,
    required_minutes integer DEFAULT 30 NOT NULL,
    required_days integer DEFAULT 7 NOT NULL,
    started_on date DEFAULT ((now() AT TIME ZONE 'Asia/Riyadh'::text))::date NOT NULL,
    last_check_in_on date,
    completed_at timestamp with time zone,
    failed_at timestamp with time zone,
    xp_awarded integer DEFAULT 0 NOT NULL,
    points_awarded integer DEFAULT 0 NOT NULL,
    badge_awarded text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.study_challenge_check_ins (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    attempt_id uuid NOT NULL,
    user_id uuid NOT NULL,
    day_number integer NOT NULL,
    check_in_date date NOT NULL,
    minutes_studied integer DEFAULT 30 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.study_sessions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    duration_minutes integer DEFAULT 0 NOT NULL,
    status public.study_session_status DEFAULT 'active'::public.study_session_status NOT NULL,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    completed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    earned_xp integer DEFAULT 0 NOT NULL,
    CONSTRAINT study_sessions_duration_minutes_check CHECK ((duration_minutes >= 0))
);

CREATE TABLE public.subjects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    category_id uuid NOT NULL,
    name_ar text NOT NULL,
    name_en text,
    description text,
    icon text,
    sort_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.support_kb_articles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    category text DEFAULT 'general'::text NOT NULL,
    tags text[] DEFAULT '{}'::text[],
    views integer DEFAULT 0 NOT NULL,
    helpful_count integer DEFAULT 0 NOT NULL,
    is_published boolean DEFAULT true NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.suppressed_emails (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email text NOT NULL,
    reason text NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT suppressed_emails_reason_check CHECK ((reason = ANY (ARRAY['unsubscribe'::text, 'bounce'::text, 'complaint'::text])))
);

CREATE TABLE public.ticket_attachments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    ticket_id uuid NOT NULL,
    user_id uuid NOT NULL,
    uploaded_by_admin boolean DEFAULT false NOT NULL,
    file_name text NOT NULL,
    file_size integer NOT NULL,
    file_type text,
    storage_path text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.ticket_messages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    ticket_id uuid NOT NULL,
    sender_id uuid NOT NULL,
    sender_type text DEFAULT 'client'::text NOT NULL,
    content text NOT NULL,
    read_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.ticket_presence (
    ticket_id uuid NOT NULL,
    user_id uuid NOT NULL,
    user_type text NOT NULL,
    display_name text,
    last_seen_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT ticket_presence_user_type_check CHECK ((user_type = ANY (ARRAY['client'::text, 'admin'::text])))
);

CREATE TABLE public.ticket_quick_replies (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    category text,
    is_active boolean DEFAULT true NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid
);

CREATE TABLE public.ticket_timeline (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    ticket_id uuid NOT NULL,
    actor_id uuid,
    actor_type text DEFAULT 'system'::text NOT NULL,
    action_type text NOT NULL,
    action_label text NOT NULL,
    description text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.ticket_typing (
    ticket_id uuid NOT NULL,
    user_id uuid NOT NULL,
    user_type text NOT NULL,
    is_typing boolean DEFAULT true NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT ticket_typing_user_type_check CHECK ((user_type = ANY (ARRAY['client'::text, 'admin'::text])))
);

CREATE TABLE public.tickets (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    ticket_number text DEFAULT ('TKT-'::text || lpad((floor((random() * (100000)::double precision)))::text, 5, '0'::text)) NOT NULL,
    user_id uuid NOT NULL,
    subject text NOT NULL,
    description text,
    category text DEFAULT 'general'::text,
    priority text DEFAULT 'medium'::text,
    status text DEFAULT 'open'::text,
    assigned_to uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    customer_id uuid,
    related_invoice_id uuid,
    related_order_id uuid,
    last_message_at timestamp with time zone,
    resolved_at timestamp with time zone,
    assigned_admin_id uuid,
    first_response_at timestamp with time zone,
    closed_at timestamp with time zone,
    csat_rating integer,
    csat_comment text,
    csat_submitted_at timestamp with time zone,
    sla_due_at timestamp with time zone,
    auto_created boolean DEFAULT false NOT NULL,
    source text DEFAULT 'manual'::text NOT NULL,
    tags text[] DEFAULT '{}'::text[],
    unread_for_client integer DEFAULT 0 NOT NULL,
    unread_for_admin integer DEFAULT 0 NOT NULL,
    related_contract_id uuid,
    related_payment_id uuid,
    CONSTRAINT tickets_category_check CHECK ((category = ANY (ARRAY['general'::text, 'technical'::text, 'billing'::text, 'complaint'::text, 'suggestion'::text]))),
    CONSTRAINT tickets_csat_rating_check CHECK (((csat_rating >= 1) AND (csat_rating <= 5))),
    CONSTRAINT tickets_priority_check CHECK ((priority = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text, 'critical'::text]))),
    CONSTRAINT tickets_status_check CHECK ((status = ANY (ARRAY['open'::text, 'in_progress'::text, 'waiting'::text, 'resolved'::text, 'closed'::text])))
);

CREATE TABLE public.translation_file_analyses (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    service_order_id uuid,
    user_id uuid NOT NULL,
    file_name text NOT NULL,
    file_type text NOT NULL,
    file_size_bytes bigint DEFAULT 0 NOT NULL,
    word_count integer DEFAULT 0 NOT NULL,
    character_count integer DEFAULT 0 NOT NULL,
    estimated_pages integer DEFAULT 0 NOT NULL,
    words_per_page_standard integer DEFAULT 250 NOT NULL,
    detected_language text DEFAULT 'unknown'::text NOT NULL,
    arabic_ratio numeric(5,2) DEFAULT 0,
    english_ratio numeric(5,2) DEFAULT 0,
    domain text DEFAULT 'general'::text NOT NULL,
    domain_source text DEFAULT 'manual'::text NOT NULL,
    domain_confidence numeric(5,2) DEFAULT 0,
    estimated_price_sar numeric(10,2) DEFAULT 0 NOT NULL,
    per_word_rate_sar numeric(6,3) DEFAULT 0 NOT NULL,
    urgency_multiplier numeric(4,2) DEFAULT 1 NOT NULL,
    domain_multiplier numeric(4,2) DEFAULT 1 NOT NULL,
    approval_status text DEFAULT 'pending'::text NOT NULL,
    approved_price_sar numeric(10,2),
    approved_by uuid,
    approved_at timestamp with time zone,
    admin_notes text,
    confidence_level text DEFAULT 'medium'::text NOT NULL,
    analysis_method text DEFAULT 'browser'::text NOT NULL,
    is_fallback boolean DEFAULT false NOT NULL,
    analysis_notes text,
    text_sample text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.user_answers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    question_id uuid NOT NULL,
    selected_choice_id uuid,
    is_correct boolean DEFAULT false NOT NULL,
    time_spent_seconds integer,
    answered_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.user_inbox_notifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    type text DEFAULT 'info'::text NOT NULL,
    link text,
    metadata jsonb DEFAULT '{}'::jsonb,
    is_read boolean DEFAULT false NOT NULL,
    read_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.user_memberships (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    plan_id uuid NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    payment_method text,
    invoice_id uuid,
    amount_paid numeric DEFAULT 0 NOT NULL,
    cashback_credited boolean DEFAULT false NOT NULL,
    starts_at timestamp with time zone,
    expires_at timestamp with time zone,
    cancelled_at timestamp with time zone,
    activated_by uuid,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    referred_by uuid,
    referral_code_used text
);

CREATE TABLE public.user_notifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    title text NOT NULL,
    message text,
    type text DEFAULT 'info'::text,
    read_at timestamp with time zone,
    link text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.user_referral_codes (
    user_id uuid NOT NULL,
    code text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.user_referrals (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    ref_code text NOT NULL,
    total_clicks integer DEFAULT 0 NOT NULL,
    total_signups integer DEFAULT 0 NOT NULL,
    total_orders integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.user_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    role public.app_role DEFAULT 'user'::public.app_role NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.user_secret_features (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    feature_key text NOT NULL,
    unlocked_at timestamp with time zone DEFAULT now() NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL
);

CREATE TABLE public.wallet_credit_events (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    application_id uuid,
    user_id uuid NOT NULL,
    amount numeric(12,2) NOT NULL,
    event_type public.wallet_credit_event_type NOT NULL,
    wallet_transaction_id uuid,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.wallet_topup_requests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    wallet_id uuid,
    amount numeric NOT NULL,
    payment_method text DEFAULT 'bank_transfer'::text NOT NULL,
    reference_number text,
    notes text,
    receipt_path text,
    status text DEFAULT 'pending'::text NOT NULL,
    reviewed_by uuid,
    reviewed_at timestamp with time zone,
    admin_notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT wallet_topup_requests_amount_check CHECK ((amount > (0)::numeric))
);

CREATE TABLE public.wallet_transactions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    wallet_id uuid NOT NULL,
    user_id uuid NOT NULL,
    type text NOT NULL,
    amount numeric NOT NULL,
    balance_after numeric DEFAULT 0 NOT NULL,
    description text,
    reference_type text,
    reference_id uuid,
    created_by uuid,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    payment_intent_id uuid,
    receipt_number text,
    balance_before numeric,
    gateway_ref text,
    masked_account text,
    fee_amount numeric DEFAULT 0 NOT NULL,
    vat_amount numeric DEFAULT 0 NOT NULL,
    currency text DEFAULT 'SAR'::text NOT NULL,
    payment_method text,
    signature_hash text,
    reconciled boolean DEFAULT false NOT NULL,
    reconciled_at timestamp with time zone,
    signed_at timestamp with time zone DEFAULT now() NOT NULL,
    receipt_pdf_path text,
    receipt_generated_at timestamp with time zone,
    ip_address text
);

CREATE TABLE public.wallets (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    balance numeric DEFAULT 0 NOT NULL,
    total_deposited numeric DEFAULT 0 NOT NULL,
    total_spent numeric DEFAULT 0 NOT NULL,
    currency text DEFAULT 'SAR'::text NOT NULL,
    status text DEFAULT 'active'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.whatsapp_bot_sessions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    phone text NOT NULL,
    user_id uuid,
    customer_id uuid,
    is_registered boolean DEFAULT false NOT NULL,
    state text DEFAULT 'idle'::text NOT NULL,
    state_data jsonb DEFAULT '{}'::jsonb NOT NULL,
    human_takeover boolean DEFAULT false NOT NULL,
    human_takeover_at timestamp with time zone,
    human_takeover_reason text,
    failed_attempts integer DEFAULT 0 NOT NULL,
    last_message text,
    last_message_at timestamp with time zone,
    last_bot_reply_at timestamp with time zone,
    inbox_message_id uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.whatsapp_campaign_recipients (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    campaign_id uuid NOT NULL,
    phone text NOT NULL,
    name text,
    user_id uuid,
    customer_id uuid,
    variables jsonb DEFAULT '{}'::jsonb NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    send_log_id uuid,
    error_message text,
    sent_at timestamp with time zone,
    read_at timestamp with time zone,
    replied_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT whatsapp_campaign_recipients_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'sent'::text, 'failed'::text, 'read'::text, 'replied'::text])))
);

CREATE TABLE public.whatsapp_campaigns (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    description text,
    template_id uuid,
    message_body text NOT NULL,
    variables_map jsonb DEFAULT '{}'::jsonb NOT NULL,
    audience_filter jsonb DEFAULT '{"type": "all"}'::jsonb NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    scheduled_at timestamp with time zone,
    started_at timestamp with time zone,
    completed_at timestamp with time zone,
    total_recipients integer DEFAULT 0 NOT NULL,
    sent_count integer DEFAULT 0 NOT NULL,
    failed_count integer DEFAULT 0 NOT NULL,
    read_count integer DEFAULT 0 NOT NULL,
    reply_count integer DEFAULT 0 NOT NULL,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT whatsapp_campaigns_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'scheduled'::text, 'running'::text, 'completed'::text, 'failed'::text, 'cancelled'::text])))
);

CREATE TABLE public.whatsapp_conversation_notes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    conversation_id uuid NOT NULL,
    admin_id uuid,
    admin_name text,
    body text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.whatsapp_conversations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    phone text NOT NULL,
    customer_name text,
    user_id uuid,
    customer_id uuid,
    assigned_to uuid,
    status text DEFAULT 'open'::text NOT NULL,
    is_pinned boolean DEFAULT false NOT NULL,
    is_starred boolean DEFAULT false NOT NULL,
    human_takeover boolean DEFAULT false NOT NULL,
    unread_count integer DEFAULT 0 NOT NULL,
    last_message text,
    last_message_at timestamp with time zone,
    last_inbound_at timestamp with time zone,
    last_admin_read_at timestamp with time zone,
    tags text[] DEFAULT '{}'::text[] NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT whatsapp_conversations_status_check CHECK ((status = ANY (ARRAY['open'::text, 'pending'::text, 'closed'::text, 'archived'::text])))
);

CREATE TABLE public.whatsapp_inbound_messages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    phone text NOT NULL,
    message_body text,
    message_type text DEFAULT 'text'::text,
    raw_payload jsonb,
    bot_handled boolean DEFAULT false NOT NULL,
    bot_reply text,
    forwarded_to_human boolean DEFAULT false NOT NULL,
    inbox_message_id uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.whatsapp_messages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    conversation_id uuid NOT NULL,
    phone text NOT NULL,
    direction text NOT NULL,
    sender_type text NOT NULL,
    sender_id uuid,
    sender_name text,
    body text NOT NULL,
    message_type text DEFAULT 'text'::text NOT NULL,
    media_url text,
    media_filename text,
    provider_message_id text,
    delivery_status text DEFAULT 'pending'::text NOT NULL,
    error_message text,
    read_by_customer_at timestamp with time zone,
    read_by_admin_at timestamp with time zone,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT whatsapp_messages_delivery_status_check CHECK ((delivery_status = ANY (ARRAY['pending'::text, 'sent'::text, 'delivered'::text, 'read'::text, 'failed'::text]))),
    CONSTRAINT whatsapp_messages_direction_check CHECK ((direction = ANY (ARRAY['inbound'::text, 'outbound'::text]))),
    CONSTRAINT whatsapp_messages_message_type_check CHECK ((message_type = ANY (ARRAY['text'::text, 'image'::text, 'document'::text, 'audio'::text, 'video'::text, 'template'::text]))),
    CONSTRAINT whatsapp_messages_sender_type_check CHECK ((sender_type = ANY (ARRAY['customer'::text, 'admin'::text, 'bot'::text, 'system'::text])))
);

CREATE TABLE public.whatsapp_otp_codes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    phone text NOT NULL,
    code_hash text NOT NULL,
    purpose text DEFAULT 'login'::text NOT NULL,
    attempts integer DEFAULT 0 NOT NULL,
    used boolean DEFAULT false NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    ip_address text
);

CREATE TABLE public.whatsapp_quick_replies (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    shortcut text,
    title text NOT NULL,
    body text NOT NULL,
    category text,
    use_count integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.whatsapp_send_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    to_phone text NOT NULL,
    event_key text,
    message_body text,
    variables jsonb DEFAULT '{}'::jsonb,
    status text DEFAULT 'queued'::text NOT NULL,
    provider_message_id text,
    error_message text,
    user_id uuid,
    related_entity_type text,
    related_entity_id uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.whatsapp_settings (
    id integer DEFAULT 1 NOT NULL,
    is_enabled boolean DEFAULT true NOT NULL,
    events_enabled jsonb DEFAULT '{"otp_login": true, "invoice_new": true, "invoice_paid": true, "order_created": true, "contract_invite": true, "contract_signed": true, "order_delivered": true, "invoice_reminder": true, "order_status_changed": true}'::jsonb NOT NULL,
    default_country_code text DEFAULT '966'::text NOT NULL,
    test_phone text,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT single_row CHECK ((id = 1))
);

CREATE TABLE public.whatsapp_templates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    event_key text NOT NULL,
    title text NOT NULL,
    body_text text NOT NULL,
    variables jsonb DEFAULT '[]'::jsonb NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.withdrawal_requests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    amount numeric NOT NULL,
    bank_name text NOT NULL,
    account_holder_name text NOT NULL,
    iban text NOT NULL,
    notes text,
    status public.withdrawal_status DEFAULT 'pending'::public.withdrawal_status NOT NULL,
    admin_notes text,
    reviewed_by uuid,
    reviewed_at timestamp with time zone,
    paid_at timestamp with time zone,
    hold_transaction_id uuid,
    refund_transaction_id uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT withdrawal_requests_amount_check CHECK ((amount >= (100)::numeric))
);

CREATE TABLE public.workspace_notes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    title text DEFAULT 'ملاحظة جديدة'::text NOT NULL,
    content text DEFAULT ''::text NOT NULL,
    tags text[] DEFAULT ARRAY[]::text[],
    source_type text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.xp_daily_limits (
    source_type text NOT NULL,
    max_per_day integer NOT NULL,
    max_xp_per_day integer NOT NULL,
    description text
);

CREATE TABLE public.xp_levels (
    level integer NOT NULL,
    name_ar text NOT NULL,
    required_xp_total integer NOT NULL,
    badge_color text,
    icon text,
    reward_type text,
    reward_payload jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.xp_transactions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    amount integer NOT NULL,
    source_type text NOT NULL,
    source_id text,
    description text,
    balance_after integer NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);
