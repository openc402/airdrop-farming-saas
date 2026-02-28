export interface Airdrop {
  id: string;
  name: string;
  protocol: string;
  chain: string;
  status: 'active' | 'upcoming' | 'ended';
  estimated_value: string;
  deadline: string | null;
  snapshot_date: string | null;
  tge_date: string | null;
  tasks: string[];
  progress: number;
  url: string;
}

export interface FarmingTask {
  id: string;
  airdrop_name: string;
  task_type: 'bridge' | 'swap' | 'liquidity' | 'interact' | 'stake' | 'other';
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  last_run: string | null;
  next_run: string | null;
  frequency: string;
}

export interface GasInfo {
  chain: string;
  gas_price_gwei: number;
  status: 'low' | 'medium' | 'high';
}

export interface WalletBalance {
  chain: string;
  symbol: string;
  balance: string;
  usd_value: number;
}
