const { Client } = require('pg');

const client = new Client({
  host: 'db.bchqfuidxhypclaminib.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'Pup83965.Supa!',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  await client.connect();
  console.log('Connected to Supabase DB!');

  await client.query(`
    create table if not exists public.wallets (
      id uuid default gen_random_uuid() primary key,
      user_id uuid references auth.users(id),
      address text not null,
      label text,
      created_at timestamptz default now()
    )
  `);
  console.log('✅ wallets table');

  await client.query(`
    create table if not exists public.airdrops (
      id uuid default gen_random_uuid() primary key,
      name text not null,
      protocol text,
      chain text,
      status text default 'active',
      estimated_value text,
      deadline timestamptz,
      snapshot_date timestamptz,
      tge_date timestamptz,
      tasks jsonb default '[]',
      progress int default 0,
      url text,
      notes text,
      created_at timestamptz default now()
    )
  `);
  console.log('✅ airdrops table');

  await client.query(`
    create table if not exists public.farming_tasks (
      id uuid default gen_random_uuid() primary key,
      airdrop_id uuid references public.airdrops(id) on delete cascade,
      airdrop_name text,
      task_type text,
      description text,
      status text default 'pending',
      last_run timestamptz,
      next_run timestamptz,
      frequency text,
      tx_hash text,
      created_at timestamptz default now()
    )
  `);
  console.log('✅ farming_tasks table');

  // RLS
  await client.query('alter table public.wallets enable row level security');
  await client.query('alter table public.airdrops enable row level security');
  await client.query('alter table public.farming_tasks enable row level security');
  console.log('✅ RLS enabled');

  const policies = [
    [`auth_wallets_select`, `wallets`, `select`, `true`],
    [`auth_wallets_insert`, `wallets`, `insert`, `true`],
    [`auth_wallets_update`, `wallets`, `update`, `true`],
    [`auth_airdrops_select`, `airdrops`, `select`, `true`],
    [`auth_airdrops_insert`, `airdrops`, `insert`, `true`],
    [`auth_airdrops_update`, `airdrops`, `update`, `true`],
    [`auth_airdrops_delete`, `airdrops`, `delete`, `true`],
    [`auth_tasks_select`, `farming_tasks`, `select`, `true`],
    [`auth_tasks_insert`, `farming_tasks`, `insert`, `true`],
    [`auth_tasks_update`, `farming_tasks`, `update`, `true`],
    [`auth_tasks_delete`, `farming_tasks`, `delete`, `true`],
  ];

  for (const [name, table, action, expr] of policies) {
    try {
      if (action === 'insert') {
        await client.query(`create policy "${name}" on public.${table} for ${action} to authenticated with check (${expr})`);
      } else {
        await client.query(`create policy "${name}" on public.${table} for ${action} to authenticated using (${expr})`);
      }
      console.log(`  ✅ policy ${name}`);
    } catch(e) {
      console.log(`  ⏭️  policy ${name} (already exists)`);
    }
  }

  // Insert wallet
  const { rows } = await client.query(`select count(*) from public.wallets where address = '0xC6D0df8c89BD3DA3FDf15f4Ff2f2c2648aAa2eD2'`);
  if (rows[0].count === '0') {
    await client.query(`insert into public.wallets (address, label) values ('0xC6D0df8c89BD3DA3FDf15f4Ff2f2c2648aAa2eD2', 'Main Farming Wallet')`);
    console.log('✅ Wallet inserted');
  } else {
    console.log('⏭️  Wallet already exists');
  }

  // Insert airdrops
  const airdrops = await client.query(`select count(*) from public.airdrops`);
  if (airdrops.rows[0].count === '0') {
    await client.query(`
      insert into public.airdrops (name, protocol, chain, status, estimated_value, tasks, progress, url) values
      ('LayerZero', 'LayerZero', 'Multi-chain', 'active', '$1,500 - $5,000', '["Bridge", "Swap", "Provide LP"]', 65, 'https://layerzero.network'),
      ('zkSync Era', 'zkSync', 'zkSync', 'active', '$2,000 - $8,000', '["Bridge ETH", "Use DEX", "Mint NFT", "Deploy contract"]', 42, 'https://zksync.io'),
      ('Scroll', 'Scroll', 'Scroll', 'active', '$500 - $3,000', '["Bridge", "Swap on Ambient"]', 20, 'https://scroll.io'),
      ('Linea', 'Linea', 'Linea', 'active', '$800 - $4,000', '["Bridge", "Swap", "LP on Nile"]', 35, 'https://linea.build'),
      ('Monad', 'Monad', 'Monad', 'upcoming', '$3,000 - $15,000', '["Testnet tasks", "Discord roles"]', 10, 'https://monad.xyz')
    `);
    console.log('✅ Airdrops inserted');
  } else {
    console.log('⏭️  Airdrops already exist');
  }

  await client.end();
  console.log('\n🎉 Database setup complete!');
}

run().catch(e => { console.error('❌ Error:', e.message); process.exit(1); });
