'use client';

import { useEffect, useState } from 'react';
import { getAirdrops, getFarmingTasks, getGasPrices, getWalletBalances, getEthPrice, getTotalTxCount, GasPrice, ChainBalance } from '@/lib/api';

export default function Dashboard() {
  const [airdrops, setAirdrops] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [gas, setGas] = useState<GasPrice[]>([]);
  const [balances, setBalances] = useState<ChainBalance[]>([]);
  const [ethPrice, setEthPrice] = useState(0);
  const [txCount, setTxCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [a, t, g, b, p, tx] = await Promise.all([
        getAirdrops(),
        getFarmingTasks(),
        getGasPrices(),
        getWalletBalances(),
        getEthPrice(),
        getTotalTxCount(),
      ]);
      setAirdrops(a);
      setTasks(t);
      setGas(g);
      setBalances(b);
      setEthPrice(p);
      setTxCount(tx);
      setLoading(false);
    }
    load();
  }, []);

  const totalEth = balances.reduce((sum, b) => sum + parseFloat(b.balance || '0'), 0);
  const portfolioUsd = (totalEth * ethPrice).toFixed(2);
  const activeAirdrops = airdrops.filter(a => a.status === 'active').length;
  const runningTasks = tasks.filter(t => t.status === 'running').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-zinc-500 flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          Loading dashboard data...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">📊 Dashboard</h1>
        <p className="text-zinc-500 text-sm">Live data from on-chain + Supabase</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Portfolio Value', value: `$${portfolioUsd}`, sub: `${totalEth.toFixed(4)} ETH @ $${ethPrice.toFixed(0)}`, icon: '💰', color: 'text-green-400' },
          { title: 'Active Airdrops', value: String(activeAirdrops), sub: `${airdrops.length} total tracked`, icon: '🪂', color: 'text-purple-400' },
          { title: 'Farming Tasks', value: String(runningTasks), sub: `${tasks.length} total`, icon: '🤖', color: 'text-blue-400' },
          { title: 'Total Transactions', value: String(txCount), sub: 'Across all chains', icon: '📈', color: 'text-green-400' },
        ].map((s) => (
          <div key={s.title} className="glass p-5">
            <div className="flex justify-between items-start mb-3">
              <span className="text-zinc-500 text-sm">{s.title}</span>
              <span className="text-2xl">{s.icon}</span>
            </div>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className={`text-xs mt-1 ${s.color}`}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Airdrops + Gas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold">Top Airdrops</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {airdrops.slice(0, 4).map((a: any) => {
              const taskList = typeof a.tasks === 'string' ? JSON.parse(a.tasks) : (a.tasks || []);
              return (
                <div key={a.id} className="glass p-5 hover:border-purple-500/20 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold">{a.name}</h3>
                      <p className="text-zinc-500 text-xs">{a.protocol} · {a.chain}</p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                      a.status === 'active' ? 'badge-active' : a.status === 'upcoming' ? 'badge-upcoming' : 'badge-ended'
                    }`}>{a.status}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-zinc-500">Est. Value</span>
                    <span className="text-purple-300 font-semibold">{a.estimated_value}</span>
                  </div>
                  <div className="mb-2">
                    <div className="flex justify-between text-[11px] text-zinc-600 mb-1">
                      <span>Progress</span><span>{a.progress}%</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: `${a.progress}%` }} />
                    </div>
                  </div>
                  <div className="flex gap-1.5 flex-wrap mt-2">
                    {taskList.slice(0, 3).map((t: string) => (
                      <span key={t} className="text-[11px] bg-white/5 px-2 py-0.5 rounded-lg text-zinc-500">{t}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass p-5">
          <h2 className="font-semibold mb-4">⛽ Gas Tracker <span className="text-[10px] text-green-400 ml-1">LIVE</span></h2>
          <div className="space-y-3">
            {gas.map((g) => (
              <div key={g.chain} className="flex justify-between items-center">
                <span className="text-sm text-zinc-400">{g.chain}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-mono ${
                    g.status === 'low' ? 'text-green-400' : g.status === 'medium' ? 'text-yellow-400' : 'text-red-400'
                  }`}>{g.gasPriceGwei} gwei</span>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    g.status === 'low' ? 'bg-green-400' : g.status === 'medium' ? 'bg-yellow-400' : 'bg-red-400'
                  }`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Wallet Balances */}
      <div className="glass p-5">
        <h2 className="font-semibold mb-4">💰 Wallet Balances <span className="text-[10px] text-green-400 ml-1">LIVE</span></h2>
        <p className="text-xs text-zinc-600 mb-3 font-mono">0xC6D0...2eD2</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {balances.map((b) => (
            <div key={b.chain} className="glass p-3 text-center">
              <p className="text-xs text-zinc-500 mb-1">{b.chain}</p>
              <p className="text-sm font-mono font-bold">{parseFloat(b.balance).toFixed(4)}</p>
              <p className="text-[10px] text-zinc-600">{b.symbol}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Farming tasks */}
      {tasks.length > 0 && (
        <div className="glass overflow-hidden">
          <div className="p-4 border-b border-white/5">
            <h2 className="font-semibold">🤖 Farming Tasks</h2>
          </div>
          <table className="w-full">
            <thead>
              <tr className="text-xs text-zinc-600 border-b border-white/5">
                <th className="text-left p-4">Task</th>
                <th className="text-left p-4">Airdrop</th>
                <th className="text-left p-4">Type</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Frequency</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((t: any) => (
                <tr key={t.id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                  <td className="p-4 text-sm">{t.description}</td>
                  <td className="p-4 text-sm text-zinc-400">{t.airdrop_name}</td>
                  <td className="p-4 text-sm">{t.task_type}</td>
                  <td className="p-4 text-sm">
                    <span className={
                      t.status === 'completed' ? 'text-green-400' :
                      t.status === 'running' ? 'text-blue-400' :
                      t.status === 'failed' ? 'text-red-400' : 'text-zinc-500'
                    }>● {t.status}</span>
                  </td>
                  <td className="p-4 text-sm text-zinc-400">{t.frequency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
