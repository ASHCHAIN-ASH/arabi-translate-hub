-- إنشاء جداول المسابقات الأكاديمية

-- إنشاء نوع البيانات لحالة المسابقة
CREATE TYPE competition_status AS ENUM ('active', 'upcoming', 'ended', 'cancelled');

-- إنشاء نوع البيانات لنوع المسابقة
CREATE TYPE competition_type AS ENUM ('research', 'case_study', 'quiz', 'writing', 'translation', 'innovation');

-- إنشاء نوع البيانات لمستوى الصعوبة
CREATE TYPE difficulty_level AS ENUM ('beginner', 'intermediate', 'advanced');

-- إنشاء نوع البيانات لحالة المشاركة
CREATE TYPE participation_status AS ENUM ('registered', 'submitted', 'under_review', 'evaluated', 'winner', 'disqualified');

-- جدول المسابقات الأكاديمية
CREATE TABLE public.academic_competitions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    type competition_type NOT NULL,
    status competition_status NOT NULL DEFAULT 'upcoming',
    difficulty difficulty_level NOT NULL DEFAULT 'intermediate',
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    registration_deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    max_participants INTEGER DEFAULT 1000,
    prize_description TEXT NOT NULL,
    requirements TEXT[] DEFAULT '{}',
    evaluation_criteria TEXT[] DEFAULT '{}',
    rules TEXT,
    image_url TEXT,
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    tenant_id UUID DEFAULT get_current_tenant_id(),
    
    -- Additional fields for different competition types
    quiz_duration_minutes INTEGER, -- للمسابقات التفاعلية
    submission_format TEXT, -- نوع الملف المطلوب
    word_limit INTEGER, -- حد الكلمات للكتابة
    language_pairs TEXT[], -- أزواج اللغات للترجمة
    innovation_category TEXT -- فئة الابتكار
);

-- جدول المشاركين في المسابقات
CREATE TABLE public.competition_participants (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    competition_id UUID NOT NULL REFERENCES public.academic_competitions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    status participation_status NOT NULL DEFAULT 'registered',
    registration_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    submission_date TIMESTAMP WITH TIME ZONE,
    submission_file_url TEXT,
    submission_content TEXT,
    score DECIMAL(5,2),
    rank INTEGER,
    feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    tenant_id UUID DEFAULT get_current_tenant_id(),
    
    -- Additional data based on competition type
    quiz_answers JSONB, -- إجابات المسابقة التفاعلية
    submission_metadata JSONB DEFAULT '{}', -- معلومات إضافية عن المشاركة
    
    UNIQUE(competition_id, user_id)
);

-- جدول تقييمات المسابقات
CREATE TABLE public.competition_evaluations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    participation_id UUID NOT NULL REFERENCES public.competition_participants(id) ON DELETE CASCADE,
    evaluator_id UUID NOT NULL,
    criteria_scores JSONB NOT NULL, -- نقاط كل معيار تقييم
    total_score DECIMAL(5,2) NOT NULL,
    comments TEXT,
    evaluation_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    tenant_id UUID DEFAULT get_current_tenant_id()
);

-- جدول الفائزين
CREATE TABLE public.competition_winners (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    competition_id UUID NOT NULL REFERENCES public.academic_competitions(id) ON DELETE CASCADE,
    participant_id UUID NOT NULL REFERENCES public.competition_participants(id) ON DELETE CASCADE,
    position INTEGER NOT NULL, -- المركز (1, 2, 3...)
    prize_amount DECIMAL(10,2),
    prize_description TEXT NOT NULL,
    certificate_url TEXT,
    announcement_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    tenant_id UUID DEFAULT get_current_tenant_id(),
    
    UNIQUE(competition_id, position)
);

-- جدول التصويت العام (للمسابقات التي تسمح بالتصويت)
CREATE TABLE public.competition_votes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    competition_id UUID NOT NULL REFERENCES public.academic_competitions(id) ON DELETE CASCADE,
    participant_id UUID NOT NULL REFERENCES public.competition_participants(id) ON DELETE CASCADE,
    voter_email TEXT NOT NULL,
    voter_ip INET,
    vote_value INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    tenant_id UUID DEFAULT get_current_tenant_id(),
    
    UNIQUE(competition_id, participant_id, voter_email)
);

-- إنشاء فهارس للأداء
CREATE INDEX idx_academic_competitions_status ON public.academic_competitions(status);
CREATE INDEX idx_academic_competitions_type ON public.academic_competitions(type);
CREATE INDEX idx_academic_competitions_dates ON public.academic_competitions(start_date, end_date);
CREATE INDEX idx_competition_participants_competition ON public.competition_participants(competition_id);
CREATE INDEX idx_competition_participants_user ON public.competition_participants(user_id);
CREATE INDEX idx_competition_participants_status ON public.competition_participants(status);
CREATE INDEX idx_competition_evaluations_participation ON public.competition_evaluations(participation_id);
CREATE INDEX idx_competition_winners_competition ON public.competition_winners(competition_id);
CREATE INDEX idx_competition_votes_competition ON public.competition_votes(competition_id);

-- تفعيل RLS
ALTER TABLE public.academic_competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competition_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competition_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competition_winners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competition_votes ENABLE ROW LEVEL SECURITY;

-- سياسات الأمان للمسابقات
CREATE POLICY "الجميع يمكنهم مشاهدة المسابقات النشطة" 
    ON public.academic_competitions FOR SELECT 
    USING (status IN ('active', 'upcoming') OR status = 'ended');

CREATE POLICY "المديرون يمكنهم إدارة جميع المسابقات" 
    ON public.academic_competitions FOR ALL 
    USING (has_role(auth.uid(), 'admin'::app_role))
    WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- سياسات الأمان للمشاركين
CREATE POLICY "المستخدمون يمكنهم مشاهدة مشاركاتهم" 
    ON public.competition_participants FOR SELECT 
    USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "المستخدمون يمكنهم التسجيل في المسابقات" 
    ON public.competition_participants FOR INSERT 
    WITH CHECK (auth.uid() = user_id AND auth.uid() IS NOT NULL);

CREATE POLICY "المستخدمون يمكنهم تحديث مشاركاتهم" 
    ON public.competition_participants FOR UPDATE 
    USING (auth.uid() = user_id AND status IN ('registered', 'submitted'))
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "المديرون يمكنهم إدارة جميع المشاركات" 
    ON public.competition_participants FOR ALL 
    USING (has_role(auth.uid(), 'admin'::app_role))
    WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- سياسات الأمان للتقييمات
CREATE POLICY "المقيمون والمديرون يمكنهم إضافة التقييمات" 
    ON public.competition_evaluations FOR INSERT 
    WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "الجميع يمكنهم مشاهدة التقييمات النهائية" 
    ON public.competition_evaluations FOR SELECT 
    USING (true);

-- سياسات الأمان للفائزين
CREATE POLICY "الجميع يمكنهم مشاهدة الفائزين" 
    ON public.competition_winners FOR SELECT 
    USING (true);

CREATE POLICY "المديرون يمكنهم إدارة الفائزين" 
    ON public.competition_winners FOR ALL 
    USING (has_role(auth.uid(), 'admin'::app_role))
    WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- سياسات الأمان للتصويت
CREATE POLICY "الجميع يمكنهم التصويت" 
    ON public.competition_votes FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "الجميع يمكنهم مشاهدة نتائج التصويت" 
    ON public.competition_votes FOR SELECT 
    USING (true);

-- إنشاء دالة لحساب إحصائيات المسابقة
CREATE OR REPLACE FUNCTION get_competition_stats(competition_uuid UUID)
RETURNS JSONB AS $$
DECLARE
    stats JSONB;
BEGIN
    SELECT jsonb_build_object(
        'total_participants', COUNT(*),
        'submitted_count', COUNT(*) FILTER (WHERE status IN ('submitted', 'under_review', 'evaluated')),
        'average_score', COALESCE(AVG(score), 0),
        'top_score', COALESCE(MAX(score), 0)
    ) INTO stats
    FROM public.competition_participants 
    WHERE competition_id = competition_uuid;
    
    RETURN stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- إنشاء دالة لحساب الترتيب التلقائي
CREATE OR REPLACE FUNCTION update_competition_rankings(competition_uuid UUID)
RETURNS VOID AS $$
BEGIN
    WITH ranked_participants AS (
        SELECT id, 
               ROW_NUMBER() OVER (ORDER BY score DESC NULLS LAST) as new_rank
        FROM public.competition_participants 
        WHERE competition_id = competition_uuid 
          AND score IS NOT NULL
    )
    UPDATE public.competition_participants 
    SET rank = ranked_participants.new_rank,
        updated_at = now()
    FROM ranked_participants 
    WHERE public.competition_participants.id = ranked_participants.id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- إنشاء trigger لتحديث الترتيب عند تغيير النقاط
CREATE OR REPLACE FUNCTION trigger_update_rankings()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM update_competition_rankings(NEW.competition_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_rankings_on_score_change
    AFTER INSERT OR UPDATE OF score ON public.competition_participants
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_rankings();

-- إدراج بعض البيانات التجريبية
INSERT INTO public.academic_competitions (
    title, description, category, type, status, difficulty, 
    start_date, end_date, registration_deadline, 
    prize_description, requirements, created_by
) VALUES 
(
    'مسابقة البحث العلمي في الذكاء الاصطناعي',
    'قدم بحثًا مبتكرًا في مجال الذكاء الاصطناعي وتطبيقاته في التعليم',
    'مسابقات بحثية',
    'research',
    'active',
    'advanced',
    now() - interval '5 days',
    now() + interval '25 days',
    now() + interval '20 days',
    '5,000 ريال + شهادة معتمدة + نشر البحث',
    ARRAY['بحث أصلي غير منشور', '2000-3000 كلمة', 'مراجع علمية موثقة'],
    '00000000-0000-0000-0000-000000000000'::UUID
),
(
    'تحدي الحالة الدراسية: شركة ناشئة في السعودية',
    'حل مشكلة تسويقية حقيقية لشركة ناشئة وضع استراتيجية شاملة',
    'مسابقات مهارات عملية',
    'case_study',
    'active',
    'intermediate',
    now() - interval '2 days',
    now() + interval '13 days',
    now() + interval '10 days',
    '3,000 ريال + استشارة مجانية',
    ARRAY['عرض تقديمي', 'خطة تنفيذية', 'تحليل السوق'],
    '00000000-0000-0000-0000-000000000000'::UUID
),
(
    'اختبار المعرفة الأسبوعي - إدارة المشاريع',
    'اختبار تفاعلي في إدارة المشاريع مع أسئلة متعددة الخيارات',
    'مسابقات أسئلة وأجوبة',
    'quiz',
    'active',
    'beginner',
    now() - interval '1 day',
    now() + interval '6 days',
    now() + interval '5 days',
    '1,000 ريال للفائز الأول',
    ARRAY['إجابة سريعة ودقيقة', 'تسجيل مسبق'],
    '00000000-0000-0000-0000-000000000000'::UUID
);

-- تفعيل Realtime للجداول
ALTER PUBLICATION supabase_realtime ADD TABLE public.academic_competitions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.competition_participants;
ALTER PUBLICATION supabase_realtime ADD TABLE public.competition_evaluations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.competition_winners;
ALTER PUBLICATION supabase_realtime ADD TABLE public.competition_votes;