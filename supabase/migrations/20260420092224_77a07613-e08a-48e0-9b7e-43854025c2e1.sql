CREATE OR REPLACE FUNCTION public.set_inbox_messages_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.bump_inbox_message_on_reply()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  UPDATE public.inbox_messages
  SET reply_count = reply_count + 1,
      last_activity_at = now(),
      status = CASE WHEN status IN ('new','open') THEN 'replied' ELSE status END
  WHERE id = NEW.message_id;
  RETURN NEW;
END;
$$;