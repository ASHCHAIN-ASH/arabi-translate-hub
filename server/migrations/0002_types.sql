CREATE TYPE public.app_role AS ENUM (
    'admin',
    'moderator',
    'user'
);

CREATE TYPE public.experiment_status AS ENUM (
    'draft',
    'running',
    'paused',
    'completed',
    'archived'
);

CREATE TYPE public.experiment_target_area AS ENUM (
    'challenge_result_screen',
    'referral_page',
    'onboarding_flow',
    'share_cta'
);

CREATE TYPE public.financing_contract_status AS ENUM (
    'draft',
    'sent',
    'signed',
    'cancelled'
);

CREATE TYPE public.financing_doc_status AS ENUM (
    'pending',
    'approved',
    'rejected'
);

CREATE TYPE public.financing_doc_type AS ENUM (
    'id_front',
    'id_back',
    'bank_statement',
    'proof_of_income',
    'other'
);

CREATE TYPE public.financing_installment_status AS ENUM (
    'pending',
    'paid',
    'overdue',
    'waived'
);

CREATE TYPE public.financing_risk_level AS ENUM (
    'low',
    'medium',
    'high',
    'unknown'
);

CREATE TYPE public.financing_status AS ENUM (
    'draft',
    'submitted',
    'documents_pending',
    'under_review',
    'waiting_down_payment',
    'contract_pending_signature',
    'approved',
    'rejected',
    'execution_deed',
    'active',
    'completed',
    'overdue',
    'cancelled'
);

CREATE TYPE public.group_member_status AS ENUM (
    'joined',
    'paid',
    'refunded',
    'left'
);

CREATE TYPE public.group_order_status AS ENUM (
    'open',
    'partially_paid',
    'full',
    'in_progress',
    'completed',
    'cancelled',
    'expired'
);

CREATE TYPE public.order_lifecycle_status AS ENUM (
    'received',
    'under_review',
    'quote_sent',
    'quote_accepted',
    'contract_pending',
    'contract_signed',
    'payment_pending',
    'paid',
    'in_progress',
    'delivered',
    'completed',
    'cancelled'
);

CREATE TYPE public.student_event_type AS ENUM (
    'study',
    'exam',
    'focus'
);

CREATE TYPE public.study_session_status AS ENUM (
    'active',
    'completed',
    'cancelled',
    'planned'
);

CREATE TYPE public.wallet_credit_event_type AS ENUM (
    'financing_credit_added',
    'financing_credit_reversed',
    'installment_paid'
);

CREATE TYPE public.withdrawal_status AS ENUM (
    'pending',
    'approved',
    'rejected',
    'paid'
);
