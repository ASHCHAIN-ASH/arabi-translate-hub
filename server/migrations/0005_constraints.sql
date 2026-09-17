ALTER TABLE ONLY public.assessment_answers
    ADD CONSTRAINT assessment_answers_attempt_id_question_id_key UNIQUE (attempt_id, question_id);

ALTER TABLE ONLY public.assessment_answers
    ADD CONSTRAINT assessment_answers_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.assessment_attempts
    ADD CONSTRAINT assessment_attempts_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.assessment_options
    ADD CONSTRAINT assessment_options_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.assessment_questions
    ADD CONSTRAINT assessment_questions_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.assessments
    ADD CONSTRAINT assessments_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.assessments
    ADD CONSTRAINT assessments_slug_key UNIQUE (slug);

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.auth_phone_lockouts
    ADD CONSTRAINT auth_phone_lockouts_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.auth_whatsapp_otp
    ADD CONSTRAINT auth_whatsapp_otp_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.automation_actions_log
    ADD CONSTRAINT automation_actions_log_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.automation_insights
    ADD CONSTRAINT automation_insights_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.automation_rules
    ADD CONSTRAINT automation_rules_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.automation_rules
    ADD CONSTRAINT automation_rules_rule_key_key UNIQUE (rule_key);

ALTER TABLE ONLY public.automation_snapshots
    ADD CONSTRAINT automation_snapshots_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.automation_snapshots
    ADD CONSTRAINT automation_snapshots_snapshot_date_key UNIQUE (snapshot_date);

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_slug_key UNIQUE (slug);

ALTER TABLE ONLY public.bonus_drop_views
    ADD CONSTRAINT bonus_drop_views_bonus_drop_id_user_id_key UNIQUE (bonus_drop_id, user_id);

ALTER TABLE ONLY public.bonus_drop_views
    ADD CONSTRAINT bonus_drop_views_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.bonus_drops
    ADD CONSTRAINT bonus_drops_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.chat_conversations
    ADD CONSTRAINT chat_conversations_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT chat_messages_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.contract_evidence
    ADD CONSTRAINT contract_evidence_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.contract_otp_codes
    ADD CONSTRAINT contract_otp_codes_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.contract_signatures
    ADD CONSTRAINT contract_signatures_contract_id_unique UNIQUE (contract_id);

ALTER TABLE ONLY public.contract_signatures
    ADD CONSTRAINT contract_signatures_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.contract_timeline
    ADD CONSTRAINT contract_timeline_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.contract_versions
    ADD CONSTRAINT contract_versions_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT contracts_contract_number_key UNIQUE (contract_number);

ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT contracts_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_customer_code_key UNIQUE (customer_code);

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_referral_code_key UNIQUE (referral_code);

ALTER TABLE ONLY public.cv_purchases
    ADD CONSTRAINT cv_purchases_one_per_cv UNIQUE (cv_id);

ALTER TABLE ONLY public.cv_purchases
    ADD CONSTRAINT cv_purchases_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.daily_growth_metrics
    ADD CONSTRAINT daily_growth_metrics_pkey PRIMARY KEY (date);

ALTER TABLE ONLY public.deadline_reminders
    ADD CONSTRAINT deadline_reminders_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.deadline_reminders
    ADD CONSTRAINT deadline_reminders_service_order_id_reminder_type_key UNIQUE (service_order_id, reminder_type);

ALTER TABLE ONLY public.email_send_log
    ADD CONSTRAINT email_send_log_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.email_send_state
    ADD CONSTRAINT email_send_state_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.email_templates
    ADD CONSTRAINT email_templates_name_key UNIQUE (name);

ALTER TABLE ONLY public.email_templates
    ADD CONSTRAINT email_templates_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.email_unsubscribe_tokens
    ADD CONSTRAINT email_unsubscribe_tokens_email_key UNIQUE (email);

ALTER TABLE ONLY public.email_unsubscribe_tokens
    ADD CONSTRAINT email_unsubscribe_tokens_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.email_unsubscribe_tokens
    ADD CONSTRAINT email_unsubscribe_tokens_token_key UNIQUE (token);

ALTER TABLE ONLY public.experiment_assignments
    ADD CONSTRAINT experiment_assignments_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.experiment_audit_logs
    ADD CONSTRAINT experiment_audit_logs_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.experiment_events
    ADD CONSTRAINT experiment_events_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.experiment_results_snapshots
    ADD CONSTRAINT experiment_results_snapshots_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.experiment_variants
    ADD CONSTRAINT experiment_variants_experiment_id_variant_key_key UNIQUE (experiment_id, variant_key);

ALTER TABLE ONLY public.experiment_variants
    ADD CONSTRAINT experiment_variants_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.experiments
    ADD CONSTRAINT experiments_experiment_key_key UNIQUE (experiment_key);

ALTER TABLE ONLY public.experiments
    ADD CONSTRAINT experiments_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.financing_acknowledgments
    ADD CONSTRAINT financing_ack_unique UNIQUE (application_id, ack_type);

ALTER TABLE ONLY public.financing_acknowledgments
    ADD CONSTRAINT financing_acknowledgments_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.financing_applications
    ADD CONSTRAINT financing_applications_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.financing_contracts
    ADD CONSTRAINT financing_contracts_contract_number_key UNIQUE (contract_number);

ALTER TABLE ONLY public.financing_contracts
    ADD CONSTRAINT financing_contracts_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.financing_documents
    ADD CONSTRAINT financing_documents_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.financing_installments
    ADD CONSTRAINT financing_installments_application_id_month_number_key UNIQUE (application_id, month_number);

ALTER TABLE ONLY public.financing_installments
    ADD CONSTRAINT financing_installments_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.financing_payment_receipts
    ADD CONSTRAINT financing_payment_receipts_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.financing_status_logs
    ADD CONSTRAINT financing_status_logs_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.financing_whatsapp_logs
    ADD CONSTRAINT financing_whatsapp_logs_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.gateway_webhooks
    ADD CONSTRAINT gateway_webhooks_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.group_order_audit
    ADD CONSTRAINT group_order_audit_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.group_order_members
    ADD CONSTRAINT group_order_members_group_order_id_user_id_key UNIQUE (group_order_id, user_id);

ALTER TABLE ONLY public.group_order_members
    ADD CONSTRAINT group_order_members_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.group_orders
    ADD CONSTRAINT group_orders_invite_code_key UNIQUE (invite_code);

ALTER TABLE ONLY public.group_orders
    ADD CONSTRAINT group_orders_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.growth_events
    ADD CONSTRAINT growth_events_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.inbox_messages
    ADD CONSTRAINT inbox_messages_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.inbox_notes
    ADD CONSTRAINT inbox_notes_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.inbox_replies
    ADD CONSTRAINT inbox_replies_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.inbox_reply_templates
    ADD CONSTRAINT inbox_reply_templates_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.invoice_items
    ADD CONSTRAINT invoice_items_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.invoice_payments
    ADD CONSTRAINT invoice_payments_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.invoice_timeline
    ADD CONSTRAINT invoice_timeline_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_invoice_number_key UNIQUE (invoice_number);

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.member_referrals
    ADD CONSTRAINT member_referrals_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.member_referrals
    ADD CONSTRAINT member_referrals_referred_user_id_membership_id_key UNIQUE (referred_user_id, membership_id);

ALTER TABLE ONLY public.membership_history
    ADD CONSTRAINT membership_history_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.membership_plans
    ADD CONSTRAINT membership_plans_code_key UNIQUE (code);

ALTER TABLE ONLY public.membership_plans
    ADD CONSTRAINT membership_plans_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.order_attachments
    ADD CONSTRAINT order_attachments_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.order_timeline
    ADD CONSTRAINT order_timeline_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_tracking_id_key UNIQUE (tracking_id);

ALTER TABLE ONLY public.payment_attempts
    ADD CONSTRAINT payment_attempts_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.payment_intents
    ADD CONSTRAINT payment_intents_internal_order_number_key UNIQUE (internal_order_number);

ALTER TABLE ONLY public.payment_intents
    ADD CONSTRAINT payment_intents_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.payment_reconciliation_items
    ADD CONSTRAINT payment_reconciliation_items_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.payment_reconciliation_runs
    ADD CONSTRAINT payment_reconciliation_runs_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.payment_transactions
    ADD CONSTRAINT payment_transactions_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.point_transactions
    ADD CONSTRAINT point_transactions_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.question_categories
    ADD CONSTRAINT question_categories_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.question_choices
    ADD CONSTRAINT question_choices_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.question_tags
    ADD CONSTRAINT question_tags_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.question_tags
    ADD CONSTRAINT question_tags_question_id_tag_key UNIQUE (question_id, tag);

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.referral_audit_logs
    ADD CONSTRAINT referral_audit_logs_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.referral_clicks
    ADD CONSTRAINT referral_clicks_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.referral_conversions
    ADD CONSTRAINT referral_conversions_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.referral_conversions
    ADD CONSTRAINT referral_conversions_unique_signup UNIQUE (ref_code, user_id, type);

ALTER TABLE ONLY public.referral_events
    ADD CONSTRAINT referral_events_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.referral_viral_rewards
    ADD CONSTRAINT referral_viral_rewards_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.referral_viral_rewards
    ADD CONSTRAINT referral_viral_rewards_referral_id_reward_type_key UNIQUE (referral_id, reward_type);

ALTER TABLE ONLY public.referrals
    ADD CONSTRAINT referrals_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.research_publication_messages
    ADD CONSTRAINT research_publication_messages_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.research_publication_quotes
    ADD CONSTRAINT research_publication_quotes_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.research_publication_quotes
    ADD CONSTRAINT research_publication_quotes_quote_number_key UNIQUE (quote_number);

ALTER TABLE ONLY public.research_publications
    ADD CONSTRAINT research_publications_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.research_publications
    ADD CONSTRAINT research_publications_request_number_key UNIQUE (request_number);

ALTER TABLE ONLY public.service_categories
    ADD CONSTRAINT service_categories_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.service_order_admin_notes
    ADD CONSTRAINT service_order_admin_notes_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.service_order_messages
    ADD CONSTRAINT service_order_messages_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.service_order_timeline
    ADD CONSTRAINT service_order_timeline_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.service_orders
    ADD CONSTRAINT service_orders_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.service_orders
    ADD CONSTRAINT service_orders_tracking_id_key UNIQUE (tracking_id);

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.smart_editor_usage
    ADD CONSTRAINT smart_editor_usage_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.spin_attempts
    ADD CONSTRAINT spin_attempts_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.statistical_analyses
    ADD CONSTRAINT statistical_analyses_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.study_challenge_attempts
    ADD CONSTRAINT study_challenge_attempts_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.study_challenge_check_ins
    ADD CONSTRAINT study_challenge_check_ins_attempt_id_check_in_date_key UNIQUE (attempt_id, check_in_date);

ALTER TABLE ONLY public.study_challenge_check_ins
    ADD CONSTRAINT study_challenge_check_ins_attempt_id_day_number_key UNIQUE (attempt_id, day_number);

ALTER TABLE ONLY public.study_challenge_check_ins
    ADD CONSTRAINT study_challenge_check_ins_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.study_sessions
    ADD CONSTRAINT study_sessions_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.subjects
    ADD CONSTRAINT subjects_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.support_kb_articles
    ADD CONSTRAINT support_kb_articles_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.suppressed_emails
    ADD CONSTRAINT suppressed_emails_email_key UNIQUE (email);

ALTER TABLE ONLY public.suppressed_emails
    ADD CONSTRAINT suppressed_emails_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.ticket_attachments
    ADD CONSTRAINT ticket_attachments_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.ticket_messages
    ADD CONSTRAINT ticket_messages_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.ticket_presence
    ADD CONSTRAINT ticket_presence_pkey PRIMARY KEY (ticket_id, user_id);

ALTER TABLE ONLY public.ticket_quick_replies
    ADD CONSTRAINT ticket_quick_replies_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.ticket_timeline
    ADD CONSTRAINT ticket_timeline_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.ticket_typing
    ADD CONSTRAINT ticket_typing_pkey PRIMARY KEY (ticket_id, user_id);

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_ticket_number_key UNIQUE (ticket_number);

ALTER TABLE ONLY public.translation_file_analyses
    ADD CONSTRAINT translation_file_analyses_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.referrals
    ADD CONSTRAINT unique_referred_user UNIQUE (referred_user_id);

ALTER TABLE ONLY public.user_answers
    ADD CONSTRAINT user_answers_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.user_inbox_notifications
    ADD CONSTRAINT user_inbox_notifications_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.user_memberships
    ADD CONSTRAINT user_memberships_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.user_notifications
    ADD CONSTRAINT user_notifications_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.user_referral_codes
    ADD CONSTRAINT user_referral_codes_code_key UNIQUE (code);

ALTER TABLE ONLY public.user_referral_codes
    ADD CONSTRAINT user_referral_codes_pkey PRIMARY KEY (user_id);

ALTER TABLE ONLY public.user_referrals
    ADD CONSTRAINT user_referrals_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.user_referrals
    ADD CONSTRAINT user_referrals_ref_code_unique UNIQUE (ref_code);

ALTER TABLE ONLY public.user_referrals
    ADD CONSTRAINT user_referrals_user_unique UNIQUE (user_id);

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);

ALTER TABLE ONLY public.user_secret_features
    ADD CONSTRAINT user_secret_features_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.user_secret_features
    ADD CONSTRAINT user_secret_features_user_id_feature_key_key UNIQUE (user_id, feature_key);

ALTER TABLE ONLY public.wallet_credit_events
    ADD CONSTRAINT wallet_credit_events_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.wallet_topup_requests
    ADD CONSTRAINT wallet_topup_requests_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.wallet_transactions
    ADD CONSTRAINT wallet_transactions_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.wallet_transactions
    ADD CONSTRAINT wallet_transactions_receipt_number_key UNIQUE (receipt_number);

ALTER TABLE ONLY public.wallets
    ADD CONSTRAINT wallets_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.wallets
    ADD CONSTRAINT wallets_user_id_key UNIQUE (user_id);

ALTER TABLE ONLY public.whatsapp_bot_sessions
    ADD CONSTRAINT whatsapp_bot_sessions_phone_key UNIQUE (phone);

ALTER TABLE ONLY public.whatsapp_bot_sessions
    ADD CONSTRAINT whatsapp_bot_sessions_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.whatsapp_campaign_recipients
    ADD CONSTRAINT whatsapp_campaign_recipients_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.whatsapp_campaigns
    ADD CONSTRAINT whatsapp_campaigns_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.whatsapp_conversation_notes
    ADD CONSTRAINT whatsapp_conversation_notes_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.whatsapp_conversations
    ADD CONSTRAINT whatsapp_conversations_phone_key UNIQUE (phone);

ALTER TABLE ONLY public.whatsapp_conversations
    ADD CONSTRAINT whatsapp_conversations_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.whatsapp_inbound_messages
    ADD CONSTRAINT whatsapp_inbound_messages_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.whatsapp_messages
    ADD CONSTRAINT whatsapp_messages_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.whatsapp_otp_codes
    ADD CONSTRAINT whatsapp_otp_codes_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.whatsapp_quick_replies
    ADD CONSTRAINT whatsapp_quick_replies_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.whatsapp_send_log
    ADD CONSTRAINT whatsapp_send_log_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.whatsapp_settings
    ADD CONSTRAINT whatsapp_settings_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.whatsapp_templates
    ADD CONSTRAINT whatsapp_templates_event_key_key UNIQUE (event_key);

ALTER TABLE ONLY public.whatsapp_templates
    ADD CONSTRAINT whatsapp_templates_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.withdrawal_requests
    ADD CONSTRAINT withdrawal_requests_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.workspace_notes
    ADD CONSTRAINT workspace_notes_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.xp_daily_limits
    ADD CONSTRAINT xp_daily_limits_pkey PRIMARY KEY (source_type);

ALTER TABLE ONLY public.xp_levels
    ADD CONSTRAINT xp_levels_pkey PRIMARY KEY (level);

ALTER TABLE ONLY public.xp_transactions
    ADD CONSTRAINT xp_transactions_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.assessment_answers
    ADD CONSTRAINT assessment_answers_attempt_id_fkey FOREIGN KEY (attempt_id) REFERENCES public.assessment_attempts(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.assessment_answers
    ADD CONSTRAINT assessment_answers_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.assessment_questions(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.assessment_answers
    ADD CONSTRAINT assessment_answers_selected_option_id_fkey FOREIGN KEY (selected_option_id) REFERENCES public.assessment_options(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.assessment_attempts
    ADD CONSTRAINT assessment_attempts_assessment_id_fkey FOREIGN KEY (assessment_id) REFERENCES public.assessments(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.assessment_options
    ADD CONSTRAINT assessment_options_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.assessment_questions(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.assessment_questions
    ADD CONSTRAINT assessment_questions_assessment_id_fkey FOREIGN KEY (assessment_id) REFERENCES public.assessments(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);

ALTER TABLE ONLY public.automation_actions_log
    ADD CONSTRAINT automation_actions_log_insight_id_fkey FOREIGN KEY (insight_id) REFERENCES public.automation_insights(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.bonus_drop_views
    ADD CONSTRAINT bonus_drop_views_bonus_drop_id_fkey FOREIGN KEY (bonus_drop_id) REFERENCES public.bonus_drops(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT chat_messages_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.chat_conversations(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.contract_evidence
    ADD CONSTRAINT contract_evidence_contract_id_fkey FOREIGN KEY (contract_id) REFERENCES public.contracts(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.contract_evidence
    ADD CONSTRAINT contract_evidence_contract_version_id_fkey FOREIGN KEY (contract_version_id) REFERENCES public.contract_versions(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.contract_evidence
    ADD CONSTRAINT contract_evidence_signature_id_fkey FOREIGN KEY (signature_id) REFERENCES public.contract_signatures(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.contract_otp_codes
    ADD CONSTRAINT contract_otp_codes_contract_id_fkey FOREIGN KEY (contract_id) REFERENCES public.contracts(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.contract_signatures
    ADD CONSTRAINT contract_signatures_contract_id_fkey FOREIGN KEY (contract_id) REFERENCES public.contracts(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.contract_timeline
    ADD CONSTRAINT contract_timeline_contract_id_fkey FOREIGN KEY (contract_id) REFERENCES public.contracts(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.contract_versions
    ADD CONSTRAINT contract_versions_based_on_signature_id_fkey FOREIGN KEY (based_on_signature_id) REFERENCES public.contract_signatures(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.contract_versions
    ADD CONSTRAINT contract_versions_contract_id_fkey FOREIGN KEY (contract_id) REFERENCES public.contracts(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT contracts_current_version_id_fkey FOREIGN KEY (current_version_id) REFERENCES public.contract_versions(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT contracts_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT contracts_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.service_orders(id);

ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT contracts_parent_contract_id_fkey FOREIGN KEY (parent_contract_id) REFERENCES public.contracts(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT contracts_publication_id_fkey FOREIGN KEY (publication_id) REFERENCES public.research_publications(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT contracts_service_order_id_fkey FOREIGN KEY (service_order_id) REFERENCES public.service_orders(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT contracts_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.cv_purchases
    ADD CONSTRAINT cv_purchases_payment_intent_id_fkey FOREIGN KEY (payment_intent_id) REFERENCES public.payment_intents(id);

ALTER TABLE ONLY public.cv_purchases
    ADD CONSTRAINT cv_purchases_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.cv_purchases
    ADD CONSTRAINT cv_purchases_wallet_transaction_id_fkey FOREIGN KEY (wallet_transaction_id) REFERENCES public.wallet_transactions(id);

ALTER TABLE ONLY public.deadline_reminders
    ADD CONSTRAINT deadline_reminders_service_order_id_fkey FOREIGN KEY (service_order_id) REFERENCES public.service_orders(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.experiment_assignments
    ADD CONSTRAINT experiment_assignments_experiment_id_fkey FOREIGN KEY (experiment_id) REFERENCES public.experiments(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.experiment_assignments
    ADD CONSTRAINT experiment_assignments_variant_id_fkey FOREIGN KEY (variant_id) REFERENCES public.experiment_variants(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.experiment_audit_logs
    ADD CONSTRAINT experiment_audit_logs_experiment_id_fkey FOREIGN KEY (experiment_id) REFERENCES public.experiments(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.experiment_events
    ADD CONSTRAINT experiment_events_experiment_id_fkey FOREIGN KEY (experiment_id) REFERENCES public.experiments(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.experiment_events
    ADD CONSTRAINT experiment_events_variant_id_fkey FOREIGN KEY (variant_id) REFERENCES public.experiment_variants(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.experiment_results_snapshots
    ADD CONSTRAINT experiment_results_snapshots_experiment_id_fkey FOREIGN KEY (experiment_id) REFERENCES public.experiments(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.experiment_variants
    ADD CONSTRAINT experiment_variants_experiment_id_fkey FOREIGN KEY (experiment_id) REFERENCES public.experiments(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.experiments
    ADD CONSTRAINT experiments_winner_variant_fk FOREIGN KEY (winner_variant_id) REFERENCES public.experiment_variants(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.financing_applications
    ADD CONSTRAINT financing_applications_contract_id_fkey FOREIGN KEY (contract_id) REFERENCES public.contracts(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.financing_applications
    ADD CONSTRAINT financing_applications_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.financing_applications
    ADD CONSTRAINT financing_applications_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.service_orders(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.financing_contracts
    ADD CONSTRAINT financing_contracts_application_id_fkey FOREIGN KEY (application_id) REFERENCES public.financing_applications(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.financing_documents
    ADD CONSTRAINT financing_documents_application_id_fkey FOREIGN KEY (application_id) REFERENCES public.financing_applications(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.financing_installments
    ADD CONSTRAINT financing_installments_application_id_fkey FOREIGN KEY (application_id) REFERENCES public.financing_applications(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.financing_payment_receipts
    ADD CONSTRAINT financing_payment_receipts_application_id_fkey FOREIGN KEY (application_id) REFERENCES public.financing_applications(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.financing_status_logs
    ADD CONSTRAINT financing_status_logs_application_id_fkey FOREIGN KEY (application_id) REFERENCES public.financing_applications(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.financing_whatsapp_logs
    ADD CONSTRAINT financing_whatsapp_logs_application_id_fkey FOREIGN KEY (application_id) REFERENCES public.financing_applications(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.gateway_webhooks
    ADD CONSTRAINT gateway_webhooks_payment_intent_id_fkey FOREIGN KEY (payment_intent_id) REFERENCES public.payment_intents(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.group_order_audit
    ADD CONSTRAINT group_order_audit_group_order_id_fkey FOREIGN KEY (group_order_id) REFERENCES public.group_orders(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.group_order_members
    ADD CONSTRAINT group_order_members_group_order_id_fkey FOREIGN KEY (group_order_id) REFERENCES public.group_orders(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.group_order_members
    ADD CONSTRAINT group_order_members_payment_intent_id_fkey FOREIGN KEY (payment_intent_id) REFERENCES public.payment_intents(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.group_orders
    ADD CONSTRAINT group_orders_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(id) ON DELETE RESTRICT;

ALTER TABLE ONLY public.group_orders
    ADD CONSTRAINT group_orders_service_order_id_fkey FOREIGN KEY (service_order_id) REFERENCES public.service_orders(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.inbox_notes
    ADD CONSTRAINT inbox_notes_message_id_fkey FOREIGN KEY (message_id) REFERENCES public.inbox_messages(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.inbox_replies
    ADD CONSTRAINT inbox_replies_message_id_fkey FOREIGN KEY (message_id) REFERENCES public.inbox_messages(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.invoice_items
    ADD CONSTRAINT invoice_items_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.invoice_payments
    ADD CONSTRAINT invoice_payments_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.invoice_payments
    ADD CONSTRAINT invoice_payments_payment_intent_id_fkey FOREIGN KEY (payment_intent_id) REFERENCES public.payment_intents(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.invoice_timeline
    ADD CONSTRAINT invoice_timeline_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.service_orders(id);

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_publication_id_fkey FOREIGN KEY (publication_id) REFERENCES public.research_publications(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.membership_history
    ADD CONSTRAINT membership_history_membership_id_fkey FOREIGN KEY (membership_id) REFERENCES public.user_memberships(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);

ALTER TABLE ONLY public.order_attachments
    ADD CONSTRAINT order_attachments_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.service_orders(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.order_timeline
    ADD CONSTRAINT order_timeline_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.payment_attempts
    ADD CONSTRAINT payment_attempts_payment_intent_id_fkey FOREIGN KEY (payment_intent_id) REFERENCES public.payment_intents(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.payment_reconciliation_items
    ADD CONSTRAINT payment_reconciliation_items_payment_intent_id_fkey FOREIGN KEY (payment_intent_id) REFERENCES public.payment_intents(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.payment_reconciliation_items
    ADD CONSTRAINT payment_reconciliation_items_run_id_fkey FOREIGN KEY (run_id) REFERENCES public.payment_reconciliation_runs(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.payment_transactions
    ADD CONSTRAINT payment_transactions_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(id);

ALTER TABLE ONLY public.payment_transactions
    ADD CONSTRAINT payment_transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.question_categories
    ADD CONSTRAINT question_categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.question_categories(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.question_choices
    ADD CONSTRAINT question_choices_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.question_tags
    ADD CONSTRAINT question_tags_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_linked_assessment_id_fkey FOREIGN KEY (linked_assessment_id) REFERENCES public.assessments(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.referral_clicks
    ADD CONSTRAINT referral_clicks_ref_code_fkey FOREIGN KEY (ref_code) REFERENCES public.user_referrals(ref_code) ON DELETE CASCADE;

ALTER TABLE ONLY public.referral_conversions
    ADD CONSTRAINT referral_conversions_ref_code_fkey FOREIGN KEY (ref_code) REFERENCES public.user_referrals(ref_code) ON DELETE CASCADE;

ALTER TABLE ONLY public.referral_viral_rewards
    ADD CONSTRAINT referral_viral_rewards_referral_id_fkey FOREIGN KEY (referral_id) REFERENCES public.referrals(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.research_publication_messages
    ADD CONSTRAINT research_publication_messages_publication_id_fkey FOREIGN KEY (publication_id) REFERENCES public.research_publications(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.research_publication_quotes
    ADD CONSTRAINT research_publication_quotes_publication_id_fkey FOREIGN KEY (publication_id) REFERENCES public.research_publications(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.service_categories
    ADD CONSTRAINT service_categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.service_categories(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.service_order_timeline
    ADD CONSTRAINT service_order_timeline_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);

ALTER TABLE ONLY public.service_order_timeline
    ADD CONSTRAINT service_order_timeline_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.service_orders(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.service_orders
    ADD CONSTRAINT service_orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);

ALTER TABLE ONLY public.service_orders
    ADD CONSTRAINT service_orders_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(id);

ALTER TABLE ONLY public.service_orders
    ADD CONSTRAINT service_orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.service_categories(id);

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_subcategory_id_fkey FOREIGN KEY (subcategory_id) REFERENCES public.service_categories(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.spin_attempts
    ADD CONSTRAINT spin_attempts_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);

ALTER TABLE ONLY public.study_challenge_check_ins
    ADD CONSTRAINT study_challenge_check_ins_attempt_id_fkey FOREIGN KEY (attempt_id) REFERENCES public.study_challenge_attempts(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.study_sessions
    ADD CONSTRAINT study_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.subjects
    ADD CONSTRAINT subjects_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.question_categories(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.ticket_attachments
    ADD CONSTRAINT ticket_attachments_ticket_id_fkey FOREIGN KEY (ticket_id) REFERENCES public.tickets(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.ticket_messages
    ADD CONSTRAINT ticket_messages_ticket_id_fkey FOREIGN KEY (ticket_id) REFERENCES public.tickets(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.ticket_presence
    ADD CONSTRAINT ticket_presence_ticket_id_fkey FOREIGN KEY (ticket_id) REFERENCES public.tickets(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.ticket_timeline
    ADD CONSTRAINT ticket_timeline_ticket_id_fkey FOREIGN KEY (ticket_id) REFERENCES public.tickets(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.ticket_typing
    ADD CONSTRAINT ticket_typing_ticket_id_fkey FOREIGN KEY (ticket_id) REFERENCES public.tickets(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_assigned_admin_id_fkey FOREIGN KEY (assigned_admin_id) REFERENCES auth.users(id);

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES auth.users(id);

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_related_contract_id_fkey FOREIGN KEY (related_contract_id) REFERENCES public.contracts(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_related_invoice_id_fkey FOREIGN KEY (related_invoice_id) REFERENCES public.invoices(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_related_order_id_fkey FOREIGN KEY (related_order_id) REFERENCES public.service_orders(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_related_payment_id_fkey FOREIGN KEY (related_payment_id) REFERENCES public.invoice_payments(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.translation_file_analyses
    ADD CONSTRAINT translation_file_analyses_service_order_id_fkey FOREIGN KEY (service_order_id) REFERENCES public.service_orders(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.user_answers
    ADD CONSTRAINT user_answers_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.user_answers
    ADD CONSTRAINT user_answers_selected_choice_id_fkey FOREIGN KEY (selected_choice_id) REFERENCES public.question_choices(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.user_memberships
    ADD CONSTRAINT user_memberships_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.user_memberships
    ADD CONSTRAINT user_memberships_plan_id_fkey FOREIGN KEY (plan_id) REFERENCES public.membership_plans(id);

ALTER TABLE ONLY public.user_notifications
    ADD CONSTRAINT user_notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.wallet_credit_events
    ADD CONSTRAINT wallet_credit_events_application_id_fkey FOREIGN KEY (application_id) REFERENCES public.financing_applications(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.wallet_topup_requests
    ADD CONSTRAINT wallet_topup_requests_wallet_id_fkey FOREIGN KEY (wallet_id) REFERENCES public.wallets(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.wallet_transactions
    ADD CONSTRAINT wallet_transactions_payment_intent_id_fkey FOREIGN KEY (payment_intent_id) REFERENCES public.payment_intents(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.wallet_transactions
    ADD CONSTRAINT wallet_transactions_wallet_id_fkey FOREIGN KEY (wallet_id) REFERENCES public.wallets(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.whatsapp_campaign_recipients
    ADD CONSTRAINT whatsapp_campaign_recipients_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.whatsapp_campaigns(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.whatsapp_campaigns
    ADD CONSTRAINT whatsapp_campaigns_template_id_fkey FOREIGN KEY (template_id) REFERENCES public.whatsapp_templates(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.whatsapp_conversation_notes
    ADD CONSTRAINT whatsapp_conversation_notes_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.whatsapp_conversations(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.whatsapp_messages
    ADD CONSTRAINT whatsapp_messages_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.whatsapp_conversations(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.xp_transactions
    ADD CONSTRAINT xp_transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
