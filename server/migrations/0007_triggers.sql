CREATE TRIGGER contracts_auto_send_pdf AFTER INSERT OR UPDATE OF status ON public.contracts FOR EACH ROW EXECUTE FUNCTION public.trg_auto_send_signed_contract();

CREATE TRIGGER invoices_auto_send_pdf AFTER INSERT OR UPDATE OF status ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.trg_auto_send_paid_invoice();

CREATE TRIGGER on_new_service_order_notify_admins AFTER INSERT ON public.service_orders FOR EACH ROW EXECUTE FUNCTION public.notify_admins_new_order();

CREATE TRIGGER study_sessions_notify AFTER UPDATE ON public.study_sessions FOR EACH ROW EXECUTE FUNCTION public.trg_study_session_done();

CREATE TRIGGER trg_apply_wallet_tx BEFORE INSERT ON public.wallet_transactions FOR EACH ROW EXECUTE FUNCTION public.apply_wallet_transaction();

CREATE TRIGGER trg_assessments_updated_at BEFORE UPDATE ON public.assessments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_auto_generate_installments BEFORE INSERT OR UPDATE ON public.financing_applications FOR EACH ROW EXECUTE FUNCTION public.trg_auto_generate_installments();

CREATE TRIGGER trg_auto_ticket_overdue_invoice AFTER INSERT OR UPDATE OF status, due_date, paid_amount ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.auto_ticket_for_overdue_invoice();

CREATE TRIGGER trg_auto_ticket_unsigned_contract AFTER UPDATE OF status, sent_at ON public.contracts FOR EACH ROW EXECUTE FUNCTION public.auto_ticket_for_unsigned_contract();

CREATE TRIGGER trg_automation_insights_updated BEFORE UPDATE ON public.automation_insights FOR EACH ROW EXECUTE FUNCTION public.tg_automation_set_updated_at();

CREATE TRIGGER trg_automation_rules_updated BEFORE UPDATE ON public.automation_rules FOR EACH ROW EXECUTE FUNCTION public.tg_automation_set_updated_at();

CREATE TRIGGER trg_bump_inbox_message AFTER INSERT ON public.inbox_replies FOR EACH ROW EXECUTE FUNCTION public.bump_inbox_message_on_reply();

CREATE TRIGGER trg_bump_referral_clicks AFTER INSERT ON public.referral_clicks FOR EACH ROW EXECUTE FUNCTION public.bump_referral_clicks();

CREATE TRIGGER trg_bump_referral_conversions AFTER INSERT ON public.referral_conversions FOR EACH ROW EXECUTE FUNCTION public.bump_referral_conversions();

CREATE TRIGGER trg_calc_financing_amounts BEFORE INSERT OR UPDATE OF total_amount, down_payment, duration_months ON public.financing_applications FOR EACH ROW EXECUTE FUNCTION public.calc_financing_amounts();

CREATE TRIGGER trg_contract_changed AFTER INSERT OR UPDATE ON public.contracts FOR EACH ROW EXECUTE FUNCTION public.handle_contract_changed();

CREATE TRIGGER trg_create_customer_for_new_profile AFTER INSERT ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.create_customer_for_new_profile();

CREATE TRIGGER trg_create_deadline_reminders AFTER INSERT OR UPDATE OF deadline ON public.service_orders FOR EACH ROW EXECUTE FUNCTION public.create_deadline_reminders();

CREATE TRIGGER trg_create_wallet_on_profile AFTER INSERT ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.create_wallet_for_new_profile();

CREATE TRIGGER trg_deduct_wallet_on_payment AFTER INSERT ON public.invoice_payments FOR EACH ROW EXECUTE FUNCTION public.deduct_wallet_on_invoice_payment();

CREATE TRIGGER trg_dispatch_lifecycle_email AFTER INSERT OR UPDATE OF lifecycle_status ON public.service_orders FOR EACH ROW EXECUTE FUNCTION public.dispatch_lifecycle_email();

CREATE TRIGGER trg_experiment_variants_updated_at BEFORE UPDATE ON public.experiment_variants FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_experiments_updated_at BEFORE UPDATE ON public.experiments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_financing_apps_updated_at BEFORE UPDATE ON public.financing_applications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_financing_contracts_updated_at BEFORE UPDATE ON public.financing_contracts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_financing_notify_whatsapp AFTER INSERT OR UPDATE OF status ON public.financing_applications FOR EACH ROW EXECUTE FUNCTION public.notify_financing_status_change();

CREATE TRIGGER trg_fpr_updated_at BEFORE UPDATE ON public.financing_payment_receipts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_generate_installments_after AFTER INSERT OR UPDATE ON public.financing_applications FOR EACH ROW EXECUTE FUNCTION public.trg_generate_installments_after();

CREATE TRIGGER trg_group_member_after_change AFTER INSERT OR UPDATE OF status ON public.group_order_members FOR EACH ROW EXECUTE FUNCTION public.after_group_member_change();

CREATE TRIGGER trg_group_member_before_insert BEFORE INSERT ON public.group_order_members FOR EACH ROW EXECUTE FUNCTION public.before_group_member_insert();

CREATE TRIGGER trg_group_order_defaults BEFORE INSERT ON public.group_orders FOR EACH ROW EXECUTE FUNCTION public.set_group_order_defaults();

CREATE TRIGGER trg_group_order_guard BEFORE UPDATE ON public.group_orders FOR EACH ROW EXECUTE FUNCTION public.guard_group_order_edits();

CREATE TRIGGER trg_group_orders_updated_at BEFORE UPDATE ON public.group_orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_growth_referral_ins AFTER INSERT ON public.referrals FOR EACH ROW EXECUTE FUNCTION public.trg_growth_on_referral();

CREATE TRIGGER trg_growth_referral_upd AFTER UPDATE ON public.referrals FOR EACH ROW EXECUTE FUNCTION public.trg_growth_on_referral();

CREATE TRIGGER trg_guard_client_lifecycle_edits BEFORE UPDATE ON public.service_orders FOR EACH ROW EXECUTE FUNCTION public.guard_client_lifecycle_edits();

CREATE TRIGGER trg_guard_evidence_immutable BEFORE DELETE OR UPDATE ON public.contract_evidence FOR EACH ROW EXECUTE FUNCTION public.guard_evidence_immutable();

CREATE TRIGGER trg_guard_membership_referral BEFORE INSERT OR UPDATE OF referred_by ON public.user_memberships FOR EACH ROW EXECUTE FUNCTION public.guard_membership_referral();

CREATE TRIGGER trg_guard_signed_contract BEFORE UPDATE ON public.contracts FOR EACH ROW EXECUTE FUNCTION public.guard_signed_contract_immutability();

CREATE TRIGGER trg_guard_signed_contract_delete BEFORE DELETE ON public.contracts FOR EACH ROW EXECUTE FUNCTION public.guard_signed_contract_delete();

CREATE TRIGGER trg_guard_signed_version BEFORE DELETE OR UPDATE ON public.contract_versions FOR EACH ROW EXECUTE FUNCTION public.guard_signed_version_immutable();

CREATE TRIGGER trg_handle_topup_status AFTER UPDATE ON public.wallet_topup_requests FOR EACH ROW EXECUTE FUNCTION public.handle_topup_approved();

CREATE TRIGGER trg_inbox_messages_updated_at BEFORE UPDATE ON public.inbox_messages FOR EACH ROW EXECUTE FUNCTION public.set_inbox_messages_updated_at();

CREATE TRIGGER trg_inbox_templates_updated_at BEFORE UPDATE ON public.inbox_reply_templates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_installment_overdue AFTER UPDATE ON public.financing_installments FOR EACH ROW EXECUTE FUNCTION public.notify_installment_overdue();

CREATE TRIGGER trg_invoice_created AFTER INSERT ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.log_invoice_created();

CREATE TRIGGER trg_invoice_payment_update AFTER INSERT OR DELETE OR UPDATE ON public.invoice_payments FOR EACH ROW EXECUTE FUNCTION public.update_invoice_after_payment();

CREATE TRIGGER trg_invoice_payments_recompute AFTER INSERT OR DELETE OR UPDATE ON public.invoice_payments FOR EACH ROW EXECUTE FUNCTION public.recompute_invoice_paid_status();

CREATE TRIGGER trg_invoice_sync_order AFTER INSERT OR UPDATE OF status ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.sync_order_status_from_invoice();

CREATE TRIGGER trg_invoices_updated_at BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_log_financing_status_change AFTER INSERT OR UPDATE OF status ON public.financing_applications FOR EACH ROW EXECUTE FUNCTION public.log_financing_status_change();

CREATE TRIGGER trg_log_referral_created AFTER INSERT ON public.member_referrals FOR EACH ROW EXECUTE FUNCTION public.log_referral_created();

CREATE TRIGGER trg_member_referrals_updated_at BEFORE UPDATE ON public.member_referrals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_membership_activated BEFORE UPDATE ON public.user_memberships FOR EACH ROW EXECUTE FUNCTION public.handle_membership_activated();

CREATE TRIGGER trg_membership_created AFTER INSERT ON public.user_memberships FOR EACH ROW EXECUTE FUNCTION public.handle_membership_created();

CREATE TRIGGER trg_membership_plans_updated BEFORE UPDATE ON public.membership_plans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_notify_admins_topup AFTER INSERT ON public.wallet_topup_requests FOR EACH ROW EXECUTE FUNCTION public.notify_admins_topup_request();

CREATE TRIGGER trg_notify_referrer_whatsapp AFTER INSERT OR UPDATE OF status ON public.member_referrals FOR EACH ROW EXECUTE FUNCTION public.notify_referrer_via_whatsapp();

CREATE TRIGGER trg_notify_ticket_admin_reply AFTER INSERT ON public.ticket_messages FOR EACH ROW EXECUTE FUNCTION public.notify_ticket_whatsapp();

CREATE TRIGGER trg_notify_ticket_created AFTER INSERT ON public.tickets FOR EACH ROW EXECUTE FUNCTION public.notify_ticket_whatsapp();

CREATE TRIGGER trg_notify_ticket_status AFTER UPDATE OF status ON public.tickets FOR EACH ROW EXECUTE FUNCTION public.notify_ticket_whatsapp();

CREATE TRIGGER trg_on_contract_signed_create_invoice AFTER UPDATE ON public.contracts FOR EACH ROW EXECUTE FUNCTION public.on_contract_signed_create_invoice();

CREATE TRIGGER trg_on_delivery_file_uploaded AFTER INSERT ON public.order_attachments FOR EACH ROW EXECUTE FUNCTION public.on_delivery_file_uploaded();

CREATE TRIGGER trg_on_invoice_paid_start_execution AFTER UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.on_invoice_paid_start_execution();

CREATE TRIGGER trg_on_quote_accepted_create_contract BEFORE UPDATE ON public.service_orders FOR EACH ROW EXECUTE FUNCTION public.on_quote_accepted_create_contract();

CREATE TRIGGER trg_pi_updated_at BEFORE UPDATE ON public.payment_intents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_prevent_fin_ack_update BEFORE DELETE OR UPDATE ON public.financing_acknowledgments FOR EACH ROW EXECUTE FUNCTION public.prevent_financing_ack_modify();

CREATE TRIGGER trg_receipt_approval BEFORE UPDATE ON public.financing_payment_receipts FOR EACH ROW EXECUTE FUNCTION public.handle_receipt_approval();

CREATE TRIGGER trg_referral_commission AFTER UPDATE ON public.user_memberships FOR EACH ROW EXECUTE FUNCTION public.handle_referral_on_membership_activation();

CREATE TRIGGER trg_referral_on_activation AFTER UPDATE OF status ON public.user_memberships FOR EACH ROW EXECUTE FUNCTION public.handle_referral_on_membership_activation();

CREATE TRIGGER trg_referral_pending AFTER INSERT ON public.user_memberships FOR EACH ROW EXECUTE FUNCTION public.handle_referral_on_membership_created();

CREATE TRIGGER trg_referrals_viral_signup AFTER INSERT ON public.referrals FOR EACH ROW EXECUTE FUNCTION public.on_referral_inserted_viral();

CREATE TRIGGER trg_research_pub_msg_notify AFTER INSERT ON public.research_publication_messages FOR EACH ROW EXECUTE FUNCTION public.notify_research_publication_event();

CREATE TRIGGER trg_research_pub_notify AFTER INSERT OR UPDATE ON public.research_publications FOR EACH ROW EXECUTE FUNCTION public.notify_research_publication_event();

CREATE TRIGGER trg_research_publication_to_inbox AFTER INSERT ON public.research_publications FOR EACH ROW EXECUTE FUNCTION public.research_publication_to_inbox();

CREATE TRIGGER trg_scal_updated_at BEFORE UPDATE ON public.study_challenge_attempts FOR EACH ROW EXECUTE FUNCTION public.scal_set_updated_at();

CREATE TRIGGER trg_service_categories_updated_at BEFORE UPDATE ON public.service_categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_service_orders_lifecycle BEFORE INSERT OR UPDATE ON public.service_orders FOR EACH ROW EXECUTE FUNCTION public.handle_lifecycle_change();

CREATE TRIGGER trg_set_customer_code BEFORE INSERT ON public.customers FOR EACH ROW EXECUTE FUNCTION public.set_customer_code();

CREATE TRIGGER trg_set_referral_code BEFORE INSERT ON public.customers FOR EACH ROW EXECUTE FUNCTION public.set_referral_code();

CREATE TRIGGER trg_set_stage_deadlines BEFORE INSERT OR UPDATE OF lifecycle_status ON public.service_orders FOR EACH ROW EXECUTE FUNCTION public.set_stage_deadlines();

CREATE TRIGGER trg_sign_wallet_transaction BEFORE INSERT ON public.wallet_transactions FOR EACH ROW EXECUTE FUNCTION public.sign_wallet_transaction();

CREATE TRIGGER trg_signature_inserted AFTER INSERT ON public.contract_signatures FOR EACH ROW EXECUTE FUNCTION public.handle_signature_inserted();

CREATE TRIGGER trg_signatures_no_delete BEFORE DELETE ON public.contract_signatures FOR EACH ROW EXECUTE FUNCTION public.guard_signatures_immutable();

CREATE TRIGGER trg_signatures_no_update BEFORE UPDATE ON public.contract_signatures FOR EACH ROW EXECUTE FUNCTION public.guard_signatures_immutable();

CREATE TRIGGER trg_ss_updated_at BEFORE UPDATE ON public.study_sessions FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE TRIGGER trg_stat_analyses_updated_at BEFORE UPDATE ON public.statistical_analyses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_sync_current_version AFTER INSERT OR UPDATE OF is_current ON public.contract_versions FOR EACH ROW WHEN ((new.is_current = true)) EXECUTE FUNCTION public.sync_current_contract_version();

CREATE TRIGGER trg_tfa_updated_at BEFORE UPDATE ON public.translation_file_analyses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_ticket_after_insert AFTER INSERT ON public.tickets FOR EACH ROW EXECUTE FUNCTION public.on_ticket_after_insert();

CREATE TRIGGER trg_ticket_before_insert BEFORE INSERT ON public.tickets FOR EACH ROW EXECUTE FUNCTION public.on_ticket_before_insert();

CREATE TRIGGER trg_ticket_insert_changed AFTER INSERT ON public.tickets FOR EACH ROW EXECUTE FUNCTION public.handle_ticket_changed();

CREATE TRIGGER trg_ticket_message_insert AFTER INSERT ON public.ticket_messages FOR EACH ROW EXECUTE FUNCTION public.on_ticket_message_insert();

CREATE TRIGGER trg_ticket_message_inserted AFTER INSERT ON public.ticket_messages FOR EACH ROW EXECUTE FUNCTION public.handle_ticket_message_inserted();

CREATE TRIGGER trg_ticket_update BEFORE UPDATE ON public.tickets FOR EACH ROW EXECUTE FUNCTION public.on_ticket_update();

CREATE TRIGGER trg_ticket_update_changed BEFORE UPDATE ON public.tickets FOR EACH ROW EXECUTE FUNCTION public.handle_ticket_changed();

CREATE TRIGGER trg_timeline_no_delete BEFORE DELETE ON public.contract_timeline FOR EACH ROW EXECUTE FUNCTION public.guard_timeline_append_only();

CREATE TRIGGER trg_timeline_no_update BEFORE UPDATE ON public.contract_timeline FOR EACH ROW EXECUTE FUNCTION public.guard_timeline_append_only();

CREATE TRIGGER trg_topup_updated_at BEFORE UPDATE ON public.wallet_topup_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_touch_deadline_reminder BEFORE UPDATE ON public.deadline_reminders FOR EACH ROW EXECUTE FUNCTION public.touch_deadline_reminder_updated_at();

CREATE TRIGGER trg_user_memberships_updated BEFORE UPDATE ON public.user_memberships FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_user_referrals_set_code BEFORE INSERT ON public.user_referrals FOR EACH ROW EXECUTE FUNCTION public.set_user_referral_code();

CREATE TRIGGER trg_user_referrals_updated_at BEFORE UPDATE ON public.user_referrals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_wa_bot_sessions_updated_at BEFORE UPDATE ON public.whatsapp_bot_sessions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_wa_campaigns_updated BEFORE UPDATE ON public.whatsapp_campaigns FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_wa_conv_updated BEFORE UPDATE ON public.whatsapp_conversations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_wa_quick_replies_updated BEFORE UPDATE ON public.whatsapp_quick_replies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_wallets_updated_at BEFORE UPDATE ON public.wallets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_withdrawal_requests_updated_at BEFORE UPDATE ON public.withdrawal_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_withdrawal_status_change BEFORE UPDATE ON public.withdrawal_requests FOR EACH ROW EXECUTE FUNCTION public.handle_withdrawal_status_change();

CREATE TRIGGER trg_workspace_notes_updated BEFORE UPDATE ON public.workspace_notes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_chat_conversations_updated_at BEFORE UPDATE ON public.chat_conversations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON public.contracts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON public.email_templates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON public.questions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_research_publications_updated_at BEFORE UPDATE ON public.research_publications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_research_quotes_updated_at BEFORE UPDATE ON public.research_publication_quotes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_service_orders_updated_at BEFORE UPDATE ON public.service_orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON public.tickets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_whatsapp_settings_updated_at BEFORE UPDATE ON public.whatsapp_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_whatsapp_templates_updated_at BEFORE UPDATE ON public.whatsapp_templates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER whatsapp_on_contract_invite AFTER INSERT OR UPDATE OF status ON public.contracts FOR EACH ROW EXECUTE FUNCTION public.trg_whatsapp_contract_invite();

CREATE TRIGGER whatsapp_on_contract_signed AFTER INSERT ON public.contract_signatures FOR EACH ROW EXECUTE FUNCTION public.trg_whatsapp_contract_signed();

CREATE TRIGGER whatsapp_on_invoice_new AFTER INSERT ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.trg_whatsapp_invoice_new();

CREATE TRIGGER whatsapp_on_invoice_paid AFTER UPDATE OF status ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.trg_whatsapp_invoice_paid();

CREATE TRIGGER whatsapp_on_order_created AFTER INSERT ON public.service_orders FOR EACH ROW EXECUTE FUNCTION public.trg_whatsapp_order_created();

CREATE TRIGGER whatsapp_on_order_status_changed AFTER UPDATE OF lifecycle_status ON public.service_orders FOR EACH ROW EXECUTE FUNCTION public.trg_whatsapp_order_status_changed();
