// Vercel Edge Function — thin proxy from the site to the Ronit backend.
//
// The site posts to /api/lead; this function forwards the JSON straight
// through to `https://api.ronitbarash.site/api/website/lead`, which
// handles dedup (phone-based across CRM/Uman/Poland/Challah boards, and
// IG-aware via the `ig_id` field), channel attribution, and the actual
// Monday writes. No env vars needed — the backend URL is hardcoded.

export const config = { runtime: 'edge' };

const BACKEND_URL = 'https://api.ronitbarash.site/api/website/lead';

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'method_not_allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'invalid_json' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const upstream = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const body = await upstream.text();
    return new Response(body, {
      status: upstream.status,
      headers: {
        'Content-Type': upstream.headers.get('Content-Type') ?? 'application/json',
      },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'upstream_unreachable' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
