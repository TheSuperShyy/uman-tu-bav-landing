// Vercel Edge Function — forwards LeadForm submissions to Monday.com.
//
// The site posts a JSON payload to /api/lead; this function reads the
// Monday API token + board ID + column-ID map from Vercel env vars,
// then fires Monday's GraphQL `create_item` mutation. The token never
// reaches the client bundle.
//
// Env vars (set in Vercel Project Settings → Environment Variables, and
// in .env.local for `vercel dev`):
//   MONDAY_API_TOKEN     personal-style token from Monday → Admin → API
//   MONDAY_BOARD_ID      the numeric board id (the long number in the URL)
//   MONDAY_COLUMN_MAP    JSON string mapping form field → Monday column id,
//                        e.g. {"age":"numbers__1","email":"email__1",...}

export const config = { runtime: 'edge' };

const MONDAY_API = 'https://api.monday.com/v2';

type Payload = Partial<{
  fullName: string;
  age: string;
  birthDate: string;
  city: string;
  occupation: string;
  phone: string;
  phoneKind: string;
  passport: string;
  email: string;
}>;

type ColumnMap = Partial<Record<keyof Payload, string>>;

function json(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return json({ ok: false, error: 'method-not-allowed' }, 405);
  }

  const token = process.env.MONDAY_API_TOKEN;
  const boardId = process.env.MONDAY_BOARD_ID;
  let colMap: ColumnMap = {};
  try {
    colMap = JSON.parse(process.env.MONDAY_COLUMN_MAP || '{}') as ColumnMap;
  } catch {
    return json({ ok: false, error: 'bad-column-map' }, 500);
  }
  if (!token || !boardId) {
    return json({ ok: false, error: 'not-configured' }, 500);
  }

  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return json({ ok: false, error: 'bad-json' }, 400);
  }

  // Build the `column_values` JSON that Monday expects. Each Monday
  // column type wants a specific value shape — see Monday's docs at
  // https://developer.monday.com/api-reference/docs/change-column-values
  const columnValues: Record<string, unknown> = {};
  if (colMap.age && body.age) {
    const n = Number(body.age);
    if (Number.isFinite(n)) columnValues[colMap.age] = n;
  }
  if (colMap.birthDate && body.birthDate) {
    columnValues[colMap.birthDate] = { date: body.birthDate };
  }
  if (colMap.city && body.city) columnValues[colMap.city] = body.city;
  if (colMap.occupation && body.occupation) {
    columnValues[colMap.occupation] = body.occupation;
  }
  if (colMap.phone && body.phone) {
    columnValues[colMap.phone] = { phone: body.phone, countryShortName: 'IL' };
  }
  if (colMap.phoneKind && body.phoneKind) {
    columnValues[colMap.phoneKind] = { label: body.phoneKind };
  }
  if (colMap.passport && body.passport) {
    columnValues[colMap.passport] = { label: body.passport };
  }
  if (colMap.email && body.email) {
    columnValues[colMap.email] = { email: body.email, text: body.email };
  }

  const mutation = `mutation ($boardId: ID!, $itemName: String!, $columnValues: JSON!) {
    create_item(board_id: $boardId, item_name: $itemName, column_values: $columnValues) {
      id
    }
  }`;

  try {
    const mondayRes = await fetch(MONDAY_API, {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
        'API-Version': '2024-01',
      },
      body: JSON.stringify({
        query: mutation,
        variables: {
          boardId,
          itemName: body.fullName || body.phone || body.email || 'New lead',
          columnValues: JSON.stringify(columnValues),
        },
      }),
    });
    const data = (await mondayRes.json()) as {
      data?: { create_item?: { id?: string } };
      errors?: { message?: string }[];
    };
    if (data.errors?.length) {
      return json(
        { ok: false, error: 'monday', detail: data.errors[0]?.message },
        502,
      );
    }
    return json({ ok: true, id: data.data?.create_item?.id ?? null });
  } catch (err) {
    return json({ ok: false, error: 'network', detail: String(err) }, 502);
  }
}
