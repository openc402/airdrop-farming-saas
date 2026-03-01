'use client';

import { useEffect, useState } from 'react';
import { getFarmingTasks } from '@/lib/api';

export default function FarmingPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFarmingTasks().then(t => { setTasks(t); setLoading(false); });
  }, []);

  if (loading) return <div className="flex items-center justify-center h-96"><div className="text-zinc-500">Loading tasks...</div></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">🤖 Auto-Farming</h1>
        <p className="text-zinc-500 text-sm">Automated on-chain tasks from Supabase</p>
      </div>

      {tasks.length === 0 ? (
        <div className="glass p-8 text-center text-zinc-500">
          <p className="text-4xl mb-4">🤖</p>
          <p className="font-medium">No farming tasks yet</p>
          <p className="text-xs mt-2 text-zinc-600">Tasks will appear here once automation scripts are running</p>
        </div>
      ) : (
        <div className="glass overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-zinc-600 border-b border-white/5">
                <th className="text-left p-4">Task</th>
                <th className="text-left p-4">Airdrop</th>
                <th className="text-left p-4">Type</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Frequency</th>
                <th className="text-left p-4">Next Run</th>
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
                  <td className="p-4 text-sm text-zinc-400">{t.frequency || '—'}</td>
                  <td className="p-4 text-sm text-zinc-500">{t.next_run ? new Date(t.next_run).toLocaleString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
