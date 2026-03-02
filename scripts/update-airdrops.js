const { Client } = require('pg');
const client = new Client({
  host: 'db.bchqfuidxhypclaminib.supabase.co',
  port: 5432, database: 'postgres', user: 'postgres',
  password: 'Pup83965.Supa!', ssl: { rejectUnauthorized: false }
});

// Real airdrops from DropSEarn — March 2026
// Estimated value = rough calc based on funding * typical airdrop allocation (5-15%)
const airdrops = [
  { name: 'OpenSea', protocol: 'OpenSea', chain: 'Ethereum', status: 'active', estimated_value: '$2,000 - $8,000', tasks: '["XP Farming", "Trade NFTs", "List items"]', progress: 0, url: 'https://opensea.io/', notes: 'Raised $425M. XP farming system active. Daily tasks available.', source: 'auto' },
  { name: 'Farcaster', protocol: 'Farcaster', chain: 'Ethereum', status: 'active', estimated_value: '$500 - $3,000', tasks: '["Complete KYC", "Post on Warpcast", "Engage community"]', progress: 0, url: 'https://www.farcaster.xyz/', notes: 'Raised $180M. Social protocol. Complete KYC required.', source: 'auto' },
  { name: 'Newton', protocol: 'Newton (Magic)', chain: 'Multi-chain', status: 'active', estimated_value: '$500 - $2,500', tasks: '["Activate AI Agent"]', progress: 0, url: 'https://magicnewton.com/', notes: 'Raised $83M. Infrastructure. One-time setup ~10min, cost ~$12.', source: 'auto' },
  { name: 'MegaETH', protocol: 'MegaETH', chain: 'MegaETH', status: 'active', estimated_value: '$1,000 - $5,000', tasks: '["Transaction farming game", "Daily tasks", "Testnet"]', progress: 0, url: 'https://testnet.megaeth.com/', notes: 'Raised $57M. Layer-2. Daily transaction farming game.', source: 'auto' },
  { name: 'Ink', protocol: 'Ink', chain: 'Ink L2', status: 'active', estimated_value: '$800 - $4,000', tasks: '["Daily GM", "Bridge assets", "Use dApps"]', progress: 0, url: 'https://gm.inkonchain.com/', notes: 'Raised $42.5M. Kraken Layer-2. Daily GM + on-chain activity.', source: 'auto' },
  { name: 'XION', protocol: 'XION', chain: 'XION', status: 'active', estimated_value: '$500 - $3,000', tasks: '["Play casino games", "Daily tasks"]', progress: 0, url: 'https://xion.burnt.com/', notes: 'Raised $36M. Blockchain. Daily + one-time tasks, cost ~$81.', source: 'auto' },
  { name: 'Backpack', protocol: 'Backpack', chain: 'Solana', status: 'active', estimated_value: '$500 - $3,000', tasks: '["Trade to earn points", "Volume farming"]', progress: 0, url: 'https://backpack.exchange/', notes: 'Raised $37M. CEX. Trade to earn points.', source: 'auto' },
  { name: 'Towns', protocol: 'Towns', chain: 'Ethereum', status: 'active', estimated_value: '$300 - $2,000', tasks: '["Join Memes Towns", "Daily activity"]', progress: 0, url: 'https://app.towns.com/', notes: 'Raised $35M. Social platform. Daily engagement, cost ~$3.', source: 'auto' },
  { name: 'Recall', protocol: 'Recall', chain: 'Multi-chain', status: 'active', estimated_value: '$300 - $2,000', tasks: '["Galxe Quests", "Earn points"]', progress: 0, url: 'https://recall.network/', notes: 'Raised $30M. Blockchain infrastructure. Free Galxe quests.', source: 'auto' },
  { name: 'Sentient', protocol: 'Sentient', chain: 'Multi-chain', status: 'active', estimated_value: '$500 - $3,000', tasks: '["Register whitelist", "Chat"]', progress: 0, url: 'https://sentient.xyz/', notes: 'Raised $85M. AI infrastructure. Whitelist registration open.', source: 'auto' },
  { name: 'Miden', protocol: 'Miden (Polygon)', chain: 'Miden', status: 'active', estimated_value: '$200 - $1,500', tasks: '["Install wallet", "Get test tokens"]', progress: 0, url: 'https://faucet.testnet.miden.io/', notes: 'Raised $25M. Blockchain by Polygon. Free testnet tasks.', source: 'auto' },
  { name: 'Plasma', protocol: 'Plasma', chain: 'Plasma', status: 'active', estimated_value: '$200 - $1,500', tasks: '["Complete Galxe tasks"]', progress: 0, url: 'https://plasma.build/', notes: 'Raised $24M. Blockchain. Free Galxe tasks, 2 min.', source: 'auto' },
  { name: 'Coresky', protocol: 'Coresky', chain: 'Multi-chain', status: 'active', estimated_value: '$200 - $1,000', tasks: '["Daily Check-in", "Vote"]', progress: 0, url: 'https://coresky.com/', notes: 'Raised $21M. DeFi. Free daily tasks, 1 min/day.', source: 'auto' },
  { name: 'Hemi Network', protocol: 'Hemi', chain: 'Hemi', status: 'active', estimated_value: '$200 - $1,500', tasks: '["Bridge assets", "Stake", "Earn Points"]', progress: 0, url: 'https://app.hemi.xyz/', notes: 'Raised $15M. Modular blockchain. Staking + daily tasks, cost ~$7.', source: 'auto' },
  { name: 'Fogo', protocol: 'Fogo', chain: 'Fogo', status: 'active', estimated_value: '$200 - $1,000', tasks: '["Trade tokens", "Stake"]', progress: 0, url: 'https://www.fogo.io/', notes: 'Raised $13.5M. Blockchain. Staking + trading.', source: 'auto' },
  { name: 'Nexus', protocol: 'Nexus Labs', chain: 'Nexus', status: 'active', estimated_value: '$200 - $1,500', tasks: '["Deploy NFT Collection", "Daily tasks"]', progress: 0, url: 'https://nexus.xyz/', notes: 'Raised $25M. Infrastructure. Free daily tasks.', source: 'auto' },
  { name: 'Somnia', protocol: 'Somnia', chain: 'Somnia', status: 'active', estimated_value: '$100 - $800', tasks: '["Request test tokens", "Make swaps"]', progress: 0, url: 'https://somnia.network/', notes: 'Blockchain. Free testnet tasks, 3 min.', source: 'auto' },
  { name: 'GaiaNet', protocol: 'GaiaNet', chain: 'Multi-chain', status: 'active', estimated_value: '$200 - $1,000', tasks: '["Node setup"]', progress: 0, url: 'https://gaianet.ai/', notes: 'Raised $10M. Infrastructure. Node setup ~15min, cost ~$25.', source: 'auto' },
  { name: 'Wayfinder', protocol: 'Wayfinder', chain: 'Ethereum', status: 'active', estimated_value: '$300 - $2,000', tasks: '["Cache PRIME tokens", "Stake"]', progress: 0, url: 'https://app.wayfinder.ai/', notes: 'AI Agents platform. Staking PRIME, cost ~$20.', source: 'auto' },
  { name: 'Paradex', protocol: 'Paradex', chain: 'Starknet', status: 'active', estimated_value: '$300 - $2,000', tasks: '["Trade to earn points"]', progress: 0, url: 'https://app.paradex.trade/', notes: 'Perpetual DEX. Trading volume farming.', source: 'auto' },
];

async function run() {
  await client.connect();

  // Add source column if not exists
  try { await client.query(`alter table public.airdrops add column source text default 'manual'`); } catch(e) { /* exists */ }

  // Clear old auto airdrops
  await client.query(`delete from public.airdrops where source = 'auto'`);
  // Also clear the fake seeded ones
  await client.query(`delete from public.airdrops where name in ('LayerZero', 'zkSync Era', 'Scroll', 'Linea', 'Monad') and source is null`);

  // Insert real airdrops
  for (const a of airdrops) {
    await client.query(
      `insert into public.airdrops (name, protocol, chain, status, estimated_value, tasks, progress, url, notes, source) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [a.name, a.protocol, a.chain, a.status, a.estimated_value, a.tasks, a.progress, a.url, a.notes, a.source]
    );
  }

  console.log(`✅ ${airdrops.length} real airdrops inserted`);
  await client.end();
}

run().catch(e => { console.error('❌', e.message); process.exit(1); });
