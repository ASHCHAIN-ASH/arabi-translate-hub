CREATE POLICY "Admins can delete posts" ON public.blog_posts FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can insert posts" ON public.blog_posts FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can manage bot sessions" ON public.whatsapp_bot_sessions TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can manage categories" ON public.service_categories USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can manage conversions" ON public.referral_conversions FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can manage roles" ON public.user_roles TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can manage services" ON public.services USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can read inbound messages" ON public.whatsapp_inbound_messages FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can update posts" ON public.blog_posts FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can view all posts" ON public.blog_posts FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can view all usage" ON public.smart_editor_usage FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can view contract OTP codes" ON public.contract_otp_codes FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins create contracts" ON public.financing_contracts FOR INSERT WITH CHECK (public.is_financing_admin(auth.uid()));

CREATE POLICY "Admins create notifications" ON public.notifications FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins delete attempts" ON public.assessment_attempts FOR DELETE USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins delete contracts" ON public.financing_contracts FOR DELETE USING (public.is_financing_admin(auth.uid()));

CREATE POLICY "Admins delete financing apps" ON public.financing_applications FOR DELETE USING (public.is_financing_admin(auth.uid()));

CREATE POLICY "Admins delete referrals" ON public.user_referrals FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins insert credit events" ON public.wallet_credit_events FOR INSERT WITH CHECK (public.is_financing_admin(auth.uid()));

CREATE POLICY "Admins insert whatsapp logs" ON public.financing_whatsapp_logs FOR INSERT WITH CHECK (public.is_financing_admin(auth.uid()));

CREATE POLICY "Admins insert whatsapp logs" ON public.whatsapp_send_log FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins manage all attachments" ON public.order_attachments TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins manage all conversations" ON public.chat_conversations USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins manage all messages" ON public.chat_messages USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins manage all referrals" ON public.member_referrals USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins manage all research" ON public.research_publications USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins manage answers" ON public.assessment_answers USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins manage assessments" ON public.assessments USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins manage campaign recipients" ON public.whatsapp_campaign_recipients TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins manage campaigns" ON public.whatsapp_campaigns TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins manage conversation notes" ON public.whatsapp_conversation_notes TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins manage conversations" ON public.whatsapp_conversations TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins manage customers" ON public.customers USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins manage deadline reminders" ON public.deadline_reminders TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins manage email templates" ON public.email_templates USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins manage experiments" ON public.experiments USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins manage history" ON public.membership_history USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins manage inbox messages" ON public.inbox_messages TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins manage inbox notes" ON public.inbox_notes TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins manage inbox replies" ON public.inbox_replies TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins manage installments" ON public.financing_installments USING (public.is_financing_admin(auth.uid())) WITH CHECK (public.is_financing_admin(auth.uid()));

CREATE POLICY "Admins manage invoice items" ON public.invoice_items USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins manage invoice payments" ON public.invoice_payments USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins manage invoice timeline" ON public.invoice_timeline USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins manage invoices" ON public.invoices USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins manage levels" ON public.xp_levels USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins manage limits" ON public.xp_daily_limits USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins manage memberships" ON public.user_memberships USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins manage options" ON public.assessment_options USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins manage order messages" ON public.service_order_messages USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins manage order timeline" ON public.order_timeline USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins manage orders" ON public.orders USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins manage orders" ON public.service_orders USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins manage plans" ON public.membership_plans USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins manage point tx" ON public.point_transactions USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins manage questions" ON public.assessment_questions USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins manage quick replies" ON public.whatsapp_quick_replies TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins manage reply templates" ON public.inbox_reply_templates TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins manage research quotes" ON public.research_publication_quotes USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins manage snapshots" ON public.experiment_results_snapshots USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins manage spins" ON public.spin_attempts USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins manage ticket attachments" ON public.ticket_attachments USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins manage ticket messages" ON public.ticket_messages USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins manage ticket timeline" ON public.ticket_timeline USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins manage tickets" ON public.tickets USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins manage timeline" ON public.service_order_timeline USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins manage topup requests" ON public.wallet_topup_requests USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins manage transactions" ON public.payment_transactions USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins manage user notifications" ON public.user_notifications USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins manage variants" ON public.experiment_variants USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins manage wallet transactions" ON public.wallet_transactions USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins manage wallets" ON public.wallets USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins manage whatsapp messages" ON public.whatsapp_messages TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins manage whatsapp settings" ON public.whatsapp_settings USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins manage whatsapp templates" ON public.whatsapp_templates USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins only manage internal notes" ON public.service_order_admin_notes USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins or owners update docs" ON public.financing_documents FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM public.financing_applications a
  WHERE ((a.id = financing_documents.application_id) AND ((a.user_id = auth.uid()) OR public.is_financing_admin(auth.uid()))))));

CREATE POLICY "Admins read assignments" ON public.experiment_assignments FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins read audit" ON public.experiment_audit_logs FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins read daily_growth_metrics" ON public.daily_growth_metrics FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins read events" ON public.experiment_events FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins read growth_events" ON public.growth_events FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins update all analyses" ON public.translation_file_analyses FOR UPDATE USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins update referrals" ON public.user_referrals FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins update withdrawals" ON public.withdrawal_requests FOR UPDATE USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins view all analyses" ON public.statistical_analyses FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins view all analyses" ON public.translation_file_analyses FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins view all contract evidence" ON public.contract_evidence FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins view all contract versions" ON public.contract_versions FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins view all cv purchases" ON public.cv_purchases FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins view all withdrawals" ON public.withdrawal_requests FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins view all xp tx" ON public.xp_transactions FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins view audit logs" ON public.audit_logs FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins view email send state" ON public.email_send_state FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins view otp codes" ON public.whatsapp_otp_codes FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins view referral audit" ON public.referral_audit_logs FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins view whatsapp logs" ON public.financing_whatsapp_logs FOR SELECT USING (public.is_financing_admin(auth.uid()));

CREATE POLICY "Admins view whatsapp logs" ON public.whatsapp_send_log FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Anyone can create an attempt" ON public.assessment_attempts FOR INSERT WITH CHECK ((((user_id IS NOT NULL) AND (user_id = auth.uid())) OR ((user_id IS NULL) AND (anonymous_id IS NOT NULL))));

CREATE POLICY "Anyone can record valid click" ON public.referral_clicks FOR INSERT TO authenticated, anon WITH CHECK (((ref_code IS NOT NULL) AND (length(TRIM(BOTH FROM ref_code)) > 0)));

CREATE POLICY "Anyone can view active plans" ON public.membership_plans FOR SELECT USING (((is_active = true) OR public.has_role(auth.uid(), 'admin'::public.app_role)));

CREATE POLICY "Anyone can view active services" ON public.services FOR SELECT USING (((is_active = true) OR public.has_role(auth.uid(), 'admin'::public.app_role)));

CREATE POLICY "Anyone can view categories" ON public.service_categories FOR SELECT USING (true);

CREATE POLICY "Anyone can view published posts" ON public.blog_posts FOR SELECT USING (((status = 'published'::text) AND (published_at <= now())));

CREATE POLICY "Anyone reads running experiments" ON public.experiments FOR SELECT USING ((status = ANY (ARRAY['running'::public.experiment_status, 'completed'::public.experiment_status])));

CREATE POLICY "Anyone reads variants of visible experiments" ON public.experiment_variants FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.experiments e
  WHERE ((e.id = experiment_variants.experiment_id) AND (e.status = ANY (ARRAY['running'::public.experiment_status, 'completed'::public.experiment_status]))))));

CREATE POLICY "Anyone view levels" ON public.xp_levels FOR SELECT USING (true);

CREATE POLICY "Anyone view limits" ON public.xp_daily_limits FOR SELECT USING (true);

CREATE POLICY "Authenticated can record conversion" ON public.referral_conversions FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));

CREATE POLICY "Authenticated users insert own spin" ON public.spin_attempts FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));

CREATE POLICY "Block anon access to otp" ON public.contract_otp_codes AS RESTRICTIVE TO anon USING (false) WITH CHECK (false);

CREATE POLICY "Block client delete otp" ON public.contract_otp_codes AS RESTRICTIVE FOR DELETE TO authenticated USING ((public.has_role(auth.uid(), 'admin'::public.app_role) OR (auth.role() = 'service_role'::text)));

CREATE POLICY "Block client delete referrals" ON public.member_referrals AS RESTRICTIVE FOR DELETE USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Block client delete reminders" ON public.deadline_reminders AS RESTRICTIVE FOR DELETE TO authenticated USING ((public.has_role(auth.uid(), 'admin'::public.app_role) OR (auth.role() = 'service_role'::text)));

CREATE POLICY "Block client delete tx" ON public.point_transactions AS RESTRICTIVE FOR DELETE TO authenticated USING ((public.has_role(auth.uid(), 'admin'::public.app_role) OR (auth.role() = 'service_role'::text)));

CREATE POLICY "Block client delete wallet tx" ON public.wallet_transactions AS RESTRICTIVE FOR DELETE USING ((public.has_role(auth.uid(), 'admin'::public.app_role) OR (auth.role() = 'service_role'::text)));

CREATE POLICY "Block client insert otp" ON public.contract_otp_codes AS RESTRICTIVE FOR INSERT TO authenticated WITH CHECK ((public.has_role(auth.uid(), 'admin'::public.app_role) OR (auth.role() = 'service_role'::text)));

CREATE POLICY "Block client insert referrals" ON public.member_referrals AS RESTRICTIVE FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Block client insert reminders" ON public.deadline_reminders AS RESTRICTIVE FOR INSERT TO authenticated WITH CHECK ((public.has_role(auth.uid(), 'admin'::public.app_role) OR (auth.role() = 'service_role'::text)));

CREATE POLICY "Block client insert tx" ON public.point_transactions AS RESTRICTIVE FOR INSERT TO authenticated WITH CHECK ((public.has_role(auth.uid(), 'admin'::public.app_role) OR (auth.role() = 'service_role'::text)));

CREATE POLICY "Block client insert wallet tx" ON public.wallet_transactions AS RESTRICTIVE FOR INSERT WITH CHECK ((public.has_role(auth.uid(), 'admin'::public.app_role) OR (auth.role() = 'service_role'::text)));

CREATE POLICY "Block client update otp" ON public.contract_otp_codes AS RESTRICTIVE FOR UPDATE TO authenticated USING ((public.has_role(auth.uid(), 'admin'::public.app_role) OR (auth.role() = 'service_role'::text)));

CREATE POLICY "Block client update referrals" ON public.member_referrals AS RESTRICTIVE FOR UPDATE USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Block client update reminders" ON public.deadline_reminders AS RESTRICTIVE FOR UPDATE TO authenticated USING ((public.has_role(auth.uid(), 'admin'::public.app_role) OR (auth.role() = 'service_role'::text)));

CREATE POLICY "Block client update tx" ON public.point_transactions AS RESTRICTIVE FOR UPDATE TO authenticated USING ((public.has_role(auth.uid(), 'admin'::public.app_role) OR (auth.role() = 'service_role'::text)));

CREATE POLICY "Block client update wallet tx" ON public.wallet_transactions AS RESTRICTIVE FOR UPDATE USING ((public.has_role(auth.uid(), 'admin'::public.app_role) OR (auth.role() = 'service_role'::text)));

CREATE POLICY "Block direct insert" ON public.withdrawal_requests FOR INSERT WITH CHECK (false);

CREATE POLICY "Block non-admin role writes" ON public.user_roles AS RESTRICTIVE TO authenticated, anon USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Block non-service access to suppressed" ON public.suppressed_emails AS RESTRICTIVE TO authenticated, anon USING (false) WITH CHECK (false);

CREATE POLICY "Block non-service access to unsub tokens" ON public.email_unsubscribe_tokens AS RESTRICTIVE TO authenticated, anon USING (false) WITH CHECK (false);

CREATE POLICY "Clients view their contract evidence" ON public.contract_evidence FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.contracts c
  WHERE ((c.id = contract_evidence.contract_id) AND (c.user_id = auth.uid())))));

CREATE POLICY "Clients view their contract versions" ON public.contract_versions FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.contracts c
  WHERE ((c.id = contract_versions.contract_id) AND (c.user_id = auth.uid())))));

CREATE POLICY "Insert own answers" ON public.assessment_answers FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM public.assessment_attempts at
  WHERE ((at.id = assessment_answers.attempt_id) AND ((at.user_id = auth.uid()) OR ((at.user_id IS NULL) AND (at.anonymous_id IS NOT NULL)))))));

CREATE POLICY "Insert own financing docs" ON public.financing_documents FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM public.financing_applications a
  WHERE ((a.id = financing_documents.application_id) AND (a.user_id = auth.uid())))));

CREATE POLICY "Owner or admin can view clicks" ON public.referral_clicks FOR SELECT TO authenticated USING ((public.has_role(auth.uid(), 'admin'::public.app_role) OR (EXISTS ( SELECT 1
   FROM public.user_referrals ur
  WHERE ((ur.ref_code = referral_clicks.ref_code) AND (ur.user_id = auth.uid()))))));

CREATE POLICY "Owner or admin can view conversions" ON public.referral_conversions FOR SELECT TO authenticated USING ((public.has_role(auth.uid(), 'admin'::public.app_role) OR (EXISTS ( SELECT 1
   FROM public.user_referrals ur
  WHERE ((ur.ref_code = referral_conversions.ref_code) AND (ur.user_id = auth.uid()))))));

CREATE POLICY "Owner or admin delete docs" ON public.financing_documents FOR DELETE USING ((EXISTS ( SELECT 1
   FROM public.financing_applications a
  WHERE ((a.id = financing_documents.application_id) AND (((a.user_id = auth.uid()) AND (a.status = ANY (ARRAY['draft'::public.financing_status, 'documents_pending'::public.financing_status]))) OR public.is_financing_admin(auth.uid()))))));

CREATE POLICY "Owner sign or admin manage contracts" ON public.financing_contracts FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM public.financing_applications a
  WHERE ((a.id = financing_contracts.application_id) AND ((a.user_id = auth.uid()) OR public.is_financing_admin(auth.uid()))))));

CREATE POLICY "Public can track orders by tracking info" ON public.orders FOR SELECT TO authenticated, anon USING (false);

CREATE POLICY "Public can view active assessments" ON public.assessments FOR SELECT USING ((is_active = true));

CREATE POLICY "Public can view options" ON public.assessment_options FOR SELECT USING ((EXISTS ( SELECT 1
   FROM (public.assessment_questions q
     JOIN public.assessments a ON ((a.id = q.assessment_id)))
  WHERE ((q.id = assessment_options.question_id) AND (a.is_active = true)))));

CREATE POLICY "Public can view questions of active assessments" ON public.assessment_questions FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.assessments a
  WHERE ((a.id = assessment_questions.assessment_id) AND (a.is_active = true)))));

CREATE POLICY "Service role can insert send log" ON public.email_send_log FOR INSERT WITH CHECK ((auth.role() = 'service_role'::text));

CREATE POLICY "Service role can insert suppressed emails" ON public.suppressed_emails FOR INSERT WITH CHECK ((auth.role() = 'service_role'::text));

CREATE POLICY "Service role can insert tokens" ON public.email_unsubscribe_tokens FOR INSERT WITH CHECK ((auth.role() = 'service_role'::text));

CREATE POLICY "Service role can manage send state" ON public.email_send_state USING ((auth.role() = 'service_role'::text)) WITH CHECK ((auth.role() = 'service_role'::text));

CREATE POLICY "Service role can mark tokens as used" ON public.email_unsubscribe_tokens FOR UPDATE USING ((auth.role() = 'service_role'::text)) WITH CHECK ((auth.role() = 'service_role'::text));

CREATE POLICY "Service role can read send log" ON public.email_send_log FOR SELECT USING ((auth.role() = 'service_role'::text));

CREATE POLICY "Service role can read suppressed emails" ON public.suppressed_emails FOR SELECT USING ((auth.role() = 'service_role'::text));

CREATE POLICY "Service role can read tokens" ON public.email_unsubscribe_tokens FOR SELECT USING ((auth.role() = 'service_role'::text));

CREATE POLICY "Service role can update send log" ON public.email_send_log FOR UPDATE USING ((auth.role() = 'service_role'::text)) WITH CHECK ((auth.role() = 'service_role'::text));

CREATE POLICY "Users add attachments to own tickets" ON public.ticket_attachments FOR INSERT WITH CHECK (((auth.uid() = user_id) AND (EXISTS ( SELECT 1
   FROM public.tickets t
  WHERE ((t.id = ticket_attachments.ticket_id) AND (t.user_id = auth.uid()))))));

CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK ((auth.uid() = id));

CREATE POLICY "Users can pay own invoices" ON public.invoice_payments FOR INSERT TO authenticated WITH CHECK (((payment_method = ANY (ARRAY['wallet'::text, 'bank_transfer'::text])) AND (created_by = auth.uid()) AND (EXISTS ( SELECT 1
   FROM public.invoices i
  WHERE ((i.id = invoice_payments.invoice_id) AND (i.user_id = auth.uid()))))));

CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING ((auth.uid() = id));

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING ((auth.uid() = id));

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING ((auth.uid() = user_id));

CREATE POLICY "Users can view their own usage" ON public.smart_editor_usage FOR SELECT USING ((auth.uid() = user_id));

CREATE POLICY "Users create orders" ON public.orders FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));

CREATE POLICY "Users create own attachments" ON public.order_attachments FOR INSERT WITH CHECK ((auth.uid() = user_id));

CREATE POLICY "Users create own conversations" ON public.chat_conversations FOR INSERT WITH CHECK ((auth.uid() = user_id));

CREATE POLICY "Users create own financing apps" ON public.financing_applications FOR INSERT WITH CHECK ((auth.uid() = user_id));

CREATE POLICY "Users create own memberships" ON public.user_memberships FOR INSERT TO authenticated WITH CHECK (((auth.uid() = user_id) AND (status = 'pending'::text) AND (COALESCE(amount_paid, (0)::numeric) = (0)::numeric) AND (COALESCE(cashback_credited, false) = false)));

CREATE POLICY "Users create own orders" ON public.service_orders FOR INSERT WITH CHECK ((auth.uid() = user_id));

CREATE POLICY "Users create own referral" ON public.user_referrals FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));

CREATE POLICY "Users create own research" ON public.research_publications FOR INSERT WITH CHECK ((auth.uid() = user_id));

CREATE POLICY "Users create own tickets" ON public.tickets FOR INSERT WITH CHECK ((auth.uid() = user_id));

CREATE POLICY "Users create own topup requests" ON public.wallet_topup_requests FOR INSERT WITH CHECK ((auth.uid() = user_id));

CREATE POLICY "Users delete own analyses" ON public.statistical_analyses FOR DELETE USING ((auth.uid() = user_id));

CREATE POLICY "Users insert own analyses" ON public.statistical_analyses FOR INSERT WITH CHECK ((auth.uid() = user_id));

CREATE POLICY "Users insert own analyses" ON public.translation_file_analyses FOR INSERT WITH CHECK ((auth.uid() = user_id));

CREATE POLICY "Users insert own growth_events" ON public.growth_events FOR INSERT WITH CHECK (((auth.uid() = user_id) OR (user_id IS NULL)));

CREATE POLICY "Users insert their assignment" ON public.experiment_assignments FOR INSERT WITH CHECK ((((auth.uid() IS NOT NULL) AND (user_id = auth.uid())) OR ((auth.uid() IS NULL) AND (anonymous_id IS NOT NULL) AND (user_id IS NULL))));

CREATE POLICY "Users insert their events" ON public.experiment_events FOR INSERT WITH CHECK ((((auth.uid() IS NOT NULL) AND (user_id = auth.uid())) OR ((auth.uid() IS NULL) AND (anonymous_id IS NOT NULL) AND (user_id IS NULL))));

CREATE POLICY "Users read their own assignment" ON public.experiment_assignments FOR SELECT USING ((((auth.uid() IS NOT NULL) AND (user_id = auth.uid())) OR public.has_role(auth.uid(), 'admin'::public.app_role)));

CREATE POLICY "Users send messages in own conversations" ON public.chat_messages FOR INSERT WITH CHECK (((auth.uid() = sender_id) AND (EXISTS ( SELECT 1
   FROM public.chat_conversations
  WHERE ((chat_conversations.id = chat_messages.conversation_id) AND (chat_conversations.user_id = auth.uid()))))));

CREATE POLICY "Users send messages on own orders" ON public.service_order_messages FOR INSERT WITH CHECK (((auth.uid() = sender_id) AND (sender_type = 'client'::text) AND (EXISTS ( SELECT 1
   FROM public.service_orders so
  WHERE ((so.id = service_order_messages.order_id) AND (so.user_id = auth.uid()))))));

CREATE POLICY "Users send messages on own publications" ON public.research_publication_messages FOR INSERT WITH CHECK (((sender_id = auth.uid()) AND ((EXISTS ( SELECT 1
   FROM public.research_publications p
  WHERE ((p.id = research_publication_messages.publication_id) AND (p.user_id = auth.uid())))) OR public.has_role(auth.uid(), 'admin'::public.app_role))));

CREATE POLICY "Users send messages on own tickets" ON public.ticket_messages FOR INSERT WITH CHECK (((auth.uid() = sender_id) AND (sender_type = 'client'::text) AND (EXISTS ( SELECT 1
   FROM public.tickets t
  WHERE ((t.id = ticket_messages.ticket_id) AND (t.user_id = auth.uid()))))));

CREATE POLICY "Users update own analyses" ON public.statistical_analyses FOR UPDATE USING ((auth.uid() = user_id));

CREATE POLICY "Users update own attempts" ON public.assessment_attempts FOR UPDATE USING (((user_id = auth.uid()) OR ((user_id IS NULL) AND (anonymous_id IS NOT NULL)) OR public.has_role(auth.uid(), 'admin'::public.app_role)));

CREATE POLICY "Users update own draft apps" ON public.financing_applications FOR UPDATE USING ((((auth.uid() = user_id) AND (status = ANY (ARRAY['draft'::public.financing_status, 'documents_pending'::public.financing_status]))) OR public.is_financing_admin(auth.uid())));

CREATE POLICY "Users update own notifications" ON public.user_notifications FOR UPDATE USING ((auth.uid() = user_id));

CREATE POLICY "Users update own orders for quotes" ON public.service_orders FOR UPDATE TO authenticated USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));

CREATE POLICY "Users update own pending analyses" ON public.translation_file_analyses FOR UPDATE USING (((auth.uid() = user_id) AND (approval_status = 'pending'::text)));

CREATE POLICY "Users update own pending research" ON public.research_publications FOR UPDATE USING (((auth.uid() = user_id) AND (status = ANY (ARRAY['new'::text, 'draft'::text]))));

CREATE POLICY "Users view own analyses" ON public.statistical_analyses FOR SELECT USING ((auth.uid() = user_id));

CREATE POLICY "Users view own analyses" ON public.translation_file_analyses FOR SELECT USING ((auth.uid() = user_id));

CREATE POLICY "Users view own attachments" ON public.order_attachments FOR SELECT USING (((auth.uid() = user_id) OR public.has_role(auth.uid(), 'admin'::public.app_role)));

CREATE POLICY "Users view own attempts" ON public.assessment_attempts FOR SELECT USING (((user_id = auth.uid()) OR ((user_id IS NULL) AND (anonymous_id IS NOT NULL)) OR public.has_role(auth.uid(), 'admin'::public.app_role)));

CREATE POLICY "Users view own conversation messages" ON public.chat_messages FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.chat_conversations
  WHERE ((chat_conversations.id = chat_messages.conversation_id) AND (chat_conversations.user_id = auth.uid())))));

CREATE POLICY "Users view own conversations" ON public.chat_conversations FOR SELECT USING ((auth.uid() = user_id));

CREATE POLICY "Users view own customer record" ON public.customers FOR SELECT USING ((auth.uid() = user_id));

CREATE POLICY "Users view own cv purchases" ON public.cv_purchases FOR SELECT USING ((auth.uid() = user_id));

CREATE POLICY "Users view own deadline reminders" ON public.deadline_reminders FOR SELECT USING ((auth.uid() = user_id));

CREATE POLICY "Users view own financing apps" ON public.financing_applications FOR SELECT USING (((auth.uid() = user_id) OR public.is_financing_admin(auth.uid())));

CREATE POLICY "Users view own history" ON public.membership_history FOR SELECT USING ((auth.uid() = user_id));

CREATE POLICY "Users view own invoice items" ON public.invoice_items FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.invoices
  WHERE ((invoices.id = invoice_items.invoice_id) AND (invoices.user_id = auth.uid())))));

CREATE POLICY "Users view own invoice payments" ON public.invoice_payments FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.invoices i
  WHERE ((i.id = invoice_payments.invoice_id) AND (i.user_id = auth.uid())))));

CREATE POLICY "Users view own invoice timeline" ON public.invoice_timeline FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.invoices i
  WHERE ((i.id = invoice_timeline.invoice_id) AND (i.user_id = auth.uid())))));

CREATE POLICY "Users view own invoices" ON public.invoices FOR SELECT USING ((auth.uid() = user_id));

CREATE POLICY "Users view own memberships" ON public.user_memberships FOR SELECT USING ((auth.uid() = user_id));

CREATE POLICY "Users view own notifications" ON public.user_notifications FOR SELECT USING ((auth.uid() = user_id));

CREATE POLICY "Users view own order messages" ON public.service_order_messages FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.service_orders so
  WHERE ((so.id = service_order_messages.order_id) AND (so.user_id = auth.uid())))));

CREATE POLICY "Users view own order timeline" ON public.order_timeline FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.orders
  WHERE ((orders.id = order_timeline.order_id) AND (orders.user_id = auth.uid())))));

CREATE POLICY "Users view own order timeline" ON public.service_order_timeline FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.service_orders
  WHERE ((service_orders.id = service_order_timeline.order_id) AND (service_orders.user_id = auth.uid())))));

CREATE POLICY "Users view own orders" ON public.orders FOR SELECT USING ((auth.uid() = user_id));

CREATE POLICY "Users view own orders" ON public.service_orders FOR SELECT USING ((auth.uid() = user_id));

CREATE POLICY "Users view own point tx" ON public.point_transactions FOR SELECT USING ((auth.uid() = user_id));

CREATE POLICY "Users view own publication messages" ON public.research_publication_messages FOR SELECT USING (((EXISTS ( SELECT 1
   FROM public.research_publications p
  WHERE ((p.id = research_publication_messages.publication_id) AND (p.user_id = auth.uid())))) OR public.has_role(auth.uid(), 'admin'::public.app_role)));

CREATE POLICY "Users view own publication quotes" ON public.research_publication_quotes FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.research_publications rp
  WHERE ((rp.id = research_publication_quotes.publication_id) AND (rp.user_id = auth.uid())))));

CREATE POLICY "Users view own referral" ON public.user_referrals FOR SELECT TO authenticated USING (((auth.uid() = user_id) OR public.has_role(auth.uid(), 'admin'::public.app_role)));

CREATE POLICY "Users view own referral audit" ON public.referral_audit_logs FOR SELECT TO authenticated USING (((auth.uid() = referrer_user_id) OR (auth.uid() = referred_user_id)));

CREATE POLICY "Users view own referrals (as referred)" ON public.member_referrals FOR SELECT USING ((auth.uid() = referred_user_id));

CREATE POLICY "Users view own referrals (as referrer)" ON public.member_referrals FOR SELECT USING ((auth.uid() = referrer_user_id));

CREATE POLICY "Users view own research" ON public.research_publications FOR SELECT USING ((auth.uid() = user_id));

CREATE POLICY "Users view own spins" ON public.spin_attempts FOR SELECT TO authenticated USING ((auth.uid() = user_id));

CREATE POLICY "Users view own ticket attachments" ON public.ticket_attachments FOR SELECT USING (((EXISTS ( SELECT 1
   FROM public.tickets t
  WHERE ((t.id = ticket_attachments.ticket_id) AND (t.user_id = auth.uid())))) OR public.has_role(auth.uid(), 'admin'::public.app_role)));

CREATE POLICY "Users view own ticket messages" ON public.ticket_messages FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.tickets t
  WHERE ((t.id = ticket_messages.ticket_id) AND (t.user_id = auth.uid())))));

CREATE POLICY "Users view own ticket timeline" ON public.ticket_timeline FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.tickets t
  WHERE ((t.id = ticket_timeline.ticket_id) AND (t.user_id = auth.uid())))));

CREATE POLICY "Users view own tickets" ON public.tickets FOR SELECT USING ((auth.uid() = user_id));

CREATE POLICY "Users view own topup requests" ON public.wallet_topup_requests FOR SELECT USING ((auth.uid() = user_id));

CREATE POLICY "Users view own transactions" ON public.payment_transactions FOR SELECT USING ((auth.uid() = user_id));

CREATE POLICY "Users view own wallet" ON public.wallets FOR SELECT USING ((auth.uid() = user_id));

CREATE POLICY "Users view own wallet transactions" ON public.wallet_transactions FOR SELECT USING ((auth.uid() = user_id));

CREATE POLICY "Users view own withdrawals" ON public.withdrawal_requests FOR SELECT USING ((auth.uid() = user_id));

CREATE POLICY "Users view own xp tx" ON public.xp_transactions FOR SELECT USING ((auth.uid() = user_id));

CREATE POLICY "Users view targeted notifications" ON public.notifications FOR SELECT TO authenticated USING (((target_audience = 'all'::text) OR (target_audience = (auth.uid())::text) OR public.has_role(auth.uid(), 'admin'::public.app_role)));

CREATE POLICY "View own answers" ON public.assessment_answers FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.assessment_attempts at
  WHERE ((at.id = assessment_answers.attempt_id) AND ((at.user_id = auth.uid()) OR ((at.user_id IS NULL) AND (at.anonymous_id IS NOT NULL)) OR public.has_role(auth.uid(), 'admin'::public.app_role))))));

CREATE POLICY "View own credit events" ON public.wallet_credit_events FOR SELECT USING (((auth.uid() = user_id) OR public.is_financing_admin(auth.uid())));

CREATE POLICY "View own financing contracts" ON public.financing_contracts FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.financing_applications a
  WHERE ((a.id = financing_contracts.application_id) AND ((a.user_id = auth.uid()) OR public.is_financing_admin(auth.uid()))))));

CREATE POLICY "View own financing docs" ON public.financing_documents FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.financing_applications a
  WHERE ((a.id = financing_documents.application_id) AND ((a.user_id = auth.uid()) OR public.is_financing_admin(auth.uid()))))));

CREATE POLICY "View own installments" ON public.financing_installments FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.financing_applications a
  WHERE ((a.id = financing_installments.application_id) AND ((a.user_id = auth.uid()) OR public.is_financing_admin(auth.uid()))))));

CREATE POLICY "View own status logs" ON public.financing_status_logs FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.financing_applications a
  WHERE ((a.id = financing_status_logs.application_id) AND ((a.user_id = auth.uid()) OR public.is_financing_admin(auth.uid()))))));

CREATE POLICY ack_insert_owner ON public.financing_acknowledgments FOR INSERT WITH CHECK ((auth.uid() = user_id));

CREATE POLICY ack_select_admin ON public.financing_acknowledgments FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY ack_select_owner ON public.financing_acknowledgments FOR SELECT USING ((auth.uid() = user_id));

CREATE POLICY "admins manage bonus drops" ON public.bonus_drops TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "admins manage referral codes" ON public.user_referral_codes USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "admins manage referrals" ON public.referrals USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "admins read referral events" ON public.referral_events FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY admins_all_actions_log ON public.automation_actions_log TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY admins_all_insights ON public.automation_insights TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY admins_all_rules ON public.automation_rules TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY admins_all_snapshots ON public.automation_snapshots TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY admins_can_insert_inbox ON public.user_inbox_notifications FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY admins_manage_all_inbox ON public.user_inbox_notifications USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY admins_select_study_sessions ON public.study_sessions FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "anyone can log valid referral event" ON public.referral_events FOR INSERT TO authenticated, anon WITH CHECK (((ref_code IS NOT NULL) AND (length(TRIM(BOTH FROM ref_code)) > 0)));

CREATE POLICY "anyone views active bonus drops" ON public.bonus_drops FOR SELECT TO authenticated USING ((is_active = true));

ALTER TABLE public.assessment_answers ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.assessment_attempts ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.assessment_options ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.assessment_questions ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.auth_phone_lockouts ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.auth_whatsapp_otp ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.automation_actions_log ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.automation_insights ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.automation_rules ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.automation_snapshots ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.bonus_drop_views ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.bonus_drops ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY choices_admin_all ON public.question_choices USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY choices_public_read ON public.question_choices FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.questions q
  WHERE ((q.id = question_choices.question_id) AND (q.is_active = true)))));

ALTER TABLE public.contract_evidence ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.contract_otp_codes ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.contract_signatures ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.contract_timeline ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.contract_versions ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

CREATE POLICY contracts_admin_delete_unsigned ON public.contracts FOR DELETE USING ((public.has_role(auth.uid(), 'admin'::public.app_role) AND (locked_at IS NULL)));

CREATE POLICY contracts_admin_insert ON public.contracts FOR INSERT WITH CHECK ((public.has_role(auth.uid(), 'admin'::public.app_role) AND (status = ANY (ARRAY['draft'::text, 'pending_signature'::text])) AND (locked_at IS NULL)));

CREATE POLICY contracts_admin_select ON public.contracts FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY contracts_admin_update_unsigned ON public.contracts FOR UPDATE USING ((public.has_role(auth.uid(), 'admin'::public.app_role) AND (locked_at IS NULL))) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY contracts_select_own ON public.contracts FOR SELECT USING ((auth.uid() = user_id));

CREATE POLICY contracts_user_insert_financing ON public.contracts FOR INSERT TO authenticated WITH CHECK (((auth.uid() = user_id) AND (template_type = 'financing'::text) AND (locked_at IS NULL) AND (status = ANY (ARRAY['draft'::text, 'pending_signature'::text])) AND (EXISTS ( SELECT 1
   FROM public.financing_applications fa
  WHERE ((fa.id = ((contracts.metadata ->> 'application_id'::text))::uuid) AND (fa.user_id = auth.uid()))))));

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.cv_purchases ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.daily_growth_metrics ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.deadline_reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY deny_all_auth_otp_delete ON public.auth_whatsapp_otp FOR DELETE USING (false);

CREATE POLICY deny_all_auth_otp_insert ON public.auth_whatsapp_otp FOR INSERT WITH CHECK (false);

CREATE POLICY deny_all_auth_otp_select ON public.auth_whatsapp_otp FOR SELECT USING (false);

CREATE POLICY deny_all_auth_otp_update ON public.auth_whatsapp_otp FOR UPDATE USING (false);

CREATE POLICY deny_all_lockouts_delete ON public.auth_phone_lockouts FOR DELETE USING (false);

CREATE POLICY deny_all_lockouts_insert ON public.auth_phone_lockouts FOR INSERT WITH CHECK (false);

CREATE POLICY deny_all_lockouts_select ON public.auth_phone_lockouts FOR SELECT USING (false);

CREATE POLICY deny_all_lockouts_update ON public.auth_phone_lockouts FOR UPDATE USING (false);

ALTER TABLE public.email_send_log ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.email_send_state ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.email_unsubscribe_tokens ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.experiment_assignments ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.experiment_audit_logs ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.experiment_events ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.experiment_results_snapshots ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.experiment_variants ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.experiments ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.financing_acknowledgments ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.financing_applications ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.financing_contracts ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.financing_documents ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.financing_installments ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.financing_payment_receipts ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.financing_status_logs ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.financing_whatsapp_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY fpr_admins_update ON public.financing_payment_receipts FOR UPDATE TO authenticated USING (public.is_financing_admin(auth.uid()));

CREATE POLICY fpr_admins_view_all ON public.financing_payment_receipts FOR SELECT TO authenticated USING (public.is_financing_admin(auth.uid()));

CREATE POLICY fpr_users_insert_own ON public.financing_payment_receipts FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));

CREATE POLICY fpr_users_view_own ON public.financing_payment_receipts FOR SELECT TO authenticated USING ((auth.uid() = user_id));

ALTER TABLE public.gateway_webhooks ENABLE ROW LEVEL SECURITY;

CREATE POLICY go_delete_admin ON public.group_orders FOR DELETE USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY go_insert_self_creator ON public.group_orders FOR INSERT WITH CHECK ((creator_id = auth.uid()));

CREATE POLICY go_select_member_or_creator_or_admin ON public.group_orders FOR SELECT USING (((creator_id = auth.uid()) OR public.has_role(auth.uid(), 'admin'::public.app_role) OR (EXISTS ( SELECT 1
   FROM public.group_order_members m
  WHERE ((m.group_order_id = group_orders.id) AND (m.user_id = auth.uid()))))));

CREATE POLICY go_update_creator_or_admin ON public.group_orders FOR UPDATE USING (((creator_id = auth.uid()) OR public.has_role(auth.uid(), 'admin'::public.app_role)));

CREATE POLICY goa_select_involved_or_admin ON public.group_order_audit FOR SELECT USING ((public.has_role(auth.uid(), 'admin'::public.app_role) OR (EXISTS ( SELECT 1
   FROM public.group_orders g
  WHERE ((g.id = group_order_audit.group_order_id) AND (g.creator_id = auth.uid())))) OR (EXISTS ( SELECT 1
   FROM public.group_order_members m
  WHERE ((m.group_order_id = group_order_audit.group_order_id) AND (m.user_id = auth.uid()))))));

CREATE POLICY gom_insert_self ON public.group_order_members FOR INSERT WITH CHECK ((user_id = auth.uid()));

CREATE POLICY gom_select_self_or_member_or_admin ON public.group_order_members FOR SELECT USING (((user_id = auth.uid()) OR public.has_role(auth.uid(), 'admin'::public.app_role) OR (EXISTS ( SELECT 1
   FROM public.group_order_members m2
  WHERE ((m2.group_order_id = group_order_members.group_order_id) AND (m2.user_id = auth.uid()))))));

CREATE POLICY gom_update_self_or_admin ON public.group_order_members FOR UPDATE USING (((user_id = auth.uid()) OR public.has_role(auth.uid(), 'admin'::public.app_role)));

ALTER TABLE public.group_order_audit ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.group_order_members ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.group_orders ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.growth_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY gw_admins_select ON public.gateway_webhooks FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY gw_block_client ON public.gateway_webhooks AS RESTRICTIVE TO authenticated, anon USING ((public.has_role(auth.uid(), 'admin'::public.app_role) OR (auth.role() = 'service_role'::text))) WITH CHECK ((auth.role() = 'service_role'::text));

ALTER TABLE public.inbox_messages ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.inbox_notes ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.inbox_replies ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.inbox_reply_templates ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.invoice_payments ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.invoice_timeline ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY kb_read ON public.support_kb_articles FOR SELECT USING (((is_published = true) OR public.has_role(auth.uid(), 'admin'::public.app_role)));

CREATE POLICY kb_write ON public.support_kb_articles USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

ALTER TABLE public.member_referrals ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.membership_history ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.membership_plans ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.order_attachments ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.order_timeline ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY pa_admins_all ON public.payment_attempts USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY pa_users_select_own ON public.payment_attempts FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.payment_intents pi
  WHERE ((pi.id = payment_attempts.payment_intent_id) AND (pi.user_id = auth.uid())))));

ALTER TABLE public.payment_attempts ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.payment_intents ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.payment_reconciliation_items ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.payment_reconciliation_runs ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY pi_admins_all ON public.payment_intents USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY pi_block_client_delete ON public.payment_intents AS RESTRICTIVE FOR DELETE TO authenticated USING ((public.has_role(auth.uid(), 'admin'::public.app_role) OR (auth.role() = 'service_role'::text)));

CREATE POLICY pi_block_client_insert ON public.payment_intents AS RESTRICTIVE FOR INSERT TO authenticated WITH CHECK ((public.has_role(auth.uid(), 'admin'::public.app_role) OR (auth.role() = 'service_role'::text)));

CREATE POLICY pi_block_client_update ON public.payment_intents AS RESTRICTIVE FOR UPDATE TO authenticated USING ((public.has_role(auth.uid(), 'admin'::public.app_role) OR (auth.role() = 'service_role'::text)));

CREATE POLICY pi_users_select_own ON public.payment_intents FOR SELECT USING ((auth.uid() = user_id));

ALTER TABLE public.point_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY presence_del ON public.ticket_presence FOR DELETE USING ((user_id = auth.uid()));

CREATE POLICY presence_ins ON public.ticket_presence FOR INSERT WITH CHECK ((user_id = auth.uid()));

CREATE POLICY presence_select ON public.ticket_presence FOR SELECT USING ((public.has_role(auth.uid(), 'admin'::public.app_role) OR (EXISTS ( SELECT 1
   FROM public.tickets t
  WHERE ((t.id = ticket_presence.ticket_id) AND (t.user_id = auth.uid()))))));

CREATE POLICY presence_upd ON public.ticket_presence FOR UPDATE USING ((user_id = auth.uid()));

CREATE POLICY pri_admins_all ON public.payment_reconciliation_items USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY prr_admins_all ON public.payment_reconciliation_runs USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY qcat_admin_all ON public.question_categories USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY qcat_public_read ON public.question_categories FOR SELECT USING ((is_active = true));

CREATE POLICY qr_admin_all ON public.ticket_quick_replies USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY qtags_admin_all ON public.question_tags USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY qtags_public_read ON public.question_tags FOR SELECT USING (true);

ALTER TABLE public.question_categories ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.question_choices ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.question_tags ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY questions_admin_all ON public.questions USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY questions_public_read ON public.questions FOR SELECT USING ((is_active = true));

ALTER TABLE public.referral_audit_logs ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.referral_clicks ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.referral_conversions ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.referral_events ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.referral_viral_rewards ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.research_publication_messages ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.research_publication_quotes ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.research_publications ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY service_categories_admin_all ON public.service_categories TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY service_categories_select_all ON public.service_categories FOR SELECT USING (true);

ALTER TABLE public.service_order_admin_notes ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.service_order_messages ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.service_order_timeline ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.service_orders ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY services_admin_all ON public.services TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY services_select_active ON public.services FOR SELECT USING (((is_active = true) OR public.has_role(auth.uid(), 'admin'::public.app_role)));

CREATE POLICY signatures_admin_select ON public.contract_signatures FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY signatures_select_own ON public.contract_signatures FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.contracts c
  WHERE ((c.id = contract_signatures.contract_id) AND (c.user_id = auth.uid())))));

CREATE POLICY signatures_user_insert_own ON public.contract_signatures FOR INSERT WITH CHECK (((signer_user_id IS NOT NULL) AND (auth.uid() = signer_user_id) AND (EXISTS ( SELECT 1
   FROM public.contracts c
  WHERE ((c.id = contract_signatures.contract_id) AND (c.user_id = auth.uid()) AND (c.locked_at IS NULL))))));

ALTER TABLE public.smart_editor_usage ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.spin_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY ss_delete_own ON public.study_sessions FOR DELETE USING ((auth.uid() = user_id));

CREATE POLICY ss_insert_own ON public.study_sessions FOR INSERT WITH CHECK ((auth.uid() = user_id));

CREATE POLICY ss_select_own ON public.study_sessions FOR SELECT USING ((auth.uid() = user_id));

CREATE POLICY ss_update_own ON public.study_sessions FOR UPDATE USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));

ALTER TABLE public.statistical_analyses ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.study_challenge_attempts ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.study_challenge_check_ins ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

CREATE POLICY subjects_admin_all ON public.subjects USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY subjects_public_read ON public.subjects FOR SELECT USING ((is_active = true));

ALTER TABLE public.support_kb_articles ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.suppressed_emails ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.ticket_attachments ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.ticket_presence ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.ticket_quick_replies ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.ticket_timeline ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.ticket_typing ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY timeline_admin_select ON public.contract_timeline FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY timeline_insert_admin_or_system ON public.contract_timeline FOR INSERT WITH CHECK ((public.has_role(auth.uid(), 'admin'::public.app_role) OR (auth.uid() IS NOT NULL)));

CREATE POLICY timeline_select_own ON public.contract_timeline FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.contracts c
  WHERE ((c.id = contract_timeline.contract_id) AND (c.user_id = auth.uid())))));

ALTER TABLE public.translation_file_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY typing_del ON public.ticket_typing FOR DELETE USING ((user_id = auth.uid()));

CREATE POLICY typing_ins ON public.ticket_typing FOR INSERT WITH CHECK ((user_id = auth.uid()));

CREATE POLICY typing_select ON public.ticket_typing FOR SELECT USING ((public.has_role(auth.uid(), 'admin'::public.app_role) OR (EXISTS ( SELECT 1
   FROM public.tickets t
  WHERE ((t.id = ticket_typing.ticket_id) AND (t.user_id = auth.uid()))))));

CREATE POLICY typing_upd ON public.ticket_typing FOR UPDATE USING ((user_id = auth.uid()));

CREATE POLICY uans_admin_read ON public.user_answers FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY uans_self_insert ON public.user_answers FOR INSERT WITH CHECK ((auth.uid() = user_id));

CREATE POLICY uans_self_read ON public.user_answers FOR SELECT USING ((auth.uid() = user_id));

ALTER TABLE public.user_answers ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.user_inbox_notifications ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.user_memberships ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.user_referral_codes ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.user_referrals ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.user_secret_features ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users delete own notes" ON public.workspace_notes FOR DELETE USING ((auth.uid() = user_id));

CREATE POLICY "users insert own attempts" ON public.study_challenge_attempts FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));

CREATE POLICY "users insert own bonus drop views" ON public.bonus_drop_views FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));

CREATE POLICY "users insert own check-ins" ON public.study_challenge_check_ins FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));

CREATE POLICY "users insert own notes" ON public.workspace_notes FOR INSERT WITH CHECK ((auth.uid() = user_id));

CREATE POLICY "users read own referral code" ON public.user_referral_codes FOR SELECT USING (((auth.uid() = user_id) OR public.has_role(auth.uid(), 'admin'::public.app_role)));

CREATE POLICY "users read own referrals" ON public.referrals FOR SELECT USING (((auth.uid() = referrer_user_id) OR (auth.uid() = referred_user_id) OR public.has_role(auth.uid(), 'admin'::public.app_role)));

CREATE POLICY "users update own attempts" ON public.study_challenge_attempts FOR UPDATE TO authenticated USING ((auth.uid() = user_id));

CREATE POLICY "users update own notes" ON public.workspace_notes FOR UPDATE USING ((auth.uid() = user_id));

CREATE POLICY "users view own attempts" ON public.study_challenge_attempts FOR SELECT TO authenticated USING ((auth.uid() = user_id));

CREATE POLICY "users view own bonus drop views" ON public.bonus_drop_views FOR SELECT TO authenticated USING ((auth.uid() = user_id));

CREATE POLICY "users view own check-ins" ON public.study_challenge_check_ins FOR SELECT TO authenticated USING ((auth.uid() = user_id));

CREATE POLICY "users view own notes" ON public.workspace_notes FOR SELECT USING ((auth.uid() = user_id));

CREATE POLICY "users view own secret features" ON public.user_secret_features FOR SELECT TO authenticated USING ((auth.uid() = user_id));

CREATE POLICY "users view own viral rewards" ON public.referral_viral_rewards FOR SELECT TO authenticated USING (((auth.uid() = referrer_user_id) OR (auth.uid() = referred_user_id)));

CREATE POLICY users_update_own_inbox ON public.user_inbox_notifications FOR UPDATE USING ((auth.uid() = user_id));

CREATE POLICY users_view_own_inbox ON public.user_inbox_notifications FOR SELECT USING ((auth.uid() = user_id));

ALTER TABLE public.wallet_credit_events ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.wallet_topup_requests ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.whatsapp_bot_sessions ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.whatsapp_campaign_recipients ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.whatsapp_campaigns ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.whatsapp_conversation_notes ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.whatsapp_conversations ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.whatsapp_inbound_messages ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.whatsapp_messages ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.whatsapp_otp_codes ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.whatsapp_quick_replies ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.whatsapp_send_log ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.whatsapp_settings ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.whatsapp_templates ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.withdrawal_requests ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.workspace_notes ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.xp_daily_limits ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.xp_levels ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.xp_transactions ENABLE ROW LEVEL SECURITY;
