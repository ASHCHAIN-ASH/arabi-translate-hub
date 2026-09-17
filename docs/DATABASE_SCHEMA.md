# توثيق مخطط قاعدة البيانات — FekrahEdu

> ملف مُولَّد آليًا من قاعدة البيانات الحالية (schema: `public`). لا تحرره يدويًا؛ أعد توليده عند تغيّر المخطط.

- عدد الجداول: **137**
- عدد الأنواع المعرّفة (ENUM): **16**
- عدد الدوال (Functions/RPC): **204**
- عدد المشغّلات (Triggers): **133**
- عدد العروض (Views): **0**

## فهرس الجداول

- [`assessment_answers`](#assessment-answers)
- [`assessment_attempts`](#assessment-attempts)
- [`assessment_options`](#assessment-options)
- [`assessment_questions`](#assessment-questions)
- [`assessments`](#assessments)
- [`audit_logs`](#audit-logs)
- [`auth_phone_lockouts`](#auth-phone-lockouts)
- [`auth_whatsapp_otp`](#auth-whatsapp-otp)
- [`automation_actions_log`](#automation-actions-log)
- [`automation_insights`](#automation-insights)
- [`automation_rules`](#automation-rules)
- [`automation_snapshots`](#automation-snapshots)
- [`blog_posts`](#blog-posts)
- [`bonus_drop_views`](#bonus-drop-views)
- [`bonus_drops`](#bonus-drops)
- [`chat_conversations`](#chat-conversations)
- [`chat_messages`](#chat-messages)
- [`contract_evidence`](#contract-evidence)
- [`contract_otp_codes`](#contract-otp-codes)
- [`contract_signatures`](#contract-signatures)
- [`contract_timeline`](#contract-timeline)
- [`contract_versions`](#contract-versions)
- [`contracts`](#contracts)
- [`customers`](#customers)
- [`cv_purchases`](#cv-purchases)
- [`daily_growth_metrics`](#daily-growth-metrics)
- [`deadline_reminders`](#deadline-reminders)
- [`email_send_log`](#email-send-log)
- [`email_send_state`](#email-send-state)
- [`email_templates`](#email-templates)
- [`email_unsubscribe_tokens`](#email-unsubscribe-tokens)
- [`experiment_assignments`](#experiment-assignments)
- [`experiment_audit_logs`](#experiment-audit-logs)
- [`experiment_events`](#experiment-events)
- [`experiment_results_snapshots`](#experiment-results-snapshots)
- [`experiment_variants`](#experiment-variants)
- [`experiments`](#experiments)
- [`financing_acknowledgments`](#financing-acknowledgments)
- [`financing_applications`](#financing-applications)
- [`financing_contracts`](#financing-contracts)
- [`financing_documents`](#financing-documents)
- [`financing_installments`](#financing-installments)
- [`financing_payment_receipts`](#financing-payment-receipts)
- [`financing_status_logs`](#financing-status-logs)
- [`financing_whatsapp_logs`](#financing-whatsapp-logs)
- [`gateway_webhooks`](#gateway-webhooks)
- [`group_order_audit`](#group-order-audit)
- [`group_order_members`](#group-order-members)
- [`group_orders`](#group-orders)
- [`growth_events`](#growth-events)
- [`inbox_messages`](#inbox-messages)
- [`inbox_notes`](#inbox-notes)
- [`inbox_replies`](#inbox-replies)
- [`inbox_reply_templates`](#inbox-reply-templates)
- [`invoice_items`](#invoice-items)
- [`invoice_payments`](#invoice-payments)
- [`invoice_timeline`](#invoice-timeline)
- [`invoices`](#invoices)
- [`member_referrals`](#member-referrals)
- [`membership_history`](#membership-history)
- [`membership_plans`](#membership-plans)
- [`notifications`](#notifications)
- [`order_attachments`](#order-attachments)
- [`order_timeline`](#order-timeline)
- [`orders`](#orders)
- [`payment_attempts`](#payment-attempts)
- [`payment_intents`](#payment-intents)
- [`payment_reconciliation_items`](#payment-reconciliation-items)
- [`payment_reconciliation_runs`](#payment-reconciliation-runs)
- [`payment_transactions`](#payment-transactions)
- [`point_transactions`](#point-transactions)
- [`profiles`](#profiles)
- [`question_categories`](#question-categories)
- [`question_choices`](#question-choices)
- [`question_tags`](#question-tags)
- [`questions`](#questions)
- [`referral_audit_logs`](#referral-audit-logs)
- [`referral_clicks`](#referral-clicks)
- [`referral_conversions`](#referral-conversions)
- [`referral_events`](#referral-events)
- [`referral_viral_rewards`](#referral-viral-rewards)
- [`referrals`](#referrals)
- [`research_publication_messages`](#research-publication-messages)
- [`research_publication_quotes`](#research-publication-quotes)
- [`research_publications`](#research-publications)
- [`service_categories`](#service-categories)
- [`service_order_admin_notes`](#service-order-admin-notes)
- [`service_order_messages`](#service-order-messages)
- [`service_order_timeline`](#service-order-timeline)
- [`service_orders`](#service-orders)
- [`services`](#services)
- [`smart_editor_usage`](#smart-editor-usage)
- [`spin_attempts`](#spin-attempts)
- [`statistical_analyses`](#statistical-analyses)
- [`study_challenge_attempts`](#study-challenge-attempts)
- [`study_challenge_check_ins`](#study-challenge-check-ins)
- [`study_sessions`](#study-sessions)
- [`subjects`](#subjects)
- [`support_kb_articles`](#support-kb-articles)
- [`suppressed_emails`](#suppressed-emails)
- [`ticket_attachments`](#ticket-attachments)
- [`ticket_messages`](#ticket-messages)
- [`ticket_presence`](#ticket-presence)
- [`ticket_quick_replies`](#ticket-quick-replies)
- [`ticket_timeline`](#ticket-timeline)
- [`ticket_typing`](#ticket-typing)
- [`tickets`](#tickets)
- [`translation_file_analyses`](#translation-file-analyses)
- [`user_answers`](#user-answers)
- [`user_inbox_notifications`](#user-inbox-notifications)
- [`user_memberships`](#user-memberships)
- [`user_notifications`](#user-notifications)
- [`user_referral_codes`](#user-referral-codes)
- [`user_referrals`](#user-referrals)
- [`user_roles`](#user-roles)
- [`user_secret_features`](#user-secret-features)
- [`wallet_credit_events`](#wallet-credit-events)
- [`wallet_topup_requests`](#wallet-topup-requests)
- [`wallet_transactions`](#wallet-transactions)
- [`wallets`](#wallets)
- [`whatsapp_bot_sessions`](#whatsapp-bot-sessions)
- [`whatsapp_campaign_recipients`](#whatsapp-campaign-recipients)
- [`whatsapp_campaigns`](#whatsapp-campaigns)
- [`whatsapp_conversation_notes`](#whatsapp-conversation-notes)
- [`whatsapp_conversations`](#whatsapp-conversations)
- [`whatsapp_inbound_messages`](#whatsapp-inbound-messages)
- [`whatsapp_messages`](#whatsapp-messages)
- [`whatsapp_otp_codes`](#whatsapp-otp-codes)
- [`whatsapp_quick_replies`](#whatsapp-quick-replies)
- [`whatsapp_send_log`](#whatsapp-send-log)
- [`whatsapp_settings`](#whatsapp-settings)
- [`whatsapp_templates`](#whatsapp-templates)
- [`withdrawal_requests`](#withdrawal-requests)
- [`workspace_notes`](#workspace-notes)
- [`xp_daily_limits`](#xp-daily-limits)
- [`xp_levels`](#xp-levels)
- [`xp_transactions`](#xp-transactions)

## الأنواع المعرّفة (ENUM)

- **app_role**: `admin`, `moderator`, `user`
- **experiment_status**: `draft`, `running`, `paused`, `completed`, `archived`
- **experiment_target_area**: `challenge_result_screen`, `referral_page`, `onboarding_flow`, `share_cta`
- **financing_contract_status**: `draft`, `sent`, `signed`, `cancelled`
- **financing_doc_status**: `pending`, `approved`, `rejected`
- **financing_doc_type**: `id_front`, `id_back`, `bank_statement`, `proof_of_income`, `other`
- **financing_installment_status**: `pending`, `paid`, `overdue`, `waived`
- **financing_risk_level**: `low`, `medium`, `high`, `unknown`
- **financing_status**: `draft`, `submitted`, `documents_pending`, `under_review`, `waiting_down_payment`, `contract_pending_signature`, `approved`, `rejected`, `execution_deed`, `active`, `completed`, `overdue`, `cancelled`
- **group_member_status**: `joined`, `paid`, `refunded`, `left`
- **group_order_status**: `open`, `partially_paid`, `full`, `in_progress`, `completed`, `cancelled`, `expired`
- **order_lifecycle_status**: `received`, `under_review`, `quote_sent`, `quote_accepted`, `contract_pending`, `contract_signed`, `payment_pending`, `paid`, `in_progress`, `delivered`, `completed`, `cancelled`
- **student_event_type**: `study`, `exam`, `focus`
- **study_session_status**: `active`, `completed`, `cancelled`, `planned`
- **wallet_credit_event_type**: `financing_credit_added`, `financing_credit_reversed`, `installment_paid`
- **withdrawal_status**: `pending`, `approved`, `rejected`, `paid`

---

## تفاصيل الجداول

### assessment_answers

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `attempt_id` | `uuid` | لا | — |
| `question_id` | `uuid` | لا | — |
| `selected_option_id` | `uuid` | نعم | — |
| `is_correct` | `boolean` | لا | `false` |
| `answered_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `assessment_answers_attempt_id_fkey` — `FOREIGN KEY (attempt_id) REFERENCES assessment_attempts(id) ON DELETE CASCADE`
- `assessment_answers_question_id_fkey` — `FOREIGN KEY (question_id) REFERENCES assessment_questions(id) ON DELETE CASCADE`
- `assessment_answers_selected_option_id_fkey` — `FOREIGN KEY (selected_option_id) REFERENCES assessment_options(id) ON DELETE SET NULL`

**Unique constraints:**

- `assessment_answers_attempt_id_question_id_key` — `UNIQUE (attempt_id, question_id)`

**Indexes:**

- `CREATE UNIQUE INDEX assessment_answers_attempt_id_question_id_key ON public.assessment_answers USING btree (attempt_id, question_id)`
- `CREATE UNIQUE INDEX assessment_answers_pkey ON public.assessment_answers USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 3

---

### assessment_attempts

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `assessment_id` | `uuid` | لا | — |
| `user_id` | `uuid` | نعم | — |
| `anonymous_id` | `text` | نعم | — |
| `status` | `text` | لا | `'in_progress'::text` |
| `total_questions` | `integer` | لا | `0` |
| `correct_count` | `integer` | لا | `0` |
| `total_score` | `integer` | لا | `0` |
| `level_result` | `text` | نعم | — |
| `skill_breakdown` | `jsonb` | لا | `'{}'::jsonb` |
| `time_spent_seconds` | `integer` | لا | `0` |
| `xp_awarded` | `integer` | لا | `0` |
| `shared_at` | `timestamp with time zone` | نعم | — |
| `share_xp_awarded` | `integer` | لا | `0` |
| `started_at` | `timestamp with time zone` | لا | `now()` |
| `completed_at` | `timestamp with time zone` | نعم | — |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `assessment_attempts_assessment_id_fkey` — `FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE`

**Check constraints:**

- `assessment_attempts_status_check` — `CHECK ((status = ANY (ARRAY['in_progress'::text, 'completed'::text, 'abandoned'::text])))`
- `attempt_owner` — `CHECK (((user_id IS NOT NULL) OR (anonymous_id IS NOT NULL)))`

**Indexes:**

- `CREATE UNIQUE INDEX assessment_attempts_pkey ON public.assessment_attempts USING btree (id)`
- `CREATE INDEX idx_att_anon ON public.assessment_attempts USING btree (anonymous_id)`
- `CREATE INDEX idx_att_assess ON public.assessment_attempts USING btree (assessment_id)`
- `CREATE INDEX idx_att_user ON public.assessment_attempts USING btree (user_id)`

**RLS:** مفعّل — عدد السياسات: 4

---

### assessment_options

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `question_id` | `uuid` | لا | — |
| `option_text` | `text` | لا | — |
| `is_correct` | `boolean` | لا | `false` |
| `order_index` | `integer` | لا | `0` |
| `created_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `assessment_options_question_id_fkey` — `FOREIGN KEY (question_id) REFERENCES assessment_questions(id) ON DELETE CASCADE`

**Indexes:**

- `CREATE UNIQUE INDEX assessment_options_pkey ON public.assessment_options USING btree (id)`
- `CREATE INDEX idx_ao_question ON public.assessment_options USING btree (question_id, order_index)`

**RLS:** مفعّل — عدد السياسات: 2

---

### assessment_questions

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `assessment_id` | `uuid` | لا | — |
| `question_text` | `text` | لا | — |
| `difficulty` | `text` | لا | `'medium'::text` |
| `skill_tag` | `text` | لا | `'general'::text` |
| `explanation` | `text` | نعم | — |
| `order_index` | `integer` | لا | `0` |
| `created_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `assessment_questions_assessment_id_fkey` — `FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE`

**Check constraints:**

- `assessment_questions_difficulty_check` — `CHECK ((difficulty = ANY (ARRAY['easy'::text, 'medium'::text, 'hard'::text])))`

**Indexes:**

- `CREATE UNIQUE INDEX assessment_questions_pkey ON public.assessment_questions USING btree (id)`
- `CREATE INDEX idx_aq_assessment ON public.assessment_questions USING btree (assessment_id, order_index)`

**RLS:** مفعّل — عدد السياسات: 2

---

### assessments

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `slug` | `text` | لا | — |
| `title` | `text` | لا | — |
| `description` | `text` | نعم | — |
| `category` | `text` | لا | `'general'::text` |
| `difficulty_profile` | `jsonb` | لا | `'{"easy": 4, "hard": 2, "medium": 4}'::jsonb` |
| `time_limit_seconds` | `integer` | لا | `420` |
| `xp_completion` | `integer` | لا | `50` |
| `xp_share` | `integer` | لا | `25` |
| `cover_emoji` | `text` | نعم | `'🎯'::text` |
| `is_active` | `boolean` | لا | `true` |
| `sort_order` | `integer` | لا | `0` |
| `created_at` | `timestamp with time zone` | لا | `now()` |
| `updated_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Unique constraints:**

- `assessments_slug_key` — `UNIQUE (slug)`

**Indexes:**

- `CREATE UNIQUE INDEX assessments_pkey ON public.assessments USING btree (id)`
- `CREATE UNIQUE INDEX assessments_slug_key ON public.assessments USING btree (slug)`

**RLS:** مفعّل — عدد السياسات: 2

---

### audit_logs

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `user_id` | `uuid` | نعم | — |
| `action` | `text` | لا | — |
| `table_name` | `text` | نعم | — |
| `record_id` | `uuid` | نعم | — |
| `old_data` | `jsonb` | نعم | — |
| `new_data` | `jsonb` | نعم | — |
| `ip_address` | `text` | نعم | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `audit_logs_user_id_fkey` — `FOREIGN KEY (user_id) REFERENCES auth.users(id)`

**Indexes:**

- `CREATE UNIQUE INDEX audit_logs_pkey ON public.audit_logs USING btree (id)`
- `CREATE INDEX idx_audit_logs_created_at ON public.audit_logs USING btree (created_at)`
- `CREATE INDEX idx_audit_logs_user_id ON public.audit_logs USING btree (user_id)`

**RLS:** مفعّل — عدد السياسات: 1

---

### auth_phone_lockouts

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `phone` | `text` | لا | — |
| `locked_at` | `timestamp with time zone` | لا | `now()` |
| `locked_until` | `timestamp with time zone` | لا | — |
| `reason` | `text` | لا | `'too_many_otp_attempts'::text` |
| `created_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Indexes:**

- `CREATE UNIQUE INDEX auth_phone_lockouts_pkey ON public.auth_phone_lockouts USING btree (id)`
- `CREATE INDEX idx_auth_phone_lockouts_phone ON public.auth_phone_lockouts USING btree (phone)`
- `CREATE INDEX idx_auth_phone_lockouts_until ON public.auth_phone_lockouts USING btree (locked_until)`

**RLS:** مفعّل — عدد السياسات: 4

---

### auth_whatsapp_otp

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `phone` | `text` | لا | — |
| `code_hash` | `text` | لا | — |
| `purpose` | `text` | لا | `'login'::text` |
| `full_name` | `text` | نعم | — |
| `attempts` | `integer` | لا | `0` |
| `max_attempts` | `integer` | لا | `5` |
| `expires_at` | `timestamp with time zone` | لا | — |
| `consumed_at` | `timestamp with time zone` | نعم | — |
| `ip_address` | `text` | نعم | — |
| `user_agent` | `text` | نعم | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Indexes:**

- `CREATE UNIQUE INDEX auth_whatsapp_otp_pkey ON public.auth_whatsapp_otp USING btree (id)`
- `CREATE INDEX idx_auth_whatsapp_otp_expires ON public.auth_whatsapp_otp USING btree (expires_at)`
- `CREATE INDEX idx_auth_whatsapp_otp_phone ON public.auth_whatsapp_otp USING btree (phone)`

**RLS:** مفعّل — عدد السياسات: 4

---

### automation_actions_log

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `insight_id` | `uuid` | نعم | — |
| `action_type` | `text` | لا | — |
| `action_payload` | `jsonb` | لا | `'{}'::jsonb` |
| `note` | `text` | نعم | — |
| `status` | `text` | لا | `'success'::text` |
| `created_by` | `uuid` | نعم | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `automation_actions_log_insight_id_fkey` — `FOREIGN KEY (insight_id) REFERENCES automation_insights(id) ON DELETE CASCADE`

**Indexes:**

- `CREATE UNIQUE INDEX automation_actions_log_pkey ON public.automation_actions_log USING btree (id)`
- `CREATE INDEX idx_actions_log_insight ON public.automation_actions_log USING btree (insight_id, created_at DESC)`

**RLS:** مفعّل — عدد السياسات: 1

---

### automation_insights

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `insight_type` | `text` | لا | — |
| `severity` | `text` | لا | — |
| `title` | `text` | لا | — |
| `description` | `text` | لا | — |
| `recommendation` | `text` | لا | — |
| `metric_key` | `text` | لا | — |
| `metric_value` | `numeric` | نعم | — |
| `comparison_value` | `numeric` | نعم | — |
| `delta_percentage` | `numeric` | نعم | — |
| `context_data` | `jsonb` | لا | `'{}'::jsonb` |
| `status` | `text` | لا | `'active'::text` |
| `dedupe_key` | `text` | لا | — |
| `detected_at` | `timestamp with time zone` | لا | `now()` |
| `resolved_at` | `timestamp with time zone` | نعم | — |
| `dismissed_at` | `timestamp with time zone` | نعم | — |
| `last_seen_at` | `timestamp with time zone` | لا | `now()` |
| `created_at` | `timestamp with time zone` | لا | `now()` |
| `updated_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Check constraints:**

- `automation_insights_severity_check` — `CHECK ((severity = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text, 'critical'::text])))`
- `automation_insights_status_check` — `CHECK ((status = ANY (ARRAY['active'::text, 'dismissed'::text, 'resolved'::text])))`

**Indexes:**

- `CREATE UNIQUE INDEX automation_insights_pkey ON public.automation_insights USING btree (id)`
- `CREATE INDEX idx_insights_metric_key ON public.automation_insights USING btree (metric_key)`
- `CREATE INDEX idx_insights_status_severity ON public.automation_insights USING btree (status, severity, detected_at DESC)`
- `CREATE UNIQUE INDEX uniq_active_insight_per_key ON public.automation_insights USING btree (dedupe_key) WHERE (status = 'active'::text)`

**RLS:** مفعّل — عدد السياسات: 1

---

### automation_rules

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `rule_key` | `text` | لا | — |
| `rule_name` | `text` | لا | — |
| `rule_group` | `text` | لا | — |
| `threshold_value` | `numeric` | لا | — |
| `comparison_operator` | `text` | لا | `'<'::text` |
| `lookback_days` | `integer` | لا | `7` |
| `is_active` | `boolean` | لا | `true` |
| `recommendation_template` | `text` | لا | — |
| `description` | `text` | نعم | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |
| `updated_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Unique constraints:**

- `automation_rules_rule_key_key` — `UNIQUE (rule_key)`

**Check constraints:**

- `automation_rules_comparison_operator_check` — `CHECK ((comparison_operator = ANY (ARRAY['<'::text, '<='::text, '>'::text, '>='::text, '='::text])))`
- `automation_rules_lookback_days_check` — `CHECK (((lookback_days >= 1) AND (lookback_days <= 90)))`

**Indexes:**

- `CREATE UNIQUE INDEX automation_rules_pkey ON public.automation_rules USING btree (id)`
- `CREATE UNIQUE INDEX automation_rules_rule_key_key ON public.automation_rules USING btree (rule_key)`

**RLS:** مفعّل — عدد السياسات: 1

---

### automation_snapshots

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `snapshot_date` | `date` | لا | — |
| `metrics_payload` | `jsonb` | لا | `'{}'::jsonb` |
| `created_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Unique constraints:**

- `automation_snapshots_snapshot_date_key` — `UNIQUE (snapshot_date)`

**Indexes:**

- `CREATE UNIQUE INDEX automation_snapshots_pkey ON public.automation_snapshots USING btree (id)`
- `CREATE UNIQUE INDEX automation_snapshots_snapshot_date_key ON public.automation_snapshots USING btree (snapshot_date)`

**RLS:** مفعّل — عدد السياسات: 1

---

### blog_posts

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `slug` | `text` | لا | — |
| `title` | `text` | لا | — |
| `excerpt` | `text` | نعم | — |
| `content` | `text` | لا | — |
| `cover_image` | `text` | نعم | — |
| `category` | `text` | لا | `'general'::text` |
| `tags` | `text[]` | نعم | `'{}'::text[]` |
| `author_name` | `text` | لا | `'MasterEduPath'::text` |
| `author_id` | `uuid` | نعم | — |
| `status` | `text` | لا | `'draft'::text` |
| `published_at` | `timestamp with time zone` | نعم | — |
| `meta_title` | `text` | نعم | — |
| `meta_description` | `text` | نعم | — |
| `reading_minutes` | `integer` | نعم | `5` |
| `view_count` | `integer` | لا | `0` |
| `created_at` | `timestamp with time zone` | لا | `now()` |
| `updated_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Unique constraints:**

- `blog_posts_slug_key` — `UNIQUE (slug)`

**Check constraints:**

- `blog_posts_status_check` — `CHECK ((status = ANY (ARRAY['draft'::text, 'published'::text, 'archived'::text])))`

**Indexes:**

- `CREATE UNIQUE INDEX blog_posts_pkey ON public.blog_posts USING btree (id)`
- `CREATE UNIQUE INDEX blog_posts_slug_key ON public.blog_posts USING btree (slug)`
- `CREATE INDEX idx_blog_posts_category ON public.blog_posts USING btree (category)`
- `CREATE INDEX idx_blog_posts_slug ON public.blog_posts USING btree (slug)`
- `CREATE INDEX idx_blog_posts_status_published ON public.blog_posts USING btree (status, published_at DESC)`

**RLS:** مفعّل — عدد السياسات: 5

---

### bonus_drop_views

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `bonus_drop_id` | `uuid` | لا | — |
| `user_id` | `uuid` | لا | — |
| `seen_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `bonus_drop_views_bonus_drop_id_fkey` — `FOREIGN KEY (bonus_drop_id) REFERENCES bonus_drops(id) ON DELETE CASCADE`

**Unique constraints:**

- `bonus_drop_views_bonus_drop_id_user_id_key` — `UNIQUE (bonus_drop_id, user_id)`

**Indexes:**

- `CREATE UNIQUE INDEX bonus_drop_views_bonus_drop_id_user_id_key ON public.bonus_drop_views USING btree (bonus_drop_id, user_id)`
- `CREATE UNIQUE INDEX bonus_drop_views_pkey ON public.bonus_drop_views USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 2

---

### bonus_drops

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `title` | `text` | لا | — |
| `subtitle` | `text` | نعم | — |
| `notification_message` | `text` | لا | `'🔥 الساعة الذهبية بدأت!'::text` |
| `multiplier_type` | `text` | لا | `'both'::text` |
| `multiplier_value` | `numeric(4,2)` | لا | `2.0` |
| `starts_at` | `timestamp with time zone` | لا | — |
| `ends_at` | `timestamp with time zone` | لا | — |
| `banner_color` | `text` | لا | `'gradient-amber'::text` |
| `emoji` | `text` | لا | `'🔥'::text` |
| `is_active` | `boolean` | لا | `true` |
| `metadata` | `jsonb` | لا | `'{}'::jsonb` |
| `created_by` | `uuid` | نعم | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |
| `updated_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Check constraints:**

- `bonus_drops_multiplier_type_check` — `CHECK ((multiplier_type = ANY (ARRAY['xp'::text, 'points'::text, 'both'::text])))`
- `bonus_drops_multiplier_value_check` — `CHECK (((multiplier_value >= (1)::numeric) AND (multiplier_value <= (10)::numeric)))`

**Indexes:**

- `CREATE UNIQUE INDEX bonus_drops_pkey ON public.bonus_drops USING btree (id)`
- `CREATE INDEX idx_bonus_drops_window ON public.bonus_drops USING btree (starts_at, ends_at) WHERE (is_active = true)`

**RLS:** مفعّل — عدد السياسات: 2

---

### chat_conversations

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `user_id` | `uuid` | لا | — |
| `admin_id` | `uuid` | نعم | — |
| `subject` | `text` | لا | `'محادثة جديدة'::text` |
| `status` | `text` | لا | `'open'::text` |
| `last_message` | `text` | نعم | — |
| `last_message_at` | `timestamp with time zone` | نعم | `now()` |
| `created_at` | `timestamp with time zone` | لا | `now()` |
| `updated_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Indexes:**

- `CREATE UNIQUE INDEX chat_conversations_pkey ON public.chat_conversations USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 3

---

### chat_messages

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `conversation_id` | `uuid` | لا | — |
| `sender_id` | `uuid` | لا | — |
| `sender_type` | `text` | لا | `'client'::text` |
| `content` | `text` | لا | — |
| `read_at` | `timestamp with time zone` | نعم | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `chat_messages_conversation_id_fkey` — `FOREIGN KEY (conversation_id) REFERENCES chat_conversations(id) ON DELETE CASCADE`

**Indexes:**

- `CREATE UNIQUE INDEX chat_messages_pkey ON public.chat_messages USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 3

---

### contract_evidence

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `contract_id` | `uuid` | لا | — |
| `signature_id` | `uuid` | نعم | — |
| `contract_version_id` | `uuid` | نعم | — |
| `signed_at` | `timestamp with time zone` | لا | — |
| `signer_name` | `text` | لا | — |
| `signer_email` | `text` | نعم | — |
| `signer_id_number` | `text` | نعم | — |
| `signer_user_id` | `uuid` | نعم | — |
| `ip_address` | `text` | نعم | — |
| `user_agent` | `text` | نعم | — |
| `accepted_terms` | `jsonb` | نعم | — |
| `content_snapshot` | `text` | نعم | — |
| `content_sha256` | `text` | لا | — |
| `pdf_storage_path` | `text` | نعم | — |
| `pdf_sha256` | `text` | نعم | — |
| `evidence_sha256` | `text` | نعم | — |
| `verification_token` | `text` | لا | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |
| `metadata` | `jsonb` | لا | `'{}'::jsonb` |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `contract_evidence_contract_id_fkey` — `FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE`
- `contract_evidence_contract_version_id_fkey` — `FOREIGN KEY (contract_version_id) REFERENCES contract_versions(id) ON DELETE SET NULL`
- `contract_evidence_signature_id_fkey` — `FOREIGN KEY (signature_id) REFERENCES contract_signatures(id) ON DELETE SET NULL`

**Indexes:**

- `CREATE UNIQUE INDEX contract_evidence_contract_unique ON public.contract_evidence USING btree (contract_id)`
- `CREATE UNIQUE INDEX contract_evidence_pkey ON public.contract_evidence USING btree (id)`
- `CREATE INDEX contract_evidence_signature_idx ON public.contract_evidence USING btree (signature_id)`
- `CREATE UNIQUE INDEX contract_evidence_token_unique ON public.contract_evidence USING btree (verification_token)`

**RLS:** مفعّل — عدد السياسات: 2

---

### contract_otp_codes

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `contract_id` | `uuid` | لا | — |
| `email` | `text` | لا | — |
| `code_hash` | `text` | لا | — |
| `expires_at` | `timestamp with time zone` | لا | — |
| `attempts` | `integer` | لا | `0` |
| `used` | `boolean` | لا | `false` |
| `created_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `contract_otp_codes_contract_id_fkey` — `FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE`

**Indexes:**

- `CREATE UNIQUE INDEX contract_otp_codes_pkey ON public.contract_otp_codes USING btree (id)`
- `CREATE INDEX idx_contract_otp_lookup ON public.contract_otp_codes USING btree (contract_id, email, used, expires_at)`

**RLS:** مفعّل — عدد السياسات: 5

---

### contract_signatures

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `contract_id` | `uuid` | لا | — |
| `signer_user_id` | `uuid` | نعم | — |
| `signer_name` | `text` | لا | — |
| `signer_email` | `text` | نعم | — |
| `signer_id_number` | `text` | نعم | — |
| `signature_text` | `text` | لا | — |
| `ip_address` | `text` | نعم | — |
| `user_agent` | `text` | نعم | — |
| `accepted_terms` | `jsonb` | نعم | `'[]'::jsonb` |
| `comments` | `text` | نعم | — |
| `signed_at` | `timestamp with time zone` | لا | `now()` |
| `signature_image` | `text` | نعم | — |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `contract_signatures_contract_id_fkey` — `FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE`

**Unique constraints:**

- `contract_signatures_contract_id_unique` — `UNIQUE (contract_id)`

**Indexes:**

- `CREATE UNIQUE INDEX contract_signatures_contract_id_unique ON public.contract_signatures USING btree (contract_id)`
- `CREATE UNIQUE INDEX contract_signatures_pkey ON public.contract_signatures USING btree (id)`
- `CREATE INDEX idx_contract_signatures_contract ON public.contract_signatures USING btree (contract_id)`

**RLS:** مفعّل — عدد السياسات: 3

---

### contract_timeline

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `contract_id` | `uuid` | لا | — |
| `actor_id` | `uuid` | نعم | — |
| `actor_type` | `text` | لا | `'system'::text` |
| `action_type` | `text` | لا | — |
| `action_label` | `text` | لا | — |
| `description` | `text` | نعم | — |
| `metadata` | `jsonb` | نعم | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `contract_timeline_contract_id_fkey` — `FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE`

**Indexes:**

- `CREATE UNIQUE INDEX contract_timeline_pkey ON public.contract_timeline USING btree (id)`
- `CREATE INDEX idx_contract_timeline_contract ON public.contract_timeline USING btree (contract_id)`

**RLS:** مفعّل — عدد السياسات: 3

---

### contract_versions

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `contract_id` | `uuid` | لا | — |
| `version_no` | `integer` | لا | `1` |
| `output_type` | `text` | لا | — |
| `content_snapshot` | `text` | نعم | — |
| `content_sha256` | `text` | نعم | — |
| `pdf_storage_path` | `text` | نعم | — |
| `pdf_size_bytes` | `bigint` | نعم | — |
| `generator` | `text` | لا | `'browserless'::text` |
| `generated_at` | `timestamp with time zone` | لا | `now()` |
| `generated_by` | `uuid` | نعم | — |
| `based_on_signature_id` | `uuid` | نعم | — |
| `is_current` | `boolean` | لا | `false` |
| `metadata` | `jsonb` | لا | `'{}'::jsonb` |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `contract_versions_based_on_signature_id_fkey` — `FOREIGN KEY (based_on_signature_id) REFERENCES contract_signatures(id) ON DELETE SET NULL`
- `contract_versions_contract_id_fkey` — `FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE`

**Check constraints:**

- `contract_versions_output_type_check` — `CHECK ((output_type = ANY (ARRAY['draft'::text, 'preview'::text, 'signed_final'::text])))`

**Indexes:**

- `CREATE INDEX contract_versions_contract_idx ON public.contract_versions USING btree (contract_id, generated_at DESC)`
- `CREATE INDEX contract_versions_current_idx ON public.contract_versions USING btree (contract_id) WHERE (is_current = true)`
- `CREATE UNIQUE INDEX contract_versions_pkey ON public.contract_versions USING btree (id)`
- `CREATE UNIQUE INDEX contract_versions_signed_unique ON public.contract_versions USING btree (contract_id, version_no) WHERE (output_type = 'signed_final'::text)`

**RLS:** مفعّل — عدد السياسات: 2

---

### contracts

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `contract_number` | `text` | لا | `('CTR-'::text \|\| lpad((floor((random() * (100000)::double precision)))::text, 5, '0'::text))` |
| `order_id` | `uuid` | نعم | — |
| `user_id` | `uuid` | نعم | — |
| `title` | `text` | لا | — |
| `content` | `text` | نعم | — |
| `status` | `text` | نعم | `'draft'::text` |
| `signed_at` | `timestamp with time zone` | نعم | — |
| `expires_at` | `timestamp with time zone` | نعم | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |
| `updated_at` | `timestamp with time zone` | لا | `now()` |
| `service_order_id` | `uuid` | نعم | — |
| `customer_id` | `uuid` | نعم | — |
| `service_name` | `text` | نعم | — |
| `service_type` | `text` | نعم | — |
| `total_amount` | `numeric` | نعم | `0` |
| `currency` | `text` | نعم | `'SAR'::text` |
| `payment_terms` | `text` | نعم | — |
| `delivery_date` | `date` | نعم | — |
| `client_full_name` | `text` | نعم | — |
| `client_id_number` | `text` | نعم | — |
| `client_email` | `text` | نعم | — |
| `client_phone` | `text` | نعم | — |
| `sent_at` | `timestamp with time zone` | نعم | — |
| `variables` | `jsonb` | نعم | `'{}'::jsonb` |
| `metadata` | `jsonb` | نعم | `'{}'::jsonb` |
| `signed_pdf_path` | `text` | نعم | — |
| `signed_pdf_generated_at` | `timestamp with time zone` | نعم | — |
| `template_type` | `text` | نعم | `'academic'::text` |
| `version` | `integer` | لا | `1` |
| `parent_contract_id` | `uuid` | نعم | — |
| `content_sha256` | `text` | نعم | — |
| `locked_at` | `timestamp with time zone` | نعم | — |
| `evidence_id` | `uuid` | نعم | — |
| `cancellation_reason` | `text` | نعم | — |
| `cancelled_by` | `uuid` | نعم | — |
| `current_version_id` | `uuid` | نعم | — |
| `verification_token` | `text` | لا | `encode(extensions.gen_random_bytes(16), 'hex'::text)` |
| `publication_id` | `uuid` | نعم | — |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `contracts_current_version_id_fkey` — `FOREIGN KEY (current_version_id) REFERENCES contract_versions(id) ON DELETE SET NULL`
- `contracts_customer_id_fkey` — `FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL`
- `contracts_order_id_fkey` — `FOREIGN KEY (order_id) REFERENCES service_orders(id)`
- `contracts_parent_contract_id_fkey` — `FOREIGN KEY (parent_contract_id) REFERENCES contracts(id) ON DELETE SET NULL`
- `contracts_publication_id_fkey` — `FOREIGN KEY (publication_id) REFERENCES research_publications(id) ON DELETE SET NULL`
- `contracts_service_order_id_fkey` — `FOREIGN KEY (service_order_id) REFERENCES service_orders(id) ON DELETE SET NULL`
- `contracts_user_id_fkey` — `FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL`

**Unique constraints:**

- `contracts_contract_number_key` — `UNIQUE (contract_number)`

**Check constraints:**

- `contracts_status_check` — `CHECK ((status = ANY (ARRAY['draft'::text, 'pending_signature'::text, 'signed'::text, 'active'::text, 'completed'::text, 'cancelled'::text, 'expired'::text])))`
- `contracts_template_type_check` — `CHECK ((template_type = ANY (ARRAY['academic'::text, 'translation'::text, 'consulting'::text, 'corporate'::text, 'financing'::text])))`

**Indexes:**

- `CREATE UNIQUE INDEX contracts_contract_number_key ON public.contracts USING btree (contract_number)`
- `CREATE UNIQUE INDEX contracts_pkey ON public.contracts USING btree (id)`
- `CREATE UNIQUE INDEX contracts_verification_token_unique ON public.contracts USING btree (verification_token)`
- `CREATE INDEX idx_contracts_customer ON public.contracts USING btree (customer_id)`
- `CREATE INDEX idx_contracts_locked_at ON public.contracts USING btree (locked_at)`
- `CREATE INDEX idx_contracts_parent ON public.contracts USING btree (parent_contract_id)`
- `CREATE INDEX idx_contracts_publication_id ON public.contracts USING btree (publication_id)`
- `CREATE INDEX idx_contracts_service_order ON public.contracts USING btree (service_order_id)`
- `CREATE INDEX idx_contracts_status ON public.contracts USING btree (status)`
- `CREATE INDEX idx_contracts_template_type ON public.contracts USING btree (template_type)`
- `CREATE INDEX idx_contracts_user_id ON public.contracts USING btree (user_id)`

**RLS:** مفعّل — عدد السياسات: 6

---

### customers

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `user_id` | `uuid` | نعم | — |
| `name` | `text` | لا | — |
| `email` | `text` | نعم | — |
| `phone` | `text` | نعم | — |
| `company` | `text` | نعم | — |
| `notes` | `text` | نعم | — |
| `status` | `text` | نعم | `'active'::text` |
| `created_at` | `timestamp with time zone` | لا | `now()` |
| `updated_at` | `timestamp with time zone` | لا | `now()` |
| `customer_code` | `text` | نعم | — |
| `referral_code` | `text` | نعم | — |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `customers_user_id_fkey` — `FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL`

**Unique constraints:**

- `customers_customer_code_key` — `UNIQUE (customer_code)`
- `customers_referral_code_key` — `UNIQUE (referral_code)`

**Check constraints:**

- `customers_status_check` — `CHECK ((status = ANY (ARRAY['active'::text, 'inactive'::text, 'blocked'::text])))`

**Indexes:**

- `CREATE UNIQUE INDEX customers_customer_code_key ON public.customers USING btree (customer_code)`
- `CREATE UNIQUE INDEX customers_pkey ON public.customers USING btree (id)`
- `CREATE UNIQUE INDEX customers_referral_code_key ON public.customers USING btree (referral_code)`

**RLS:** مفعّل — عدد السياسات: 2

---

### cv_purchases

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `user_id` | `uuid` | لا | — |
| `cv_id` | `uuid` | لا | — |
| `template_key` | `text` | لا | — |
| `amount` | `numeric(10,2)` | لا | `0` |
| `was_free` | `boolean` | لا | `false` |
| `free_reason` | `text` | نعم | — |
| `payment_method` | `text` | لا | `'wallet'::text` |
| `wallet_transaction_id` | `uuid` | نعم | — |
| `payment_intent_id` | `uuid` | نعم | — |
| `status` | `text` | لا | `'completed'::text` |
| `metadata` | `jsonb` | لا | `'{}'::jsonb` |
| `created_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `cv_purchases_payment_intent_id_fkey` — `FOREIGN KEY (payment_intent_id) REFERENCES payment_intents(id)`
- `cv_purchases_user_id_fkey` — `FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE`
- `cv_purchases_wallet_transaction_id_fkey` — `FOREIGN KEY (wallet_transaction_id) REFERENCES wallet_transactions(id)`

**Unique constraints:**

- `cv_purchases_one_per_cv` — `UNIQUE (cv_id)`

**Check constraints:**

- `cv_purchases_payment_method_check` — `CHECK ((payment_method = ANY (ARRAY['wallet'::text, 'gateway'::text, 'manual'::text])))`
- `cv_purchases_status_check` — `CHECK ((status = ANY (ARRAY['pending'::text, 'completed'::text, 'refunded'::text, 'failed'::text])))`

**Indexes:**

- `CREATE UNIQUE INDEX cv_purchases_one_per_cv ON public.cv_purchases USING btree (cv_id)`
- `CREATE UNIQUE INDEX cv_purchases_pkey ON public.cv_purchases USING btree (id)`
- `CREATE INDEX idx_cv_purchases_user ON public.cv_purchases USING btree (user_id, created_at DESC)`

**RLS:** مفعّل — عدد السياسات: 2

---

### daily_growth_metrics

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `date` | `date` | لا | — |
| `new_users` | `integer` | لا | `0` |
| `active_users` | `integer` | لا | `0` |
| `challenges_completed` | `integer` | لا | `0` |
| `shares_count` | `integer` | لا | `0` |
| `referrals_count` | `integer` | لا | `0` |
| `referrals_completed` | `integer` | لا | `0` |
| `conversions` | `integer` | لا | `0` |
| `retention_rate` | `numeric(5,2)` | لا | `0` |
| `computed_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (date)`

**Indexes:**

- `CREATE UNIQUE INDEX daily_growth_metrics_pkey ON public.daily_growth_metrics USING btree (date)`

**RLS:** مفعّل — عدد السياسات: 1

---

### deadline_reminders

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `user_id` | `uuid` | لا | — |
| `service_order_id` | `uuid` | لا | — |
| `deadline_at` | `timestamp with time zone` | لا | — |
| `reminder_type` | `text` | لا | — |
| `due_at` | `timestamp with time zone` | لا | — |
| `sent` | `boolean` | لا | `false` |
| `sent_at` | `timestamp with time zone` | نعم | — |
| `channel` | `text` | لا | `'in_app'::text` |
| `error_message` | `text` | نعم | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |
| `updated_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `deadline_reminders_service_order_id_fkey` — `FOREIGN KEY (service_order_id) REFERENCES service_orders(id) ON DELETE CASCADE`

**Unique constraints:**

- `deadline_reminders_service_order_id_reminder_type_key` — `UNIQUE (service_order_id, reminder_type)`

**Check constraints:**

- `deadline_reminders_channel_check` — `CHECK ((channel = ANY (ARRAY['in_app'::text, 'email'::text, 'both'::text])))`
- `deadline_reminders_reminder_type_check` — `CHECK ((reminder_type = ANY (ARRAY['3_days'::text, '1_day'::text, '3_hours'::text, 'overdue'::text])))`

**Indexes:**

- `CREATE UNIQUE INDEX deadline_reminders_pkey ON public.deadline_reminders USING btree (id)`
- `CREATE UNIQUE INDEX deadline_reminders_service_order_id_reminder_type_key ON public.deadline_reminders USING btree (service_order_id, reminder_type)`
- `CREATE INDEX idx_deadline_reminders_due ON public.deadline_reminders USING btree (due_at) WHERE (sent = false)`
- `CREATE INDEX idx_deadline_reminders_order ON public.deadline_reminders USING btree (service_order_id)`
- `CREATE INDEX idx_deadline_reminders_user ON public.deadline_reminders USING btree (user_id)`

**RLS:** مفعّل — عدد السياسات: 5

---

### email_send_log

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `message_id` | `text` | نعم | — |
| `template_name` | `text` | لا | — |
| `recipient_email` | `text` | لا | — |
| `status` | `text` | لا | — |
| `error_message` | `text` | نعم | — |
| `metadata` | `jsonb` | نعم | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Check constraints:**

- `email_send_log_status_check` — `CHECK ((status = ANY (ARRAY['pending'::text, 'sent'::text, 'suppressed'::text, 'failed'::text, 'bounced'::text, 'complained'::text, 'dlq'::text])))`

**Indexes:**

- `CREATE UNIQUE INDEX email_send_log_pkey ON public.email_send_log USING btree (id)`
- `CREATE INDEX idx_email_send_log_created ON public.email_send_log USING btree (created_at DESC)`
- `CREATE INDEX idx_email_send_log_message ON public.email_send_log USING btree (message_id)`
- `CREATE UNIQUE INDEX idx_email_send_log_message_sent_unique ON public.email_send_log USING btree (message_id) WHERE (status = 'sent'::text)`
- `CREATE INDEX idx_email_send_log_recipient ON public.email_send_log USING btree (recipient_email)`

**RLS:** مفعّل — عدد السياسات: 3

---

### email_send_state

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `integer` | لا | `1` |
| `retry_after_until` | `timestamp with time zone` | نعم | — |
| `batch_size` | `integer` | لا | `10` |
| `send_delay_ms` | `integer` | لا | `200` |
| `auth_email_ttl_minutes` | `integer` | لا | `15` |
| `transactional_email_ttl_minutes` | `integer` | لا | `60` |
| `updated_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Check constraints:**

- `email_send_state_id_check` — `CHECK ((id = 1))`

**Indexes:**

- `CREATE UNIQUE INDEX email_send_state_pkey ON public.email_send_state USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 2

---

### email_templates

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `name` | `text` | لا | — |
| `subject` | `text` | لا | — |
| `body` | `text` | لا | — |
| `variables` | `jsonb` | نعم | `'[]'::jsonb` |
| `is_active` | `boolean` | نعم | `true` |
| `created_at` | `timestamp with time zone` | لا | `now()` |
| `updated_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Unique constraints:**

- `email_templates_name_key` — `UNIQUE (name)`

**Indexes:**

- `CREATE UNIQUE INDEX email_templates_name_key ON public.email_templates USING btree (name)`
- `CREATE UNIQUE INDEX email_templates_pkey ON public.email_templates USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 1

---

### email_unsubscribe_tokens

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `token` | `text` | لا | — |
| `email` | `text` | لا | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |
| `used_at` | `timestamp with time zone` | نعم | — |

**Primary key:** `PRIMARY KEY (id)`

**Unique constraints:**

- `email_unsubscribe_tokens_email_key` — `UNIQUE (email)`
- `email_unsubscribe_tokens_token_key` — `UNIQUE (token)`

**Indexes:**

- `CREATE UNIQUE INDEX email_unsubscribe_tokens_email_key ON public.email_unsubscribe_tokens USING btree (email)`
- `CREATE UNIQUE INDEX email_unsubscribe_tokens_pkey ON public.email_unsubscribe_tokens USING btree (id)`
- `CREATE UNIQUE INDEX email_unsubscribe_tokens_token_key ON public.email_unsubscribe_tokens USING btree (token)`
- `CREATE INDEX idx_unsubscribe_tokens_token ON public.email_unsubscribe_tokens USING btree (token)`

**RLS:** مفعّل — عدد السياسات: 4

---

### experiment_assignments

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `experiment_id` | `uuid` | لا | — |
| `variant_id` | `uuid` | لا | — |
| `user_id` | `uuid` | نعم | — |
| `anonymous_id` | `text` | نعم | — |
| `assigned_at` | `timestamp with time zone` | لا | `now()` |
| `source_context` | `jsonb` | لا | `'{}'::jsonb` |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `experiment_assignments_experiment_id_fkey` — `FOREIGN KEY (experiment_id) REFERENCES experiments(id) ON DELETE CASCADE`
- `experiment_assignments_variant_id_fkey` — `FOREIGN KEY (variant_id) REFERENCES experiment_variants(id) ON DELETE CASCADE`

**Check constraints:**

- `experiment_assignments_check` — `CHECK (((user_id IS NOT NULL) OR (anonymous_id IS NOT NULL)))`

**Indexes:**

- `CREATE UNIQUE INDEX experiment_assignments_pkey ON public.experiment_assignments USING btree (id)`
- `CREATE INDEX idx_assignments_experiment ON public.experiment_assignments USING btree (experiment_id)`
- `CREATE INDEX idx_assignments_variant ON public.experiment_assignments USING btree (variant_id)`
- `CREATE UNIQUE INDEX uq_assignments_anon ON public.experiment_assignments USING btree (experiment_id, anonymous_id) WHERE ((anonymous_id IS NOT NULL) AND (user_id IS NULL))`
- `CREATE UNIQUE INDEX uq_assignments_user ON public.experiment_assignments USING btree (experiment_id, user_id) WHERE (user_id IS NOT NULL)`

**RLS:** مفعّل — عدد السياسات: 3

---

### experiment_audit_logs

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `experiment_id` | `uuid` | نعم | — |
| `action_type` | `text` | لا | — |
| `actor_user_id` | `uuid` | نعم | — |
| `before_state` | `jsonb` | نعم | — |
| `after_state` | `jsonb` | نعم | — |
| `note` | `text` | نعم | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `experiment_audit_logs_experiment_id_fkey` — `FOREIGN KEY (experiment_id) REFERENCES experiments(id) ON DELETE CASCADE`

**Indexes:**

- `CREATE UNIQUE INDEX experiment_audit_logs_pkey ON public.experiment_audit_logs USING btree (id)`
- `CREATE INDEX idx_audit_experiment ON public.experiment_audit_logs USING btree (experiment_id, created_at DESC)`

**RLS:** مفعّل — عدد السياسات: 1

---

### experiment_events

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `experiment_id` | `uuid` | لا | — |
| `variant_id` | `uuid` | لا | — |
| `user_id` | `uuid` | نعم | — |
| `anonymous_id` | `text` | نعم | — |
| `event_type` | `text` | لا | — |
| `metric_value` | `numeric` | نعم | — |
| `metadata` | `jsonb` | لا | `'{}'::jsonb` |
| `created_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `experiment_events_experiment_id_fkey` — `FOREIGN KEY (experiment_id) REFERENCES experiments(id) ON DELETE CASCADE`
- `experiment_events_variant_id_fkey` — `FOREIGN KEY (variant_id) REFERENCES experiment_variants(id) ON DELETE CASCADE`

**Indexes:**

- `CREATE UNIQUE INDEX experiment_events_pkey ON public.experiment_events USING btree (id)`
- `CREATE INDEX idx_events_created ON public.experiment_events USING btree (created_at DESC)`
- `CREATE INDEX idx_events_experiment ON public.experiment_events USING btree (experiment_id, event_type)`
- `CREATE INDEX idx_events_variant ON public.experiment_events USING btree (variant_id, event_type)`

**RLS:** مفعّل — عدد السياسات: 2

---

### experiment_results_snapshots

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `experiment_id` | `uuid` | لا | — |
| `snapshot_at` | `timestamp with time zone` | لا | `now()` |
| `results_payload` | `jsonb` | لا | `'{}'::jsonb` |
| `created_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `experiment_results_snapshots_experiment_id_fkey` — `FOREIGN KEY (experiment_id) REFERENCES experiments(id) ON DELETE CASCADE`

**Indexes:**

- `CREATE UNIQUE INDEX experiment_results_snapshots_pkey ON public.experiment_results_snapshots USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 1

---

### experiment_variants

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `experiment_id` | `uuid` | لا | — |
| `variant_key` | `text` | لا | — |
| `name` | `text` | لا | — |
| `is_control` | `boolean` | لا | `false` |
| `allocation_percentage` | `numeric(5,2)` | لا | — |
| `config_payload` | `jsonb` | لا | `'{}'::jsonb` |
| `created_at` | `timestamp with time zone` | لا | `now()` |
| `updated_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `experiment_variants_experiment_id_fkey` — `FOREIGN KEY (experiment_id) REFERENCES experiments(id) ON DELETE CASCADE`

**Unique constraints:**

- `experiment_variants_experiment_id_variant_key_key` — `UNIQUE (experiment_id, variant_key)`

**Check constraints:**

- `experiment_variants_allocation_percentage_check` — `CHECK (((allocation_percentage >= (0)::numeric) AND (allocation_percentage <= (100)::numeric)))`

**Indexes:**

- `CREATE UNIQUE INDEX experiment_variants_experiment_id_variant_key_key ON public.experiment_variants USING btree (experiment_id, variant_key)`
- `CREATE UNIQUE INDEX experiment_variants_pkey ON public.experiment_variants USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 2

---

### experiments

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `experiment_key` | `text` | لا | — |
| `name` | `text` | لا | — |
| `description` | `text` | نعم | — |
| `hypothesis` | `text` | نعم | — |
| `status` | `experiment_status` | لا | `'draft'::experiment_status` |
| `target_area` | `experiment_target_area` | لا | — |
| `traffic_allocation_percentage` | `numeric(5,2)` | لا | `100` |
| `primary_metric` | `text` | لا | — |
| `secondary_metrics` | `jsonb` | لا | `'[]'::jsonb` |
| `start_at` | `timestamp with time zone` | نعم | — |
| `end_at` | `timestamp with time zone` | نعم | — |
| `winner_variant_id` | `uuid` | نعم | — |
| `min_sample_size` | `integer` | لا | `100` |
| `created_by` | `uuid` | نعم | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |
| `updated_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `experiments_winner_variant_fk` — `FOREIGN KEY (winner_variant_id) REFERENCES experiment_variants(id) ON DELETE SET NULL`

**Unique constraints:**

- `experiments_experiment_key_key` — `UNIQUE (experiment_key)`

**Check constraints:**

- `experiments_traffic_allocation_percentage_check` — `CHECK (((traffic_allocation_percentage > (0)::numeric) AND (traffic_allocation_percentage <= (100)::numeric)))`

**Indexes:**

- `CREATE UNIQUE INDEX experiments_experiment_key_key ON public.experiments USING btree (experiment_key)`
- `CREATE UNIQUE INDEX experiments_pkey ON public.experiments USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 2

---

### financing_acknowledgments

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `application_id` | `uuid` | لا | — |
| `user_id` | `uuid` | لا | — |
| `ack_type` | `text` | لا | — |
| `ack_title` | `text` | لا | — |
| `signer_name` | `text` | لا | — |
| `signer_id_number` | `text` | نعم | — |
| `accepted_clauses` | `jsonb` | لا | `'[]'::jsonb` |
| `signature_text` | `text` | لا | — |
| `signed_at` | `timestamp with time zone` | لا | `now()` |
| `ip_address` | `text` | نعم | — |
| `user_agent` | `text` | نعم | — |
| `evidence_sha256` | `text` | لا | — |
| `locked` | `boolean` | لا | `true` |
| `created_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Unique constraints:**

- `financing_ack_unique` — `UNIQUE (application_id, ack_type)`

**Indexes:**

- `CREATE UNIQUE INDEX financing_ack_unique ON public.financing_acknowledgments USING btree (application_id, ack_type)`
- `CREATE UNIQUE INDEX financing_acknowledgments_pkey ON public.financing_acknowledgments USING btree (id)`
- `CREATE INDEX idx_fin_ack_app ON public.financing_acknowledgments USING btree (application_id)`
- `CREATE INDEX idx_fin_ack_user ON public.financing_acknowledgments USING btree (user_id)`

**RLS:** مفعّل — عدد السياسات: 3

---

### financing_applications

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `user_id` | `uuid` | لا | — |
| `order_id` | `uuid` | نعم | — |
| `invoice_id` | `uuid` | نعم | — |
| `total_amount` | `numeric(12,2)` | لا | — |
| `down_payment` | `numeric(12,2)` | لا | `0` |
| `remaining_amount` | `numeric(12,2)` | لا | `0` |
| `monthly_installment` | `numeric(12,2)` | لا | `0` |
| `duration_months` | `integer` | لا | `12` |
| `funding_type` | `text` | لا | `'wallet_credit'::text` |
| `status` | `financing_status` | لا | `'draft'::financing_status` |
| `score` | `integer` | نعم | `0` |
| `risk_level` | `financing_risk_level` | لا | `'unknown'::financing_risk_level` |
| `applicant_full_name` | `text` | نعم | — |
| `applicant_id_number` | `text` | نعم | — |
| `applicant_phone` | `text` | نعم | — |
| `applicant_email` | `text` | نعم | — |
| `employer_name` | `text` | نعم | — |
| `monthly_income` | `numeric(12,2)` | نعم | — |
| `monthly_commitments` | `numeric(12,2)` | نعم | — |
| `city` | `text` | نعم | — |
| `notes` | `text` | نعم | — |
| `approved_at` | `timestamp with time zone` | نعم | — |
| `approved_by` | `uuid` | نعم | — |
| `rejected_at` | `timestamp with time zone` | نعم | — |
| `rejection_reason` | `text` | نعم | — |
| `activated_at` | `timestamp with time zone` | نعم | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |
| `updated_at` | `timestamp with time zone` | لا | `now()` |
| `contract_id` | `uuid` | نعم | — |
| `contract_pdf_url` | `text` | نعم | — |
| `has_guarantor` | `boolean` | لا | `false` |
| `guarantor_full_name` | `text` | نعم | — |
| `guarantor_id_number` | `text` | نعم | — |
| `guarantor_phone` | `text` | نعم | — |
| `guarantor_relation` | `text` | نعم | — |
| `guarantor_employer` | `text` | نعم | — |
| `guarantor_monthly_income` | `numeric(12,2)` | نعم | — |
| `guarantor_city` | `text` | نعم | — |
| `guarantor_consent` | `boolean` | لا | `false` |
| `auto_debit_enabled` | `boolean` | لا | `true` |
| `ai_risk_score` | `integer` | نعم | — |
| `ai_risk_analysis` | `jsonb` | نعم | `'{}'::jsonb` |
| `ai_scored_at` | `timestamp with time zone` | نعم | — |
| `client_signature_data` | `text` | نعم | — |
| `client_signed_at` | `timestamp with time zone` | نعم | — |
| `client_signed_ip` | `text` | نعم | — |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `financing_applications_contract_id_fkey` — `FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE SET NULL`
- `financing_applications_invoice_id_fkey` — `FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE SET NULL`
- `financing_applications_order_id_fkey` — `FOREIGN KEY (order_id) REFERENCES service_orders(id) ON DELETE SET NULL`

**Check constraints:**

- `financing_applications_duration_months_check` — `CHECK ((duration_months > 0))`
- `financing_applications_total_amount_check` — `CHECK ((total_amount >= (2500)::numeric))`

**Indexes:**

- `CREATE UNIQUE INDEX financing_applications_pkey ON public.financing_applications USING btree (id)`
- `CREATE INDEX idx_financing_applications_contract_id ON public.financing_applications USING btree (contract_id)`
- `CREATE INDEX idx_financing_apps_order ON public.financing_applications USING btree (order_id)`
- `CREATE INDEX idx_financing_apps_status ON public.financing_applications USING btree (status)`
- `CREATE INDEX idx_financing_apps_user ON public.financing_applications USING btree (user_id)`

**RLS:** مفعّل — عدد السياسات: 4

---

### financing_contracts

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `application_id` | `uuid` | لا | — |
| `contract_number` | `text` | لا | — |
| `contract_text` | `text` | نعم | — |
| `signed_at` | `timestamp with time zone` | نعم | — |
| `signed_ip` | `text` | نعم | — |
| `signed_user_agent` | `text` | نعم | — |
| `status` | `financing_contract_status` | لا | `'draft'::financing_contract_status` |
| `pdf_storage_path` | `text` | نعم | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |
| `updated_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `financing_contracts_application_id_fkey` — `FOREIGN KEY (application_id) REFERENCES financing_applications(id) ON DELETE CASCADE`

**Unique constraints:**

- `financing_contracts_contract_number_key` — `UNIQUE (contract_number)`

**Indexes:**

- `CREATE UNIQUE INDEX financing_contracts_contract_number_key ON public.financing_contracts USING btree (contract_number)`
- `CREATE UNIQUE INDEX financing_contracts_pkey ON public.financing_contracts USING btree (id)`
- `CREATE INDEX idx_financing_contracts_app ON public.financing_contracts USING btree (application_id)`

**RLS:** مفعّل — عدد السياسات: 4

---

### financing_documents

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `application_id` | `uuid` | لا | — |
| `document_type` | `financing_doc_type` | لا | — |
| `file_url` | `text` | لا | — |
| `file_name` | `text` | نعم | — |
| `mime_type` | `text` | نعم | — |
| `status` | `financing_doc_status` | لا | `'pending'::financing_doc_status` |
| `review_note` | `text` | نعم | — |
| `reviewed_by` | `uuid` | نعم | — |
| `reviewed_at` | `timestamp with time zone` | نعم | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |
| `ai_extracted_data` | `jsonb` | نعم | `'{}'::jsonb` |
| `ai_extracted_at` | `timestamp with time zone` | نعم | — |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `financing_documents_application_id_fkey` — `FOREIGN KEY (application_id) REFERENCES financing_applications(id) ON DELETE CASCADE`

**Indexes:**

- `CREATE UNIQUE INDEX financing_documents_pkey ON public.financing_documents USING btree (id)`
- `CREATE INDEX idx_financing_docs_app ON public.financing_documents USING btree (application_id)`

**RLS:** مفعّل — عدد السياسات: 4

---

### financing_installments

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `application_id` | `uuid` | لا | — |
| `month_number` | `integer` | لا | — |
| `amount` | `numeric(12,2)` | لا | — |
| `due_date` | `date` | لا | — |
| `status` | `financing_installment_status` | لا | `'pending'::financing_installment_status` |
| `paid_at` | `timestamp with time zone` | نعم | — |
| `paid_amount` | `numeric(12,2)` | نعم | — |
| `wallet_transaction_id` | `uuid` | نعم | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `financing_installments_application_id_fkey` — `FOREIGN KEY (application_id) REFERENCES financing_applications(id) ON DELETE CASCADE`

**Unique constraints:**

- `financing_installments_application_id_month_number_key` — `UNIQUE (application_id, month_number)`

**Indexes:**

- `CREATE UNIQUE INDEX financing_installments_application_id_month_number_key ON public.financing_installments USING btree (application_id, month_number)`
- `CREATE UNIQUE INDEX financing_installments_pkey ON public.financing_installments USING btree (id)`
- `CREATE INDEX idx_financing_inst_app ON public.financing_installments USING btree (application_id)`
- `CREATE INDEX idx_financing_inst_due ON public.financing_installments USING btree (due_date) WHERE (status = 'pending'::financing_installment_status)`

**RLS:** مفعّل — عدد السياسات: 2

---

### financing_payment_receipts

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `application_id` | `uuid` | لا | — |
| `user_id` | `uuid` | لا | — |
| `payment_method` | `text` | لا | — |
| `amount` | `numeric(12,2)` | لا | — |
| `bank_name` | `text` | نعم | — |
| `reference_number` | `text` | نعم | — |
| `transfer_date` | `date` | نعم | — |
| `receipt_file_url` | `text` | نعم | — |
| `receipt_file_name` | `text` | نعم | — |
| `status` | `text` | لا | `'pending'::text` |
| `reviewer_note` | `text` | نعم | — |
| `reviewed_by` | `uuid` | نعم | — |
| `reviewed_at` | `timestamp with time zone` | نعم | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |
| `updated_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `financing_payment_receipts_application_id_fkey` — `FOREIGN KEY (application_id) REFERENCES financing_applications(id) ON DELETE CASCADE`

**Check constraints:**

- `financing_payment_receipts_amount_check` — `CHECK ((amount > (0)::numeric))`
- `financing_payment_receipts_payment_method_check` — `CHECK ((payment_method = ANY (ARRAY['wallet'::text, 'bank_transfer'::text])))`
- `financing_payment_receipts_status_check` — `CHECK ((status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text])))`

**Indexes:**

- `CREATE UNIQUE INDEX financing_payment_receipts_pkey ON public.financing_payment_receipts USING btree (id)`
- `CREATE INDEX idx_fpr_app ON public.financing_payment_receipts USING btree (application_id)`
- `CREATE INDEX idx_fpr_status ON public.financing_payment_receipts USING btree (status)`
- `CREATE INDEX idx_fpr_user ON public.financing_payment_receipts USING btree (user_id)`

**RLS:** مفعّل — عدد السياسات: 4

---

### financing_status_logs

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `application_id` | `uuid` | لا | — |
| `old_status` | `financing_status` | نعم | — |
| `new_status` | `financing_status` | لا | — |
| `changed_by` | `uuid` | نعم | — |
| `note` | `text` | نعم | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `financing_status_logs_application_id_fkey` — `FOREIGN KEY (application_id) REFERENCES financing_applications(id) ON DELETE CASCADE`

**Indexes:**

- `CREATE UNIQUE INDEX financing_status_logs_pkey ON public.financing_status_logs USING btree (id)`
- `CREATE INDEX idx_financing_status_logs_app ON public.financing_status_logs USING btree (application_id)`

**RLS:** مفعّل — عدد السياسات: 1

---

### financing_whatsapp_logs

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `application_id` | `uuid` | نعم | — |
| `message_type` | `text` | لا | — |
| `recipient_phone` | `text` | لا | — |
| `message_body` | `text` | نعم | — |
| `delivery_status` | `text` | لا | `'queued'::text` |
| `error_message` | `text` | نعم | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `financing_whatsapp_logs_application_id_fkey` — `FOREIGN KEY (application_id) REFERENCES financing_applications(id) ON DELETE CASCADE`

**Indexes:**

- `CREATE UNIQUE INDEX financing_whatsapp_logs_pkey ON public.financing_whatsapp_logs USING btree (id)`
- `CREATE INDEX idx_financing_wa_logs_app ON public.financing_whatsapp_logs USING btree (application_id)`

**RLS:** مفعّل — عدد السياسات: 2

---

### gateway_webhooks

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `provider` | `text` | لا | `'paylink'::text` |
| `event_type` | `text` | نعم | — |
| `external_transaction_no` | `text` | نعم | — |
| `internal_order_number` | `text` | نعم | — |
| `payment_intent_id` | `uuid` | نعم | — |
| `payload` | `jsonb` | لا | — |
| `headers` | `jsonb` | نعم | — |
| `signature_status` | `text` | لا | `'unverified'::text` |
| `processed` | `boolean` | لا | `false` |
| `processed_at` | `timestamp with time zone` | نعم | — |
| `error_message` | `text` | نعم | — |
| `ip_address` | `text` | نعم | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `gateway_webhooks_payment_intent_id_fkey` — `FOREIGN KEY (payment_intent_id) REFERENCES payment_intents(id) ON DELETE SET NULL`

**Indexes:**

- `CREATE UNIQUE INDEX gateway_webhooks_pkey ON public.gateway_webhooks USING btree (id)`
- `CREATE UNIQUE INDEX idx_gw_dedup ON public.gateway_webhooks USING btree (provider, external_transaction_no, event_type) WHERE ((external_transaction_no IS NOT NULL) AND (event_type IS NOT NULL))`
- `CREATE INDEX idx_gw_intent ON public.gateway_webhooks USING btree (payment_intent_id)`
- `CREATE INDEX idx_gw_processed ON public.gateway_webhooks USING btree (processed)`

**RLS:** مفعّل — عدد السياسات: 2

---

### group_order_audit

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `group_order_id` | `uuid` | لا | — |
| `actor_id` | `uuid` | نعم | — |
| `action_type` | `text` | لا | — |
| `description` | `text` | نعم | — |
| `metadata` | `jsonb` | لا | `'{}'::jsonb` |
| `created_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `group_order_audit_group_order_id_fkey` — `FOREIGN KEY (group_order_id) REFERENCES group_orders(id) ON DELETE CASCADE`

**Indexes:**

- `CREATE UNIQUE INDEX group_order_audit_pkey ON public.group_order_audit USING btree (id)`
- `CREATE INDEX idx_group_audit_group ON public.group_order_audit USING btree (group_order_id)`

**RLS:** مفعّل — عدد السياسات: 1

---

### group_order_members

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `group_order_id` | `uuid` | لا | — |
| `user_id` | `uuid` | لا | — |
| `status` | `group_member_status` | لا | `'joined'::group_member_status` |
| `amount_due` | `numeric(12,2)` | لا | — |
| `amount_paid` | `numeric(12,2)` | لا | `0` |
| `paid_via` | `text` | نعم | — |
| `wallet_transaction_id` | `uuid` | نعم | — |
| `payment_intent_id` | `uuid` | نعم | — |
| `joined_at` | `timestamp with time zone` | لا | `now()` |
| `paid_at` | `timestamp with time zone` | نعم | — |
| `refunded_at` | `timestamp with time zone` | نعم | — |
| `is_creator` | `boolean` | لا | `false` |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `group_order_members_group_order_id_fkey` — `FOREIGN KEY (group_order_id) REFERENCES group_orders(id) ON DELETE CASCADE`
- `group_order_members_payment_intent_id_fkey` — `FOREIGN KEY (payment_intent_id) REFERENCES payment_intents(id) ON DELETE SET NULL`

**Unique constraints:**

- `group_order_members_group_order_id_user_id_key` — `UNIQUE (group_order_id, user_id)`

**Indexes:**

- `CREATE UNIQUE INDEX group_order_members_group_order_id_user_id_key ON public.group_order_members USING btree (group_order_id, user_id)`
- `CREATE UNIQUE INDEX group_order_members_pkey ON public.group_order_members USING btree (id)`
- `CREATE INDEX idx_group_members_group ON public.group_order_members USING btree (group_order_id)`
- `CREATE INDEX idx_group_members_user ON public.group_order_members USING btree (user_id)`

**RLS:** مفعّل — عدد السياسات: 3

---

### group_orders

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `creator_id` | `uuid` | لا | — |
| `service_id` | `uuid` | لا | — |
| `service_name` | `text` | نعم | — |
| `title` | `text` | لا | — |
| `description` | `text` | نعم | — |
| `seat_price` | `numeric(12,2)` | لا | — |
| `currency` | `text` | لا | `'SAR'::text` |
| `max_members` | `integer` | لا | — |
| `min_members` | `integer` | لا | `2` |
| `invite_code` | `text` | لا | — |
| `status` | `group_order_status` | لا | `'open'::group_order_status` |
| `deadline` | `timestamp with time zone` | نعم | — |
| `service_order_id` | `uuid` | نعم | — |
| `metadata` | `jsonb` | لا | `'{}'::jsonb` |
| `created_at` | `timestamp with time zone` | لا | `now()` |
| `updated_at` | `timestamp with time zone` | لا | `now()` |
| `started_at` | `timestamp with time zone` | نعم | — |
| `cancelled_at` | `timestamp with time zone` | نعم | — |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `group_orders_service_id_fkey` — `FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE RESTRICT`
- `group_orders_service_order_id_fkey` — `FOREIGN KEY (service_order_id) REFERENCES service_orders(id) ON DELETE SET NULL`

**Unique constraints:**

- `group_orders_invite_code_key` — `UNIQUE (invite_code)`

**Check constraints:**

- `group_orders_max_members_check` — `CHECK (((max_members >= 2) AND (max_members <= 50)))`
- `group_orders_min_members_check` — `CHECK ((min_members >= 2))`
- `group_orders_seat_price_check` — `CHECK ((seat_price > (0)::numeric))`

**Indexes:**

- `CREATE UNIQUE INDEX group_orders_invite_code_key ON public.group_orders USING btree (invite_code)`
- `CREATE UNIQUE INDEX group_orders_pkey ON public.group_orders USING btree (id)`
- `CREATE INDEX idx_group_orders_creator ON public.group_orders USING btree (creator_id)`
- `CREATE INDEX idx_group_orders_invite ON public.group_orders USING btree (invite_code)`
- `CREATE INDEX idx_group_orders_status ON public.group_orders USING btree (status)`

**RLS:** مفعّل — عدد السياسات: 4

---

### growth_events

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `user_id` | `uuid` | نعم | — |
| `event_type` | `text` | لا | — |
| `source` | `text` | لا | `'direct'::text` |
| `metadata` | `jsonb` | لا | `'{}'::jsonb` |
| `dedupe_key` | `text` | نعم | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Indexes:**

- `CREATE INDEX growth_events_created_idx ON public.growth_events USING btree (created_at DESC)`
- `CREATE UNIQUE INDEX growth_events_dedupe_uidx ON public.growth_events USING btree (dedupe_key) WHERE (dedupe_key IS NOT NULL)`
- `CREATE UNIQUE INDEX growth_events_pkey ON public.growth_events USING btree (id)`
- `CREATE INDEX growth_events_source_idx ON public.growth_events USING btree (source)`
- `CREATE INDEX growth_events_type_idx ON public.growth_events USING btree (event_type)`
- `CREATE INDEX growth_events_user_idx ON public.growth_events USING btree (user_id)`

**RLS:** مفعّل — عدد السياسات: 2

---

### inbox_messages

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `sender_name` | `text` | لا | — |
| `sender_email` | `text` | لا | — |
| `sender_phone` | `text` | نعم | — |
| `subject` | `text` | نعم | — |
| `message` | `text` | لا | — |
| `form_type` | `text` | لا | `'contact'::text` |
| `service_type` | `text` | نعم | — |
| `source_page` | `text` | نعم | — |
| `status` | `text` | لا | `'new'::text` |
| `priority` | `text` | لا | `'normal'::text` |
| `assigned_to` | `uuid` | نعم | — |
| `metadata` | `jsonb` | لا | `'{}'::jsonb` |
| `reply_count` | `integer` | لا | `0` |
| `last_activity_at` | `timestamp with time zone` | لا | `now()` |
| `created_at` | `timestamp with time zone` | لا | `now()` |
| `updated_at` | `timestamp with time zone` | لا | `now()` |
| `is_pinned` | `boolean` | لا | `false` |
| `is_starred` | `boolean` | لا | `false` |
| `is_archived` | `boolean` | لا | `false` |
| `read_at` | `timestamp with time zone` | نعم | — |
| `tags` | `text[]` | لا | `'{}'::text[]` |

**Primary key:** `PRIMARY KEY (id)`

**Indexes:**

- `CREATE INDEX idx_inbox_messages_archived ON public.inbox_messages USING btree (is_archived)`
- `CREATE INDEX idx_inbox_messages_assigned ON public.inbox_messages USING btree (assigned_to)`
- `CREATE INDEX idx_inbox_messages_email ON public.inbox_messages USING btree (sender_email)`
- `CREATE INDEX idx_inbox_messages_form_type ON public.inbox_messages USING btree (form_type)`
- `CREATE INDEX idx_inbox_messages_pinned ON public.inbox_messages USING btree (is_pinned) WHERE is_pinned`
- `CREATE INDEX idx_inbox_messages_starred ON public.inbox_messages USING btree (is_starred) WHERE is_starred`
- `CREATE INDEX idx_inbox_messages_status ON public.inbox_messages USING btree (status, created_at DESC)`
- `CREATE UNIQUE INDEX inbox_messages_pkey ON public.inbox_messages USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 1

---

### inbox_notes

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `message_id` | `uuid` | لا | — |
| `admin_id` | `uuid` | نعم | — |
| `admin_name` | `text` | نعم | — |
| `body` | `text` | لا | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `inbox_notes_message_id_fkey` — `FOREIGN KEY (message_id) REFERENCES inbox_messages(id) ON DELETE CASCADE`

**Indexes:**

- `CREATE INDEX idx_inbox_notes_message ON public.inbox_notes USING btree (message_id, created_at DESC)`
- `CREATE UNIQUE INDEX inbox_notes_pkey ON public.inbox_notes USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 1

---

### inbox_replies

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `message_id` | `uuid` | لا | — |
| `admin_id` | `uuid` | نعم | — |
| `admin_name` | `text` | نعم | — |
| `admin_email` | `text` | نعم | — |
| `body` | `text` | لا | — |
| `delivery_status` | `text` | لا | `'pending'::text` |
| `delivery_error` | `text` | نعم | — |
| `external_message_id` | `text` | نعم | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `inbox_replies_message_id_fkey` — `FOREIGN KEY (message_id) REFERENCES inbox_messages(id) ON DELETE CASCADE`

**Indexes:**

- `CREATE INDEX idx_inbox_replies_message ON public.inbox_replies USING btree (message_id, created_at)`
- `CREATE UNIQUE INDEX inbox_replies_pkey ON public.inbox_replies USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 1

---

### inbox_reply_templates

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `title` | `text` | لا | — |
| `body` | `text` | لا | — |
| `category` | `text` | نعم | — |
| `shortcut` | `text` | نعم | — |
| `use_count` | `integer` | لا | `0` |
| `is_active` | `boolean` | لا | `true` |
| `created_by` | `uuid` | نعم | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |
| `updated_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Indexes:**

- `CREATE UNIQUE INDEX inbox_reply_templates_pkey ON public.inbox_reply_templates USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 1

---

### invoice_items

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `invoice_id` | `uuid` | لا | — |
| `item_name` | `text` | لا | — |
| `description` | `text` | نعم | — |
| `quantity` | `integer` | نعم | `1` |
| `unit_price` | `numeric(12,2)` | لا | — |
| `discount_percentage` | `numeric(5,2)` | نعم | `0` |
| `discount_amount` | `numeric(12,2)` | نعم | `0` |
| `total_price` | `numeric(12,2)` | لا | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `invoice_items_invoice_id_fkey` — `FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE`

**Indexes:**

- `CREATE UNIQUE INDEX invoice_items_pkey ON public.invoice_items USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 2

---

### invoice_payments

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `invoice_id` | `uuid` | لا | — |
| `amount` | `numeric` | لا | — |
| `payment_method` | `text` | لا | `'bank_transfer'::text` |
| `payment_date` | `date` | لا | `CURRENT_DATE` |
| `reference_number` | `text` | نعم | — |
| `status` | `text` | لا | `'completed'::text` |
| `notes` | `text` | نعم | — |
| `created_by` | `uuid` | نعم | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |
| `payment_intent_id` | `uuid` | نعم | — |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `invoice_payments_invoice_id_fkey` — `FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE`
- `invoice_payments_payment_intent_id_fkey` — `FOREIGN KEY (payment_intent_id) REFERENCES payment_intents(id) ON DELETE SET NULL`

**Check constraints:**

- `invoice_payments_amount_check` — `CHECK ((amount > (0)::numeric))`

**Indexes:**

- `CREATE INDEX idx_invoice_payments_invoice ON public.invoice_payments USING btree (invoice_id)`
- `CREATE INDEX idx_ip_payment_intent ON public.invoice_payments USING btree (payment_intent_id)`
- `CREATE UNIQUE INDEX invoice_payments_pkey ON public.invoice_payments USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 3

---

### invoice_timeline

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `invoice_id` | `uuid` | لا | — |
| `action_type` | `text` | لا | — |
| `action_label` | `text` | لا | — |
| `action_description` | `text` | نعم | — |
| `actor_user_id` | `uuid` | نعم | — |
| `metadata` | `jsonb` | نعم | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `invoice_timeline_invoice_id_fkey` — `FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE`

**Indexes:**

- `CREATE INDEX idx_invoice_timeline_invoice ON public.invoice_timeline USING btree (invoice_id)`
- `CREATE UNIQUE INDEX invoice_timeline_pkey ON public.invoice_timeline USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 2

---

### invoices

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `invoice_number` | `text` | لا | `('INV-'::text \|\| lpad((floor((random() * (1000000)::double precision)))::text, 6, '0'::text))` |
| `order_id` | `uuid` | نعم | — |
| `user_id` | `uuid` | نعم | — |
| `customer_id` | `uuid` | نعم | — |
| `subtotal` | `numeric(12,2)` | نعم | `0` |
| `tax_amount` | `numeric(12,2)` | نعم | `0` |
| `discount_amount` | `numeric(12,2)` | نعم | `0` |
| `total_amount` | `numeric(12,2)` | نعم | `0` |
| `status` | `text` | نعم | `'draft'::text` |
| `due_date` | `date` | نعم | — |
| `paid_at` | `timestamp with time zone` | نعم | — |
| `notes` | `text` | نعم | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |
| `updated_at` | `timestamp with time zone` | لا | `now()` |
| `issue_date` | `date` | لا | `CURRENT_DATE` |
| `paid_amount` | `numeric` | لا | `0` |
| `currency` | `text` | لا | `'SAR'::text` |
| `terms` | `text` | نعم | — |
| `customer_name` | `text` | نعم | — |
| `customer_email` | `text` | نعم | — |
| `customer_phone` | `text` | نعم | — |
| `sent_at` | `timestamp with time zone` | نعم | — |
| `remaining_amount` | `numeric` | نعم | `(COALESCE(total_amount, (0)::numeric) - COALESCE(paid_amount, (0)::numeric))` |
| `pdf_storage_path` | `text` | نعم | — |
| `pdf_generated_at` | `timestamp with time zone` | نعم | — |
| `publication_id` | `uuid` | نعم | — |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `invoices_customer_id_fkey` — `FOREIGN KEY (customer_id) REFERENCES customers(id)`
- `invoices_order_id_fkey` — `FOREIGN KEY (order_id) REFERENCES service_orders(id)`
- `invoices_publication_id_fkey` — `FOREIGN KEY (publication_id) REFERENCES research_publications(id) ON DELETE SET NULL`
- `invoices_user_id_fkey` — `FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL`

**Unique constraints:**

- `invoices_invoice_number_key` — `UNIQUE (invoice_number)`

**Check constraints:**

- `invoices_status_check` — `CHECK ((status = ANY (ARRAY['draft'::text, 'pending'::text, 'sent'::text, 'partially_paid'::text, 'paid'::text, 'overdue'::text, 'cancelled'::text])))`

**Indexes:**

- `CREATE INDEX idx_invoices_publication_id ON public.invoices USING btree (publication_id)`
- `CREATE INDEX idx_invoices_status ON public.invoices USING btree (status)`
- `CREATE INDEX idx_invoices_user_id ON public.invoices USING btree (user_id)`
- `CREATE UNIQUE INDEX invoices_invoice_number_key ON public.invoices USING btree (invoice_number)`
- `CREATE UNIQUE INDEX invoices_pkey ON public.invoices USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 2

---

### member_referrals

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `referrer_user_id` | `uuid` | لا | — |
| `referred_user_id` | `uuid` | لا | — |
| `referral_code` | `text` | لا | — |
| `membership_id` | `uuid` | نعم | — |
| `plan_id` | `uuid` | نعم | — |
| `status` | `text` | لا | `'pending'::text` |
| `commission_amount` | `numeric` | لا | `0` |
| `commission_paid_at` | `timestamp with time zone` | نعم | — |
| `wallet_transaction_id` | `uuid` | نعم | — |
| `notes` | `text` | نعم | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |
| `updated_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Unique constraints:**

- `member_referrals_referred_user_id_membership_id_key` — `UNIQUE (referred_user_id, membership_id)`

**Indexes:**

- `CREATE INDEX idx_member_referrals_referred ON public.member_referrals USING btree (referred_user_id)`
- `CREATE INDEX idx_member_referrals_referrer ON public.member_referrals USING btree (referrer_user_id)`
- `CREATE UNIQUE INDEX member_referrals_pkey ON public.member_referrals USING btree (id)`
- `CREATE UNIQUE INDEX member_referrals_referred_user_id_membership_id_key ON public.member_referrals USING btree (referred_user_id, membership_id)`

**RLS:** مفعّل — عدد السياسات: 6

---

### membership_history

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `membership_id` | `uuid` | لا | — |
| `user_id` | `uuid` | لا | — |
| `action` | `text` | لا | — |
| `actor_id` | `uuid` | نعم | — |
| `actor_type` | `text` | لا | `'system'::text` |
| `description` | `text` | نعم | — |
| `metadata` | `jsonb` | نعم | `'{}'::jsonb` |
| `created_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `membership_history_membership_id_fkey` — `FOREIGN KEY (membership_id) REFERENCES user_memberships(id) ON DELETE CASCADE`

**Indexes:**

- `CREATE UNIQUE INDEX membership_history_pkey ON public.membership_history USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 2

---

### membership_plans

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `code` | `text` | لا | — |
| `name_ar` | `text` | لا | — |
| `name_en` | `text` | لا | — |
| `description` | `text` | نعم | — |
| `price` | `numeric` | لا | `0` |
| `currency` | `text` | لا | `'SAR'::text` |
| `duration_months` | `integer` | لا | `12` |
| `discount_percentage` | `numeric` | لا | `0` |
| `cashback_amount` | `numeric` | لا | `0` |
| `priority_level` | `integer` | لا | `0` |
| `badge_color` | `text` | نعم | — |
| `benefits` | `jsonb` | نعم | `'[]'::jsonb` |
| `is_active` | `boolean` | لا | `true` |
| `sort_order` | `integer` | نعم | `0` |
| `created_at` | `timestamp with time zone` | لا | `now()` |
| `updated_at` | `timestamp with time zone` | لا | `now()` |
| `referral_commission_percentage` | `numeric` | لا | `10` |
| `referral_commission_fixed` | `numeric` | لا | `0` |

**Primary key:** `PRIMARY KEY (id)`

**Unique constraints:**

- `membership_plans_code_key` — `UNIQUE (code)`

**Indexes:**

- `CREATE UNIQUE INDEX membership_plans_code_key ON public.membership_plans USING btree (code)`
- `CREATE UNIQUE INDEX membership_plans_pkey ON public.membership_plans USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 2

---

### notifications

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `title` | `text` | لا | — |
| `message` | `text` | نعم | — |
| `type` | `text` | نعم | `'info'::text` |
| `target_audience` | `text` | نعم | `'all'::text` |
| `created_by` | `uuid` | نعم | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `notifications_created_by_fkey` — `FOREIGN KEY (created_by) REFERENCES auth.users(id)`

**Check constraints:**

- `notifications_type_check` — `CHECK ((type = ANY (ARRAY['info'::text, 'success'::text, 'warning'::text, 'error'::text])))`

**Indexes:**

- `CREATE UNIQUE INDEX notifications_pkey ON public.notifications USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 2

---

### order_attachments

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `order_id` | `uuid` | لا | — |
| `user_id` | `uuid` | لا | — |
| `file_name` | `text` | لا | — |
| `file_size` | `integer` | لا | — |
| `file_type` | `text` | نعم | — |
| `storage_path` | `text` | لا | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |
| `is_delivery` | `boolean` | لا | `false` |
| `uploaded_by_admin` | `boolean` | لا | `false` |
| `service_order_id` | `uuid` | نعم | — |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `order_attachments_order_id_fkey` — `FOREIGN KEY (order_id) REFERENCES service_orders(id) ON DELETE CASCADE`

**Indexes:**

- `CREATE INDEX idx_order_attachments_service_order ON public.order_attachments USING btree (service_order_id)`
- `CREATE UNIQUE INDEX order_attachments_pkey ON public.order_attachments USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 3

---

### order_timeline

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `order_id` | `uuid` | لا | — |
| `title` | `text` | لا | `''::text` |
| `description` | `text` | نعم | — |
| `status` | `text` | لا | — |
| `scheduled_date` | `date` | نعم | — |
| `completed_date` | `date` | نعم | — |
| `actor_type` | `text` | لا | `'system'::text` |
| `actor_name` | `text` | نعم | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `order_timeline_order_id_fkey` — `FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE`

**Indexes:**

- `CREATE INDEX idx_order_timeline_order_id ON public.order_timeline USING btree (order_id)`
- `CREATE UNIQUE INDEX order_timeline_pkey ON public.order_timeline USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 2

---

### orders

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `tracking_id` | `text` | لا | `('TR'::text \|\| lpad((floor((random() * (1000000)::double precision)))::text, 6, '0'::text))` |
| `phone_last_four` | `text` | لا | — |
| `title` | `text` | لا | — |
| `degree` | `text` | لا | `''::text` |
| `service_type` | `text` | لا | `'general'::text` |
| `description` | `text` | نعم | — |
| `current_status` | `text` | نعم | `'received'::text` |
| `estimated_delivery` | `date` | نعم | — |
| `client_name` | `text` | لا | — |
| `client_phone` | `text` | لا | — |
| `client_email` | `text` | لا | — |
| `user_id` | `uuid` | نعم | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |
| `updated_at` | `timestamp with time zone` | لا | `now()` |
| `assistance_type` | `text` | نعم | — |

**Primary key:** `PRIMARY KEY (id)`

**Unique constraints:**

- `orders_tracking_id_key` — `UNIQUE (tracking_id)`

**Indexes:**

- `CREATE INDEX idx_orders_phone_tracking ON public.orders USING btree (tracking_id, phone_last_four)`
- `CREATE INDEX idx_orders_status ON public.orders USING btree (current_status)`
- `CREATE INDEX idx_orders_tracking_id ON public.orders USING btree (tracking_id)`
- `CREATE INDEX idx_orders_user_id ON public.orders USING btree (user_id)`
- `CREATE UNIQUE INDEX orders_pkey ON public.orders USING btree (id)`
- `CREATE UNIQUE INDEX orders_tracking_id_key ON public.orders USING btree (tracking_id)`

**RLS:** مفعّل — عدد السياسات: 4

---

### payment_attempts

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `payment_intent_id` | `uuid` | لا | — |
| `attempt_no` | `integer` | لا | `1` |
| `action` | `text` | لا | — |
| `request_payload` | `jsonb` | نعم | — |
| `response_payload` | `jsonb` | نعم | — |
| `http_status` | `integer` | نعم | — |
| `status` | `text` | لا | `'pending'::text` |
| `error_message` | `text` | نعم | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `payment_attempts_payment_intent_id_fkey` — `FOREIGN KEY (payment_intent_id) REFERENCES payment_intents(id) ON DELETE CASCADE`

**Indexes:**

- `CREATE INDEX idx_pa_intent ON public.payment_attempts USING btree (payment_intent_id)`
- `CREATE INDEX idx_pa_status ON public.payment_attempts USING btree (status)`
- `CREATE UNIQUE INDEX payment_attempts_pkey ON public.payment_attempts USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 2

---

### payment_intents

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `user_id` | `uuid` | لا | — |
| `service_order_id` | `uuid` | نعم | — |
| `invoice_id` | `uuid` | نعم | — |
| `contract_id` | `uuid` | نعم | — |
| `provider` | `text` | لا | `'paylink'::text` |
| `provider_mode` | `text` | لا | `'hosted'::text` |
| `internal_order_number` | `text` | لا | — |
| `external_transaction_no` | `text` | نعم | — |
| `external_invoice_id` | `text` | نعم | — |
| `amount` | `numeric(14,2)` | لا | — |
| `currency` | `text` | لا | `'SAR'::text` |
| `status` | `text` | لا | `'created'::text` |
| `purpose` | `text` | لا | — |
| `payment_method_type` | `text` | نعم | — |
| `checkout_url` | `text` | نعم | — |
| `return_url` | `text` | نعم | — |
| `callback_url` | `text` | نعم | — |
| `expires_at` | `timestamp with time zone` | نعم | — |
| `succeeded_at` | `timestamp with time zone` | نعم | — |
| `failed_at` | `timestamp with time zone` | نعم | — |
| `failure_reason` | `text` | نعم | — |
| `metadata` | `jsonb` | لا | `'{}'::jsonb` |
| `created_at` | `timestamp with time zone` | لا | `now()` |
| `updated_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Unique constraints:**

- `payment_intents_internal_order_number_key` — `UNIQUE (internal_order_number)`

**Check constraints:**

- `payment_intents_amount_check` — `CHECK ((amount > (0)::numeric))`

**Indexes:**

- `CREATE INDEX idx_pi_external ON public.payment_intents USING btree (external_transaction_no)`
- `CREATE INDEX idx_pi_invoice ON public.payment_intents USING btree (invoice_id)`
- `CREATE INDEX idx_pi_order ON public.payment_intents USING btree (service_order_id)`
- `CREATE INDEX idx_pi_purpose ON public.payment_intents USING btree (purpose)`
- `CREATE INDEX idx_pi_status ON public.payment_intents USING btree (status)`
- `CREATE INDEX idx_pi_user ON public.payment_intents USING btree (user_id)`
- `CREATE UNIQUE INDEX payment_intents_internal_order_number_key ON public.payment_intents USING btree (internal_order_number)`
- `CREATE UNIQUE INDEX payment_intents_pkey ON public.payment_intents USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 5

---

### payment_reconciliation_items

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `run_id` | `uuid` | لا | — |
| `payment_intent_id` | `uuid` | نعم | — |
| `external_transaction_no` | `text` | نعم | — |
| `internal_order_number` | `text` | نعم | — |
| `expected_amount` | `numeric(14,2)` | نعم | — |
| `actual_amount` | `numeric(14,2)` | نعم | — |
| `expected_status` | `text` | نعم | — |
| `actual_status` | `text` | نعم | — |
| `matched` | `boolean` | لا | `false` |
| `mismatch_reason` | `text` | نعم | — |
| `raw_external` | `jsonb` | نعم | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `payment_reconciliation_items_payment_intent_id_fkey` — `FOREIGN KEY (payment_intent_id) REFERENCES payment_intents(id) ON DELETE SET NULL`
- `payment_reconciliation_items_run_id_fkey` — `FOREIGN KEY (run_id) REFERENCES payment_reconciliation_runs(id) ON DELETE CASCADE`

**Indexes:**

- `CREATE INDEX idx_pri_matched ON public.payment_reconciliation_items USING btree (matched)`
- `CREATE INDEX idx_pri_run ON public.payment_reconciliation_items USING btree (run_id)`
- `CREATE UNIQUE INDEX payment_reconciliation_items_pkey ON public.payment_reconciliation_items USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 1

---

### payment_reconciliation_runs

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `provider` | `text` | لا | `'paylink'::text` |
| `run_type` | `text` | لا | `'manual'::text` |
| `status` | `text` | لا | `'running'::text` |
| `started_at` | `timestamp with time zone` | لا | `now()` |
| `finished_at` | `timestamp with time zone` | نعم | — |
| `total_checked` | `integer` | لا | `0` |
| `total_matched` | `integer` | لا | `0` |
| `total_mismatched` | `integer` | لا | `0` |
| `summary` | `jsonb` | نعم | — |
| `created_by` | `uuid` | نعم | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Indexes:**

- `CREATE UNIQUE INDEX payment_reconciliation_runs_pkey ON public.payment_reconciliation_runs USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 1

---

### payment_transactions

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `user_id` | `uuid` | نعم | — |
| `invoice_id` | `uuid` | نعم | — |
| `type` | `text` | لا | — |
| `amount` | `numeric(12,2)` | لا | — |
| `balance_after` | `numeric(12,2)` | نعم | — |
| `description` | `text` | نعم | — |
| `status` | `text` | نعم | `'completed'::text` |
| `reference` | `text` | نعم | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `payment_transactions_invoice_id_fkey` — `FOREIGN KEY (invoice_id) REFERENCES invoices(id)`
- `payment_transactions_user_id_fkey` — `FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL`

**Check constraints:**

- `payment_transactions_status_check` — `CHECK ((status = ANY (ARRAY['pending'::text, 'completed'::text, 'failed'::text, 'reversed'::text])))`
- `payment_transactions_type_check` — `CHECK ((type = ANY (ARRAY['credit'::text, 'debit'::text, 'refund'::text])))`

**Indexes:**

- `CREATE INDEX idx_payment_transactions_user_id ON public.payment_transactions USING btree (user_id)`
- `CREATE UNIQUE INDEX payment_transactions_pkey ON public.payment_transactions USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 2

---

### point_transactions

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `user_id` | `uuid` | لا | — |
| `points` | `integer` | لا | — |
| `type` | `text` | لا | — |
| `source_type` | `text` | لا | — |
| `source_id` | `text` | نعم | — |
| `description` | `text` | نعم | — |
| `multiplier` | `numeric` | لا | `1.0` |
| `base_points` | `integer` | نعم | — |
| `metadata` | `jsonb` | لا | `'{}'::jsonb` |
| `balance_after` | `integer` | نعم | — |
| `created_by` | `uuid` | نعم | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Check constraints:**

- `point_transactions_type_check` — `CHECK ((type = ANY (ARRAY['earn'::text, 'spend'::text, 'bonus'::text, 'penalty'::text, 'adjustment'::text, 'refund'::text])))`

**Indexes:**

- `CREATE INDEX idx_point_tx_user_created ON public.point_transactions USING btree (user_id, created_at DESC)`
- `CREATE UNIQUE INDEX point_transactions_pkey ON public.point_transactions USING btree (id)`
- `CREATE UNIQUE INDEX uniq_point_tx_source ON public.point_transactions USING btree (user_id, source_type, source_id) WHERE ((source_id IS NOT NULL) AND (type = ANY (ARRAY['earn'::text, 'bonus'::text])))`

**RLS:** مفعّل — عدد السياسات: 5

---

### profiles

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | — |
| `full_name` | `text` | نعم | — |
| `phone` | `text` | نعم | — |
| `avatar_url` | `text` | نعم | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |
| `updated_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `profiles_id_fkey` — `FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE`

**Indexes:**

- `CREATE UNIQUE INDEX idx_profiles_phone_unique ON public.profiles USING btree (phone) WHERE (phone IS NOT NULL)`
- `CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 4

---

### question_categories

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `name_ar` | `text` | لا | — |
| `name_en` | `text` | نعم | — |
| `parent_id` | `uuid` | نعم | — |
| `icon` | `text` | نعم | — |
| `sort_order` | `integer` | لا | `0` |
| `is_active` | `boolean` | لا | `true` |
| `created_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `question_categories_parent_id_fkey` — `FOREIGN KEY (parent_id) REFERENCES question_categories(id) ON DELETE SET NULL`

**Indexes:**

- `CREATE INDEX idx_qcat_parent ON public.question_categories USING btree (parent_id)`
- `CREATE UNIQUE INDEX question_categories_pkey ON public.question_categories USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 2

---

### question_choices

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `question_id` | `uuid` | لا | — |
| `choice_text` | `text` | لا | — |
| `is_correct` | `boolean` | لا | `false` |
| `order_index` | `integer` | لا | `0` |
| `created_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `question_choices_question_id_fkey` — `FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE`

**Indexes:**

- `CREATE INDEX idx_choices_question ON public.question_choices USING btree (question_id)`
- `CREATE UNIQUE INDEX question_choices_pkey ON public.question_choices USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 2

---

### question_tags

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `question_id` | `uuid` | لا | — |
| `tag` | `text` | لا | — |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `question_tags_question_id_fkey` — `FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE`

**Unique constraints:**

- `question_tags_question_id_tag_key` — `UNIQUE (question_id, tag)`

**Indexes:**

- `CREATE INDEX idx_qtags_tag ON public.question_tags USING btree (tag)`
- `CREATE UNIQUE INDEX question_tags_pkey ON public.question_tags USING btree (id)`
- `CREATE UNIQUE INDEX question_tags_question_id_tag_key ON public.question_tags USING btree (question_id, tag)`

**RLS:** مفعّل — عدد السياسات: 2

---

### questions

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `subject_id` | `uuid` | لا | — |
| `question_text` | `text` | لا | — |
| `explanation` | `text` | نعم | — |
| `question_type` | `text` | لا | `'mcq'::text` |
| `difficulty` | `text` | لا | `'medium'::text` |
| `linked_assessment_id` | `uuid` | نعم | — |
| `is_active` | `boolean` | لا | `true` |
| `created_by` | `uuid` | نعم | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |
| `updated_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `questions_linked_assessment_id_fkey` — `FOREIGN KEY (linked_assessment_id) REFERENCES assessments(id) ON DELETE SET NULL`
- `questions_subject_id_fkey` — `FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE`

**Check constraints:**

- `questions_difficulty_check` — `CHECK ((difficulty = ANY (ARRAY['easy'::text, 'medium'::text, 'hard'::text])))`
- `questions_question_type_check` — `CHECK ((question_type = ANY (ARRAY['mcq'::text, 'true_false'::text])))`

**Indexes:**

- `CREATE INDEX idx_questions_difficulty ON public.questions USING btree (difficulty)`
- `CREATE INDEX idx_questions_subject ON public.questions USING btree (subject_id)`
- `CREATE UNIQUE INDEX questions_pkey ON public.questions USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 2

---

### referral_audit_logs

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `action_type` | `text` | لا | — |
| `referral_id` | `uuid` | نعم | — |
| `referrer_user_id` | `uuid` | نعم | — |
| `referred_user_id` | `uuid` | نعم | — |
| `membership_id` | `uuid` | نعم | — |
| `amount` | `numeric` | نعم | `0` |
| `reason` | `text` | نعم | — |
| `metadata` | `jsonb` | نعم | `'{}'::jsonb` |
| `created_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Indexes:**

- `CREATE INDEX idx_referral_audit_created ON public.referral_audit_logs USING btree (created_at DESC)`
- `CREATE INDEX idx_referral_audit_referral ON public.referral_audit_logs USING btree (referral_id)`
- `CREATE INDEX idx_referral_audit_referrer ON public.referral_audit_logs USING btree (referrer_user_id)`
- `CREATE UNIQUE INDEX referral_audit_logs_pkey ON public.referral_audit_logs USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 2

---

### referral_clicks

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `ref_code` | `text` | لا | — |
| `ip` | `text` | نعم | — |
| `user_agent` | `text` | نعم | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |
| `session_id` | `text` | نعم | — |
| `tracking_started_at` | `timestamp with time zone` | نعم | — |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `referral_clicks_ref_code_fkey` — `FOREIGN KEY (ref_code) REFERENCES user_referrals(ref_code) ON DELETE CASCADE`

**Indexes:**

- `CREATE INDEX idx_referral_clicks_code ON public.referral_clicks USING btree (ref_code)`
- `CREATE INDEX idx_referral_clicks_code_created ON public.referral_clicks USING btree (ref_code, created_at DESC)`
- `CREATE INDEX idx_referral_clicks_created ON public.referral_clicks USING btree (created_at DESC)`
- `CREATE INDEX idx_referral_clicks_refcode_session ON public.referral_clicks USING btree (ref_code, session_id) WHERE (session_id IS NOT NULL)`
- `CREATE INDEX idx_referral_clicks_session_id ON public.referral_clicks USING btree (session_id) WHERE (session_id IS NOT NULL)`
- `CREATE UNIQUE INDEX referral_clicks_pkey ON public.referral_clicks USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 2

---

### referral_conversions

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `ref_code` | `text` | لا | — |
| `user_id` | `uuid` | لا | — |
| `order_id` | `uuid` | نعم | — |
| `type` | `text` | لا | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `referral_conversions_ref_code_fkey` — `FOREIGN KEY (ref_code) REFERENCES user_referrals(ref_code) ON DELETE CASCADE`

**Unique constraints:**

- `referral_conversions_unique_signup` — `UNIQUE (ref_code, user_id, type)`

**Check constraints:**

- `referral_conversions_type_check` — `CHECK ((type = ANY (ARRAY['signup'::text, 'order'::text])))`

**Indexes:**

- `CREATE INDEX idx_referral_conversions_code ON public.referral_conversions USING btree (ref_code)`
- `CREATE INDEX idx_referral_conversions_code_type ON public.referral_conversions USING btree (ref_code, type)`
- `CREATE INDEX idx_referral_conversions_type ON public.referral_conversions USING btree (type)`
- `CREATE INDEX idx_referral_conversions_user ON public.referral_conversions USING btree (user_id)`
- `CREATE UNIQUE INDEX referral_conversions_pkey ON public.referral_conversions USING btree (id)`
- `CREATE UNIQUE INDEX referral_conversions_unique_signup ON public.referral_conversions USING btree (ref_code, user_id, type)`

**RLS:** مفعّل — عدد السياسات: 3

---

### referral_events

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `ref_code` | `text` | لا | — |
| `ip_address` | `text` | نعم | — |
| `user_agent` | `text` | نعم | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Indexes:**

- `CREATE INDEX idx_referral_events_code ON public.referral_events USING btree (ref_code, created_at DESC)`
- `CREATE UNIQUE INDEX referral_events_pkey ON public.referral_events USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 2

---

### referral_viral_rewards

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `referral_id` | `uuid` | لا | — |
| `referrer_user_id` | `uuid` | لا | — |
| `referred_user_id` | `uuid` | لا | — |
| `reward_type` | `text` | لا | — |
| `points_awarded` | `integer` | لا | `0` |
| `xp_awarded` | `integer` | لا | `0` |
| `metadata` | `jsonb` | لا | `'{}'::jsonb` |
| `created_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `referral_viral_rewards_referral_id_fkey` — `FOREIGN KEY (referral_id) REFERENCES referrals(id) ON DELETE CASCADE`

**Unique constraints:**

- `referral_viral_rewards_referral_id_reward_type_key` — `UNIQUE (referral_id, reward_type)`

**Indexes:**

- `CREATE INDEX idx_rvr_referrer ON public.referral_viral_rewards USING btree (referrer_user_id, created_at DESC)`
- `CREATE UNIQUE INDEX referral_viral_rewards_pkey ON public.referral_viral_rewards USING btree (id)`
- `CREATE UNIQUE INDEX referral_viral_rewards_referral_id_reward_type_key ON public.referral_viral_rewards USING btree (referral_id, reward_type)`

**RLS:** مفعّل — عدد السياسات: 1

---

### referrals

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `referrer_user_id` | `uuid` | لا | — |
| `referred_user_id` | `uuid` | لا | — |
| `referral_code` | `text` | لا | — |
| `status` | `text` | لا | `'pending'::text` |
| `created_at` | `timestamp with time zone` | لا | `now()` |
| `completed_at` | `timestamp with time zone` | نعم | — |

**Primary key:** `PRIMARY KEY (id)`

**Unique constraints:**

- `unique_referred_user` — `UNIQUE (referred_user_id)`

**Check constraints:**

- `no_self_referral` — `CHECK ((referrer_user_id <> referred_user_id))`
- `referrals_status_check` — `CHECK ((status = ANY (ARRAY['pending'::text, 'completed'::text, 'invalid'::text])))`

**Indexes:**

- `CREATE INDEX idx_referrals_referred ON public.referrals USING btree (referred_user_id)`
- `CREATE INDEX idx_referrals_referrer ON public.referrals USING btree (referrer_user_id)`
- `CREATE INDEX idx_referrals_status ON public.referrals USING btree (status)`
- `CREATE UNIQUE INDEX referrals_pkey ON public.referrals USING btree (id)`
- `CREATE UNIQUE INDEX unique_referred_user ON public.referrals USING btree (referred_user_id)`

**RLS:** مفعّل — عدد السياسات: 2

---

### research_publication_messages

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `publication_id` | `uuid` | لا | — |
| `sender_id` | `uuid` | لا | — |
| `sender_type` | `text` | لا | `'client'::text` |
| `message` | `text` | لا | — |
| `attachments` | `jsonb` | نعم | `'[]'::jsonb` |
| `read_at` | `timestamp with time zone` | نعم | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `research_publication_messages_publication_id_fkey` — `FOREIGN KEY (publication_id) REFERENCES research_publications(id) ON DELETE CASCADE`

**Indexes:**

- `CREATE INDEX idx_research_msg_pub ON public.research_publication_messages USING btree (publication_id)`
- `CREATE UNIQUE INDEX research_publication_messages_pkey ON public.research_publication_messages USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 2

---

### research_publication_quotes

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `publication_id` | `uuid` | لا | — |
| `quote_number` | `text` | لا | `((('QT-'::text \|\| to_char(now(), 'YYMMDD'::text)) \|\| '-'::text) \|\| substr((gen_random_uuid())::text, 1, 6))` |
| `amount` | `numeric(12,2)` | لا | — |
| `tax_amount` | `numeric(12,2)` | لا | `0` |
| `total_amount` | `numeric(12,2)` | لا | — |
| `currency` | `text` | لا | `'SAR'::text` |
| `description` | `text` | نعم | — |
| `valid_until` | `date` | نعم | — |
| `status` | `text` | لا | `'draft'::text` |
| `created_by` | `uuid` | نعم | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |
| `updated_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `research_publication_quotes_publication_id_fkey` — `FOREIGN KEY (publication_id) REFERENCES research_publications(id) ON DELETE CASCADE`

**Unique constraints:**

- `research_publication_quotes_quote_number_key` — `UNIQUE (quote_number)`

**Check constraints:**

- `research_publication_quotes_status_check` — `CHECK ((status = ANY (ARRAY['draft'::text, 'sent'::text, 'accepted'::text, 'rejected'::text, 'expired'::text])))`

**Indexes:**

- `CREATE INDEX idx_research_quotes_publication ON public.research_publication_quotes USING btree (publication_id)`
- `CREATE UNIQUE INDEX research_publication_quotes_pkey ON public.research_publication_quotes USING btree (id)`
- `CREATE UNIQUE INDEX research_publication_quotes_quote_number_key ON public.research_publication_quotes USING btree (quote_number)`

**RLS:** مفعّل — عدد السياسات: 2

---

### research_publications

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `user_id` | `uuid` | لا | — |
| `request_number` | `text` | لا | `((('RP-'::text \|\| to_char(now(), 'YYMMDD'::text)) \|\| '-'::text) \|\| substr((gen_random_uuid())::text, 1, 6))` |
| `title` | `text` | لا | — |
| `field` | `text` | لا | — |
| `language` | `text` | لا | `'ar'::text` |
| `service_type` | `text` | لا | `'publication'::text` |
| `target_journal` | `text` | نعم | — |
| `journal_rank` | `text` | نعم | — |
| `abstract` | `text` | لا | — |
| `keywords` | `text` | نعم | — |
| `authors` | `text` | نعم | — |
| `page_count` | `integer` | نعم | — |
| `file_url` | `text` | نعم | — |
| `notes` | `text` | نعم | — |
| `client_name` | `text` | لا | — |
| `client_phone` | `text` | لا | — |
| `client_email` | `text` | نعم | — |
| `status` | `text` | لا | `'new'::text` |
| `priority` | `text` | لا | `'normal'::text` |
| `estimated_amount` | `numeric(12,2)` | نعم | — |
| `final_amount` | `numeric(12,2)` | نعم | — |
| `expected_delivery_date` | `date` | نعم | — |
| `admin_notes` | `text` | نعم | — |
| `assigned_to` | `uuid` | نعم | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |
| `updated_at` | `timestamp with time zone` | لا | `now()` |
| `attachments` | `jsonb` | لا | `'[]'::jsonb` |

**Primary key:** `PRIMARY KEY (id)`

**Unique constraints:**

- `research_publications_request_number_key` — `UNIQUE (request_number)`

**Indexes:**

- `CREATE INDEX idx_research_pub_status ON public.research_publications USING btree (status)`
- `CREATE INDEX idx_research_pub_user ON public.research_publications USING btree (user_id)`
- `CREATE UNIQUE INDEX research_publications_pkey ON public.research_publications USING btree (id)`
- `CREATE UNIQUE INDEX research_publications_request_number_key ON public.research_publications USING btree (request_number)`

**RLS:** مفعّل — عدد السياسات: 4

---

### service_categories

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `name` | `text` | لا | — |
| `name_ar` | `text` | نعم | — |
| `description` | `text` | نعم | — |
| `icon` | `text` | نعم | — |
| `sort_order` | `integer` | نعم | `0` |
| `created_at` | `timestamp with time zone` | لا | `now()` |
| `parent_id` | `uuid` | نعم | — |
| `slug` | `text` | نعم | — |
| `color` | `text` | نعم | — |
| `is_active` | `boolean` | لا | `true` |
| `updated_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `service_categories_parent_id_fkey` — `FOREIGN KEY (parent_id) REFERENCES service_categories(id) ON DELETE SET NULL`

**Indexes:**

- `CREATE INDEX idx_service_categories_parent ON public.service_categories USING btree (parent_id)`
- `CREATE UNIQUE INDEX service_categories_pkey ON public.service_categories USING btree (id)`
- `CREATE UNIQUE INDEX uniq_service_categories_slug ON public.service_categories USING btree (slug) WHERE (slug IS NOT NULL)`

**RLS:** مفعّل — عدد السياسات: 4

---

### service_order_admin_notes

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `order_id` | `uuid` | لا | — |
| `author_id` | `uuid` | لا | — |
| `content` | `text` | لا | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Indexes:**

- `CREATE INDEX idx_soan_order ON public.service_order_admin_notes USING btree (order_id, created_at)`
- `CREATE UNIQUE INDEX service_order_admin_notes_pkey ON public.service_order_admin_notes USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 1

---

### service_order_messages

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `order_id` | `uuid` | لا | — |
| `sender_id` | `uuid` | لا | — |
| `sender_type` | `text` | لا | `'client'::text` |
| `content` | `text` | لا | — |
| `read_at` | `timestamp with time zone` | نعم | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Indexes:**

- `CREATE INDEX idx_som_order ON public.service_order_messages USING btree (order_id, created_at)`
- `CREATE UNIQUE INDEX service_order_messages_pkey ON public.service_order_messages USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 3

---

### service_order_timeline

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `order_id` | `uuid` | لا | — |
| `status` | `text` | لا | — |
| `note` | `text` | نعم | — |
| `created_by` | `uuid` | نعم | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `service_order_timeline_created_by_fkey` — `FOREIGN KEY (created_by) REFERENCES auth.users(id)`
- `service_order_timeline_order_id_fkey` — `FOREIGN KEY (order_id) REFERENCES service_orders(id) ON DELETE CASCADE`

**Indexes:**

- `CREATE UNIQUE INDEX service_order_timeline_pkey ON public.service_order_timeline USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 2

---

### service_orders

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `tracking_id` | `text` | لا | `('ORD-'::text \|\| lpad((floor((random() * (1000000)::double precision)))::text, 6, '0'::text))` |
| `user_id` | `uuid` | نعم | — |
| `customer_id` | `uuid` | نعم | — |
| `service_id` | `uuid` | نعم | — |
| `service_name` | `text` | نعم | — |
| `current_status` | `text` | نعم | `'pending'::text` |
| `priority` | `text` | نعم | `'normal'::text` |
| `total_amount` | `numeric(12,2)` | نعم | `0` |
| `paid_amount` | `numeric(12,2)` | نعم | `0` |
| `notes` | `text` | نعم | — |
| `deadline` | `timestamp with time zone` | نعم | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |
| `updated_at` | `timestamp with time zone` | لا | `now()` |
| `quote_status` | `text` | نعم | — |
| `quote_notes` | `text` | نعم | — |
| `quote_sent_at` | `timestamp with time zone` | نعم | — |
| `assistance_type` | `text` | نعم | — |
| `lifecycle_status` | `order_lifecycle_status` | لا | `'received'::order_lifecycle_status` |
| `signed_contract_id` | `uuid` | نعم | — |
| `active_invoice_id` | `uuid` | نعم | — |
| `progress_percentage` | `integer` | لا | `0` |
| `client_confirmed_at` | `timestamp with time zone` | نعم | — |
| `contract_pending_at` | `timestamp with time zone` | نعم | — |
| `contract_signed_at` | `timestamp with time zone` | نعم | — |
| `payment_completed_at` | `timestamp with time zone` | نعم | — |
| `execution_started_at` | `timestamp with time zone` | نعم | — |
| `delivered_at` | `timestamp with time zone` | نعم | — |
| `completed_at` | `timestamp with time zone` | نعم | — |
| `cancelled_at` | `timestamp with time zone` | نعم | — |
| `metadata` | `jsonb` | لا | `'{}'::jsonb` |
| `estimated_amount` | `numeric` | نعم | — |
| `quantity` | `numeric` | نعم | — |
| `quantity_unit` | `text` | نعم | — |
| `preferred_language` | `text` | نعم | — |
| `quote_response_deadline` | `timestamp with time zone` | نعم | — |
| `contract_signature_deadline` | `timestamp with time zone` | نعم | — |
| `payment_deadline` | `timestamp with time zone` | نعم | — |
| `price_approval_status` | `text` | لا | `'not_requested'::text` |
| `client_estimated_price` | `numeric(12,2)` | نعم | — |
| `admin_approved_price` | `numeric(12,2)` | نعم | — |
| `price_approval_requested_at` | `timestamp with time zone` | نعم | — |
| `price_approved_at` | `timestamp with time zone` | نعم | — |
| `price_approval_note` | `text` | نعم | — |
| `price_reviewed_by` | `uuid` | نعم | — |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `service_orders_customer_id_fkey` — `FOREIGN KEY (customer_id) REFERENCES customers(id)`
- `service_orders_service_id_fkey` — `FOREIGN KEY (service_id) REFERENCES services(id)`
- `service_orders_user_id_fkey` — `FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL`

**Unique constraints:**

- `service_orders_tracking_id_key` — `UNIQUE (tracking_id)`

**Check constraints:**

- `service_orders_price_approval_status_check` — `CHECK ((price_approval_status = ANY (ARRAY['not_requested'::text, 'pending'::text, 'approved'::text, 'rejected'::text])))`
- `service_orders_priority_check` — `CHECK ((priority = ANY (ARRAY['low'::text, 'normal'::text, 'high'::text, 'urgent'::text])))`

**Indexes:**

- `CREATE INDEX idx_service_orders_deadlines ON public.service_orders USING btree (quote_response_deadline, contract_signature_deadline, payment_deadline) WHERE (lifecycle_status = ANY (ARRAY['quote_sent'::order_lifecycle_status, 'contract_pending'::order_lifecycle_status, 'contract_signed'::order_lifecycle_status, 'payment_pending'::order_lifecycle_status]))`
- `CREATE INDEX idx_service_orders_lifecycle ON public.service_orders USING btree (lifecycle_status)`
- `CREATE INDEX idx_service_orders_lifecycle_status ON public.service_orders USING btree (lifecycle_status)`
- `CREATE INDEX idx_service_orders_metadata ON public.service_orders USING gin (metadata)`
- `CREATE INDEX idx_service_orders_price_approval_status ON public.service_orders USING btree (price_approval_status) WHERE (price_approval_status = 'pending'::text)`
- `CREATE INDEX idx_service_orders_status ON public.service_orders USING btree (current_status)`
- `CREATE INDEX idx_service_orders_user_id ON public.service_orders USING btree (user_id)`
- `CREATE UNIQUE INDEX service_orders_pkey ON public.service_orders USING btree (id)`
- `CREATE UNIQUE INDEX service_orders_tracking_id_key ON public.service_orders USING btree (tracking_id)`

**RLS:** مفعّل — عدد السياسات: 4

---

### services

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `category_id` | `uuid` | نعم | — |
| `name` | `text` | لا | — |
| `name_ar` | `text` | نعم | — |
| `description` | `text` | نعم | — |
| `price` | `numeric(12,2)` | نعم | — |
| `unit` | `text` | نعم | `'page'::text` |
| `is_active` | `boolean` | نعم | `true` |
| `created_at` | `timestamp with time zone` | لا | `now()` |
| `updated_at` | `timestamp with time zone` | لا | `now()` |
| `is_group_eligible` | `boolean` | لا | `false` |
| `group_min_members` | `integer` | لا | `2` |
| `group_max_members` | `integer` | لا | `10` |
| `group_seat_price` | `numeric(12,2)` | نعم | — |
| `slug` | `text` | نعم | — |
| `image_url` | `text` | نعم | — |
| `is_featured` | `boolean` | لا | `false` |
| `description_ar` | `text` | نعم | — |
| `subcategory_id` | `uuid` | نعم | — |
| `sort_order` | `integer` | لا | `0` |
| `dynamic_fields` | `jsonb` | لا | `'[]'::jsonb` |
| `quantity_unit_label` | `text` | نعم | — |
| `default_quantity` | `integer` | لا | `1` |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `services_category_id_fkey` — `FOREIGN KEY (category_id) REFERENCES service_categories(id)`
- `services_subcategory_id_fkey` — `FOREIGN KEY (subcategory_id) REFERENCES service_categories(id) ON DELETE SET NULL`

**Indexes:**

- `CREATE INDEX idx_services_subcategory ON public.services USING btree (subcategory_id)`
- `CREATE UNIQUE INDEX services_pkey ON public.services USING btree (id)`
- `CREATE UNIQUE INDEX uniq_services_slug ON public.services USING btree (slug) WHERE (slug IS NOT NULL)`

**RLS:** مفعّل — عدد السياسات: 4

---

### smart_editor_usage

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `user_id` | `uuid` | لا | — |
| `operation` | `text` | لا | — |
| `mode` | `text` | لا | `'standard'::text` |
| `input_length` | `integer` | لا | `0` |
| `output_length` | `integer` | لا | `0` |
| `cost` | `numeric` | لا | `0` |
| `was_free` | `boolean` | لا | `false` |
| `wallet_transaction_id` | `uuid` | نعم | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Check constraints:**

- `smart_editor_usage_mode_check` — `CHECK ((mode = ANY (ARRAY['standard'::text, 'pro'::text])))`
- `smart_editor_usage_operation_check` — `CHECK ((operation = ANY (ARRAY['correct'::text, 'rephrase'::text, 'academic'::text, 'shorten'::text, 'expand'::text])))`

**Indexes:**

- `CREATE INDEX idx_smart_editor_usage_user_date ON public.smart_editor_usage USING btree (user_id, created_at DESC)`
- `CREATE UNIQUE INDEX smart_editor_usage_pkey ON public.smart_editor_usage USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 2

---

### spin_attempts

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `user_id` | `uuid` | نعم | — |
| `email` | `text` | نعم | — |
| `phone` | `text` | نعم | — |
| `prize` | `text` | نعم | — |
| `claimed` | `boolean` | نعم | `false` |
| `created_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `spin_attempts_user_id_fkey` — `FOREIGN KEY (user_id) REFERENCES auth.users(id)`

**Indexes:**

- `CREATE UNIQUE INDEX spin_attempts_pkey ON public.spin_attempts USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 3

---

### statistical_analyses

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `user_id` | `uuid` | لا | — |
| `title` | `text` | لا | `'تحليل إحصائي'::text` |
| `file_name` | `text` | نعم | — |
| `file_size` | `integer` | نعم | — |
| `row_count` | `integer` | نعم | `0` |
| `column_count` | `integer` | نعم | `0` |
| `columns_meta` | `jsonb` | لا | `'[]'::jsonb` |
| `data_sample` | `jsonb` | نعم | `'[]'::jsonb` |
| `analysis_type` | `text` | نعم | — |
| `analysis_params` | `jsonb` | نعم | `'{}'::jsonb` |
| `results` | `jsonb` | نعم | `'{}'::jsonb` |
| `assumptions` | `jsonb` | نعم | `'{}'::jsonb` |
| `interpretation_ar` | `text` | نعم | — |
| `interpretation_en` | `text` | نعم | — |
| `language` | `text` | لا | `'ar'::text` |
| `status` | `text` | لا | `'draft'::text` |
| `is_paid` | `boolean` | لا | `false` |
| `pdf_purchased` | `boolean` | لا | `false` |
| `pdf_exports_count` | `integer` | لا | `0` |
| `created_at` | `timestamp with time zone` | لا | `now()` |
| `updated_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Indexes:**

- `CREATE INDEX idx_stat_analyses_user ON public.statistical_analyses USING btree (user_id, created_at DESC)`
- `CREATE UNIQUE INDEX statistical_analyses_pkey ON public.statistical_analyses USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 5

---

### study_challenge_attempts

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `user_id` | `uuid` | لا | — |
| `status` | `text` | لا | `'in_progress'::text` |
| `current_day` | `integer` | لا | `0` |
| `streak` | `integer` | لا | `0` |
| `required_minutes` | `integer` | لا | `30` |
| `required_days` | `integer` | لا | `7` |
| `started_on` | `date` | لا | `((now() AT TIME ZONE 'Asia/Riyadh'::text))::date` |
| `last_check_in_on` | `date` | نعم | — |
| `completed_at` | `timestamp with time zone` | نعم | — |
| `failed_at` | `timestamp with time zone` | نعم | — |
| `xp_awarded` | `integer` | لا | `0` |
| `points_awarded` | `integer` | لا | `0` |
| `badge_awarded` | `text` | نعم | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |
| `updated_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Indexes:**

- `CREATE INDEX idx_scal_user ON public.study_challenge_attempts USING btree (user_id, created_at DESC)`
- `CREATE INDEX idx_scal_user_active ON public.study_challenge_attempts USING btree (user_id) WHERE (status = 'in_progress'::text)`
- `CREATE UNIQUE INDEX study_challenge_attempts_pkey ON public.study_challenge_attempts USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 3

---

### study_challenge_check_ins

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `attempt_id` | `uuid` | لا | — |
| `user_id` | `uuid` | لا | — |
| `day_number` | `integer` | لا | — |
| `check_in_date` | `date` | لا | — |
| `minutes_studied` | `integer` | لا | `30` |
| `created_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `study_challenge_check_ins_attempt_id_fkey` — `FOREIGN KEY (attempt_id) REFERENCES study_challenge_attempts(id) ON DELETE CASCADE`

**Unique constraints:**

- `study_challenge_check_ins_attempt_id_check_in_date_key` — `UNIQUE (attempt_id, check_in_date)`
- `study_challenge_check_ins_attempt_id_day_number_key` — `UNIQUE (attempt_id, day_number)`

**Indexes:**

- `CREATE INDEX idx_scci_user ON public.study_challenge_check_ins USING btree (user_id, check_in_date DESC)`
- `CREATE UNIQUE INDEX study_challenge_check_ins_attempt_id_check_in_date_key ON public.study_challenge_check_ins USING btree (attempt_id, check_in_date)`
- `CREATE UNIQUE INDEX study_challenge_check_ins_attempt_id_day_number_key ON public.study_challenge_check_ins USING btree (attempt_id, day_number)`
- `CREATE UNIQUE INDEX study_challenge_check_ins_pkey ON public.study_challenge_check_ins USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 2

---

### study_sessions

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `user_id` | `uuid` | لا | — |
| `duration_minutes` | `integer` | لا | `0` |
| `status` | `study_session_status` | لا | `'active'::study_session_status` |
| `started_at` | `timestamp with time zone` | لا | `now()` |
| `completed_at` | `timestamp with time zone` | نعم | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |
| `updated_at` | `timestamp with time zone` | لا | `now()` |
| `earned_xp` | `integer` | لا | `0` |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `study_sessions_user_id_fkey` — `FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE`

**Check constraints:**

- `study_sessions_duration_minutes_check` — `CHECK ((duration_minutes >= 0))`

**Indexes:**

- `CREATE INDEX idx_study_sessions_user_started ON public.study_sessions USING btree (user_id, started_at DESC)`
- `CREATE UNIQUE INDEX study_sessions_pkey ON public.study_sessions USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 5

---

### subjects

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `category_id` | `uuid` | لا | — |
| `name_ar` | `text` | لا | — |
| `name_en` | `text` | نعم | — |
| `description` | `text` | نعم | — |
| `icon` | `text` | نعم | — |
| `sort_order` | `integer` | لا | `0` |
| `is_active` | `boolean` | لا | `true` |
| `created_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `subjects_category_id_fkey` — `FOREIGN KEY (category_id) REFERENCES question_categories(id) ON DELETE CASCADE`

**Indexes:**

- `CREATE INDEX idx_subjects_cat ON public.subjects USING btree (category_id)`
- `CREATE UNIQUE INDEX subjects_pkey ON public.subjects USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 2

---

### support_kb_articles

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `title` | `text` | لا | — |
| `content` | `text` | لا | — |
| `category` | `text` | لا | `'general'::text` |
| `tags` | `text[]` | نعم | `'{}'::text[]` |
| `views` | `integer` | لا | `0` |
| `helpful_count` | `integer` | لا | `0` |
| `is_published` | `boolean` | لا | `true` |
| `sort_order` | `integer` | لا | `0` |
| `created_at` | `timestamp with time zone` | لا | `now()` |
| `updated_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Indexes:**

- `CREATE UNIQUE INDEX support_kb_articles_pkey ON public.support_kb_articles USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 2

---

### suppressed_emails

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `email` | `text` | لا | — |
| `reason` | `text` | لا | — |
| `metadata` | `jsonb` | نعم | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Unique constraints:**

- `suppressed_emails_email_key` — `UNIQUE (email)`

**Check constraints:**

- `suppressed_emails_reason_check` — `CHECK ((reason = ANY (ARRAY['unsubscribe'::text, 'bounce'::text, 'complaint'::text])))`

**Indexes:**

- `CREATE INDEX idx_suppressed_emails_email ON public.suppressed_emails USING btree (email)`
- `CREATE UNIQUE INDEX suppressed_emails_email_key ON public.suppressed_emails USING btree (email)`
- `CREATE UNIQUE INDEX suppressed_emails_pkey ON public.suppressed_emails USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 3

---

### ticket_attachments

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `ticket_id` | `uuid` | لا | — |
| `user_id` | `uuid` | لا | — |
| `uploaded_by_admin` | `boolean` | لا | `false` |
| `file_name` | `text` | لا | — |
| `file_size` | `integer` | لا | — |
| `file_type` | `text` | نعم | — |
| `storage_path` | `text` | لا | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `ticket_attachments_ticket_id_fkey` — `FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE`

**Indexes:**

- `CREATE INDEX idx_ticket_attachments_ticket ON public.ticket_attachments USING btree (ticket_id)`
- `CREATE UNIQUE INDEX ticket_attachments_pkey ON public.ticket_attachments USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 3

---

### ticket_messages

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `ticket_id` | `uuid` | لا | — |
| `sender_id` | `uuid` | لا | — |
| `sender_type` | `text` | لا | `'client'::text` |
| `content` | `text` | لا | — |
| `read_at` | `timestamp with time zone` | نعم | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `ticket_messages_ticket_id_fkey` — `FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE`

**Indexes:**

- `CREATE INDEX idx_ticket_messages_ticket ON public.ticket_messages USING btree (ticket_id)`
- `CREATE UNIQUE INDEX ticket_messages_pkey ON public.ticket_messages USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 3

---

### ticket_presence

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `ticket_id` | `uuid` | لا | — |
| `user_id` | `uuid` | لا | — |
| `user_type` | `text` | لا | — |
| `display_name` | `text` | نعم | — |
| `last_seen_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (ticket_id, user_id)`

**Foreign keys:**

- `ticket_presence_ticket_id_fkey` — `FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE`

**Check constraints:**

- `ticket_presence_user_type_check` — `CHECK ((user_type = ANY (ARRAY['client'::text, 'admin'::text])))`

**Indexes:**

- `CREATE UNIQUE INDEX ticket_presence_pkey ON public.ticket_presence USING btree (ticket_id, user_id)`

**RLS:** مفعّل — عدد السياسات: 4

---

### ticket_quick_replies

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `title` | `text` | لا | — |
| `content` | `text` | لا | — |
| `category` | `text` | نعم | — |
| `is_active` | `boolean` | لا | `true` |
| `sort_order` | `integer` | لا | `0` |
| `created_at` | `timestamp with time zone` | لا | `now()` |
| `created_by` | `uuid` | نعم | — |

**Primary key:** `PRIMARY KEY (id)`

**Indexes:**

- `CREATE UNIQUE INDEX ticket_quick_replies_pkey ON public.ticket_quick_replies USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 1

---

### ticket_timeline

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `ticket_id` | `uuid` | لا | — |
| `actor_id` | `uuid` | نعم | — |
| `actor_type` | `text` | لا | `'system'::text` |
| `action_type` | `text` | لا | — |
| `action_label` | `text` | لا | — |
| `description` | `text` | نعم | — |
| `metadata` | `jsonb` | نعم | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `ticket_timeline_ticket_id_fkey` — `FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE`

**Indexes:**

- `CREATE INDEX idx_ticket_timeline_ticket ON public.ticket_timeline USING btree (ticket_id)`
- `CREATE UNIQUE INDEX ticket_timeline_pkey ON public.ticket_timeline USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 2

---

### ticket_typing

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `ticket_id` | `uuid` | لا | — |
| `user_id` | `uuid` | لا | — |
| `user_type` | `text` | لا | — |
| `is_typing` | `boolean` | لا | `true` |
| `updated_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (ticket_id, user_id)`

**Foreign keys:**

- `ticket_typing_ticket_id_fkey` — `FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE`

**Check constraints:**

- `ticket_typing_user_type_check` — `CHECK ((user_type = ANY (ARRAY['client'::text, 'admin'::text])))`

**Indexes:**

- `CREATE UNIQUE INDEX ticket_typing_pkey ON public.ticket_typing USING btree (ticket_id, user_id)`

**RLS:** مفعّل — عدد السياسات: 4

---

### tickets

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `ticket_number` | `text` | لا | `('TKT-'::text \|\| lpad((floor((random() * (100000)::double precision)))::text, 5, '0'::text))` |
| `user_id` | `uuid` | لا | — |
| `subject` | `text` | لا | — |
| `description` | `text` | نعم | — |
| `category` | `text` | نعم | `'general'::text` |
| `priority` | `text` | نعم | `'medium'::text` |
| `status` | `text` | نعم | `'open'::text` |
| `assigned_to` | `uuid` | نعم | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |
| `updated_at` | `timestamp with time zone` | لا | `now()` |
| `customer_id` | `uuid` | نعم | — |
| `related_invoice_id` | `uuid` | نعم | — |
| `related_order_id` | `uuid` | نعم | — |
| `last_message_at` | `timestamp with time zone` | نعم | — |
| `resolved_at` | `timestamp with time zone` | نعم | — |
| `assigned_admin_id` | `uuid` | نعم | — |
| `first_response_at` | `timestamp with time zone` | نعم | — |
| `closed_at` | `timestamp with time zone` | نعم | — |
| `csat_rating` | `integer` | نعم | — |
| `csat_comment` | `text` | نعم | — |
| `csat_submitted_at` | `timestamp with time zone` | نعم | — |
| `sla_due_at` | `timestamp with time zone` | نعم | — |
| `auto_created` | `boolean` | لا | `false` |
| `source` | `text` | لا | `'manual'::text` |
| `tags` | `text[]` | نعم | `'{}'::text[]` |
| `unread_for_client` | `integer` | لا | `0` |
| `unread_for_admin` | `integer` | لا | `0` |
| `related_contract_id` | `uuid` | نعم | — |
| `related_payment_id` | `uuid` | نعم | — |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `tickets_assigned_admin_id_fkey` — `FOREIGN KEY (assigned_admin_id) REFERENCES auth.users(id)`
- `tickets_assigned_to_fkey` — `FOREIGN KEY (assigned_to) REFERENCES auth.users(id)`
- `tickets_related_contract_id_fkey` — `FOREIGN KEY (related_contract_id) REFERENCES contracts(id) ON DELETE SET NULL`
- `tickets_related_invoice_id_fkey` — `FOREIGN KEY (related_invoice_id) REFERENCES invoices(id) ON DELETE SET NULL`
- `tickets_related_order_id_fkey` — `FOREIGN KEY (related_order_id) REFERENCES service_orders(id) ON DELETE SET NULL`
- `tickets_related_payment_id_fkey` — `FOREIGN KEY (related_payment_id) REFERENCES invoice_payments(id) ON DELETE SET NULL`
- `tickets_user_id_fkey` — `FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL`

**Unique constraints:**

- `tickets_ticket_number_key` — `UNIQUE (ticket_number)`

**Check constraints:**

- `tickets_category_check` — `CHECK ((category = ANY (ARRAY['general'::text, 'technical'::text, 'billing'::text, 'complaint'::text, 'suggestion'::text])))`
- `tickets_csat_rating_check` — `CHECK (((csat_rating >= 1) AND (csat_rating <= 5)))`
- `tickets_priority_check` — `CHECK ((priority = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text, 'critical'::text])))`
- `tickets_status_check` — `CHECK ((status = ANY (ARRAY['open'::text, 'in_progress'::text, 'waiting'::text, 'resolved'::text, 'closed'::text])))`

**Indexes:**

- `CREATE INDEX idx_tickets_assigned_admin ON public.tickets USING btree (assigned_admin_id)`
- `CREATE INDEX idx_tickets_category ON public.tickets USING btree (category)`
- `CREATE INDEX idx_tickets_invoice ON public.tickets USING btree (related_invoice_id)`
- `CREATE INDEX idx_tickets_last_message ON public.tickets USING btree (last_message_at DESC)`
- `CREATE INDEX idx_tickets_order ON public.tickets USING btree (related_order_id)`
- `CREATE INDEX idx_tickets_related_contract_id ON public.tickets USING btree (related_contract_id)`
- `CREATE INDEX idx_tickets_related_payment_id ON public.tickets USING btree (related_payment_id)`
- `CREATE INDEX idx_tickets_sla_due ON public.tickets USING btree (sla_due_at) WHERE (status <> ALL (ARRAY['resolved'::text, 'closed'::text]))`
- `CREATE INDEX idx_tickets_status ON public.tickets USING btree (status)`
- `CREATE INDEX idx_tickets_user ON public.tickets USING btree (user_id)`
- `CREATE INDEX idx_tickets_user_id ON public.tickets USING btree (user_id)`
- `CREATE UNIQUE INDEX tickets_pkey ON public.tickets USING btree (id)`
- `CREATE UNIQUE INDEX tickets_ticket_number_key ON public.tickets USING btree (ticket_number)`

**RLS:** مفعّل — عدد السياسات: 3

---

### translation_file_analyses

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `service_order_id` | `uuid` | نعم | — |
| `user_id` | `uuid` | لا | — |
| `file_name` | `text` | لا | — |
| `file_type` | `text` | لا | — |
| `file_size_bytes` | `bigint` | لا | `0` |
| `word_count` | `integer` | لا | `0` |
| `character_count` | `integer` | لا | `0` |
| `estimated_pages` | `integer` | لا | `0` |
| `words_per_page_standard` | `integer` | لا | `250` |
| `detected_language` | `text` | لا | `'unknown'::text` |
| `arabic_ratio` | `numeric(5,2)` | نعم | `0` |
| `english_ratio` | `numeric(5,2)` | نعم | `0` |
| `domain` | `text` | لا | `'general'::text` |
| `domain_source` | `text` | لا | `'manual'::text` |
| `domain_confidence` | `numeric(5,2)` | نعم | `0` |
| `estimated_price_sar` | `numeric(10,2)` | لا | `0` |
| `per_word_rate_sar` | `numeric(6,3)` | لا | `0` |
| `urgency_multiplier` | `numeric(4,2)` | لا | `1` |
| `domain_multiplier` | `numeric(4,2)` | لا | `1` |
| `approval_status` | `text` | لا | `'pending'::text` |
| `approved_price_sar` | `numeric(10,2)` | نعم | — |
| `approved_by` | `uuid` | نعم | — |
| `approved_at` | `timestamp with time zone` | نعم | — |
| `admin_notes` | `text` | نعم | — |
| `confidence_level` | `text` | لا | `'medium'::text` |
| `analysis_method` | `text` | لا | `'browser'::text` |
| `is_fallback` | `boolean` | لا | `false` |
| `analysis_notes` | `text` | نعم | — |
| `text_sample` | `text` | نعم | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |
| `updated_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `translation_file_analyses_service_order_id_fkey` — `FOREIGN KEY (service_order_id) REFERENCES service_orders(id) ON DELETE CASCADE`

**Indexes:**

- `CREATE INDEX idx_tfa_service_order ON public.translation_file_analyses USING btree (service_order_id)`
- `CREATE INDEX idx_tfa_status ON public.translation_file_analyses USING btree (approval_status)`
- `CREATE INDEX idx_tfa_user ON public.translation_file_analyses USING btree (user_id)`
- `CREATE UNIQUE INDEX translation_file_analyses_pkey ON public.translation_file_analyses USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 5

---

### user_answers

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `user_id` | `uuid` | لا | — |
| `question_id` | `uuid` | لا | — |
| `selected_choice_id` | `uuid` | نعم | — |
| `is_correct` | `boolean` | لا | `false` |
| `time_spent_seconds` | `integer` | نعم | — |
| `answered_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `user_answers_question_id_fkey` — `FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE`
- `user_answers_selected_choice_id_fkey` — `FOREIGN KEY (selected_choice_id) REFERENCES question_choices(id) ON DELETE SET NULL`

**Indexes:**

- `CREATE INDEX idx_uans_question ON public.user_answers USING btree (question_id)`
- `CREATE INDEX idx_uans_user ON public.user_answers USING btree (user_id)`
- `CREATE INDEX idx_uans_user_correct ON public.user_answers USING btree (user_id, is_correct)`
- `CREATE UNIQUE INDEX user_answers_pkey ON public.user_answers USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 3

---

### user_inbox_notifications

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `user_id` | `uuid` | لا | — |
| `title` | `text` | لا | — |
| `message` | `text` | لا | — |
| `type` | `text` | لا | `'info'::text` |
| `link` | `text` | نعم | — |
| `metadata` | `jsonb` | نعم | `'{}'::jsonb` |
| `is_read` | `boolean` | لا | `false` |
| `read_at` | `timestamp with time zone` | نعم | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Indexes:**

- `CREATE INDEX idx_inbox_user_unread ON public.user_inbox_notifications USING btree (user_id, is_read, created_at DESC)`
- `CREATE UNIQUE INDEX user_inbox_notifications_pkey ON public.user_inbox_notifications USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 4

---

### user_memberships

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `user_id` | `uuid` | لا | — |
| `plan_id` | `uuid` | لا | — |
| `status` | `text` | لا | `'pending'::text` |
| `payment_method` | `text` | نعم | — |
| `invoice_id` | `uuid` | نعم | — |
| `amount_paid` | `numeric` | لا | `0` |
| `cashback_credited` | `boolean` | لا | `false` |
| `starts_at` | `timestamp with time zone` | نعم | — |
| `expires_at` | `timestamp with time zone` | نعم | — |
| `cancelled_at` | `timestamp with time zone` | نعم | — |
| `activated_by` | `uuid` | نعم | — |
| `notes` | `text` | نعم | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |
| `updated_at` | `timestamp with time zone` | لا | `now()` |
| `referred_by` | `uuid` | نعم | — |
| `referral_code_used` | `text` | نعم | — |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `user_memberships_invoice_id_fkey` — `FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE SET NULL`
- `user_memberships_plan_id_fkey` — `FOREIGN KEY (plan_id) REFERENCES membership_plans(id)`

**Indexes:**

- `CREATE INDEX idx_user_memberships_status ON public.user_memberships USING btree (status)`
- `CREATE INDEX idx_user_memberships_user ON public.user_memberships USING btree (user_id)`
- `CREATE UNIQUE INDEX user_memberships_pkey ON public.user_memberships USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 3

---

### user_notifications

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `user_id` | `uuid` | لا | — |
| `title` | `text` | لا | — |
| `message` | `text` | نعم | — |
| `type` | `text` | نعم | `'info'::text` |
| `read_at` | `timestamp with time zone` | نعم | — |
| `link` | `text` | نعم | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `user_notifications_user_id_fkey` — `FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE`

**Indexes:**

- `CREATE INDEX idx_user_notifications_user_id ON public.user_notifications USING btree (user_id)`
- `CREATE UNIQUE INDEX user_notifications_pkey ON public.user_notifications USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 3

---

### user_referral_codes

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `user_id` | `uuid` | لا | — |
| `code` | `text` | لا | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (user_id)`

**Unique constraints:**

- `user_referral_codes_code_key` — `UNIQUE (code)`

**Indexes:**

- `CREATE INDEX idx_user_referral_codes_code ON public.user_referral_codes USING btree (code)`
- `CREATE UNIQUE INDEX user_referral_codes_code_key ON public.user_referral_codes USING btree (code)`
- `CREATE UNIQUE INDEX user_referral_codes_pkey ON public.user_referral_codes USING btree (user_id)`

**RLS:** مفعّل — عدد السياسات: 2

---

### user_referrals

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `user_id` | `uuid` | لا | — |
| `ref_code` | `text` | لا | — |
| `total_clicks` | `integer` | لا | `0` |
| `total_signups` | `integer` | لا | `0` |
| `total_orders` | `integer` | لا | `0` |
| `created_at` | `timestamp with time zone` | لا | `now()` |
| `updated_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Unique constraints:**

- `user_referrals_ref_code_unique` — `UNIQUE (ref_code)`
- `user_referrals_user_unique` — `UNIQUE (user_id)`

**Indexes:**

- `CREATE INDEX idx_user_referrals_code ON public.user_referrals USING btree (ref_code)`
- `CREATE INDEX idx_user_referrals_user ON public.user_referrals USING btree (user_id)`
- `CREATE UNIQUE INDEX user_referrals_pkey ON public.user_referrals USING btree (id)`
- `CREATE UNIQUE INDEX user_referrals_ref_code_unique ON public.user_referrals USING btree (ref_code)`
- `CREATE UNIQUE INDEX user_referrals_user_unique ON public.user_referrals USING btree (user_id)`

**RLS:** مفعّل — عدد السياسات: 4

---

### user_roles

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `user_id` | `uuid` | لا | — |
| `role` | `app_role` | لا | `'user'::app_role` |
| `created_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `user_roles_user_id_fkey` — `FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE`

**Unique constraints:**

- `user_roles_user_id_role_key` — `UNIQUE (user_id, role)`

**Indexes:**

- `CREATE INDEX idx_user_roles_user_id ON public.user_roles USING btree (user_id)`
- `CREATE UNIQUE INDEX user_roles_pkey ON public.user_roles USING btree (id)`
- `CREATE UNIQUE INDEX user_roles_user_id_role_key ON public.user_roles USING btree (user_id, role)`

**RLS:** مفعّل — عدد السياسات: 3

---

### user_secret_features

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `user_id` | `uuid` | لا | — |
| `feature_key` | `text` | لا | — |
| `unlocked_at` | `timestamp with time zone` | لا | `now()` |
| `metadata` | `jsonb` | لا | `'{}'::jsonb` |

**Primary key:** `PRIMARY KEY (id)`

**Unique constraints:**

- `user_secret_features_user_id_feature_key_key` — `UNIQUE (user_id, feature_key)`

**Indexes:**

- `CREATE INDEX idx_usf_user ON public.user_secret_features USING btree (user_id)`
- `CREATE UNIQUE INDEX user_secret_features_pkey ON public.user_secret_features USING btree (id)`
- `CREATE UNIQUE INDEX user_secret_features_user_id_feature_key_key ON public.user_secret_features USING btree (user_id, feature_key)`

**RLS:** مفعّل — عدد السياسات: 1

---

### wallet_credit_events

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `application_id` | `uuid` | نعم | — |
| `user_id` | `uuid` | لا | — |
| `amount` | `numeric(12,2)` | لا | — |
| `event_type` | `wallet_credit_event_type` | لا | — |
| `wallet_transaction_id` | `uuid` | نعم | — |
| `metadata` | `jsonb` | نعم | `'{}'::jsonb` |
| `created_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `wallet_credit_events_application_id_fkey` — `FOREIGN KEY (application_id) REFERENCES financing_applications(id) ON DELETE SET NULL`

**Indexes:**

- `CREATE INDEX idx_wallet_credit_events_app ON public.wallet_credit_events USING btree (application_id)`
- `CREATE INDEX idx_wallet_credit_events_user ON public.wallet_credit_events USING btree (user_id)`
- `CREATE UNIQUE INDEX wallet_credit_events_pkey ON public.wallet_credit_events USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 2

---

### wallet_topup_requests

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `user_id` | `uuid` | لا | — |
| `wallet_id` | `uuid` | نعم | — |
| `amount` | `numeric` | لا | — |
| `payment_method` | `text` | لا | `'bank_transfer'::text` |
| `reference_number` | `text` | نعم | — |
| `notes` | `text` | نعم | — |
| `receipt_path` | `text` | نعم | — |
| `status` | `text` | لا | `'pending'::text` |
| `reviewed_by` | `uuid` | نعم | — |
| `reviewed_at` | `timestamp with time zone` | نعم | — |
| `admin_notes` | `text` | نعم | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |
| `updated_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `wallet_topup_requests_wallet_id_fkey` — `FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE SET NULL`

**Check constraints:**

- `wallet_topup_requests_amount_check` — `CHECK ((amount > (0)::numeric))`

**Indexes:**

- `CREATE UNIQUE INDEX wallet_topup_requests_pkey ON public.wallet_topup_requests USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 3

---

### wallet_transactions

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `wallet_id` | `uuid` | لا | — |
| `user_id` | `uuid` | لا | — |
| `type` | `text` | لا | — |
| `amount` | `numeric` | لا | — |
| `balance_after` | `numeric` | لا | `0` |
| `description` | `text` | نعم | — |
| `reference_type` | `text` | نعم | — |
| `reference_id` | `uuid` | نعم | — |
| `created_by` | `uuid` | نعم | — |
| `metadata` | `jsonb` | نعم | `'{}'::jsonb` |
| `created_at` | `timestamp with time zone` | لا | `now()` |
| `payment_intent_id` | `uuid` | نعم | — |
| `receipt_number` | `text` | نعم | — |
| `balance_before` | `numeric` | نعم | — |
| `gateway_ref` | `text` | نعم | — |
| `masked_account` | `text` | نعم | — |
| `fee_amount` | `numeric` | لا | `0` |
| `vat_amount` | `numeric` | لا | `0` |
| `currency` | `text` | لا | `'SAR'::text` |
| `payment_method` | `text` | نعم | — |
| `signature_hash` | `text` | نعم | — |
| `reconciled` | `boolean` | لا | `false` |
| `reconciled_at` | `timestamp with time zone` | نعم | — |
| `signed_at` | `timestamp with time zone` | لا | `now()` |
| `receipt_pdf_path` | `text` | نعم | — |
| `receipt_generated_at` | `timestamp with time zone` | نعم | — |
| `ip_address` | `text` | نعم | — |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `wallet_transactions_payment_intent_id_fkey` — `FOREIGN KEY (payment_intent_id) REFERENCES payment_intents(id) ON DELETE SET NULL`
- `wallet_transactions_wallet_id_fkey` — `FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE`

**Unique constraints:**

- `wallet_transactions_receipt_number_key` — `UNIQUE (receipt_number)`

**Indexes:**

- `CREATE INDEX idx_wallet_tx_gateway_ref ON public.wallet_transactions USING btree (gateway_ref)`
- `CREATE INDEX idx_wallet_tx_receipt_no ON public.wallet_transactions USING btree (receipt_number)`
- `CREATE INDEX idx_wallet_tx_user ON public.wallet_transactions USING btree (user_id, created_at DESC)`
- `CREATE INDEX idx_wallet_tx_wallet ON public.wallet_transactions USING btree (wallet_id, created_at DESC)`
- `CREATE INDEX idx_wt_payment_intent ON public.wallet_transactions USING btree (payment_intent_id)`
- `CREATE UNIQUE INDEX wallet_transactions_pkey ON public.wallet_transactions USING btree (id)`
- `CREATE UNIQUE INDEX wallet_transactions_receipt_number_key ON public.wallet_transactions USING btree (receipt_number)`

**RLS:** مفعّل — عدد السياسات: 5

---

### wallets

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `user_id` | `uuid` | لا | — |
| `balance` | `numeric` | لا | `0` |
| `total_deposited` | `numeric` | لا | `0` |
| `total_spent` | `numeric` | لا | `0` |
| `currency` | `text` | لا | `'SAR'::text` |
| `status` | `text` | لا | `'active'::text` |
| `created_at` | `timestamp with time zone` | لا | `now()` |
| `updated_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Unique constraints:**

- `wallets_user_id_key` — `UNIQUE (user_id)`

**Indexes:**

- `CREATE UNIQUE INDEX wallets_pkey ON public.wallets USING btree (id)`
- `CREATE UNIQUE INDEX wallets_user_id_key ON public.wallets USING btree (user_id)`

**RLS:** مفعّل — عدد السياسات: 2

---

### whatsapp_bot_sessions

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `phone` | `text` | لا | — |
| `user_id` | `uuid` | نعم | — |
| `customer_id` | `uuid` | نعم | — |
| `is_registered` | `boolean` | لا | `false` |
| `state` | `text` | لا | `'idle'::text` |
| `state_data` | `jsonb` | لا | `'{}'::jsonb` |
| `human_takeover` | `boolean` | لا | `false` |
| `human_takeover_at` | `timestamp with time zone` | نعم | — |
| `human_takeover_reason` | `text` | نعم | — |
| `failed_attempts` | `integer` | لا | `0` |
| `last_message` | `text` | نعم | — |
| `last_message_at` | `timestamp with time zone` | نعم | — |
| `last_bot_reply_at` | `timestamp with time zone` | نعم | — |
| `inbox_message_id` | `uuid` | نعم | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |
| `updated_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Unique constraints:**

- `whatsapp_bot_sessions_phone_key` — `UNIQUE (phone)`

**Indexes:**

- `CREATE INDEX idx_wa_bot_sessions_phone ON public.whatsapp_bot_sessions USING btree (phone)`
- `CREATE INDEX idx_wa_bot_sessions_takeover ON public.whatsapp_bot_sessions USING btree (human_takeover) WHERE (human_takeover = true)`
- `CREATE UNIQUE INDEX whatsapp_bot_sessions_phone_key ON public.whatsapp_bot_sessions USING btree (phone)`
- `CREATE UNIQUE INDEX whatsapp_bot_sessions_pkey ON public.whatsapp_bot_sessions USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 1

---

### whatsapp_campaign_recipients

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `campaign_id` | `uuid` | لا | — |
| `phone` | `text` | لا | — |
| `name` | `text` | نعم | — |
| `user_id` | `uuid` | نعم | — |
| `customer_id` | `uuid` | نعم | — |
| `variables` | `jsonb` | لا | `'{}'::jsonb` |
| `status` | `text` | لا | `'pending'::text` |
| `send_log_id` | `uuid` | نعم | — |
| `error_message` | `text` | نعم | — |
| `sent_at` | `timestamp with time zone` | نعم | — |
| `read_at` | `timestamp with time zone` | نعم | — |
| `replied_at` | `timestamp with time zone` | نعم | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `whatsapp_campaign_recipients_campaign_id_fkey` — `FOREIGN KEY (campaign_id) REFERENCES whatsapp_campaigns(id) ON DELETE CASCADE`

**Check constraints:**

- `whatsapp_campaign_recipients_status_check` — `CHECK ((status = ANY (ARRAY['pending'::text, 'sent'::text, 'failed'::text, 'read'::text, 'replied'::text])))`

**Indexes:**

- `CREATE INDEX idx_wa_camp_rec_campaign ON public.whatsapp_campaign_recipients USING btree (campaign_id, status)`
- `CREATE INDEX idx_wa_camp_rec_phone ON public.whatsapp_campaign_recipients USING btree (phone)`
- `CREATE INDEX idx_wa_camp_recipients_status ON public.whatsapp_campaign_recipients USING btree (campaign_id, status)`
- `CREATE UNIQUE INDEX whatsapp_campaign_recipients_pkey ON public.whatsapp_campaign_recipients USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 1

---

### whatsapp_campaigns

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `name` | `text` | لا | — |
| `description` | `text` | نعم | — |
| `template_id` | `uuid` | نعم | — |
| `message_body` | `text` | لا | — |
| `variables_map` | `jsonb` | لا | `'{}'::jsonb` |
| `audience_filter` | `jsonb` | لا | `'{"type": "all"}'::jsonb` |
| `status` | `text` | لا | `'draft'::text` |
| `scheduled_at` | `timestamp with time zone` | نعم | — |
| `started_at` | `timestamp with time zone` | نعم | — |
| `completed_at` | `timestamp with time zone` | نعم | — |
| `total_recipients` | `integer` | لا | `0` |
| `sent_count` | `integer` | لا | `0` |
| `failed_count` | `integer` | لا | `0` |
| `read_count` | `integer` | لا | `0` |
| `reply_count` | `integer` | لا | `0` |
| `created_by` | `uuid` | نعم | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |
| `updated_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `whatsapp_campaigns_template_id_fkey` — `FOREIGN KEY (template_id) REFERENCES whatsapp_templates(id) ON DELETE SET NULL`

**Check constraints:**

- `whatsapp_campaigns_status_check` — `CHECK ((status = ANY (ARRAY['draft'::text, 'scheduled'::text, 'running'::text, 'completed'::text, 'failed'::text, 'cancelled'::text])))`

**Indexes:**

- `CREATE INDEX idx_wa_campaigns_created ON public.whatsapp_campaigns USING btree (created_at DESC)`
- `CREATE INDEX idx_wa_campaigns_status ON public.whatsapp_campaigns USING btree (status, scheduled_at)`
- `CREATE UNIQUE INDEX whatsapp_campaigns_pkey ON public.whatsapp_campaigns USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 1

---

### whatsapp_conversation_notes

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `conversation_id` | `uuid` | لا | — |
| `admin_id` | `uuid` | نعم | — |
| `admin_name` | `text` | نعم | — |
| `body` | `text` | لا | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `whatsapp_conversation_notes_conversation_id_fkey` — `FOREIGN KEY (conversation_id) REFERENCES whatsapp_conversations(id) ON DELETE CASCADE`

**Indexes:**

- `CREATE INDEX idx_wa_conv_notes ON public.whatsapp_conversation_notes USING btree (conversation_id, created_at DESC)`
- `CREATE UNIQUE INDEX whatsapp_conversation_notes_pkey ON public.whatsapp_conversation_notes USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 1

---

### whatsapp_conversations

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `phone` | `text` | لا | — |
| `customer_name` | `text` | نعم | — |
| `user_id` | `uuid` | نعم | — |
| `customer_id` | `uuid` | نعم | — |
| `assigned_to` | `uuid` | نعم | — |
| `status` | `text` | لا | `'open'::text` |
| `is_pinned` | `boolean` | لا | `false` |
| `is_starred` | `boolean` | لا | `false` |
| `human_takeover` | `boolean` | لا | `false` |
| `unread_count` | `integer` | لا | `0` |
| `last_message` | `text` | نعم | — |
| `last_message_at` | `timestamp with time zone` | نعم | — |
| `last_inbound_at` | `timestamp with time zone` | نعم | — |
| `last_admin_read_at` | `timestamp with time zone` | نعم | — |
| `tags` | `text[]` | لا | `'{}'::text[]` |
| `metadata` | `jsonb` | لا | `'{}'::jsonb` |
| `created_at` | `timestamp with time zone` | لا | `now()` |
| `updated_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Unique constraints:**

- `whatsapp_conversations_phone_key` — `UNIQUE (phone)`

**Check constraints:**

- `whatsapp_conversations_status_check` — `CHECK ((status = ANY (ARRAY['open'::text, 'pending'::text, 'closed'::text, 'archived'::text])))`

**Indexes:**

- `CREATE INDEX idx_wa_conv_assigned ON public.whatsapp_conversations USING btree (assigned_to)`
- `CREATE INDEX idx_wa_conv_pinned_lastmsg ON public.whatsapp_conversations USING btree (is_pinned DESC, last_message_at DESC)`
- `CREATE INDEX idx_wa_conv_status ON public.whatsapp_conversations USING btree (status, last_message_at DESC)`
- `CREATE INDEX idx_wa_conv_unread ON public.whatsapp_conversations USING btree (unread_count) WHERE (unread_count > 0)`
- `CREATE UNIQUE INDEX whatsapp_conversations_phone_key ON public.whatsapp_conversations USING btree (phone)`
- `CREATE UNIQUE INDEX whatsapp_conversations_pkey ON public.whatsapp_conversations USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 1

---

### whatsapp_inbound_messages

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `phone` | `text` | لا | — |
| `message_body` | `text` | نعم | — |
| `message_type` | `text` | نعم | `'text'::text` |
| `raw_payload` | `jsonb` | نعم | — |
| `bot_handled` | `boolean` | لا | `false` |
| `bot_reply` | `text` | نعم | — |
| `forwarded_to_human` | `boolean` | لا | `false` |
| `inbox_message_id` | `uuid` | نعم | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Indexes:**

- `CREATE INDEX idx_wa_inbound_phone ON public.whatsapp_inbound_messages USING btree (phone, created_at DESC)`
- `CREATE UNIQUE INDEX whatsapp_inbound_messages_pkey ON public.whatsapp_inbound_messages USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 1

---

### whatsapp_messages

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `conversation_id` | `uuid` | لا | — |
| `phone` | `text` | لا | — |
| `direction` | `text` | لا | — |
| `sender_type` | `text` | لا | — |
| `sender_id` | `uuid` | نعم | — |
| `sender_name` | `text` | نعم | — |
| `body` | `text` | لا | — |
| `message_type` | `text` | لا | `'text'::text` |
| `media_url` | `text` | نعم | — |
| `media_filename` | `text` | نعم | — |
| `provider_message_id` | `text` | نعم | — |
| `delivery_status` | `text` | لا | `'pending'::text` |
| `error_message` | `text` | نعم | — |
| `read_by_customer_at` | `timestamp with time zone` | نعم | — |
| `read_by_admin_at` | `timestamp with time zone` | نعم | — |
| `metadata` | `jsonb` | لا | `'{}'::jsonb` |
| `created_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `whatsapp_messages_conversation_id_fkey` — `FOREIGN KEY (conversation_id) REFERENCES whatsapp_conversations(id) ON DELETE CASCADE`

**Check constraints:**

- `whatsapp_messages_delivery_status_check` — `CHECK ((delivery_status = ANY (ARRAY['pending'::text, 'sent'::text, 'delivered'::text, 'read'::text, 'failed'::text])))`
- `whatsapp_messages_direction_check` — `CHECK ((direction = ANY (ARRAY['inbound'::text, 'outbound'::text])))`
- `whatsapp_messages_message_type_check` — `CHECK ((message_type = ANY (ARRAY['text'::text, 'image'::text, 'document'::text, 'audio'::text, 'video'::text, 'template'::text])))`
- `whatsapp_messages_sender_type_check` — `CHECK ((sender_type = ANY (ARRAY['customer'::text, 'admin'::text, 'bot'::text, 'system'::text])))`

**Indexes:**

- `CREATE INDEX idx_wa_msg_conv ON public.whatsapp_messages USING btree (conversation_id, created_at DESC)`
- `CREATE INDEX idx_wa_msg_conv_created ON public.whatsapp_messages USING btree (conversation_id, created_at)`
- `CREATE INDEX idx_wa_msg_phone ON public.whatsapp_messages USING btree (phone, created_at DESC)`
- `CREATE UNIQUE INDEX whatsapp_messages_pkey ON public.whatsapp_messages USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 1

---

### whatsapp_otp_codes

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `phone` | `text` | لا | — |
| `code_hash` | `text` | لا | — |
| `purpose` | `text` | لا | `'login'::text` |
| `attempts` | `integer` | لا | `0` |
| `used` | `boolean` | لا | `false` |
| `expires_at` | `timestamp with time zone` | لا | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |
| `ip_address` | `text` | نعم | — |

**Primary key:** `PRIMARY KEY (id)`

**Indexes:**

- `CREATE INDEX idx_wa_otp_expires ON public.whatsapp_otp_codes USING btree (expires_at)`
- `CREATE INDEX idx_wa_otp_phone ON public.whatsapp_otp_codes USING btree (phone, used)`
- `CREATE UNIQUE INDEX whatsapp_otp_codes_pkey ON public.whatsapp_otp_codes USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 1

---

### whatsapp_quick_replies

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `shortcut` | `text` | نعم | — |
| `title` | `text` | لا | — |
| `body` | `text` | لا | — |
| `category` | `text` | نعم | — |
| `use_count` | `integer` | لا | `0` |
| `is_active` | `boolean` | لا | `true` |
| `created_by` | `uuid` | نعم | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |
| `updated_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Indexes:**

- `CREATE UNIQUE INDEX whatsapp_quick_replies_pkey ON public.whatsapp_quick_replies USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 1

---

### whatsapp_send_log

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `to_phone` | `text` | لا | — |
| `event_key` | `text` | نعم | — |
| `message_body` | `text` | نعم | — |
| `variables` | `jsonb` | نعم | `'{}'::jsonb` |
| `status` | `text` | لا | `'queued'::text` |
| `provider_message_id` | `text` | نعم | — |
| `error_message` | `text` | نعم | — |
| `user_id` | `uuid` | نعم | — |
| `related_entity_type` | `text` | نعم | — |
| `related_entity_id` | `uuid` | نعم | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Indexes:**

- `CREATE INDEX idx_wa_log_created ON public.whatsapp_send_log USING btree (created_at DESC)`
- `CREATE INDEX idx_wa_log_phone ON public.whatsapp_send_log USING btree (to_phone)`
- `CREATE INDEX idx_wa_log_status ON public.whatsapp_send_log USING btree (status)`
- `CREATE UNIQUE INDEX whatsapp_send_log_pkey ON public.whatsapp_send_log USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 2

---

### whatsapp_settings

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `integer` | لا | `1` |
| `is_enabled` | `boolean` | لا | `true` |
| `events_enabled` | `jsonb` | لا | `'{"otp_login": true, "invoice_new": true, "invoice_paid": true, "order_created": true, "contract_invite": true, "contract_signed": true, "order_delivered": true, "invoice_reminder": true, "order_status_changed": true}'::jsonb` |
| `default_country_code` | `text` | لا | `'966'::text` |
| `test_phone` | `text` | نعم | — |
| `updated_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Check constraints:**

- `single_row` — `CHECK ((id = 1))`

**Indexes:**

- `CREATE UNIQUE INDEX whatsapp_settings_pkey ON public.whatsapp_settings USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 1

---

### whatsapp_templates

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `event_key` | `text` | لا | — |
| `title` | `text` | لا | — |
| `body_text` | `text` | لا | — |
| `variables` | `jsonb` | لا | `'[]'::jsonb` |
| `is_active` | `boolean` | لا | `true` |
| `created_at` | `timestamp with time zone` | لا | `now()` |
| `updated_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Unique constraints:**

- `whatsapp_templates_event_key_key` — `UNIQUE (event_key)`

**Indexes:**

- `CREATE UNIQUE INDEX whatsapp_templates_event_key_key ON public.whatsapp_templates USING btree (event_key)`
- `CREATE UNIQUE INDEX whatsapp_templates_pkey ON public.whatsapp_templates USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 1

---

### withdrawal_requests

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `user_id` | `uuid` | لا | — |
| `amount` | `numeric` | لا | — |
| `bank_name` | `text` | لا | — |
| `account_holder_name` | `text` | لا | — |
| `iban` | `text` | لا | — |
| `notes` | `text` | نعم | — |
| `status` | `withdrawal_status` | لا | `'pending'::withdrawal_status` |
| `admin_notes` | `text` | نعم | — |
| `reviewed_by` | `uuid` | نعم | — |
| `reviewed_at` | `timestamp with time zone` | نعم | — |
| `paid_at` | `timestamp with time zone` | نعم | — |
| `hold_transaction_id` | `uuid` | نعم | — |
| `refund_transaction_id` | `uuid` | نعم | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |
| `updated_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Check constraints:**

- `withdrawal_requests_amount_check` — `CHECK ((amount >= (100)::numeric))`

**Indexes:**

- `CREATE INDEX idx_withdrawal_requests_status ON public.withdrawal_requests USING btree (status, created_at DESC)`
- `CREATE INDEX idx_withdrawal_requests_user ON public.withdrawal_requests USING btree (user_id, created_at DESC)`
- `CREATE UNIQUE INDEX withdrawal_requests_pkey ON public.withdrawal_requests USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 4

---

### workspace_notes

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `user_id` | `uuid` | لا | — |
| `title` | `text` | لا | `'ملاحظة جديدة'::text` |
| `content` | `text` | لا | `''::text` |
| `tags` | `text[]` | نعم | `ARRAY[]::text[]` |
| `source_type` | `text` | نعم | — |
| `created_at` | `timestamp with time zone` | لا | `now()` |
| `updated_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Indexes:**

- `CREATE INDEX idx_workspace_notes_user ON public.workspace_notes USING btree (user_id, updated_at DESC)`
- `CREATE UNIQUE INDEX workspace_notes_pkey ON public.workspace_notes USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 4

---

### xp_daily_limits

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `source_type` | `text` | لا | — |
| `max_per_day` | `integer` | لا | — |
| `max_xp_per_day` | `integer` | لا | — |
| `description` | `text` | نعم | — |

**Primary key:** `PRIMARY KEY (source_type)`

**Indexes:**

- `CREATE UNIQUE INDEX xp_daily_limits_pkey ON public.xp_daily_limits USING btree (source_type)`

**RLS:** مفعّل — عدد السياسات: 2

---

### xp_levels

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `level` | `integer` | لا | — |
| `name_ar` | `text` | لا | — |
| `required_xp_total` | `integer` | لا | — |
| `badge_color` | `text` | نعم | — |
| `icon` | `text` | نعم | — |
| `reward_type` | `text` | نعم | — |
| `reward_payload` | `jsonb` | لا | `'{}'::jsonb` |
| `created_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (level)`

**Indexes:**

- `CREATE UNIQUE INDEX xp_levels_pkey ON public.xp_levels USING btree (level)`

**RLS:** مفعّل — عدد السياسات: 2

---

### xp_transactions

| العمود | النوع | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | لا | `gen_random_uuid()` |
| `user_id` | `uuid` | لا | — |
| `amount` | `integer` | لا | — |
| `source_type` | `text` | لا | — |
| `source_id` | `text` | نعم | — |
| `description` | `text` | نعم | — |
| `balance_after` | `integer` | لا | — |
| `metadata` | `jsonb` | لا | `'{}'::jsonb` |
| `created_at` | `timestamp with time zone` | لا | `now()` |

**Primary key:** `PRIMARY KEY (id)`

**Foreign keys:**

- `xp_transactions_user_id_fkey` — `FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE`

**Indexes:**

- `CREATE INDEX idx_xp_tx_source ON public.xp_transactions USING btree (source_type, source_id)`
- `CREATE INDEX idx_xp_tx_user_created ON public.xp_transactions USING btree (user_id, created_at DESC)`
- `CREATE UNIQUE INDEX xp_transactions_pkey ON public.xp_transactions USING btree (id)`

**RLS:** مفعّل — عدد السياسات: 2

---

## الدوال (Functions / RPC)

| الدالة | المعاملات | ترجع | SECURITY DEFINER |
|---|---|---|---|
| `accept_service_quote` | `_order_id uuid` | `jsonb` | نعم |
| `after_group_member_change` | `` | `trigger` | نعم |
| `aggregate_daily_growth_metrics` | `p_date date` | `daily_growth_metrics` | نعم |
| `analyze_growth_insights` | `` | `jsonb` | نعم |
| `apply_wallet_transaction` | `` | `trigger` | نعم |
| `archive_experiment` | `p_experiment_id uuid` | `experiments` | نعم |
| `assign_experiment_variant` | `p_experiment_key text, p_user_id uuid, p_anonymous_id text, p_context jsonb` | `TABLE(variant_id uuid, variant_key text, config_payload jsonb, is_control boolean)` | نعم |
| `auto_ticket_for_overdue_invoice` | `` | `trigger` | نعم |
| `auto_ticket_for_unsigned_contract` | `` | `trigger` | نعم |
| `before_group_member_insert` | `` | `trigger` | نعم |
| `bq_1v1_accept_friend_invite` | `p_invite_code text` | `jsonb` | نعم |
| `bq_1v1_cancel_queue` | `` | `jsonb` | نعم |
| `bq_1v1_enqueue` | `p_category text` | `jsonb` | نعم |
| `bq_1v1_finalize` | `p_match_id uuid` | `jsonb` | نعم |
| `bq_1v1_get_leaderboard` | `p_limit integer` | `TABLE(rank integer, user_id uuid, rating integer, wins integer, losses integer, draws integer, matches_played integer, current_streak integer, best_streak integer, display_name text, avatar_url text)` | نعم |
| `bq_1v1_heartbeat` | `p_match_id uuid` | `void` | نعم |
| `bq_1v1_request_rematch` | `p_match_id uuid` | `jsonb` | نعم |
| `bq_1v1_submit_score` | `p_match_id uuid, p_attempt_id uuid, p_score integer, p_correct integer, p_total_time_ms integer` | `jsonb` | نعم |
| `bq_bump_missions_on_1v1_finalize` | `` | `trigger` | نعم |
| `bq_bump_missions_on_invite_accept` | `` | `trigger` | نعم |
| `bq_claim_daily_mission` | `p_user_mission_id uuid` | `jsonb` | نعم |
| `bq_get_daily_missions` | `` | `TABLE(user_mission_id uuid, mission_id uuid, slug text, title_ar text, description_ar text, icon text, mission_type text, scope text, target_value integer, xp_reward integer, progress integer, is_completed boolean, is_claimed boolean)` | نعم |
| `bq_is_admin` | `` | `boolean` | نعم |
| `bq_touch_updated_at` | `` | `trigger` | لا |
| `build_growth_snapshot` | `` | `jsonb` | نعم |
| `bump_inbox_message_on_reply` | `` | `trigger` | لا |
| `bump_referral_clicks` | `` | `trigger` | نعم |
| `bump_referral_conversions` | `` | `trigger` | نعم |
| `calc_financing_amounts` | `` | `trigger` | لا |
| `cancel_group_order` | `_group_order_id uuid, _reason text` | `jsonb` | نعم |
| `challenge_submit` | `p_user_id uuid, p_challenge_id uuid, p_answer text` | `jsonb` | نعم |
| `challenge_update_streak` | `p_user_id uuid` | `TABLE(current_streak integer, longest_streak integer)` | نعم |
| `check_in_study_challenge` | `p_minutes integer` | `jsonb` | نعم |
| `claim_referral` | `_ref_code text` | `jsonb` | نعم |
| `classify_severity` | `_delta_pct numeric` | `text` | لا |
| `client_confirm_delivery` | `_order_id uuid` | `jsonb` | نعم |
| `complete_experiment` | `p_experiment_id uuid, p_winner_variant_id uuid, p_note text` | `experiments` | نعم |
| `complete_referral_on_first_challenge` | `` | `trigger` | نعم |
| `compute_experiment_results` | `p_experiment_id uuid` | `jsonb` | نعم |
| `compute_order_countdown` | `_order_id uuid` | `jsonb` | نعم |
| `compute_ticket_sla` | `_priority text, _created timestamp with time zone` | `timestamp with time zone` | لا |
| `create_customer_for_new_profile` | `` | `trigger` | نعم |
| `create_deadline_reminders` | `` | `trigger` | نعم |
| `create_group_order` | `_service_id uuid, _title text, _description text, _max_members integer, _deadline timestamp with time zone` | `uuid` | نعم |
| `create_wallet_for_new_profile` | `` | `trigger` | نعم |
| `deduct_wallet_on_invoice_payment` | `` | `trigger` | نعم |
| `delete_email` | `queue_name text, message_id bigint` | `boolean` | نعم |
| `dismiss_automation_insight` | `_id uuid, _note text` | `jsonb` | نعم |
| `dispatch_document_send` | `_kind text, _id uuid` | `void` | نعم |
| `dispatch_lifecycle_email` | `` | `trigger` | نعم |
| `email_queue_dispatch` | `` | `void` | نعم |
| `email_queue_wake` | `` | `trigger` | نعم |
| `enqueue_email` | `queue_name text, payload jsonb` | `bigint` | نعم |
| `ensure_referral_code` | `_user_id uuid` | `text` | نعم |
| `generate_customer_code` | `` | `text` | لا |
| `generate_financing_installments` | `_application_id uuid` | `void` | نعم |
| `generate_group_invite_code` | `` | `text` | لا |
| `generate_internal_order_number` | `` | `text` | لا |
| `generate_receipt_number` | `` | `text` | لا |
| `generate_referral_code` | `` | `text` | لا |
| `generate_short_ref_code` | `` | `text` | نعم |
| `get_active_bonus_drop` | `p_user_id uuid` | `jsonb` | نعم |
| `get_active_membership` | `_user_id uuid` | `TABLE(membership_id uuid, plan_id uuid, plan_code text, plan_name_ar text, discount_percentage numeric, cashback_amount numeric, priority_level integer, badge_color text, expires_at timestamp with time zone)` | نعم |
| `get_active_multipliers` | `` | `jsonb` | نعم |
| `get_ai_usage_today` | `_tool_type text` | `integer` | نعم |
| `get_challenge_leaderboard` | `p_period text, p_limit integer` | `TABLE(user_id uuid, full_name text, avatar_url text, total_xp integer, weekly_xp integer, monthly_xp integer, level_name text, level_color text, level_icon text, rank integer)` | نعم |
| `get_daily_assessment_questions` | `p_assessment_id uuid, p_limit integer` | `TABLE(id uuid, assessment_id uuid, question_text text, difficulty text, skill_tag text, explanation text, order_index integer)` | نعم |
| `get_growth_daily_series` | `p_days integer` | `TABLE(date date, new_users integer, active_users integer, challenges_completed integer, shares_count integer, referrals_count integer, referrals_completed integer, retention_rate numeric)` | نعم |
| `get_growth_funnel` | `p_days integer` | `jsonb` | نعم |
| `get_growth_overview` | `p_days integer` | `jsonb` | نعم |
| `get_growth_sources` | `p_days integer` | `TABLE(source text, users integer, percentage numeric)` | نعم |
| `get_mind_map_usage_today` | `` | `integer` | نعم |
| `get_referral_commission_balance` | `_user_id uuid` | `numeric` | نعم |
| `get_referral_leaderboard` | `p_limit integer` | `TABLE(referrer_user_id uuid, referrer_name text, total_invites integer, completed_invites integer, conversion_rate numeric)` | نعم |
| `get_referrer_by_code` | `_code text` | `TABLE(user_id uuid, customer_id uuid, name text)` | نعم |
| `get_retention_cohort` | `p_days integer` | `jsonb` | نعم |
| `get_study_challenge_state` | `p_user_id uuid` | `jsonb` | نعم |
| `get_today_any_assessment_attempt` | `p_user_id uuid, p_anonymous_id text` | `TABLE(attempt_id uuid, assessment_id uuid, assessment_slug text, assessment_title text, completed_at timestamp with time zone, next_available_at timestamp with time zone)` | نعم |
| `get_today_assessment_attempt` | `p_assessment_id uuid, p_user_id uuid, p_anonymous_id text` | `uuid` | نعم |
| `get_top_challenges` | `p_days integer, p_limit integer` | `TABLE(challenge_id uuid, title text, attempts integer, perfect integer, shares integer)` | نعم |
| `get_user_whatsapp_phone` | `_user_id uuid` | `text` | نعم |
| `get_viral_referral_summary` | `p_user_id uuid` | `jsonb` | نعم |
| `grant_referral_viral_reward` | `p_referral_id uuid, p_referrer uuid, p_referred uuid, p_reward_type text, p_points integer, p_xp integer, p_description text` | `boolean` | نعم |
| `guard_academic_cv_lock` | `` | `trigger` | نعم |
| `guard_client_lifecycle_edits` | `` | `trigger` | نعم |
| `guard_evidence_immutable` | `` | `trigger` | نعم |
| `guard_group_order_edits` | `` | `trigger` | نعم |
| `guard_membership_referral` | `` | `trigger` | نعم |
| `guard_signatures_immutable` | `` | `trigger` | نعم |
| `guard_signed_contract_delete` | `` | `trigger` | نعم |
| `guard_signed_contract_immutability` | `` | `trigger` | نعم |
| `guard_signed_version_immutable` | `` | `trigger` | نعم |
| `guard_timeline_append_only` | `` | `trigger` | نعم |
| `handle_contract_changed` | `` | `trigger` | نعم |
| `handle_lifecycle_change` | `` | `trigger` | نعم |
| `handle_membership_activated` | `` | `trigger` | نعم |
| `handle_membership_created` | `` | `trigger` | نعم |
| `handle_new_user` | `` | `trigger` | نعم |
| `handle_receipt_approval` | `` | `trigger` | نعم |
| `handle_referral_on_membership_activation` | `` | `trigger` | نعم |
| `handle_referral_on_membership_created` | `` | `trigger` | نعم |
| `handle_signature_inserted` | `` | `trigger` | نعم |
| `handle_ticket_changed` | `` | `trigger` | نعم |
| `handle_ticket_message_inserted` | `` | `trigger` | نعم |
| `handle_topup_approved` | `` | `trigger` | نعم |
| `handle_withdrawal_status_change` | `` | `trigger` | نعم |
| `has_role` | `_user_id uuid, _role app_role` | `boolean` | نعم |
| `insert_audit_log` | `_table_name text, _action text, _record_id uuid, _old_data jsonb, _new_data jsonb` | `void` | نعم |
| `is_financing_admin` | `_user_id uuid` | `boolean` | نعم |
| `is_valid_lifecycle_transition` | `_from order_lifecycle_status, _to order_lifecycle_status` | `boolean` | لا |
| `join_group_order` | `_invite_code text` | `uuid` | نعم |
| `launch_experiment` | `p_experiment_id uuid` | `experiments` | نعم |
| `lifecycle_progress` | `_status order_lifecycle_status` | `integer` | لا |
| `lifecycle_status_ar` | `p_status text` | `text` | لا |
| `link_anonymous_assessment_attempts` | `p_anonymous_id text` | `integer` | نعم |
| `log_financing_status_change` | `` | `trigger` | نعم |
| `log_invoice_created` | `` | `trigger` | نعم |
| `log_referral_created` | `` | `trigger` | نعم |
| `log_smart_editor_usage` | `_operation text, _mode text, _input_length integer, _output_length integer, _cost numeric, _was_free boolean, _wallet_transaction_id uuid` | `uuid` | نعم |
| `mark_bonus_drop_seen` | `p_drop_id uuid` | `void` | نعم |
| `move_to_dlq` | `source_queue text, dlq_name text, message_id bigint, payload jsonb` | `bigint` | نعم |
| `notify_admins_new_order` | `` | `trigger` | نعم |
| `notify_admins_topup_request` | `` | `trigger` | نعم |
| `notify_financing_status_change` | `` | `trigger` | نعم |
| `notify_installment_overdue` | `` | `trigger` | نعم |
| `notify_referrer_via_whatsapp` | `` | `trigger` | نعم |
| `notify_research_publication_event` | `` | `trigger` | نعم |
| `notify_student_whatsapp` | `_user_id uuid, _type text, _message text, _reference_id uuid, _reference_kind text, _dedupe_key text` | `void` | نعم |
| `notify_ticket_whatsapp` | `` | `trigger` | نعم |
| `notify_whatsapp_event` | `_to text, _event_key text, _variables jsonb, _related_entity_type text, _related_entity_id text, _user_id uuid` | `void` | نعم |
| `on_contract_signed_create_invoice` | `` | `trigger` | نعم |
| `on_delivery_file_uploaded` | `` | `trigger` | نعم |
| `on_invoice_paid_start_execution` | `` | `trigger` | نعم |
| `on_quote_accepted_create_contract` | `` | `trigger` | نعم |
| `on_referral_inserted_viral` | `` | `trigger` | نعم |
| `on_ticket_after_insert` | `` | `trigger` | نعم |
| `on_ticket_before_insert` | `` | `trigger` | نعم |
| `on_ticket_message_insert` | `` | `trigger` | نعم |
| `on_ticket_update` | `` | `trigger` | نعم |
| `pause_experiment` | `p_experiment_id uuid, p_note text` | `experiments` | نعم |
| `pay_group_seat_with_wallet` | `_group_order_id uuid` | `jsonb` | نعم |
| `pay_installment_from_wallet` | `p_installment_id uuid, p_user_id uuid` | `jsonb` | نعم |
| `prevent_financing_ack_modify` | `` | `trigger` | لا |
| `process_auto_debit_installments` | `` | `jsonb` | نعم |
| `purchase_cv` | `_cv_id uuid, _template_key text` | `jsonb` | نعم |
| `purchase_cv_export` | `_cv_id uuid` | `jsonb` | نعم |
| `purchase_stat_analysis` | `_analysis_id uuid` | `jsonb` | نعم |
| `purchase_stat_pdf` | `_analysis_id uuid` | `jsonb` | نعم |
| `read_email_batch` | `queue_name text, batch_size integer, vt integer` | `TABLE(msg_id bigint, read_ct integer, message jsonb)` | نعم |
| `recompute_invoice_paid_status` | `` | `trigger` | نعم |
| `record_cv_export` | `_cv_id uuid` | `jsonb` | نعم |
| `record_growth_event` | `p_event_type text, p_source text, p_metadata jsonb, p_dedupe_key text` | `uuid` | نعم |
| `request_withdrawal` | `_amount numeric, _bank_name text, _account_holder_name text, _iban text, _notes text` | `jsonb` | نعم |
| `research_publication_to_inbox` | `` | `trigger` | نعم |
| `resolve_automation_insight` | `_id uuid, _note text` | `jsonb` | نعم |
| `scal_set_updated_at` | `` | `trigger` | لا |
| `send_due_installment_reminders` | `` | `integer` | نعم |
| `set_customer_code` | `` | `trigger` | لا |
| `set_group_order_defaults` | `` | `trigger` | نعم |
| `set_inbox_messages_updated_at` | `` | `trigger` | لا |
| `set_referral_code` | `` | `trigger` | لا |
| `set_stage_deadlines` | `` | `trigger` | نعم |
| `set_updated_at` | `` | `trigger` | لا |
| `set_user_referral_code` | `` | `trigger` | نعم |
| `sign_contract_with_otp` | `_contract_id uuid, _otp_code text, _signature_text text, _signer_name text, _ip text, _ua text, _signature_image text, _signer_id_number text, _accepted_terms jsonb, _comments text` | `jsonb` | نعم |
| `sign_wallet_transaction` | `` | `trigger` | لا |
| `start_study_challenge` | `` | `jsonb` | نعم |
| `submit_assessment_attempt` | `p_attempt_id uuid, p_answers jsonb, p_time_spent integer` | `jsonb` | نعم |
| `submit_question_answer` | `p_question_id uuid, p_choice_id uuid, p_time_spent integer` | `jsonb` | نعم |
| `swap_cv_template` | `_cv_id uuid, _new_template_key text` | `jsonb` | نعم |
| `sync_current_contract_version` | `` | `trigger` | نعم |
| `sync_order_status_from_invoice` | `` | `trigger` | نعم |
| `tg_automation_set_updated_at` | `` | `trigger` | لا |
| `tg_notify_challenge_achievement` | `` | `trigger` | نعم |
| `tg_notify_challenge_attempt_completed` | `` | `trigger` | نعم |
| `tg_notify_challenge_attempt_started` | `` | `trigger` | نعم |
| `tg_notify_challenge_streak_milestone` | `` | `trigger` | نعم |
| `tg_set_updated_at` | `` | `trigger` | لا |
| `touch_deadline_reminder_updated_at` | `` | `trigger` | لا |
| `touch_library_categories` | `` | `trigger` | لا |
| `touch_qbank_session` | `` | `trigger` | لا |
| `track_experiment_event` | `p_experiment_key text, p_event_type text, p_user_id uuid, p_anonymous_id text, p_metric_value numeric, p_metadata jsonb` | `void` | نعم |
| `track_order` | `_tracking_id text, _phone_last_four text` | `SETOF orders` | نعم |
| `transition_order_lifecycle` | `_order_id uuid, _to_status order_lifecycle_status, _note text` | `jsonb` | نعم |
| `trg_auto_generate_installments` | `` | `trigger` | نعم |
| `trg_auto_send_paid_invoice` | `` | `trigger` | نعم |
| `trg_auto_send_signed_contract` | `` | `trigger` | نعم |
| `trg_generate_installments_after` | `` | `trigger` | نعم |
| `trg_growth_on_attempt_complete` | `` | `trigger` | نعم |
| `trg_growth_on_referral` | `` | `trigger` | نعم |
| `trg_study_session_done` | `` | `trigger` | نعم |
| `trg_whatsapp_contract_invite` | `` | `trigger` | نعم |
| `trg_whatsapp_contract_signed` | `` | `trigger` | نعم |
| `trg_whatsapp_invoice_new` | `` | `trigger` | نعم |
| `trg_whatsapp_invoice_paid` | `` | `trigger` | نعم |
| `trg_whatsapp_order_created` | `` | `trigger` | نعم |
| `trg_whatsapp_order_status_changed` | `` | `trigger` | نعم |
| `update_invoice_after_payment` | `` | `trigger` | نعم |
| `update_updated_at_column` | `` | `trigger` | لا |
| `upsert_insight` | `_type text, _severity text, _title text, _description text, _recommendation text, _metric_key text, _metric_value numeric, _comparison_value numeric, _delta_pct numeric, _context jsonb, _dedupe_key text` | `uuid` | نعم |
| `use_smart_editor` | `_operation text, _mode text, _input_length integer` | `jsonb` | نعم |
| `use_track_tool` | `_tool_id uuid, _mode text` | `jsonb` | نعم |
| `validate_promo_code` | `p_code text, p_item_id uuid` | `jsonb` | نعم |
| `validate_promo_code_on_base` | `p_code text, p_item_id uuid, p_base_xp integer` | `jsonb` | نعم |

## المشغّلات (Triggers)

| الجدول | المشغّل | التعريف |
|---|---|---|
| `assessments` | `trg_assessments_updated_at` | `CREATE TRIGGER trg_assessments_updated_at BEFORE UPDATE ON public.assessments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()` |
| `automation_insights` | `trg_automation_insights_updated` | `CREATE TRIGGER trg_automation_insights_updated BEFORE UPDATE ON public.automation_insights FOR EACH ROW EXECUTE FUNCTION tg_automation_set_updated_at()` |
| `automation_rules` | `trg_automation_rules_updated` | `CREATE TRIGGER trg_automation_rules_updated BEFORE UPDATE ON public.automation_rules FOR EACH ROW EXECUTE FUNCTION tg_automation_set_updated_at()` |
| `blog_posts` | `update_blog_posts_updated_at` | `CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()` |
| `chat_conversations` | `update_chat_conversations_updated_at` | `CREATE TRIGGER update_chat_conversations_updated_at BEFORE UPDATE ON public.chat_conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()` |
| `contract_evidence` | `trg_guard_evidence_immutable` | `CREATE TRIGGER trg_guard_evidence_immutable BEFORE DELETE OR UPDATE ON public.contract_evidence FOR EACH ROW EXECUTE FUNCTION guard_evidence_immutable()` |
| `contract_signatures` | `trg_signature_inserted` | `CREATE TRIGGER trg_signature_inserted AFTER INSERT ON public.contract_signatures FOR EACH ROW EXECUTE FUNCTION handle_signature_inserted()` |
| `contract_signatures` | `trg_signatures_no_delete` | `CREATE TRIGGER trg_signatures_no_delete BEFORE DELETE ON public.contract_signatures FOR EACH ROW EXECUTE FUNCTION guard_signatures_immutable()` |
| `contract_signatures` | `trg_signatures_no_update` | `CREATE TRIGGER trg_signatures_no_update BEFORE UPDATE ON public.contract_signatures FOR EACH ROW EXECUTE FUNCTION guard_signatures_immutable()` |
| `contract_signatures` | `whatsapp_on_contract_signed` | `CREATE TRIGGER whatsapp_on_contract_signed AFTER INSERT ON public.contract_signatures FOR EACH ROW EXECUTE FUNCTION trg_whatsapp_contract_signed()` |
| `contract_timeline` | `trg_timeline_no_delete` | `CREATE TRIGGER trg_timeline_no_delete BEFORE DELETE ON public.contract_timeline FOR EACH ROW EXECUTE FUNCTION guard_timeline_append_only()` |
| `contract_timeline` | `trg_timeline_no_update` | `CREATE TRIGGER trg_timeline_no_update BEFORE UPDATE ON public.contract_timeline FOR EACH ROW EXECUTE FUNCTION guard_timeline_append_only()` |
| `contract_versions` | `trg_guard_signed_version` | `CREATE TRIGGER trg_guard_signed_version BEFORE DELETE OR UPDATE ON public.contract_versions FOR EACH ROW EXECUTE FUNCTION guard_signed_version_immutable()` |
| `contract_versions` | `trg_sync_current_version` | `CREATE TRIGGER trg_sync_current_version AFTER INSERT OR UPDATE OF is_current ON public.contract_versions FOR EACH ROW WHEN ((new.is_current = true)) EXECUTE FUNCTION sync_current_contract_version()` |
| `contracts` | `contracts_auto_send_pdf` | `CREATE TRIGGER contracts_auto_send_pdf AFTER INSERT OR UPDATE OF status ON public.contracts FOR EACH ROW EXECUTE FUNCTION trg_auto_send_signed_contract()` |
| `contracts` | `trg_auto_ticket_unsigned_contract` | `CREATE TRIGGER trg_auto_ticket_unsigned_contract AFTER UPDATE OF status, sent_at ON public.contracts FOR EACH ROW EXECUTE FUNCTION auto_ticket_for_unsigned_contract()` |
| `contracts` | `trg_contract_changed` | `CREATE TRIGGER trg_contract_changed AFTER INSERT OR UPDATE ON public.contracts FOR EACH ROW EXECUTE FUNCTION handle_contract_changed()` |
| `contracts` | `trg_guard_signed_contract` | `CREATE TRIGGER trg_guard_signed_contract BEFORE UPDATE ON public.contracts FOR EACH ROW EXECUTE FUNCTION guard_signed_contract_immutability()` |
| `contracts` | `trg_guard_signed_contract_delete` | `CREATE TRIGGER trg_guard_signed_contract_delete BEFORE DELETE ON public.contracts FOR EACH ROW EXECUTE FUNCTION guard_signed_contract_delete()` |
| `contracts` | `trg_on_contract_signed_create_invoice` | `CREATE TRIGGER trg_on_contract_signed_create_invoice AFTER UPDATE ON public.contracts FOR EACH ROW EXECUTE FUNCTION on_contract_signed_create_invoice()` |
| `contracts` | `update_contracts_updated_at` | `CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON public.contracts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()` |
| `contracts` | `whatsapp_on_contract_invite` | `CREATE TRIGGER whatsapp_on_contract_invite AFTER INSERT OR UPDATE OF status ON public.contracts FOR EACH ROW EXECUTE FUNCTION trg_whatsapp_contract_invite()` |
| `customers` | `trg_set_customer_code` | `CREATE TRIGGER trg_set_customer_code BEFORE INSERT ON public.customers FOR EACH ROW EXECUTE FUNCTION set_customer_code()` |
| `customers` | `trg_set_referral_code` | `CREATE TRIGGER trg_set_referral_code BEFORE INSERT ON public.customers FOR EACH ROW EXECUTE FUNCTION set_referral_code()` |
| `customers` | `update_customers_updated_at` | `CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()` |
| `deadline_reminders` | `trg_touch_deadline_reminder` | `CREATE TRIGGER trg_touch_deadline_reminder BEFORE UPDATE ON public.deadline_reminders FOR EACH ROW EXECUTE FUNCTION touch_deadline_reminder_updated_at()` |
| `email_templates` | `update_email_templates_updated_at` | `CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON public.email_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()` |
| `experiment_variants` | `trg_experiment_variants_updated_at` | `CREATE TRIGGER trg_experiment_variants_updated_at BEFORE UPDATE ON public.experiment_variants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()` |
| `experiments` | `trg_experiments_updated_at` | `CREATE TRIGGER trg_experiments_updated_at BEFORE UPDATE ON public.experiments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()` |
| `financing_acknowledgments` | `trg_prevent_fin_ack_update` | `CREATE TRIGGER trg_prevent_fin_ack_update BEFORE DELETE OR UPDATE ON public.financing_acknowledgments FOR EACH ROW EXECUTE FUNCTION prevent_financing_ack_modify()` |
| `financing_applications` | `trg_auto_generate_installments` | `CREATE TRIGGER trg_auto_generate_installments BEFORE INSERT OR UPDATE ON public.financing_applications FOR EACH ROW EXECUTE FUNCTION trg_auto_generate_installments()` |
| `financing_applications` | `trg_calc_financing_amounts` | `CREATE TRIGGER trg_calc_financing_amounts BEFORE INSERT OR UPDATE OF total_amount, down_payment, duration_months ON public.financing_applications FOR EACH ROW EXECUTE FUNCTION calc_financing_amounts()` |
| `financing_applications` | `trg_financing_apps_updated_at` | `CREATE TRIGGER trg_financing_apps_updated_at BEFORE UPDATE ON public.financing_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()` |
| `financing_applications` | `trg_financing_notify_whatsapp` | `CREATE TRIGGER trg_financing_notify_whatsapp AFTER INSERT OR UPDATE OF status ON public.financing_applications FOR EACH ROW EXECUTE FUNCTION notify_financing_status_change()` |
| `financing_applications` | `trg_generate_installments_after` | `CREATE TRIGGER trg_generate_installments_after AFTER INSERT OR UPDATE ON public.financing_applications FOR EACH ROW EXECUTE FUNCTION trg_generate_installments_after()` |
| `financing_applications` | `trg_log_financing_status_change` | `CREATE TRIGGER trg_log_financing_status_change AFTER INSERT OR UPDATE OF status ON public.financing_applications FOR EACH ROW EXECUTE FUNCTION log_financing_status_change()` |
| `financing_contracts` | `trg_financing_contracts_updated_at` | `CREATE TRIGGER trg_financing_contracts_updated_at BEFORE UPDATE ON public.financing_contracts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()` |
| `financing_installments` | `trg_installment_overdue` | `CREATE TRIGGER trg_installment_overdue AFTER UPDATE ON public.financing_installments FOR EACH ROW EXECUTE FUNCTION notify_installment_overdue()` |
| `financing_payment_receipts` | `trg_fpr_updated_at` | `CREATE TRIGGER trg_fpr_updated_at BEFORE UPDATE ON public.financing_payment_receipts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()` |
| `financing_payment_receipts` | `trg_receipt_approval` | `CREATE TRIGGER trg_receipt_approval BEFORE UPDATE ON public.financing_payment_receipts FOR EACH ROW EXECUTE FUNCTION handle_receipt_approval()` |
| `group_order_members` | `trg_group_member_after_change` | `CREATE TRIGGER trg_group_member_after_change AFTER INSERT OR UPDATE OF status ON public.group_order_members FOR EACH ROW EXECUTE FUNCTION after_group_member_change()` |
| `group_order_members` | `trg_group_member_before_insert` | `CREATE TRIGGER trg_group_member_before_insert BEFORE INSERT ON public.group_order_members FOR EACH ROW EXECUTE FUNCTION before_group_member_insert()` |
| `group_orders` | `trg_group_order_defaults` | `CREATE TRIGGER trg_group_order_defaults BEFORE INSERT ON public.group_orders FOR EACH ROW EXECUTE FUNCTION set_group_order_defaults()` |
| `group_orders` | `trg_group_order_guard` | `CREATE TRIGGER trg_group_order_guard BEFORE UPDATE ON public.group_orders FOR EACH ROW EXECUTE FUNCTION guard_group_order_edits()` |
| `group_orders` | `trg_group_orders_updated_at` | `CREATE TRIGGER trg_group_orders_updated_at BEFORE UPDATE ON public.group_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()` |
| `inbox_messages` | `trg_inbox_messages_updated_at` | `CREATE TRIGGER trg_inbox_messages_updated_at BEFORE UPDATE ON public.inbox_messages FOR EACH ROW EXECUTE FUNCTION set_inbox_messages_updated_at()` |
| `inbox_replies` | `trg_bump_inbox_message` | `CREATE TRIGGER trg_bump_inbox_message AFTER INSERT ON public.inbox_replies FOR EACH ROW EXECUTE FUNCTION bump_inbox_message_on_reply()` |
| `inbox_reply_templates` | `trg_inbox_templates_updated_at` | `CREATE TRIGGER trg_inbox_templates_updated_at BEFORE UPDATE ON public.inbox_reply_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()` |
| `invoice_payments` | `trg_deduct_wallet_on_payment` | `CREATE TRIGGER trg_deduct_wallet_on_payment AFTER INSERT ON public.invoice_payments FOR EACH ROW EXECUTE FUNCTION deduct_wallet_on_invoice_payment()` |
| `invoice_payments` | `trg_invoice_payment_update` | `CREATE TRIGGER trg_invoice_payment_update AFTER INSERT OR DELETE OR UPDATE ON public.invoice_payments FOR EACH ROW EXECUTE FUNCTION update_invoice_after_payment()` |
| `invoice_payments` | `trg_invoice_payments_recompute` | `CREATE TRIGGER trg_invoice_payments_recompute AFTER INSERT OR DELETE OR UPDATE ON public.invoice_payments FOR EACH ROW EXECUTE FUNCTION recompute_invoice_paid_status()` |
| `invoices` | `invoices_auto_send_pdf` | `CREATE TRIGGER invoices_auto_send_pdf AFTER INSERT OR UPDATE OF status ON public.invoices FOR EACH ROW EXECUTE FUNCTION trg_auto_send_paid_invoice()` |
| `invoices` | `trg_auto_ticket_overdue_invoice` | `CREATE TRIGGER trg_auto_ticket_overdue_invoice AFTER INSERT OR UPDATE OF status, due_date, paid_amount ON public.invoices FOR EACH ROW EXECUTE FUNCTION auto_ticket_for_overdue_invoice()` |
| `invoices` | `trg_invoice_created` | `CREATE TRIGGER trg_invoice_created AFTER INSERT ON public.invoices FOR EACH ROW EXECUTE FUNCTION log_invoice_created()` |
| `invoices` | `trg_invoice_sync_order` | `CREATE TRIGGER trg_invoice_sync_order AFTER INSERT OR UPDATE OF status ON public.invoices FOR EACH ROW EXECUTE FUNCTION sync_order_status_from_invoice()` |
| `invoices` | `trg_invoices_updated_at` | `CREATE TRIGGER trg_invoices_updated_at BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()` |
| `invoices` | `trg_on_invoice_paid_start_execution` | `CREATE TRIGGER trg_on_invoice_paid_start_execution AFTER UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION on_invoice_paid_start_execution()` |
| `invoices` | `update_invoices_updated_at` | `CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()` |
| `invoices` | `whatsapp_on_invoice_new` | `CREATE TRIGGER whatsapp_on_invoice_new AFTER INSERT ON public.invoices FOR EACH ROW EXECUTE FUNCTION trg_whatsapp_invoice_new()` |
| `invoices` | `whatsapp_on_invoice_paid` | `CREATE TRIGGER whatsapp_on_invoice_paid AFTER UPDATE OF status ON public.invoices FOR EACH ROW EXECUTE FUNCTION trg_whatsapp_invoice_paid()` |
| `member_referrals` | `trg_log_referral_created` | `CREATE TRIGGER trg_log_referral_created AFTER INSERT ON public.member_referrals FOR EACH ROW EXECUTE FUNCTION log_referral_created()` |
| `member_referrals` | `trg_member_referrals_updated_at` | `CREATE TRIGGER trg_member_referrals_updated_at BEFORE UPDATE ON public.member_referrals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()` |
| `member_referrals` | `trg_notify_referrer_whatsapp` | `CREATE TRIGGER trg_notify_referrer_whatsapp AFTER INSERT OR UPDATE OF status ON public.member_referrals FOR EACH ROW EXECUTE FUNCTION notify_referrer_via_whatsapp()` |
| `membership_plans` | `trg_membership_plans_updated` | `CREATE TRIGGER trg_membership_plans_updated BEFORE UPDATE ON public.membership_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()` |
| `order_attachments` | `trg_on_delivery_file_uploaded` | `CREATE TRIGGER trg_on_delivery_file_uploaded AFTER INSERT ON public.order_attachments FOR EACH ROW EXECUTE FUNCTION on_delivery_file_uploaded()` |
| `orders` | `update_orders_updated_at` | `CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()` |
| `payment_intents` | `trg_pi_updated_at` | `CREATE TRIGGER trg_pi_updated_at BEFORE UPDATE ON public.payment_intents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()` |
| `profiles` | `trg_create_customer_for_new_profile` | `CREATE TRIGGER trg_create_customer_for_new_profile AFTER INSERT ON public.profiles FOR EACH ROW EXECUTE FUNCTION create_customer_for_new_profile()` |
| `profiles` | `trg_create_wallet_on_profile` | `CREATE TRIGGER trg_create_wallet_on_profile AFTER INSERT ON public.profiles FOR EACH ROW EXECUTE FUNCTION create_wallet_for_new_profile()` |
| `profiles` | `update_profiles_updated_at` | `CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()` |
| `questions` | `update_questions_updated_at` | `CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON public.questions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()` |
| `referral_clicks` | `trg_bump_referral_clicks` | `CREATE TRIGGER trg_bump_referral_clicks AFTER INSERT ON public.referral_clicks FOR EACH ROW EXECUTE FUNCTION bump_referral_clicks()` |
| `referral_conversions` | `trg_bump_referral_conversions` | `CREATE TRIGGER trg_bump_referral_conversions AFTER INSERT ON public.referral_conversions FOR EACH ROW EXECUTE FUNCTION bump_referral_conversions()` |
| `referrals` | `trg_growth_referral_ins` | `CREATE TRIGGER trg_growth_referral_ins AFTER INSERT ON public.referrals FOR EACH ROW EXECUTE FUNCTION trg_growth_on_referral()` |
| `referrals` | `trg_growth_referral_upd` | `CREATE TRIGGER trg_growth_referral_upd AFTER UPDATE ON public.referrals FOR EACH ROW EXECUTE FUNCTION trg_growth_on_referral()` |
| `referrals` | `trg_referrals_viral_signup` | `CREATE TRIGGER trg_referrals_viral_signup AFTER INSERT ON public.referrals FOR EACH ROW EXECUTE FUNCTION on_referral_inserted_viral()` |
| `research_publication_messages` | `trg_research_pub_msg_notify` | `CREATE TRIGGER trg_research_pub_msg_notify AFTER INSERT ON public.research_publication_messages FOR EACH ROW EXECUTE FUNCTION notify_research_publication_event()` |
| `research_publication_quotes` | `update_research_quotes_updated_at` | `CREATE TRIGGER update_research_quotes_updated_at BEFORE UPDATE ON public.research_publication_quotes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()` |
| `research_publications` | `trg_research_pub_notify` | `CREATE TRIGGER trg_research_pub_notify AFTER INSERT OR UPDATE ON public.research_publications FOR EACH ROW EXECUTE FUNCTION notify_research_publication_event()` |
| `research_publications` | `trg_research_publication_to_inbox` | `CREATE TRIGGER trg_research_publication_to_inbox AFTER INSERT ON public.research_publications FOR EACH ROW EXECUTE FUNCTION research_publication_to_inbox()` |
| `research_publications` | `update_research_publications_updated_at` | `CREATE TRIGGER update_research_publications_updated_at BEFORE UPDATE ON public.research_publications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()` |
| `service_categories` | `trg_service_categories_updated_at` | `CREATE TRIGGER trg_service_categories_updated_at BEFORE UPDATE ON public.service_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()` |
| `service_orders` | `on_new_service_order_notify_admins` | `CREATE TRIGGER on_new_service_order_notify_admins AFTER INSERT ON public.service_orders FOR EACH ROW EXECUTE FUNCTION notify_admins_new_order()` |
| `service_orders` | `trg_create_deadline_reminders` | `CREATE TRIGGER trg_create_deadline_reminders AFTER INSERT OR UPDATE OF deadline ON public.service_orders FOR EACH ROW EXECUTE FUNCTION create_deadline_reminders()` |
| `service_orders` | `trg_dispatch_lifecycle_email` | `CREATE TRIGGER trg_dispatch_lifecycle_email AFTER INSERT OR UPDATE OF lifecycle_status ON public.service_orders FOR EACH ROW EXECUTE FUNCTION dispatch_lifecycle_email()` |
| `service_orders` | `trg_guard_client_lifecycle_edits` | `CREATE TRIGGER trg_guard_client_lifecycle_edits BEFORE UPDATE ON public.service_orders FOR EACH ROW EXECUTE FUNCTION guard_client_lifecycle_edits()` |
| `service_orders` | `trg_on_quote_accepted_create_contract` | `CREATE TRIGGER trg_on_quote_accepted_create_contract BEFORE UPDATE ON public.service_orders FOR EACH ROW EXECUTE FUNCTION on_quote_accepted_create_contract()` |
| `service_orders` | `trg_service_orders_lifecycle` | `CREATE TRIGGER trg_service_orders_lifecycle BEFORE INSERT OR UPDATE ON public.service_orders FOR EACH ROW EXECUTE FUNCTION handle_lifecycle_change()` |
| `service_orders` | `trg_set_stage_deadlines` | `CREATE TRIGGER trg_set_stage_deadlines BEFORE INSERT OR UPDATE OF lifecycle_status ON public.service_orders FOR EACH ROW EXECUTE FUNCTION set_stage_deadlines()` |
| `service_orders` | `update_service_orders_updated_at` | `CREATE TRIGGER update_service_orders_updated_at BEFORE UPDATE ON public.service_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()` |
| `service_orders` | `whatsapp_on_order_created` | `CREATE TRIGGER whatsapp_on_order_created AFTER INSERT ON public.service_orders FOR EACH ROW EXECUTE FUNCTION trg_whatsapp_order_created()` |
| `service_orders` | `whatsapp_on_order_status_changed` | `CREATE TRIGGER whatsapp_on_order_status_changed AFTER UPDATE OF lifecycle_status ON public.service_orders FOR EACH ROW EXECUTE FUNCTION trg_whatsapp_order_status_changed()` |
| `services` | `update_services_updated_at` | `CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()` |
| `statistical_analyses` | `trg_stat_analyses_updated_at` | `CREATE TRIGGER trg_stat_analyses_updated_at BEFORE UPDATE ON public.statistical_analyses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()` |
| `study_challenge_attempts` | `trg_scal_updated_at` | `CREATE TRIGGER trg_scal_updated_at BEFORE UPDATE ON public.study_challenge_attempts FOR EACH ROW EXECUTE FUNCTION scal_set_updated_at()` |
| `study_sessions` | `study_sessions_notify` | `CREATE TRIGGER study_sessions_notify AFTER UPDATE ON public.study_sessions FOR EACH ROW EXECUTE FUNCTION trg_study_session_done()` |
| `study_sessions` | `trg_ss_updated_at` | `CREATE TRIGGER trg_ss_updated_at BEFORE UPDATE ON public.study_sessions FOR EACH ROW EXECUTE FUNCTION tg_set_updated_at()` |
| `ticket_messages` | `trg_notify_ticket_admin_reply` | `CREATE TRIGGER trg_notify_ticket_admin_reply AFTER INSERT ON public.ticket_messages FOR EACH ROW EXECUTE FUNCTION notify_ticket_whatsapp()` |
| `ticket_messages` | `trg_ticket_message_insert` | `CREATE TRIGGER trg_ticket_message_insert AFTER INSERT ON public.ticket_messages FOR EACH ROW EXECUTE FUNCTION on_ticket_message_insert()` |
| `ticket_messages` | `trg_ticket_message_inserted` | `CREATE TRIGGER trg_ticket_message_inserted AFTER INSERT ON public.ticket_messages FOR EACH ROW EXECUTE FUNCTION handle_ticket_message_inserted()` |
| `tickets` | `trg_notify_ticket_created` | `CREATE TRIGGER trg_notify_ticket_created AFTER INSERT ON public.tickets FOR EACH ROW EXECUTE FUNCTION notify_ticket_whatsapp()` |
| `tickets` | `trg_notify_ticket_status` | `CREATE TRIGGER trg_notify_ticket_status AFTER UPDATE OF status ON public.tickets FOR EACH ROW EXECUTE FUNCTION notify_ticket_whatsapp()` |
| `tickets` | `trg_ticket_after_insert` | `CREATE TRIGGER trg_ticket_after_insert AFTER INSERT ON public.tickets FOR EACH ROW EXECUTE FUNCTION on_ticket_after_insert()` |
| `tickets` | `trg_ticket_before_insert` | `CREATE TRIGGER trg_ticket_before_insert BEFORE INSERT ON public.tickets FOR EACH ROW EXECUTE FUNCTION on_ticket_before_insert()` |
| `tickets` | `trg_ticket_insert_changed` | `CREATE TRIGGER trg_ticket_insert_changed AFTER INSERT ON public.tickets FOR EACH ROW EXECUTE FUNCTION handle_ticket_changed()` |
| `tickets` | `trg_ticket_update` | `CREATE TRIGGER trg_ticket_update BEFORE UPDATE ON public.tickets FOR EACH ROW EXECUTE FUNCTION on_ticket_update()` |
| `tickets` | `trg_ticket_update_changed` | `CREATE TRIGGER trg_ticket_update_changed BEFORE UPDATE ON public.tickets FOR EACH ROW EXECUTE FUNCTION handle_ticket_changed()` |
| `tickets` | `update_tickets_updated_at` | `CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON public.tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()` |
| `translation_file_analyses` | `trg_tfa_updated_at` | `CREATE TRIGGER trg_tfa_updated_at BEFORE UPDATE ON public.translation_file_analyses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()` |
| `user_memberships` | `trg_guard_membership_referral` | `CREATE TRIGGER trg_guard_membership_referral BEFORE INSERT OR UPDATE OF referred_by ON public.user_memberships FOR EACH ROW EXECUTE FUNCTION guard_membership_referral()` |
| `user_memberships` | `trg_membership_activated` | `CREATE TRIGGER trg_membership_activated BEFORE UPDATE ON public.user_memberships FOR EACH ROW EXECUTE FUNCTION handle_membership_activated()` |
| `user_memberships` | `trg_membership_created` | `CREATE TRIGGER trg_membership_created AFTER INSERT ON public.user_memberships FOR EACH ROW EXECUTE FUNCTION handle_membership_created()` |
| `user_memberships` | `trg_referral_commission` | `CREATE TRIGGER trg_referral_commission AFTER UPDATE ON public.user_memberships FOR EACH ROW EXECUTE FUNCTION handle_referral_on_membership_activation()` |
| `user_memberships` | `trg_referral_on_activation` | `CREATE TRIGGER trg_referral_on_activation AFTER UPDATE OF status ON public.user_memberships FOR EACH ROW EXECUTE FUNCTION handle_referral_on_membership_activation()` |
| `user_memberships` | `trg_referral_pending` | `CREATE TRIGGER trg_referral_pending AFTER INSERT ON public.user_memberships FOR EACH ROW EXECUTE FUNCTION handle_referral_on_membership_created()` |
| `user_memberships` | `trg_user_memberships_updated` | `CREATE TRIGGER trg_user_memberships_updated BEFORE UPDATE ON public.user_memberships FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()` |
| `user_referrals` | `trg_user_referrals_set_code` | `CREATE TRIGGER trg_user_referrals_set_code BEFORE INSERT ON public.user_referrals FOR EACH ROW EXECUTE FUNCTION set_user_referral_code()` |
| `user_referrals` | `trg_user_referrals_updated_at` | `CREATE TRIGGER trg_user_referrals_updated_at BEFORE UPDATE ON public.user_referrals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()` |
| `wallet_topup_requests` | `trg_handle_topup_status` | `CREATE TRIGGER trg_handle_topup_status AFTER UPDATE ON public.wallet_topup_requests FOR EACH ROW EXECUTE FUNCTION handle_topup_approved()` |
| `wallet_topup_requests` | `trg_notify_admins_topup` | `CREATE TRIGGER trg_notify_admins_topup AFTER INSERT ON public.wallet_topup_requests FOR EACH ROW EXECUTE FUNCTION notify_admins_topup_request()` |
| `wallet_topup_requests` | `trg_topup_updated_at` | `CREATE TRIGGER trg_topup_updated_at BEFORE UPDATE ON public.wallet_topup_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()` |
| `wallet_transactions` | `trg_apply_wallet_tx` | `CREATE TRIGGER trg_apply_wallet_tx BEFORE INSERT ON public.wallet_transactions FOR EACH ROW EXECUTE FUNCTION apply_wallet_transaction()` |
| `wallet_transactions` | `trg_sign_wallet_transaction` | `CREATE TRIGGER trg_sign_wallet_transaction BEFORE INSERT ON public.wallet_transactions FOR EACH ROW EXECUTE FUNCTION sign_wallet_transaction()` |
| `wallets` | `trg_wallets_updated_at` | `CREATE TRIGGER trg_wallets_updated_at BEFORE UPDATE ON public.wallets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()` |
| `whatsapp_bot_sessions` | `trg_wa_bot_sessions_updated_at` | `CREATE TRIGGER trg_wa_bot_sessions_updated_at BEFORE UPDATE ON public.whatsapp_bot_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()` |
| `whatsapp_campaigns` | `trg_wa_campaigns_updated` | `CREATE TRIGGER trg_wa_campaigns_updated BEFORE UPDATE ON public.whatsapp_campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()` |
| `whatsapp_conversations` | `trg_wa_conv_updated` | `CREATE TRIGGER trg_wa_conv_updated BEFORE UPDATE ON public.whatsapp_conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()` |
| `whatsapp_quick_replies` | `trg_wa_quick_replies_updated` | `CREATE TRIGGER trg_wa_quick_replies_updated BEFORE UPDATE ON public.whatsapp_quick_replies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()` |
| `whatsapp_settings` | `update_whatsapp_settings_updated_at` | `CREATE TRIGGER update_whatsapp_settings_updated_at BEFORE UPDATE ON public.whatsapp_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()` |
| `whatsapp_templates` | `update_whatsapp_templates_updated_at` | `CREATE TRIGGER update_whatsapp_templates_updated_at BEFORE UPDATE ON public.whatsapp_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()` |
| `withdrawal_requests` | `trg_withdrawal_requests_updated_at` | `CREATE TRIGGER trg_withdrawal_requests_updated_at BEFORE UPDATE ON public.withdrawal_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()` |
| `withdrawal_requests` | `trg_withdrawal_status_change` | `CREATE TRIGGER trg_withdrawal_status_change BEFORE UPDATE ON public.withdrawal_requests FOR EACH ROW EXECUTE FUNCTION handle_withdrawal_status_change()` |
| `workspace_notes` | `trg_workspace_notes_updated` | `CREATE TRIGGER trg_workspace_notes_updated BEFORE UPDATE ON public.workspace_notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()` |