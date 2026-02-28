import { mockGas } from '@/data/mock';

export default function GasPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">⛽ Gas Tracker</h1>
        <p className="text-zinc-500 text-sm">Real-time gas prices across chains</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockGas.map((g) => (
          <div key={g.chain} className="glass p-5 flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{g.chain}</h3>
              <p className="text-xs text-zinc-500">Current gas price</p>
            </div>
            <div className="text-right">
              <p className={`text-2xl font-mono font-bold ${
                g.status === 'low' ? 'text-green-400' : g.status === 'medium' ? 'text-yellow-400' : 'text-red-400'
              }`}>{g.gas_price_gwei}</p>
              <p className="text-[11px] text-zinc-600">gwei · {g.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
