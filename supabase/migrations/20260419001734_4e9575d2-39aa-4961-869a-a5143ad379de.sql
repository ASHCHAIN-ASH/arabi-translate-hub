
CREATE TABLE public.workspace_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL DEFAULT 'ملاحظة جديدة',
  content TEXT NOT NULL DEFAULT '',
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  source_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.workspace_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users view own notes" ON public.workspace_notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users insert own notes" ON public.workspace_notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users update own notes" ON public.workspace_notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "users delete own notes" ON public.workspace_notes FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_workspace_notes_user ON public.workspace_notes(user_id, updated_at DESC);

CREATE TRIGGER trg_workspace_notes_updated
  BEFORE UPDATE ON public.workspace_notes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
