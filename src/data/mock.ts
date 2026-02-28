import { Airdrop, FarmingTask, GasInfo } from '@/types';

export const mockAirdrops: Airdrop[] = [
  { id: '1', name: 'LayerZero', protocol: 'LayerZero', chain: 'Multi-chain', status: 'active', estimated_value: '$1,500 - $5,000', deadline: '2026-06-01', snapshot_date: null, tge_date: null, tasks: ['Bridge', 'Swap', 'Provide LP'], progress: 65, url: '#' },
  { id: '2', name: 'zkSync Era', protocol: 'zkSync', chain: 'zkSync', status: 'active', estimated_value: '$2,000 - $8,000', deadline: null, snapshot_date: null, tge_date: null, tasks: ['Bridge ETH', 'Use DEX', 'Mint NFT', 'Deploy contract'], progress: 42, url: '#' },
  { id: '3', name: 'Scroll', protocol: 'Scroll', chain: 'Scroll', status: 'upcoming', estimated_value: '$500 - $3,000', deadline: '2026-04-15', snapshot_date: '2026-03-30', tge_date: null, tasks: ['Bridge', 'Swap on Ambient'], progress: 20, url: '#' },
  { id: '4', name: 'Linea', protocol: 'Linea', chain: 'Linea', status: 'active', estimated_value: '$800 - $4,000', deadline: null, snapshot_date: null, tge_date: null, tasks: ['Bridge', 'Swap', 'LP on Nile'], progress: 35, url: '#' },
  { id: '5', name: 'Monad', protocol: 'Monad', chain: 'Monad', status: 'upcoming', estimated_value: '$3,000 - $15,000', deadline: '2026-08-01', snapshot_date: null, tge_date: null, tasks: ['Testnet tasks', 'Discord roles'], progress: 10, url: '#' },
];

export const mockFarmingTasks: FarmingTask[] = [
  { id: '1', airdrop_name: 'LayerZero', task_type: 'bridge', description: 'Bridge ETH via Stargate', status: 'completed', last_run: '2026-02-28T14:30:00Z', next_run: '2026-03-01T14:30:00Z', frequency: 'Daily' },
  { id: '2', airdrop_name: 'zkSync', task_type: 'swap', description: 'Swap ETH/USDC on SyncSwap', status: 'running', last_run: '2026-02-28T15:00:00Z', next_run: null, frequency: 'Every 6h' },
  { id: '3', airdrop_name: 'zkSync', task_type: 'liquidity', description: 'Add LP on Mute.io', status: 'pending', last_run: null, next_run: '2026-02-28T18:00:00Z', frequency: 'Weekly' },
  { id: '4', airdrop_name: 'Scroll', task_type: 'interact', description: 'Interact with Ambient Finance', status: 'pending', last_run: null, next_run: '2026-03-01T10:00:00Z', frequency: 'Daily' },
  { id: '5', airdrop_name: 'Linea', task_type: 'swap', description: 'Swap on Nile Exchange', status: 'completed', last_run: '2026-02-28T12:00:00Z', next_run: '2026-02-28T18:00:00Z', frequency: 'Every 6h' },
];

export const mockGas: GasInfo[] = [
  { chain: 'Ethereum', gas_price_gwei: 12, status: 'low' },
  { chain: 'Arbitrum', gas_price_gwei: 0.1, status: 'low' },
  { chain: 'Base', gas_price_gwei: 0.05, status: 'low' },
  { chain: 'zkSync', gas_price_gwei: 0.25, status: 'medium' },
  { chain: 'Scroll', gas_price_gwei: 0.4, status: 'medium' },
  { chain: 'Linea', gas_price_gwei: 0.3, status: 'low' },
];
