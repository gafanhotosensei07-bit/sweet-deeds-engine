import React from 'react';
import { Period } from '@/pages/Admin';
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, QrCode, CheckCircle, Activity, Target } from 'lucide-react';

interface Props {
  period: Period;
}

const mockData = {
  today: {
    volume: 'R$ 4.782,00', volumeChange: +18.4,
    totalSales: 23, salesChange: +12,
    ticket: 'R$ 207,90', ticketChange: +5.8,
    conversion: '34,2%', conversionChange: +2.1,
    pixGenerated: 67, pixGeneratedChange: +8,
    pixPaid: 23, pixPaidChange: +12,
  },
  '7days': {
    volume: 'R$ 31.450,00', volumeChange: +22.1,
    totalSales: 151, salesChange: +18,
    ticket: 'R$ 208,28', ticketChange: +3.2,
    conversion: '32,8%', conversionChange: +1.4,
    pixGenerated: 460, pixGeneratedChange: +15,
    pixPaid: 151, pixPaidChange: +18,
  },
  '30days': {
    volume: 'R$ 127.890,00', volumeChange: +31.5,
    totalSales: 614, salesChange: +24,
    ticket: 'R$ 208,29', ticketChange: +7.1,
    conversion: '31,5%', conversionChange: +3.2,
    pixGenerated: 1950, pixGeneratedChange: +20,
    pixPaid: 614, pixPaidChange: +24,
  },
};

const KPICard: React.FC<{
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  accent?: string;
}> = ({ title, value, change, icon, accent = '#f39b19' }) => {
  const isPositive = change >= 0;
  return (
    <div className="bg-[#0d0d15] border border-white/5 rounded-xl p-5 hover:border-white/10 transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${accent}15` }}>
          <span style={{ color: accent }}>{icon}</span>
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
          isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
        }`}>
          {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {isPositive ? '+' : ''}{change}%
        </div>
      </div>
      <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1 font-semibold">{title}</p>
      <p className="text-white text-xl font-black">{value}</p>
    </div>
  );
};

const AdminKPIs: React.FC<Props> = ({ period }) => {
  const d = mockData[period];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
      <KPICard title="Volume de Vendas" value={d.volume} change={d.volumeChange} icon={<DollarSign size={16} />} accent="#f39b19" />
      <KPICard title="Total de Vendas" value={d.totalSales} change={d.salesChange} icon={<ShoppingBag size={16} />} accent="#8b5cf6" />
      <KPICard title="Ticket Médio" value={d.ticket} change={d.ticketChange} icon={<Activity size={16} />} accent="#06b6d4" />
      <KPICard title="Conversão PIX" value={d.conversion} change={d.conversionChange} icon={<Target size={16} />} accent="#10b981" />
      <KPICard title="PIX Gerados" value={d.pixGenerated} change={d.pixGeneratedChange} icon={<QrCode size={16} />} accent="#f59e0b" />
      <KPICard title="PIX Pagos" value={d.pixPaid} change={d.pixPaidChange} icon={<CheckCircle size={16} />} accent="#10b981" />
    </div>
  );
};

export default AdminKPIs;
