// Public proxy that streams library file URLs as forced downloads.
// Bypasses CORS and forces Content-Disposition: attachment so the browser
// never opens the PDF inline.

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const target = url.searchParams.get('url');
    const filename = url.searchParams.get('filename') || 'download.pdf';

    if (!target) {
      return new Response(JSON.stringify({ error: 'missing url' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Basic safety: only http(s)
    if (!/^https?:\/\//i.test(target)) {
      return new Response(JSON.stringify({ error: 'invalid url' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const upstream = await fetch(target, {
      headers: { 'User-Agent': 'Mozilla/5.0 LibraryProxy/1.0' },
      redirect: 'follow',
    });

    if (!upstream.ok || !upstream.body) {
      return new Response(JSON.stringify({ error: `upstream ${upstream.status}` }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const contentType = upstream.headers.get('content-type') || 'application/octet-stream';
    const safeName = filename.replace(/[\r\n"]/g, '_');
    const encoded = encodeURIComponent(safeName);

    return new Response(upstream.body, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${safeName}"; filename*=UTF-8''${encoded}`,
        'Cache-Control': 'public, max-age=86400, immutable',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
