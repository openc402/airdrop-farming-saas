'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getWallets } from '@/lib/api';
import { WALLET_ADDRESS } from '@/lib/chains';

export default function SettingsPage() {
  const [wallets, setWallets] = useState<any[]>([]);
  const [newAddress, setNewAddress] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [user, setUser] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    getWallets().then(setWallets);
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const addWallet = async () => {
    if (!newAddress) return;
    setSaving(true);
    const { error } = await supabase.from('wallets').insert({
      address: newAddress,
      label: newLabel || 'Wallet',
    });
    if (error) {
      setMessage('❌ Error adding wallet');
    } else {
      setMessage('✅ Wallet added!');
      setNewAddress('');
      setNewLabel('');
      getWallets().then(setWallets);
    }
    setSaving(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">⚙️ Settings</h1>
        <p className="text-zinc-500 text-sm">Manage your account, wallets and preferences</p>
      </div>

      {message && (
        <div className="glass p-3 text-sm text-center">{message}</div>
      )}

      {/* Account */}
      <div className="glass p-5">
        <h2 className="font-semibold mb-4">👤 Account</h2>
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
            <span className="text-zinc-500 text-sm">Email</span>
            <span className="text-sm font-mono">{user?.email || '...'}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
            <span className="text-zinc-500 text-sm">User ID</span>
            <span className="text-[11px] font-mono text-zinc-600">{user?.id || '...'}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
            <span className="text-zinc-500 text-sm">Created</span>
            <span className="text-sm text-zinc-400">{user?.created_at ? new Date(user.created_at).toLocaleDateString() : '...'}</span>
          </div>
        </div>
      </div>

      {/* Wallets */}
      <div className="glass p-5">
        <h2 className="font-semibold mb-4">💰 Wallets</h2>
        <div className="space-y-3 mb-4">
          {wallets.map((w) => (
            <div key={w.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 glass-sm p-3">
              <div>
                <p className="text-sm font-medium">{w.label}</p>
                <p className="text-xs font-mono text-zinc-500 break-all">{w.address}</p>
              </div>
              <span className={`text-[11px] px-2 py-0.5 rounded-full ${
                w.address === WALLET_ADDRESS ? 'badge-active' : 'badge-ended'
              }`}>
                {w.address === WALLET_ADDRESS ? 'Main' : 'Secondary'}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-white/5 pt-4 space-y-3">
          <p className="text-xs text-zinc-600">Add a new wallet to track</p>
          <input
            type="text"
            placeholder="0x..."
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500/50 font-mono"
          />
          <input
            type="text"
            placeholder="Label (optional)"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500/50"
          />
          <button
            onClick={addWallet}
            disabled={saving || !newAddress}
            className="w-full bg-purple-500 hover:bg-purple-600 disabled:opacity-30 text-white py-2.5 rounded-xl text-sm font-medium transition-all"
          >
            {saving ? 'Adding...' : 'Add Wallet'}
          </button>
        </div>
      </div>

      {/* Data */}
      <div className="glass p-5">
        <h2 className="font-semibold mb-4">🗄️ Database</h2>
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
            <span className="text-zinc-500 text-sm">Supabase Project</span>
            <span className="text-sm font-mono text-zinc-400">airdrop-farming</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
            <span className="text-zinc-500 text-sm">Region</span>
            <span className="text-sm text-zinc-400">EU West</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
            <span className="text-zinc-500 text-sm">Tables</span>
            <span className="text-sm text-zinc-400">wallets, airdrops, farming_tasks</span>
          </div>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full glass p-4 text-red-400 hover:bg-red-500/10 rounded-2xl text-sm font-medium transition-all"
      >
        🚪 Sign Out
      </button>
    </div>
  );
}
