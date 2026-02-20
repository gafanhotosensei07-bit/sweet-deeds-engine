import React, { useEffect, useState } from 'react';
import { Period } from '@/pages/Admin';
import { supabase } from '@/integrations/supabase/client';

interface Props {
  period: Period;
}

interface FunnelStep {
  label: string;
  value: number;
  icon: string;
}

function periodToFrom(period: Period): Date {
  const from = new Date();
  if (period === 'today') {
    from.setHours(0, 0, 0, 0);
  } else if (period === '7days') {
    from.setDate(from.getDate() - 7);
  } else {
    from.setDate(from.getDate() - 30);
  }
  return from;
}

async function fetchFunnel(period: Period): Promise<FunnelStep[]> {
  const from = periodToFrom(period).toISOString();

  const [views, checkouts, pixGen, pixPaid] = await Promise.all([
    supabase.from('analytics_events').select('id', { count: 'exact', head: true }).eq('event_type', 'page_view').gte('created_at', from),
    supabase.from('analytics_events').select('id', { count: 'exact', head: true }).eq('event_type', 'checkout_started').gte('created_at', from),
    supabase.from('analytics_events').select('id', { count: 'exact', head: true }).eq('event_type', 'pix_generated').gte('created_at', from),
    supabase.from('analytics_events').select('id', { count: 'exact', head: true }).eq('event_type', 'pix_paid').gte('created_at', from),
  ]);

  return [
    { label: 'Visitantes', value: views.count ?? 0, icon: '👥' },
    { label: 'Checkout Iniciado', value: checkouts.count ?? 0, icon: '🛒' },
    { label: 'PIX Gerado', value: pixGen.count ?? 0, icon: '📱' },
    { label: 'PIX Pago', value: pixPaid.count ?? 0, icon: '✅' },
  ];
}

const AdminFunnel: React.FC<Props> = ({ period }) => {
  const [steps, setSteps] = useState<FunnelStep[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchFunnel(period).then(s => { setSteps(s); setLoading(false); });
  }, [period]);

  if (loading || steps.length === 0) {
    return (
      <div className="bg-[#0d0d15] border border-white/5 rounded-xl p-5 h-full animate-pulse">
        <div className="h-4 bg-white/5 rounded w-1/2 mb-6" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="mb-4">
            <div className="h-2 bg-white/5 rounded w-full mb-2" />
            <div className="h-1.5 bg-white/5 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  const top = Math.max(steps[0].value, 1);
  const barColors = ['#f39b19', '#8b5cf6', '#06b6d4', '#10b981'];

  return (
    <div className="bg-[#0d0d15] border border-white/5 rounded-xl p-5 h-full">
      <div className="mb-6">
        <h3 className="text-sm font-black uppercase tracking-widest text-white/80">Funil de Vendas</h3>
        <p className="text-[10px] text-white/30 mt-0.5">Conversão por etapa · dados reais</p>
      </div>

      <div className="flex flex-col gap-3">
        {steps.map((step, i) => {
          const pct = Math.round((step.value / top) * 100);
          const prevPct = i > 0 ? Math.round((step.value / Math.max(steps[i - 1].value, 1)) * 100) : 100;

          return (
            <div key={step.label}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{step.icon}</span>
                  <span className="text-xs text-white/60 font-medium">{step.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-white">{step.value.toLocaleString('pt-BR')}</span>
                  {i > 0 && (
                    <span className="text-[9px] px-1.5 py-0.5 bg-white/5 text-white/30 rounded-full font-mono">
                      {prevPct}%
                    </span>
                  )}
                </div>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, background: barColors[i] }}
                />
              </div>
              {i < steps.length - 1 && (
                <div className="flex justify-center my-1">
                  <span className="text-white/10 text-xs">
                    ↓ {100 - Math.round((steps[i + 1].value / Math.max(step.value, 1)) * 100)}% saída
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-5 pt-4 border-t border-white/5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-white/30 uppercase tracking-widest">Conversão Total</span>
          <span className="text-emerald-400 font-black text-sm">
            {((steps[3].value / Math.max(steps[0].value, 1)) * 100).toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminFunnel;
