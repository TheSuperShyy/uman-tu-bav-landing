#!/usr/bin/env node
// One-shot setup script: creates the 7 lead-intake columns on Ronit's
// Monday board, fetches the "לידים חדשים" group id, and prints the
// values to paste into .env.local.
//
// Usage:
//   $env:MONDAY_API_TOKEN="<paste token>"; node scripts/monday-setup.mjs
//
// Idempotent-ish: if a column with the same title already exists the
// script reuses it instead of creating a duplicate.

const TOKEN = process.env.MONDAY_API_TOKEN;
const BOARD_ID = '5094895163';
const API = 'https://api.monday.com/v2';

if (!TOKEN) {
  console.error('Set MONDAY_API_TOKEN env var first.');
  process.exit(1);
}

const COLUMNS_TO_CREATE = [
  { key: 'age',         title: 'גיל',         column_type: 'numbers' },
  { key: 'birthDate',   title: 'תאריך לידה',  column_type: 'date' },
  { key: 'city',        title: 'עיר',         column_type: 'text' },
  { key: 'occupation',  title: 'עיסוק',       column_type: 'text' },
  { key: 'phoneKind',   title: 'סוג טלפון',   column_type: 'dropdown',
    defaults: { settings: { labels: [{ id: 1, name: 'כשר' }, { id: 2, name: 'רגיל' }] } } },
  { key: 'passport',    title: 'דרכון',       column_type: 'dropdown',
    defaults: { settings: { labels: [{ id: 1, name: 'כן' }, { id: 2, name: 'לא' }] } } },
  { key: 'email',       title: 'מייל',        column_type: 'email' },
];

async function gql(query, variables) {
  const res = await fetch(API, {
    method: 'POST',
    headers: {
      Authorization: TOKEN,
      'Content-Type': 'application/json',
      'API-Version': '2024-01',
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors?.length) {
    throw new Error(`Monday API error: ${json.errors[0]?.message}`);
  }
  return json.data;
}

async function fetchBoard() {
  const data = await gql(
    `query ($id: [ID!]) {
      boards(ids: $id) {
        id
        name
        groups { id title }
        columns { id title type }
      }
    }`,
    { id: [BOARD_ID] },
  );
  return data.boards?.[0];
}

async function createColumn({ title, column_type, defaults }) {
  const variables = { board_id: BOARD_ID, title, column_type };
  let mutation = `mutation ($board_id: ID!, $title: String!, $column_type: ColumnType!) {
    create_column(board_id: $board_id, title: $title, column_type: $column_type) {
      id title
    }
  }`;
  if (defaults) {
    variables.defaults = JSON.stringify(defaults);
    mutation = `mutation ($board_id: ID!, $title: String!, $column_type: ColumnType!, $defaults: JSON) {
      create_column(board_id: $board_id, title: $title, column_type: $column_type, defaults: $defaults) {
        id title
      }
    }`;
  }
  const data = await gql(mutation, variables);
  return data.create_column;
}

async function main() {
  console.log(`Fetching board ${BOARD_ID}…`);
  const board = await fetchBoard();
  if (!board) throw new Error('Board not found — check the token has access.');

  console.log(`Board: ${board.name}`);
  console.log(`Groups: ${board.groups.map((g) => g.title).join(', ')}`);

  const newLeadsGroup =
    board.groups.find((g) => g.title.includes('לידים')) ||
    board.groups[0];
  console.log(`New-leads group → id="${newLeadsGroup.id}" title="${newLeadsGroup.title}"`);

  const existingByTitle = new Map(board.columns.map((c) => [c.title, c]));
  const colMap = {};

  // The Phone column already exists on the CRM board — match it by title
  // so we don't create a duplicate.
  const existingPhone = board.columns.find((c) => c.type === 'phone' || c.title === 'Phone' || c.title === 'טלפון');
  if (existingPhone) {
    colMap.phone = existingPhone.id;
    console.log(`Reused existing Phone column → ${existingPhone.id}`);
  } else {
    const created = await createColumn({ title: 'טלפון', column_type: 'phone' });
    colMap.phone = created.id;
    console.log(`Created Phone column → ${created.id}`);
  }

  for (const spec of COLUMNS_TO_CREATE) {
    const existing = existingByTitle.get(spec.title);
    if (existing) {
      colMap[spec.key] = existing.id;
      console.log(`Reused "${spec.title}" → ${existing.id}`);
    } else {
      const created = await createColumn(spec);
      colMap[spec.key] = created.id;
      console.log(`Created "${spec.title}" → ${created.id}`);
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Paste this into .env.local:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`MONDAY_API_TOKEN=${TOKEN}`);
  console.log(`MONDAY_BOARD_ID=${BOARD_ID}`);
  console.log(`MONDAY_GROUP_ID=${newLeadsGroup.id}`);
  console.log(`MONDAY_COLUMN_MAP=${JSON.stringify(colMap)}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
