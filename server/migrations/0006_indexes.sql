CREATE UNIQUE INDEX contract_evidence_contract_unique ON public.contract_evidence USING btree (contract_id);

CREATE INDEX contract_evidence_signature_idx ON public.contract_evidence USING btree (signature_id);

CREATE UNIQUE INDEX contract_evidence_token_unique ON public.contract_evidence USING btree (verification_token);

CREATE INDEX contract_versions_contract_idx ON public.contract_versions USING btree (contract_id, generated_at DESC);

CREATE INDEX contract_versions_current_idx ON public.contract_versions USING btree (contract_id) WHERE (is_current = true);

CREATE UNIQUE INDEX contract_versions_signed_unique ON public.contract_versions USING btree (contract_id, version_no) WHERE (output_type = 'signed_final'::text);

CREATE UNIQUE INDEX contracts_verification_token_unique ON public.contracts USING btree (verification_token);

CREATE INDEX growth_events_created_idx ON public.growth_events USING btree (created_at DESC);

CREATE UNIQUE INDEX growth_events_dedupe_uidx ON public.growth_events USING btree (dedupe_key) WHERE (dedupe_key IS NOT NULL);

CREATE INDEX growth_events_source_idx ON public.growth_events USING btree (source);

CREATE INDEX growth_events_type_idx ON public.growth_events USING btree (event_type);

CREATE INDEX growth_events_user_idx ON public.growth_events USING btree (user_id);

CREATE INDEX idx_actions_log_insight ON public.automation_actions_log USING btree (insight_id, created_at DESC);

CREATE INDEX idx_ao_question ON public.assessment_options USING btree (question_id, order_index);

CREATE INDEX idx_aq_assessment ON public.assessment_questions USING btree (assessment_id, order_index);

CREATE INDEX idx_assignments_experiment ON public.experiment_assignments USING btree (experiment_id);

CREATE INDEX idx_assignments_variant ON public.experiment_assignments USING btree (variant_id);

CREATE INDEX idx_att_anon ON public.assessment_attempts USING btree (anonymous_id);

CREATE INDEX idx_att_assess ON public.assessment_attempts USING btree (assessment_id);

CREATE INDEX idx_att_user ON public.assessment_attempts USING btree (user_id);

CREATE INDEX idx_audit_experiment ON public.experiment_audit_logs USING btree (experiment_id, created_at DESC);

CREATE INDEX idx_audit_logs_created_at ON public.audit_logs USING btree (created_at);

CREATE INDEX idx_audit_logs_user_id ON public.audit_logs USING btree (user_id);

CREATE INDEX idx_auth_phone_lockouts_phone ON public.auth_phone_lockouts USING btree (phone);

CREATE INDEX idx_auth_phone_lockouts_until ON public.auth_phone_lockouts USING btree (locked_until);

CREATE INDEX idx_auth_whatsapp_otp_expires ON public.auth_whatsapp_otp USING btree (expires_at);

CREATE INDEX idx_auth_whatsapp_otp_phone ON public.auth_whatsapp_otp USING btree (phone);

CREATE INDEX idx_blog_posts_category ON public.blog_posts USING btree (category);

CREATE INDEX idx_blog_posts_slug ON public.blog_posts USING btree (slug);

CREATE INDEX idx_blog_posts_status_published ON public.blog_posts USING btree (status, published_at DESC);

CREATE INDEX idx_bonus_drops_window ON public.bonus_drops USING btree (starts_at, ends_at) WHERE (is_active = true);

CREATE INDEX idx_choices_question ON public.question_choices USING btree (question_id);

CREATE INDEX idx_contract_otp_lookup ON public.contract_otp_codes USING btree (contract_id, email, used, expires_at);

CREATE INDEX idx_contract_signatures_contract ON public.contract_signatures USING btree (contract_id);

CREATE INDEX idx_contract_timeline_contract ON public.contract_timeline USING btree (contract_id);

CREATE INDEX idx_contracts_customer ON public.contracts USING btree (customer_id);

CREATE INDEX idx_contracts_locked_at ON public.contracts USING btree (locked_at);

CREATE INDEX idx_contracts_parent ON public.contracts USING btree (parent_contract_id);

CREATE INDEX idx_contracts_publication_id ON public.contracts USING btree (publication_id);

CREATE INDEX idx_contracts_service_order ON public.contracts USING btree (service_order_id);

CREATE INDEX idx_contracts_status ON public.contracts USING btree (status);

CREATE INDEX idx_contracts_template_type ON public.contracts USING btree (template_type);

CREATE INDEX idx_contracts_user_id ON public.contracts USING btree (user_id);

CREATE INDEX idx_cv_purchases_user ON public.cv_purchases USING btree (user_id, created_at DESC);

CREATE INDEX idx_deadline_reminders_due ON public.deadline_reminders USING btree (due_at) WHERE (sent = false);

CREATE INDEX idx_deadline_reminders_order ON public.deadline_reminders USING btree (service_order_id);

CREATE INDEX idx_deadline_reminders_user ON public.deadline_reminders USING btree (user_id);

CREATE INDEX idx_email_send_log_created ON public.email_send_log USING btree (created_at DESC);

CREATE INDEX idx_email_send_log_message ON public.email_send_log USING btree (message_id);

CREATE UNIQUE INDEX idx_email_send_log_message_sent_unique ON public.email_send_log USING btree (message_id) WHERE (status = 'sent'::text);

CREATE INDEX idx_email_send_log_recipient ON public.email_send_log USING btree (recipient_email);

CREATE INDEX idx_events_created ON public.experiment_events USING btree (created_at DESC);

CREATE INDEX idx_events_experiment ON public.experiment_events USING btree (experiment_id, event_type);

CREATE INDEX idx_events_variant ON public.experiment_events USING btree (variant_id, event_type);

CREATE INDEX idx_fin_ack_app ON public.financing_acknowledgments USING btree (application_id);

CREATE INDEX idx_fin_ack_user ON public.financing_acknowledgments USING btree (user_id);

CREATE INDEX idx_financing_applications_contract_id ON public.financing_applications USING btree (contract_id);

CREATE INDEX idx_financing_apps_order ON public.financing_applications USING btree (order_id);

CREATE INDEX idx_financing_apps_status ON public.financing_applications USING btree (status);

CREATE INDEX idx_financing_apps_user ON public.financing_applications USING btree (user_id);

CREATE INDEX idx_financing_contracts_app ON public.financing_contracts USING btree (application_id);

CREATE INDEX idx_financing_docs_app ON public.financing_documents USING btree (application_id);

CREATE INDEX idx_financing_inst_app ON public.financing_installments USING btree (application_id);

CREATE INDEX idx_financing_inst_due ON public.financing_installments USING btree (due_date) WHERE (status = 'pending'::public.financing_installment_status);

CREATE INDEX idx_financing_status_logs_app ON public.financing_status_logs USING btree (application_id);

CREATE INDEX idx_financing_wa_logs_app ON public.financing_whatsapp_logs USING btree (application_id);

CREATE INDEX idx_fpr_app ON public.financing_payment_receipts USING btree (application_id);

CREATE INDEX idx_fpr_status ON public.financing_payment_receipts USING btree (status);

CREATE INDEX idx_fpr_user ON public.financing_payment_receipts USING btree (user_id);

CREATE INDEX idx_group_audit_group ON public.group_order_audit USING btree (group_order_id);

CREATE INDEX idx_group_members_group ON public.group_order_members USING btree (group_order_id);

CREATE INDEX idx_group_members_user ON public.group_order_members USING btree (user_id);

CREATE INDEX idx_group_orders_creator ON public.group_orders USING btree (creator_id);

CREATE INDEX idx_group_orders_invite ON public.group_orders USING btree (invite_code);

CREATE INDEX idx_group_orders_status ON public.group_orders USING btree (status);

CREATE UNIQUE INDEX idx_gw_dedup ON public.gateway_webhooks USING btree (provider, external_transaction_no, event_type) WHERE ((external_transaction_no IS NOT NULL) AND (event_type IS NOT NULL));

CREATE INDEX idx_gw_intent ON public.gateway_webhooks USING btree (payment_intent_id);

CREATE INDEX idx_gw_processed ON public.gateway_webhooks USING btree (processed);

CREATE INDEX idx_inbox_messages_archived ON public.inbox_messages USING btree (is_archived);

CREATE INDEX idx_inbox_messages_assigned ON public.inbox_messages USING btree (assigned_to);

CREATE INDEX idx_inbox_messages_email ON public.inbox_messages USING btree (sender_email);

CREATE INDEX idx_inbox_messages_form_type ON public.inbox_messages USING btree (form_type);

CREATE INDEX idx_inbox_messages_pinned ON public.inbox_messages USING btree (is_pinned) WHERE is_pinned;

CREATE INDEX idx_inbox_messages_starred ON public.inbox_messages USING btree (is_starred) WHERE is_starred;

CREATE INDEX idx_inbox_messages_status ON public.inbox_messages USING btree (status, created_at DESC);

CREATE INDEX idx_inbox_notes_message ON public.inbox_notes USING btree (message_id, created_at DESC);

CREATE INDEX idx_inbox_replies_message ON public.inbox_replies USING btree (message_id, created_at);

CREATE INDEX idx_inbox_user_unread ON public.user_inbox_notifications USING btree (user_id, is_read, created_at DESC);

CREATE INDEX idx_insights_metric_key ON public.automation_insights USING btree (metric_key);

CREATE INDEX idx_insights_status_severity ON public.automation_insights USING btree (status, severity, detected_at DESC);

CREATE INDEX idx_invoice_payments_invoice ON public.invoice_payments USING btree (invoice_id);

CREATE INDEX idx_invoice_timeline_invoice ON public.invoice_timeline USING btree (invoice_id);

CREATE INDEX idx_invoices_publication_id ON public.invoices USING btree (publication_id);

CREATE INDEX idx_invoices_status ON public.invoices USING btree (status);

CREATE INDEX idx_invoices_user_id ON public.invoices USING btree (user_id);

CREATE INDEX idx_ip_payment_intent ON public.invoice_payments USING btree (payment_intent_id);

CREATE INDEX idx_member_referrals_referred ON public.member_referrals USING btree (referred_user_id);

CREATE INDEX idx_member_referrals_referrer ON public.member_referrals USING btree (referrer_user_id);

CREATE INDEX idx_order_attachments_service_order ON public.order_attachments USING btree (service_order_id);

CREATE INDEX idx_order_timeline_order_id ON public.order_timeline USING btree (order_id);

CREATE INDEX idx_orders_phone_tracking ON public.orders USING btree (tracking_id, phone_last_four);

CREATE INDEX idx_orders_status ON public.orders USING btree (current_status);

CREATE INDEX idx_orders_tracking_id ON public.orders USING btree (tracking_id);

CREATE INDEX idx_orders_user_id ON public.orders USING btree (user_id);

CREATE INDEX idx_pa_intent ON public.payment_attempts USING btree (payment_intent_id);

CREATE INDEX idx_pa_status ON public.payment_attempts USING btree (status);

CREATE INDEX idx_payment_transactions_user_id ON public.payment_transactions USING btree (user_id);

CREATE INDEX idx_pi_external ON public.payment_intents USING btree (external_transaction_no);

CREATE INDEX idx_pi_invoice ON public.payment_intents USING btree (invoice_id);

CREATE INDEX idx_pi_order ON public.payment_intents USING btree (service_order_id);

CREATE INDEX idx_pi_purpose ON public.payment_intents USING btree (purpose);

CREATE INDEX idx_pi_status ON public.payment_intents USING btree (status);

CREATE INDEX idx_pi_user ON public.payment_intents USING btree (user_id);

CREATE INDEX idx_point_tx_user_created ON public.point_transactions USING btree (user_id, created_at DESC);

CREATE INDEX idx_pri_matched ON public.payment_reconciliation_items USING btree (matched);

CREATE INDEX idx_pri_run ON public.payment_reconciliation_items USING btree (run_id);

CREATE UNIQUE INDEX idx_profiles_phone_unique ON public.profiles USING btree (phone) WHERE (phone IS NOT NULL);

CREATE INDEX idx_qcat_parent ON public.question_categories USING btree (parent_id);

CREATE INDEX idx_qtags_tag ON public.question_tags USING btree (tag);

CREATE INDEX idx_questions_difficulty ON public.questions USING btree (difficulty);

CREATE INDEX idx_questions_subject ON public.questions USING btree (subject_id);

CREATE INDEX idx_referral_audit_created ON public.referral_audit_logs USING btree (created_at DESC);

CREATE INDEX idx_referral_audit_referral ON public.referral_audit_logs USING btree (referral_id);

CREATE INDEX idx_referral_audit_referrer ON public.referral_audit_logs USING btree (referrer_user_id);

CREATE INDEX idx_referral_clicks_code ON public.referral_clicks USING btree (ref_code);

CREATE INDEX idx_referral_clicks_code_created ON public.referral_clicks USING btree (ref_code, created_at DESC);

CREATE INDEX idx_referral_clicks_created ON public.referral_clicks USING btree (created_at DESC);

CREATE INDEX idx_referral_clicks_refcode_session ON public.referral_clicks USING btree (ref_code, session_id) WHERE (session_id IS NOT NULL);

CREATE INDEX idx_referral_clicks_session_id ON public.referral_clicks USING btree (session_id) WHERE (session_id IS NOT NULL);

CREATE INDEX idx_referral_conversions_code ON public.referral_conversions USING btree (ref_code);

CREATE INDEX idx_referral_conversions_code_type ON public.referral_conversions USING btree (ref_code, type);

CREATE INDEX idx_referral_conversions_type ON public.referral_conversions USING btree (type);

CREATE INDEX idx_referral_conversions_user ON public.referral_conversions USING btree (user_id);

CREATE INDEX idx_referral_events_code ON public.referral_events USING btree (ref_code, created_at DESC);

CREATE INDEX idx_referrals_referred ON public.referrals USING btree (referred_user_id);

CREATE INDEX idx_referrals_referrer ON public.referrals USING btree (referrer_user_id);

CREATE INDEX idx_referrals_status ON public.referrals USING btree (status);

CREATE INDEX idx_research_msg_pub ON public.research_publication_messages USING btree (publication_id);

CREATE INDEX idx_research_pub_status ON public.research_publications USING btree (status);

CREATE INDEX idx_research_pub_user ON public.research_publications USING btree (user_id);

CREATE INDEX idx_research_quotes_publication ON public.research_publication_quotes USING btree (publication_id);

CREATE INDEX idx_rvr_referrer ON public.referral_viral_rewards USING btree (referrer_user_id, created_at DESC);

CREATE INDEX idx_scal_user ON public.study_challenge_attempts USING btree (user_id, created_at DESC);

CREATE INDEX idx_scal_user_active ON public.study_challenge_attempts USING btree (user_id) WHERE (status = 'in_progress'::text);

CREATE INDEX idx_scci_user ON public.study_challenge_check_ins USING btree (user_id, check_in_date DESC);

CREATE INDEX idx_service_categories_parent ON public.service_categories USING btree (parent_id);

CREATE INDEX idx_service_orders_deadlines ON public.service_orders USING btree (quote_response_deadline, contract_signature_deadline, payment_deadline) WHERE (lifecycle_status = ANY (ARRAY['quote_sent'::public.order_lifecycle_status, 'contract_pending'::public.order_lifecycle_status, 'contract_signed'::public.order_lifecycle_status, 'payment_pending'::public.order_lifecycle_status]));

CREATE INDEX idx_service_orders_lifecycle ON public.service_orders USING btree (lifecycle_status);

CREATE INDEX idx_service_orders_lifecycle_status ON public.service_orders USING btree (lifecycle_status);

CREATE INDEX idx_service_orders_metadata ON public.service_orders USING gin (metadata);

CREATE INDEX idx_service_orders_price_approval_status ON public.service_orders USING btree (price_approval_status) WHERE (price_approval_status = 'pending'::text);

CREATE INDEX idx_service_orders_status ON public.service_orders USING btree (current_status);

CREATE INDEX idx_service_orders_user_id ON public.service_orders USING btree (user_id);

CREATE INDEX idx_services_subcategory ON public.services USING btree (subcategory_id);

CREATE INDEX idx_smart_editor_usage_user_date ON public.smart_editor_usage USING btree (user_id, created_at DESC);

CREATE INDEX idx_soan_order ON public.service_order_admin_notes USING btree (order_id, created_at);

CREATE INDEX idx_som_order ON public.service_order_messages USING btree (order_id, created_at);

CREATE INDEX idx_stat_analyses_user ON public.statistical_analyses USING btree (user_id, created_at DESC);

CREATE INDEX idx_study_sessions_user_started ON public.study_sessions USING btree (user_id, started_at DESC);

CREATE INDEX idx_subjects_cat ON public.subjects USING btree (category_id);

CREATE INDEX idx_suppressed_emails_email ON public.suppressed_emails USING btree (email);

CREATE INDEX idx_tfa_service_order ON public.translation_file_analyses USING btree (service_order_id);

CREATE INDEX idx_tfa_status ON public.translation_file_analyses USING btree (approval_status);

CREATE INDEX idx_tfa_user ON public.translation_file_analyses USING btree (user_id);

CREATE INDEX idx_ticket_attachments_ticket ON public.ticket_attachments USING btree (ticket_id);

CREATE INDEX idx_ticket_messages_ticket ON public.ticket_messages USING btree (ticket_id);

CREATE INDEX idx_ticket_timeline_ticket ON public.ticket_timeline USING btree (ticket_id);

CREATE INDEX idx_tickets_assigned_admin ON public.tickets USING btree (assigned_admin_id);

CREATE INDEX idx_tickets_category ON public.tickets USING btree (category);

CREATE INDEX idx_tickets_invoice ON public.tickets USING btree (related_invoice_id);

CREATE INDEX idx_tickets_last_message ON public.tickets USING btree (last_message_at DESC);

CREATE INDEX idx_tickets_order ON public.tickets USING btree (related_order_id);

CREATE INDEX idx_tickets_related_contract_id ON public.tickets USING btree (related_contract_id);

CREATE INDEX idx_tickets_related_payment_id ON public.tickets USING btree (related_payment_id);

CREATE INDEX idx_tickets_sla_due ON public.tickets USING btree (sla_due_at) WHERE (status <> ALL (ARRAY['resolved'::text, 'closed'::text]));

CREATE INDEX idx_tickets_status ON public.tickets USING btree (status);

CREATE INDEX idx_tickets_user ON public.tickets USING btree (user_id);

CREATE INDEX idx_tickets_user_id ON public.tickets USING btree (user_id);

CREATE INDEX idx_uans_question ON public.user_answers USING btree (question_id);

CREATE INDEX idx_uans_user ON public.user_answers USING btree (user_id);

CREATE INDEX idx_uans_user_correct ON public.user_answers USING btree (user_id, is_correct);

CREATE INDEX idx_unsubscribe_tokens_token ON public.email_unsubscribe_tokens USING btree (token);

CREATE INDEX idx_user_memberships_status ON public.user_memberships USING btree (status);

CREATE INDEX idx_user_memberships_user ON public.user_memberships USING btree (user_id);

CREATE INDEX idx_user_notifications_user_id ON public.user_notifications USING btree (user_id);

CREATE INDEX idx_user_referral_codes_code ON public.user_referral_codes USING btree (code);

CREATE INDEX idx_user_referrals_code ON public.user_referrals USING btree (ref_code);

CREATE INDEX idx_user_referrals_user ON public.user_referrals USING btree (user_id);

CREATE INDEX idx_user_roles_user_id ON public.user_roles USING btree (user_id);

CREATE INDEX idx_usf_user ON public.user_secret_features USING btree (user_id);

CREATE INDEX idx_wa_bot_sessions_phone ON public.whatsapp_bot_sessions USING btree (phone);

CREATE INDEX idx_wa_bot_sessions_takeover ON public.whatsapp_bot_sessions USING btree (human_takeover) WHERE (human_takeover = true);

CREATE INDEX idx_wa_camp_rec_campaign ON public.whatsapp_campaign_recipients USING btree (campaign_id, status);

CREATE INDEX idx_wa_camp_rec_phone ON public.whatsapp_campaign_recipients USING btree (phone);

CREATE INDEX idx_wa_camp_recipients_status ON public.whatsapp_campaign_recipients USING btree (campaign_id, status);

CREATE INDEX idx_wa_campaigns_created ON public.whatsapp_campaigns USING btree (created_at DESC);

CREATE INDEX idx_wa_campaigns_status ON public.whatsapp_campaigns USING btree (status, scheduled_at);

CREATE INDEX idx_wa_conv_assigned ON public.whatsapp_conversations USING btree (assigned_to);

CREATE INDEX idx_wa_conv_notes ON public.whatsapp_conversation_notes USING btree (conversation_id, created_at DESC);

CREATE INDEX idx_wa_conv_pinned_lastmsg ON public.whatsapp_conversations USING btree (is_pinned DESC, last_message_at DESC);

CREATE INDEX idx_wa_conv_status ON public.whatsapp_conversations USING btree (status, last_message_at DESC);

CREATE INDEX idx_wa_conv_unread ON public.whatsapp_conversations USING btree (unread_count) WHERE (unread_count > 0);

CREATE INDEX idx_wa_inbound_phone ON public.whatsapp_inbound_messages USING btree (phone, created_at DESC);

CREATE INDEX idx_wa_log_created ON public.whatsapp_send_log USING btree (created_at DESC);

CREATE INDEX idx_wa_log_phone ON public.whatsapp_send_log USING btree (to_phone);

CREATE INDEX idx_wa_log_status ON public.whatsapp_send_log USING btree (status);

CREATE INDEX idx_wa_msg_conv ON public.whatsapp_messages USING btree (conversation_id, created_at DESC);

CREATE INDEX idx_wa_msg_conv_created ON public.whatsapp_messages USING btree (conversation_id, created_at);

CREATE INDEX idx_wa_msg_phone ON public.whatsapp_messages USING btree (phone, created_at DESC);

CREATE INDEX idx_wa_otp_expires ON public.whatsapp_otp_codes USING btree (expires_at);

CREATE INDEX idx_wa_otp_phone ON public.whatsapp_otp_codes USING btree (phone, used);

CREATE INDEX idx_wallet_credit_events_app ON public.wallet_credit_events USING btree (application_id);

CREATE INDEX idx_wallet_credit_events_user ON public.wallet_credit_events USING btree (user_id);

CREATE INDEX idx_wallet_tx_gateway_ref ON public.wallet_transactions USING btree (gateway_ref);

CREATE INDEX idx_wallet_tx_receipt_no ON public.wallet_transactions USING btree (receipt_number);

CREATE INDEX idx_wallet_tx_user ON public.wallet_transactions USING btree (user_id, created_at DESC);

CREATE INDEX idx_wallet_tx_wallet ON public.wallet_transactions USING btree (wallet_id, created_at DESC);

CREATE INDEX idx_withdrawal_requests_status ON public.withdrawal_requests USING btree (status, created_at DESC);

CREATE INDEX idx_withdrawal_requests_user ON public.withdrawal_requests USING btree (user_id, created_at DESC);

CREATE INDEX idx_workspace_notes_user ON public.workspace_notes USING btree (user_id, updated_at DESC);

CREATE INDEX idx_wt_payment_intent ON public.wallet_transactions USING btree (payment_intent_id);

CREATE INDEX idx_xp_tx_source ON public.xp_transactions USING btree (source_type, source_id);

CREATE INDEX idx_xp_tx_user_created ON public.xp_transactions USING btree (user_id, created_at DESC);

CREATE UNIQUE INDEX uniq_active_insight_per_key ON public.automation_insights USING btree (dedupe_key) WHERE (status = 'active'::text);

CREATE UNIQUE INDEX uniq_point_tx_source ON public.point_transactions USING btree (user_id, source_type, source_id) WHERE ((source_id IS NOT NULL) AND (type = ANY (ARRAY['earn'::text, 'bonus'::text])));

CREATE UNIQUE INDEX uniq_service_categories_slug ON public.service_categories USING btree (slug) WHERE (slug IS NOT NULL);

CREATE UNIQUE INDEX uniq_services_slug ON public.services USING btree (slug) WHERE (slug IS NOT NULL);

CREATE UNIQUE INDEX uq_assignments_anon ON public.experiment_assignments USING btree (experiment_id, anonymous_id) WHERE ((anonymous_id IS NOT NULL) AND (user_id IS NULL));

CREATE UNIQUE INDEX uq_assignments_user ON public.experiment_assignments USING btree (experiment_id, user_id) WHERE (user_id IS NOT NULL);
