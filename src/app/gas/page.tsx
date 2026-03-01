'use client';

import { useEffect, useState } from 'react';
import { getGasPrices, GasPrice } from '@/lib/api';

export default function GasPage() {
  const [gas, setGas] = useState<GasPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState('');

  const fetchGas = async () => {
    const g = await getGasPrices();
    setGas(g);
    setLastUpdate(new Date().toLocaleTimeString());
    setLoading(false);
  };

  useEffect(() => {
    fetchGas();
    const interval = setInterval(fetchGas, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="flex items-center justify-center h-96"><div className="text-zinc-500">Fetching gas prices...</div></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">⛽ Gas Tracker</h1>
          <p className="text-zinc-500 text-sm">Real-time gas prices across chains</p>
        </div>
        <div className="text-right">
          <p className="text-[11px] text-zinc-600">Last update: {lastUpdate}</p>
          <p className="text-[11px] text-green-400">Auto-refresh: 30s</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {gas.map((g) => (
          <div key={g.chain} className="glass p-6 flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-lg">{g.chain}</h3>
              <p className="text-xs text-zinc-500">Current gas price</p>
            </div>
            <div className="text-right">
              <p className={`text-3xl font-mono font-bold ${
                g.status === 'low' ? 'text-green-400' : g.status === 'medium' ? 'text-yellow-400' : 'text-red-400'
              }`}>{g.gasPriceGwei}</p>
              <p className="text-[11px] text-zinc-600">gwei · {g.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
