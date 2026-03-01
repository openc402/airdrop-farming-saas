import { supabase } from './supabase';
import { CHAINS, WALLET_ADDRESS } from './chains';

// ========== WALLET BALANCES ==========

export interface ChainBalance {
  chain: string;
  symbol: string;
  balance: string;
  balanceRaw: bigint;
}

async function getBalance(rpcUrl: string): Promise<string> {
  try {
    const res = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getBalance',
        params: [WALLET_ADDRESS, 'latest'],
        id: 1,
      }),
    });
    const data = await res.json();
    if (data.result) {
      const wei = BigInt(data.result);
      const eth = Number(wei) / 1e18;
      return eth.toFixed(6);
    }
    return '0';
  } catch {
    return '0';
  }
}

export async function getWalletBalances(): Promise<ChainBalance[]> {
  const balances: ChainBalance[] = [];
  
  for (const [, chain] of Object.entries(CHAINS)) {
    const balance = await getBalance(chain.rpc);
    balances.push({
      chain: chain.name,
      symbol: chain.symbol,
      balance,
      balanceRaw: BigInt(0),
    });
  }
  
  return balances;
}

// ========== GAS PRICES ==========

export interface GasPrice {
  chain: string;
  gasPriceGwei: number;
  status: 'low' | 'medium' | 'high';
}

async function getGasPrice(rpcUrl: string): Promise<number> {
  try {
    const res = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', method: 'eth_gasPrice', params: [], id: 1 }),
    });
    const data = await res.json();
    if (data.result) {
      return Number(BigInt(data.result)) / 1e9; // Convert wei to gwei
    }
    return 0;
  } catch {
    return 0;
  }
}

function getGasStatus(gwei: number, chain: string): 'low' | 'medium' | 'high' {
  if (chain === 'Ethereum') {
    if (gwei < 20) return 'low';
    if (gwei < 50) return 'medium';
    return 'high';
  }
  // L2s
  if (gwei < 0.5) return 'low';
  if (gwei < 2) return 'medium';
  return 'high';
}

export async function getGasPrices(): Promise<GasPrice[]> {
  const prices: GasPrice[] = [];
  
  for (const [, chain] of Object.entries(CHAINS)) {
    const gasPriceGwei = await getGasPrice(chain.rpc);
    prices.push({
      chain: chain.name,
      gasPriceGwei: Math.round(gasPriceGwei * 100) / 100,
      status: getGasStatus(gasPriceGwei, chain.name),
    });
  }
  
  return prices;
}

// ========== SUPABASE DATA ==========

export async function getAirdrops() {
  const { data, error } = await supabase
    .from('airdrops')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) { console.error('Error fetching airdrops:', error); return []; }
  return data || [];
}

export async function getFarmingTasks() {
  const { data, error } = await supabase
    .from('farming_tasks')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) { console.error('Error fetching tasks:', error); return []; }
  return data || [];
}

export async function getWallets() {
  const { data, error } = await supabase
    .from('wallets')
    .select('*');
  
  if (error) { console.error('Error fetching wallets:', error); return []; }
  return data || [];
}

export async function addAirdrop(airdrop: {
  name: string; protocol: string; chain: string; status: string;
  estimated_value: string; tasks: string[]; progress: number; url: string;
  deadline?: string; snapshot_date?: string; tge_date?: string;
}) {
  const { data, error } = await supabase
    .from('airdrops')
    .insert({ ...airdrop, tasks: JSON.stringify(airdrop.tasks) })
    .select()
    .single();
  
  if (error) { console.error('Error adding airdrop:', error); return null; }
  return data;
}

export async function updateAirdropProgress(id: string, progress: number) {
  const { error } = await supabase
    .from('airdrops')
    .update({ progress })
    .eq('id', id);
  
  if (error) console.error('Error updating airdrop:', error);
}

export async function deleteAirdrop(id: string) {
  const { error } = await supabase
    .from('airdrops')
    .delete()
    .eq('id', id);
  
  if (error) console.error('Error deleting airdrop:', error);
}

// ========== ETH PRICE ==========

export async function getEthPrice(): Promise<number> {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
    const data = await res.json();
    return data.ethereum?.usd || 0;
  } catch {
    return 0;
  }
}

// ========== TX COUNT ==========

async function getTxCount(rpcUrl: string): Promise<number> {
  try {
    const res = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getTransactionCount',
        params: [WALLET_ADDRESS, 'latest'],
        id: 1,
      }),
    });
    const data = await res.json();
    return data.result ? Number(BigInt(data.result)) : 0;
  } catch {
    return 0;
  }
}

export async function getTotalTxCount(): Promise<number> {
  let total = 0;
  for (const [, chain] of Object.entries(CHAINS)) {
    total += await getTxCount(chain.rpc);
  }
  return total;
}
