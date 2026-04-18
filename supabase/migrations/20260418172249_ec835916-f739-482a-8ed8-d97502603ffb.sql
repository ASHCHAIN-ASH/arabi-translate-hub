UPDATE public.track_tools tt
SET action_link = '/student/tracks/' || t.slug || '/tools/' || tt.slug
FROM public.tracks t
WHERE tt.track_id = t.id;