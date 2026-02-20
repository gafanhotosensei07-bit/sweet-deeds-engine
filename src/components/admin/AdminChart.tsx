import React, { useEffect, useState } from 'react';
import { Period } from '@/pages/Admin';
import {
  Area, AreaChart, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { supabase } from '@/integrations/supabase/client';

interface Props {
  period: Period;
}

interface ChartPoint {
  label: string;
  vendas: number;
  valor: number;
}

function buildBuckets(period: Period): { label: string; from: Date; to: Date }[] {
  const now = new Date();
  const buckets: { label: string; from: Date; to: Date }[] = [];

  if (period === 'today') {
    for (let h = 0; h < 24; h += 2) {
      const from = new Date(now);
      from.setHours(h, 0, 0, 0);
      const to = new Date(from);
      to.setHours(h + 2, 0, 0, 0);
      buckets.push({ label: `${String(h).padStart(2, '0')}h`, from, to });
    }
  } else if (period === '7days') {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    for (let d = 6; d >= 0; d--) {
      const from = new Date(now);
      from.setDate(from.getDate() - d);
      from.setHours(0, 0, 0, 0);
      const to = new Date(from);
      to.setDate(to.getDate() + 1);
      buckets.push({ label: days[from.getDay()], from, to });
    }
  } else {
    for (let d = 29; d >= 0; d--) {
      const from = new Date(now);
      from.setDate(from.getDate() - d);
      from.setHours(0, 0, 0, 0);
      const to = new Date(from);
      to.setDate(to.getDate() + 1);
      buckets.push({ label: `${from.getDate()}`, from, to });
    }
  }
  return buckets;
}

async function fetchChartData(period: Period): Promise<ChartPoint[]> {
  const buckets = buildBuckets(period);
  const earliest = buckets[0].from.toISOString();

  const { data: events } = await supabase
    .from('analytics_events')
    .select('event_type, amount, created_at')
    .in('event_type', ['pix_paid'])
    .gte('created_at', earliest);

  return buckets.map(b => {
    const inBucket = (events ?? []).filter((e: any) => {
      const t = new Date(e.created_at);
      return t >= b.from && t < b.to;
    });
    const vendas = inBucket.length;
    const valor = inBucket.reduce((s: number, e: any) => s + (e.amount ?? 0), 0);
    return { label: b.label, vendas, valor: Math.round(valor) };
  });
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a1a2e] border border-white/10 rounded-lg px-3 py-2 text-xs shadow-xl">
        <p className="text-white/50 mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }} className="font-bold">
            {p.name}: {p.name === 'valor' ? `R$ ${p.value.toLocaleString('pt-BR')}` : p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const AdminChart: React.FC<Props> = ({ period }) => {
  const [data, setData] = useState<ChartPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchChartData(period).then(d => { setData(d); setLoading(false); });
  }, [period]);

  return (
    <div className="bg-[#0d0d15] border border-white/5 rounded-xl p-5">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-white/80">Vendas & Volume</h3>
          <p className="text-[10px] text-white/30 mt-0.5">Dados reais de transações</p>
        </div>
        <div className="flex items-center gap-4 text-[10px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-[#f39b19] rounded-full" />
            <span className="text-white/40">Vendas</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-violet-500 rounded-full" />
            <span className="text-white/40">Volume (R$)</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="h-[220px] flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-[#f39b19] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f39b19" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#f39b19" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorValor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
            <XAxis dataKey="label" tick={{ fill: '#ffffff30', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#ffffff30', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="vendas" stroke="#f39b19" strokeWidth={2} fill="url(#colorVendas)" name="vendas" dot={false} />
            <Area type="monotone" dataKey="valor" stroke="#8b5cf6" strokeWidth={2} fill="url(#colorValor)" name="valor" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default AdminChart;
