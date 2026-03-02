const { Client } = require('pg');
const c = new Client({ host: 'db.bchqfuidxhypclaminib.supabase.co', port: 5432, database: 'postgres', user: 'postgres', password: 'Pup83965.Supa!', ssl: { rejectUnauthorized: false } });

const costs = {
  'OpenSea': 'free', 'Farcaster': 'paid', 'Newton': 'paid', 'MegaETH': 'free',
  'Ink': 'paid', 'XION': 'paid', 'Backpack': 'paid', 'Towns': 'paid',
  'Recall': 'free', 'Sentient': 'free', 'Miden': 'free', 'Plasma': 'free',
  'Coresky': 'free', 'Hemi Network': 'paid', 'Fogo': 'paid', 'Nexus': 'free',
  'Somnia': 'free', 'GaiaNet': 'paid', 'Wayfinder': 'paid', 'Paradex': 'paid',
};

async function run() {
  await c.connect();
  try { await c.query(`alter table public.airdrops add column cost text default 'free'`); } catch(e) {}
  for (const [name, cost] of Object.entries(costs)) {
    await c.query(`update public.airdrops set cost = $1 where name = $2`, [cost, name]);
  }
  await c.end();
  console.log('✅ Cost field updated');
}
run();
