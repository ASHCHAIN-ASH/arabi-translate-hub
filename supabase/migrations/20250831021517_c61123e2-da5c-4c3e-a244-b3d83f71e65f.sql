-- Add current sandbox domain to siteA for testing
UPDATE public.tenants 
SET extra_domains = array_append(extra_domains, 'ac43130c-4bba-404a-ade5-b9d62d1f8904.sandbox.lovable.dev')
WHERE code = 'siteA';

-- Also add any *.sandbox.lovable.dev pattern for future sandbox domains
UPDATE public.tenants 
SET extra_domains = array_append(extra_domains, '*.sandbox.lovable.dev')
WHERE code = 'siteA';