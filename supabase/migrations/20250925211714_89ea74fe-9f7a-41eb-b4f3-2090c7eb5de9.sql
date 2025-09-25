-- إصلاح مشاكل الأمان في الدوال المضافة

-- إصلاح search_path للدوال
CREATE OR REPLACE FUNCTION get_competition_stats(competition_uuid UUID)
RETURNS JSONB 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
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
$$;

CREATE OR REPLACE FUNCTION update_competition_rankings(competition_uuid UUID)
RETURNS VOID 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
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
$$;

CREATE OR REPLACE FUNCTION trigger_update_rankings()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
    PERFORM update_competition_rankings(NEW.competition_id);
    RETURN NEW;
END;
$$;

-- إضافة دالة للتحقق من صحة المشاركة
CREATE OR REPLACE FUNCTION validate_competition_participation(
    p_competition_id UUID,
    p_user_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
    competition_record RECORD;
    participant_record RECORD;
    result JSONB := '{}';
BEGIN
    -- التحقق من وجود المسابقة وحالتها
    SELECT * INTO competition_record
    FROM public.academic_competitions 
    WHERE id = p_competition_id;
    
    IF competition_record IS NULL THEN
        RETURN jsonb_build_object('valid', false, 'message', 'المسابقة غير موجودة');
    END IF;
    
    IF competition_record.status != 'active' THEN
        RETURN jsonb_build_object('valid', false, 'message', 'المسابقة غير نشطة');
    END IF;
    
    IF competition_record.registration_deadline < now() THEN
        RETURN jsonb_build_object('valid', false, 'message', 'انتهت فترة التسجيل');
    END IF;
    
    -- التحقق من المشاركة السابقة
    SELECT * INTO participant_record
    FROM public.competition_participants 
    WHERE competition_id = p_competition_id AND user_id = p_user_id;
    
    IF participant_record IS NOT NULL THEN
        RETURN jsonb_build_object(
            'valid', false, 
            'message', 'أنت مسجل مسبقاً في هذه المسابقة',
            'status', participant_record.status
        );
    END IF;
    
    -- التحقق من عدد المشاركين
    IF competition_record.max_participants IS NOT NULL THEN
        DECLARE participant_count INTEGER;
        BEGIN
            SELECT COUNT(*) INTO participant_count
            FROM public.competition_participants 
            WHERE competition_id = p_competition_id;
            
            IF participant_count >= competition_record.max_participants THEN
                RETURN jsonb_build_object('valid', false, 'message', 'تم الوصول للحد الأقصى من المشاركين');
            END IF;
        END;
    END IF;
    
    RETURN jsonb_build_object('valid', true, 'message', 'يمكن المشاركة');
END;
$$;

-- دالة تسجيل المشاركة
CREATE OR REPLACE FUNCTION register_competition_participation(
    p_competition_id UUID,
    p_user_id UUID,
    p_metadata JSONB DEFAULT '{}'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
    validation_result JSONB;
    participant_id UUID;
BEGIN
    -- التحقق من صحة المشاركة
    SELECT validate_competition_participation(p_competition_id, p_user_id) INTO validation_result;
    
    IF NOT (validation_result->>'valid')::BOOLEAN THEN
        RETURN validation_result;
    END IF;
    
    -- تسجيل المشاركة
    INSERT INTO public.competition_participants (
        competition_id,
        user_id,
        status,
        submission_metadata
    ) VALUES (
        p_competition_id,
        p_user_id,
        'registered',
        p_metadata
    ) RETURNING id INTO participant_id;
    
    RETURN jsonb_build_object(
        'success', true,
        'participant_id', participant_id,
        'message', 'تم تسجيل المشاركة بنجاح'
    );
END;
$$;

-- دالة إضافة التصويت
CREATE OR REPLACE FUNCTION add_competition_vote(
    p_competition_id UUID,
    p_participant_id UUID,
    p_voter_email TEXT,
    p_vote_value INTEGER DEFAULT 1
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
    existing_vote RECORD;
BEGIN
    -- التحقق من التصويت السابق
    SELECT * INTO existing_vote
    FROM public.competition_votes 
    WHERE competition_id = p_competition_id 
      AND participant_id = p_participant_id 
      AND voter_email = p_voter_email;
      
    IF existing_vote IS NOT NULL THEN
        RETURN jsonb_build_object('success', false, 'message', 'لقد قمت بالتصويت مسبقاً');
    END IF;
    
    -- إضافة التصويت
    INSERT INTO public.competition_votes (
        competition_id,
        participant_id,
        voter_email,
        voter_ip,
        vote_value
    ) VALUES (
        p_competition_id,
        p_participant_id,
        p_voter_email,
        inet_client_addr(),
        p_vote_value
    );
    
    RETURN jsonb_build_object('success', true, 'message', 'تم التصويت بنجاح');
END;
$$;

-- دالة احصائيات التصويت
CREATE OR REPLACE FUNCTION get_voting_stats(p_competition_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
    stats JSONB;
BEGIN
    WITH vote_stats AS (
        SELECT 
            cp.id as participant_id,
            cp.user_id,
            COUNT(cv.id) as vote_count,
            SUM(cv.vote_value) as total_votes
        FROM public.competition_participants cp
        LEFT JOIN public.competition_votes cv ON cp.id = cv.participant_id
        WHERE cp.competition_id = p_competition_id
        GROUP BY cp.id, cp.user_id
    )
    SELECT jsonb_agg(
        jsonb_build_object(
            'participant_id', participant_id,
            'user_id', user_id,
            'vote_count', vote_count,
            'total_votes', total_votes
        )
    ) INTO stats
    FROM vote_stats;
    
    RETURN COALESCE(stats, '[]'::jsonb);
END;
$$;