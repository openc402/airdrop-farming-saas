'use client';

import { useEffect, useState } from 'react';
import { getWalletBalances, getEthPrice, ChainBalance } from '@/lib/api';
import { WALLET_ADDRESS } from '@/lib/chains';

export default function WalletPage() {
  const [balances, setBalances] = useState<ChainBalance[]>([]);
  const [ethPrice, setEthPrice] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getWalletBalances(), getEthPrice()]).then(([b, p]) => {
      setBalances(b); setEthPrice(p); setLoading(false);
    });
  }, []);

  const totalEth = balances.reduce((sum, b) => sum + parseFloat(b.balance || '0'), 0);
  const totalUsd = totalEth * ethPrice;

  if (loading) return <div className="flex items-center justify-center h-96"><div className="text-zinc-500">Fetching on-chain balances...</div></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">💰 Wallet</h1>
        <p className="text-zinc-500 text-sm">Multi-chain portfolio — live on-chain data</p>
      </div>

      <div className="glass p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-zinc-500 text-sm">Main Farming Wallet</p>
            <p className="font-mono text-sm mt-1">{WALLET_ADDRESS}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">${totalUsd.toFixed(2)}</p>
            <p className="text-zinc-500 text-sm">{totalEth.toFixed(6)} ETH @ ${ethPrice.toFixed(0)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {balances.map((b) => {
            const ethVal = parseFloat(b.balance);
            const usdVal = ethVal * ethPrice;
            return (
              <div key={b.chain} className="glass p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{b.chain}</h3>
                  <span className="text-xs text-zinc-600">{b.symbol}</span>
                </div>
                <p className="text-xl font-mono font-bold">{ethVal.toFixed(6)}</p>
                <p className="text-xs text-zinc-500">${usdVal.toFixed(2)} USD</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
