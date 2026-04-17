DROP TRIGGER IF EXISTS trg_ticket_changed ON public.tickets;

CREATE TRIGGER trg_ticket_insert_changed
AFTER INSERT ON public.tickets
FOR EACH ROW EXECUTE FUNCTION public.handle_ticket_changed();

CREATE TRIGGER trg_ticket_update_changed
BEFORE UPDATE ON public.tickets
FOR EACH ROW EXECUTE FUNCTION public.handle_ticket_changed();