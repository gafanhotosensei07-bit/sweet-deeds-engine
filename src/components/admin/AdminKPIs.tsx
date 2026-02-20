import React, { useEffect, useState } from 'react';
import { Period } from '@/pages/Admin';
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, QrCode, CheckCircle, Activity, Target } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Props {
  period: Period;
}

interface KPIData {
  volume: string;
  volumeChange: number;
  totalSales: number;
  salesChange: number;
  ticket: string;
  ticketChange: number;
  conversion: string;
  conversionChange: number;
  pixGenerated: number;
  pixGeneratedChange: number;
  pixPaid: number;
  pixPaidChange: number;
}

function periodToRange(period: Period): { from: Date; prevFrom: Date } {
  const now = new Date();
  const from = new Date(now);
  const prevFrom = new Date(now);
  if (period === 'today') {
    from.setHours(0, 0, 0, 0);
    prevFrom.setDate(prevFrom.getDate() - 1);
    prevFrom.setHours(0, 0, 0, 0);
  } else if (period === '7days') {
    from.setDate(from.getDate() - 7);
    prevFrom.setDate(prevFrom.getDate() - 14);
  } else {
    from.setDate(from.getDate() - 30);
    prevFrom.setDate(prevFrom.getDate() - 60);
  }
  return { from, prevFrom };
}

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

async function fetchKPIs(period: Period): Promise<KPIData> {
  const { from, prevFrom } = periodToRange(period);
  const now = new Date();
  const prevTo = new Date(from);

  const [curPix, prevPix, curCheckout, prevCheckout, curViews, prevViews] = await Promise.all([
    supabase.from('analytics_events').select('amount').eq('event_type', 'pix_paid').gte('created_at', from.toISOString()).lte('created_at', now.toISOString()),
    supabase.from('analytics_events').select('amount').eq('event_type', 'pix_paid').gte('created_at', prevFrom.toISOString()).lt('created_at', prevTo.toISOString()),
    supabase.from('analytics_events').select('id').eq('event_type', 'checkout_started').gte('created_at', from.toISOString()),
    supabase.from('analytics_events').select('id').eq('event_type', 'checkout_started').gte('created_at', prevFrom.toISOString()).lt('created_at', prevTo.toISOString()),
    supabase.from('analytics_events').select('id').eq('event_type', 'page_view').gte('created_at', from.toISOString()),
    supabase.from('analytics_events').select('id').eq('event_type', 'page_view').gte('created_at', prevFrom.toISOString()).lt('created_at', prevTo.toISOString()),
  ]);

  const pixPaidCur = curPix.data ?? [];
  const pixPaidPrev = prevPix.data ?? [];
  const pixGenCur = (await supabase.from('analytics_events').select('id').eq('event_type', 'pix_generated').gte('created_at', from.toISOString())).data ?? [];
  const pixGenPrev = (await supabase.from('analytics_events').select('id').eq('event_type', 'pix_generated').gte('created_at', prevFrom.toISOString()).lt('created_at', prevTo.toISOString())).data ?? [];

  const volume = pixPaidCur.reduce((s: number, r: any) => s + (r.amount ?? 0), 0);
  const prevVolume = pixPaidPrev.reduce((s: number, r: any) => s + (r.amount ?? 0), 0);

  const totalSales = pixPaidCur.length;
  const prevTotalSales = pixPaidPrev.length;

  const ticket = totalSales > 0 ? volume / totalSales : 0;
  const prevTicket = prevTotalSales > 0 ? prevVolume / prevTotalSales : 0;

  const views = curViews.data?.length ?? 0;
  const checkouts = curCheckout.data?.length ?? 0;
  const prevCheckouts = prevCheckout.data?.length ?? 0;
  const conversion = views > 0 ? (totalSales / views) * 100 : 0;
  const prevViews2 = prevViews.data?.length ?? 0;
  const prevConversion = prevViews2 > 0 ? (prevTotalSales / prevViews2) * 100 : 0;

  const pct = (cur: number, prev: number) => prev === 0 ? (cur > 0 ? 100 : 0) : Math.round(((cur - prev) / prev) * 100);

  return {
    volume: `R$ ${volume.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
    volumeChange: pct(volume, prevVolume),
    totalSales,
    salesChange: pct(totalSales, prevTotalSales),
    ticket: `R$ ${ticket.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
    ticketChange: pct(ticket, prevTicket),
    conversion: `${conversion.toFixed(1)}%`,
    conversionChange: parseFloat((conversion - prevConversion).toFixed(1)),
    pixGenerated: pixGenCur.length,
    pixGeneratedChange: pct(pixGenCur.length, pixGenPrev.length),
    pixPaid: totalSales,
    pixPaidChange: pct(totalSales, prevTotalSales),
  };
}

const AdminKPIs: React.FC<Props> = ({ period }) => {
  const [data, setData] = useState<KPIData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchKPIs(period).then(d => { setData(d); setLoading(false); });
  }, [period]);

  if (loading || !data) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-[#0d0d15] border border-white/5 rounded-xl p-5 animate-pulse">
            <div className="w-9 h-9 bg-white/5 rounded-lg mb-4" />
            <div className="h-2 bg-white/5 rounded w-2/3 mb-2" />
            <div className="h-5 bg-white/5 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
      <KPICard title="Volume de Vendas" value={data.volume} change={data.volumeChange} icon={<DollarSign size={16} />} accent="#f39b19" />
      <KPICard title="Total de Vendas" value={data.totalSales} change={data.salesChange} icon={<ShoppingBag size={16} />} accent="#8b5cf6" />
      <KPICard title="Ticket Médio" value={data.ticket} change={data.ticketChange} icon={<Activity size={16} />} accent="#06b6d4" />
      <KPICard title="Conversão PIX" value={data.conversion} change={data.conversionChange} icon={<Target size={16} />} accent="#10b981" />
      <KPICard title="PIX Gerados" value={data.pixGenerated} change={data.pixGeneratedChange} icon={<QrCode size={16} />} accent="#f59e0b" />
      <KPICard title="PIX Pagos" value={data.pixPaid} change={data.pixPaidChange} icon={<CheckCircle size={16} />} accent="#10b981" />
    </div>
  );
};

export default AdminKPIs;
