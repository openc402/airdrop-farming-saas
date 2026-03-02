'use client';

import { useEffect, useState } from 'react';
import { getAirdrops, addAirdrop } from '@/lib/api';

export default function AirdropsPage() {
  const [airdrops, setAirdrops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', protocol: '', chain: '', estimated_value: '', url: '', notes: '' });

  const load = () => getAirdrops().then(a => { setAirdrops(a); setLoading(false); });
  useEffect(() => { load(); }, []);

  const filtered = filter === 'all' ? airdrops : airdrops.filter(a => a.status === filter);
  const chains = [...new Set(airdrops.map(a => a.chain))];

  const handleAdd = async () => {
    if (!form.name) return;
    await addAirdrop({ ...form, status: 'active', tasks: [], progress: 0 });
    setForm({ name: '', protocol: '', chain: '', estimated_value: '', url: '', notes: '' });
    setShowAdd(false);
    load();
  };

  if (loading) return <div className="flex items-center justify-center h-96"><div className="text-zinc-500">Loading airdrops...</div></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
        <div>
          <h1 className="text-2xl font-bold">🪂 Airdrops</h1>
          <p className="text-zinc-500 text-sm">{airdrops.length} airdrops tracked — auto-updated + manual</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all">
          + Add Airdrop
        </button>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="glass p-5 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input type="text" placeholder="Name *" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500/50" />
            <input type="text" placeholder="Protocol" value={form.protocol} onChange={e => setForm({...form, protocol: e.target.value})}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500/50" />
            <input type="text" placeholder="Chain (ex: Ethereum, Solana)" value={form.chain} onChange={e => setForm({...form, chain: e.target.value})}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500/50" />
            <input type="text" placeholder="Est. Value (ex: $500 - $2,000)" value={form.estimated_value} onChange={e => setForm({...form, estimated_value: e.target.value})}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500/50" />
            <input type="text" placeholder="URL" value={form.url} onChange={e => setForm({...form, url: e.target.value})}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500/50" />
            <input type="text" placeholder="Notes" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500/50" />
          </div>
          <div className="flex gap-3">
            <button onClick={handleAdd} className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium">Add</button>
            <button onClick={() => setShowAdd(false)} className="text-zinc-500 hover:text-zinc-300 px-4 py-2.5 text-sm">Cancel</button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'active', 'upcoming', 'ended'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              filter === f ? 'bg-purple-500/20 text-purple-300' : 'bg-white/5 text-zinc-500 hover:text-zinc-300'
            }`}>{f === 'all' ? `All (${airdrops.length})` : f}</button>
        ))}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((a: any) => {
          const taskList = typeof a.tasks === 'string' ? JSON.parse(a.tasks) : (a.tasks || []);
          return (
            <div key={a.id} className="glass p-5 hover:border-purple-500/20 transition-all">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{a.name}</h3>
                    {a.source === 'manual' && <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-400">MANUAL</span>}
                  </div>
                  <p className="text-zinc-500 text-xs">{a.protocol} · {a.chain}</p>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                  a.status === 'active' ? 'badge-active' : a.status === 'upcoming' ? 'badge-upcoming' : 'badge-ended'
                }`}>{a.status}</span>
              </div>

              {a.estimated_value && (
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-zinc-500">Est. Value</span>
                  <span className="text-purple-300 font-semibold">{a.estimated_value}</span>
                </div>
              )}

              {a.notes && <p className="text-[11px] text-zinc-600 mb-3 leading-relaxed">{a.notes}</p>}

              <div className="mb-2">
                <div className="flex justify-between text-[11px] text-zinc-600 mb-1">
                  <span>Progress</span><span>{a.progress}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: `${a.progress}%` }} />
                </div>
              </div>

              {taskList.length > 0 && (
                <div className="flex gap-1.5 flex-wrap mt-2">
                  {taskList.map((t: string) => (
                    <span key={t} className="text-[11px] bg-white/5 px-2 py-0.5 rounded-lg text-zinc-500">{t}</span>
                  ))}
                </div>
              )}

              {a.url && (
                <a href={a.url} target="_blank" rel="noopener noreferrer" className="block mt-3 text-[11px] text-purple-400 hover:text-purple-300 transition-all">
                  🔗 Participate →
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
