import React from 'react';
import { Period, GatewaySetting } from '@/pages/Admin';

interface Props {
  period: Period;
  setPeriod: (p: Period) => void;
  liveVisitors: number;
  activeGateway?: GatewaySetting;
}

const periods: { value: Period; label: string }[] = [
  { value: 'today', label: 'Hoje' },
  { value: '7days', label: '7 dias' },
  { value: '30days', label: '30 dias' },
];

const AdminTopBar: React.FC<Props> = ({ period, setPeriod, liveVisitors, activeGateway }) => {
  return (
    <div className="h-14 border-b border-white/5 bg-[#0d0d15]/80 backdrop-blur flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <h1 className="text-sm font-black uppercase tracking-widest text-white/80">Visão Geral</h1>
        {/* Period Filter */}
        <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
          {periods.map(p => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                period === p.value
                  ? 'bg-[#f39b19] text-black'
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Live visitors */}
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-emerald-400 text-xs font-bold">{liveVisitors} ao vivo</span>
        </div>

        {/* Saldo */}
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="text-[#f39b19]">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
          </svg>
          <span className="text-white/40 text-xs">Saldo:</span>
          <span className="text-white text-xs font-bold">R$ 0,00</span>
        </div>

        {/* Gateway Badge */}
        {activeGateway && (
          <div className="flex items-center gap-2 bg-[#f39b19]/10 border border-[#f39b19]/20 px-3 py-1.5 rounded-lg">
            <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-[#f39b19]">
              <path d="M1 6l5 5 5-5 5 5 5-5"/>
            </svg>
            <span className="text-[#f39b19] text-xs font-bold">{activeGateway.gateway_name}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTopBar;
