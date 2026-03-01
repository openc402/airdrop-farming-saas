'use client';

import { useEffect, useState } from 'react';
import { getAirdrops } from '@/lib/api';

export default function AirdropsPage() {
  const [airdrops, setAirdrops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAirdrops().then(a => { setAirdrops(a); setLoading(false); });
  }, []);

  if (loading) return <div className="flex items-center justify-center h-96"><div className="text-zinc-500">Loading airdrops...</div></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">🪂 Airdrops</h1>
        <p className="text-zinc-500 text-sm">All tracked airdrops from Supabase</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {airdrops.map((a: any) => {
          const taskList = typeof a.tasks === 'string' ? JSON.parse(a.tasks) : (a.tasks || []);
          return (
            <div key={a.id} className="glass p-5 hover:border-purple-500/20 transition-all">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{a.name}</h3>
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
              <div className="mb-3">
                <div className="flex justify-between text-[11px] text-zinc-600 mb-1">
                  <span>Progress</span><span>{a.progress}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: `${a.progress}%` }} />
                </div>
              </div>
              {a.deadline && <p className="text-xs text-zinc-500">⏰ Deadline: {new Date(a.deadline).toLocaleDateString()}</p>}
              {a.snapshot_date && <p className="text-xs text-zinc-500">📸 Snapshot: {new Date(a.snapshot_date).toLocaleDateString()}</p>}
              <div className="flex gap-1.5 flex-wrap mt-3">
                {taskList.map((t: string) => (
                  <span key={t} className="text-[11px] bg-white/5 px-2 py-0.5 rounded-lg text-zinc-500">{t}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
