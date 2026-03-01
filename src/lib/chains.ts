export const CHAINS = {
  ethereum: { name: 'Ethereum', rpc: 'https://eth.llamarpc.com', symbol: 'ETH', explorer: 'https://etherscan.io' },
  arbitrum: { name: 'Arbitrum', rpc: 'https://arb1.arbitrum.io/rpc', symbol: 'ETH', explorer: 'https://arbiscan.io' },
  base: { name: 'Base', rpc: 'https://mainnet.base.org', symbol: 'ETH', explorer: 'https://basescan.org' },
  zksync: { name: 'zkSync', rpc: 'https://mainnet.era.zksync.io', symbol: 'ETH', explorer: 'https://explorer.zksync.io' },
  scroll: { name: 'Scroll', rpc: 'https://rpc.scroll.io', symbol: 'ETH', explorer: 'https://scrollscan.com' },
  linea: { name: 'Linea', rpc: 'https://rpc.linea.build', symbol: 'ETH', explorer: 'https://lineascan.build' },
} as const;

export const WALLET_ADDRESS = '0xC6D0df8c89BD3DA3FDf15f4Ff2f2c2648aAa2eD2';
