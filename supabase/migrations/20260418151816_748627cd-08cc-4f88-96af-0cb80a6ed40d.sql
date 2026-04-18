-- ============= TRACKS =============
CREATE TABLE public.tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name_ar TEXT NOT NULL,
  name_en TEXT,
  description_ar TEXT,
  icon TEXT DEFAULT 'GraduationCap',
  color TEXT DEFAULT 'from-blue-500 to-indigo-600',
  cover_image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active tracks" ON public.tracks
  FOR SELECT USING (is_active = true OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins manage tracks" ON public.tracks
  FOR ALL USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_tracks_updated_at BEFORE UPDATE ON public.tracks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============= TRACK TOOLS =============
CREATE TABLE public.track_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id UUID NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  name_en TEXT,
  description_ar TEXT,
  icon TEXT DEFAULT 'Sparkles',
  badge TEXT,
  tool_type TEXT NOT NULL DEFAULT 'ai' CHECK (tool_type IN ('ai','external','internal')),
  action_link TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  free_daily_quota INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_premium BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(track_id, slug)
);

CREATE INDEX idx_track_tools_track ON public.track_tools(track_id) WHERE is_active = true;

ALTER TABLE public.track_tools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active tools" ON public.track_tools
  FOR SELECT USING (is_active = true OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins manage tools" ON public.track_tools
  FOR ALL USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_track_tools_updated_at BEFORE UPDATE ON public.track_tools
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============= USAGE LOGS =============
CREATE TABLE public.track_tool_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  tool_id UUID NOT NULL REFERENCES public.track_tools(id) ON DELETE CASCADE,
  track_id UUID NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
  cost NUMERIC(10,2) NOT NULL DEFAULT 0,
  was_free BOOLEAN NOT NULL DEFAULT false,
  wallet_transaction_id UUID,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_usage_user_date ON public.track_tool_usage_logs(user_id, created_at DESC);
CREATE INDEX idx_usage_tool ON public.track_tool_usage_logs(tool_id);

ALTER TABLE public.track_tool_usage_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own usage" ON public.track_tool_usage_logs
  FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System inserts via RPC" ON public.track_tool_usage_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============= RPC: USE TOOL (atomic) =============
CREATE OR REPLACE FUNCTION public.use_track_tool(_tool_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_tool RECORD;
  v_used_today INT;
  v_wallet RECORD;
  v_was_free BOOLEAN := false;
  v_tx_id UUID;
  v_log_id UUID;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'يجب تسجيل الدخول';
  END IF;

  SELECT * INTO v_tool FROM public.track_tools WHERE id = _tool_id AND is_active = true;
  IF v_tool IS NULL THEN
    RAISE EXCEPTION 'الأداة غير موجودة أو معطلة';
  END IF;

  -- Free quota check
  IF v_tool.free_daily_quota > 0 THEN
    SELECT COUNT(*) INTO v_used_today
      FROM public.track_tool_usage_logs
     WHERE user_id = v_uid AND tool_id = _tool_id
       AND created_at::date = CURRENT_DATE
       AND was_free = true;
    IF v_used_today < v_tool.free_daily_quota THEN
      v_was_free := true;
    END IF;
  END IF;

  -- Charge wallet if not free
  IF NOT v_was_free AND v_tool.price > 0 THEN
    SELECT * INTO v_wallet FROM public.wallets WHERE user_id = v_uid FOR UPDATE;
    IF v_wallet IS NULL THEN
      INSERT INTO public.wallets (user_id) VALUES (v_uid) RETURNING * INTO v_wallet;
    END IF;
    IF v_wallet.balance < v_tool.price THEN
      RAISE EXCEPTION 'الرصيد غير كافٍ. السعر: % ر.س، رصيدك: % ر.س', v_tool.price, v_wallet.balance;
    END IF;

    INSERT INTO public.wallet_transactions (wallet_id, user_id, type, amount, description, reference_type, reference_id)
    VALUES (v_wallet.id, v_uid, 'payment', v_tool.price,
            'استخدام أداة: ' || v_tool.name_ar,
            'track_tool', _tool_id)
    RETURNING id INTO v_tx_id;
  END IF;

  INSERT INTO public.track_tool_usage_logs (user_id, tool_id, track_id, cost, was_free, wallet_transaction_id)
  VALUES (v_uid, _tool_id, v_tool.track_id,
          CASE WHEN v_was_free THEN 0 ELSE v_tool.price END,
          v_was_free, v_tx_id)
  RETURNING id INTO v_log_id;

  RETURN jsonb_build_object(
    'ok', true,
    'log_id', v_log_id,
    'was_free', v_was_free,
    'charged', CASE WHEN v_was_free THEN 0 ELSE v_tool.price END,
    'action_link', v_tool.action_link
  );
END;
$$;

-- ============= SEED: Medical Track + Tools =============
INSERT INTO public.tracks (slug, name_ar, name_en, description_ar, icon, color, sort_order) VALUES
  ('medical', 'المسار الطبي', 'Medical Track',
   'أدوات وخدمات متخصصة لطلاب الطب والعلوم الصحية: تلخيص أبحاث، تحليل حالات، شرح مصطلحات، وتجهيز عروض.',
   'Stethoscope', 'from-rose-500 to-red-600', 1),
  ('tech', 'المسار التقني', 'Tech Track',
   'حلول للمبرمجين وطلاب الحاسب: مراجعة كود، شرح خوارزميات، توليد اختبارات، توثيق.',
   'Code', 'from-blue-500 to-cyan-600', 2),
  ('business', 'مسار الأعمال', 'Business Track',
   'خطط أعمال، تحليل SWOT، عروض تقديمية، ودراسات جدوى.',
   'Briefcase', 'from-amber-500 to-orange-600', 3),
  ('law', 'المسار القانوني', 'Law Track',
   'تحليل قضايا، صياغة مذكرات، شرح نصوص قانونية، وأبحاث قانونية.',
   'Scale', 'from-slate-600 to-zinc-700', 4),
  ('languages', 'مسار اللغات', 'Languages Track',
   'ترجمة احترافية، تدقيق لغوي، تعلّم مفردات، ومحادثات تدريبية.',
   'Languages', 'from-emerald-500 to-teal-600', 5),
  ('design', 'مسار التصميم', 'Design Track',
   'أفكار إبداعية، لوحات ألوان، مقترحات هوية، وتقييم تصاميم.',
   'Palette', 'from-fuchsia-500 to-pink-600', 6),
  ('marketing', 'مسار التسويق', 'Marketing Track',
   'حملات إعلانية، نصوص تسويقية، تحليل جمهور، واستراتيجيات سوشيال.',
   'Megaphone', 'from-violet-500 to-purple-600', 7),
  ('general', 'المسار العام', 'General Track',
   'أدوات لكل التخصصات: تلخيص، خرائط ذهنية، مراجعة، وكتابة أكاديمية.',
   'GraduationCap', 'from-indigo-500 to-blue-600', 8);

-- Medical tools (MVP)
INSERT INTO public.track_tools (track_id, slug, name_ar, description_ar, icon, tool_type, action_link, price, free_daily_quota, sort_order, metadata)
SELECT id, 'medical-summarizer', 'مُلخِّص الأبحاث الطبية',
       'لخّص ورقة بحثية طبية إلى نقاط واضحة مع المنهجية والنتائج.',
       'FileText', 'ai', '/student/tracks/medical/tools/medical-summarizer', 2.00, 1, 1,
       '{"input":"text","output":"markdown","ai_model":"google/gemini-2.5-flash"}'::jsonb
FROM public.tracks WHERE slug='medical'
UNION ALL
SELECT id, 'case-analyzer', 'محلّل الحالات السريرية',
       'حلّل حالة سريرية مع التشخيص التفريقي والخطة العلاجية المقترحة.',
       'Activity', 'ai', '/student/tracks/medical/tools/case-analyzer', 5.00, 0, 2,
       '{"premium":true,"ai_model":"openai/gpt-5-mini"}'::jsonb
FROM public.tracks WHERE slug='medical'
UNION ALL
SELECT id, 'med-terms', 'قاموس المصطلحات الطبية',
       'شرح فوري لأي مصطلح طبي بالعربية والإنجليزية مع أمثلة.',
       'BookOpen', 'ai', '/student/tracks/medical/tools/med-terms', 0.50, 5, 3,
       '{"ai_model":"google/gemini-2.5-flash-lite"}'::jsonb
FROM public.tracks WHERE slug='medical'
UNION ALL
SELECT id, 'med-mindmap', 'خريطة ذهنية طبية',
       'حوّل ملاحظاتك الطبية إلى خريطة ذهنية مرئية احترافية.',
       'GitBranch', 'internal', '/student/mind-map?context=medical', 0.00, 3, 4,
       '{"linked_feature":"mind_map"}'::jsonb
FROM public.tracks WHERE slug='medical'
UNION ALL
SELECT id, 'med-quiz', 'مولّد اختبارات طبية',
       'أنشئ اختبار MCQ من ملاحظاتك مع الإجابات والتفسيرات.',
       'ListChecks', 'ai', '/student/tracks/medical/tools/med-quiz', 3.00, 0, 5,
       '{"ai_model":"google/gemini-2.5-flash"}'::jsonb
FROM public.tracks WHERE slug='medical';