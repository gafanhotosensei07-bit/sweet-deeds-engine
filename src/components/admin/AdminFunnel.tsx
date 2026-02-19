import React from 'react';
import { Period } from '@/pages/Admin';

interface Props {
  period: Period;
}

const funnelData = {
  today: [
    { label: 'Visitantes', value: 342, icon: '👥' },
    { label: 'Checkout Iniciado', value: 89, icon: '🛒' },
    { label: 'PIX Gerado', value: 67, icon: '📱' },
    { label: 'PIX Pago', value: 23, icon: '✅' },
  ],
  '7days': [
    { label: 'Visitantes', value: 2184, icon: '👥' },
    { label: 'Checkout Iniciado', value: 598, icon: '🛒' },
    { label: 'PIX Gerado', value: 460, icon: '📱' },
    { label: 'PIX Pago', value: 151, icon: '✅' },
  ],
  '30days': [
    { label: 'Visitantes', value: 9240, icon: '👥' },
    { label: 'Checkout Iniciado', value: 2560, icon: '🛒' },
    { label: 'PIX Gerado', value: 1950, icon: '📱' },
    { label: 'PIX Pago', value: 614, icon: '✅' },
  ],
};

const AdminFunnel: React.FC<Props> = ({ period }) => {
  const steps = funnelData[period];
  const top = steps[0].value;

  return (
    <div className="bg-[#0d0d15] border border-white/5 rounded-xl p-5 h-full">
      <div className="mb-6">
        <h3 className="text-sm font-black uppercase tracking-widest text-white/80">Funil de Vendas</h3>
        <p className="text-[10px] text-white/30 mt-0.5">Conversão por etapa</p>
      </div>

      <div className="flex flex-col gap-3">
        {steps.map((step, i) => {
          const pct = Math.round((step.value / top) * 100);
          const prevPct = i > 0 ? Math.round((step.value / steps[i - 1].value) * 100) : 100;
          const barColors = ['#f39b19', '#8b5cf6', '#06b6d4', '#10b981'];

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
                  <span className="text-white/10 text-xs">↓ {100 - Math.round((steps[i + 1].value / step.value) * 100)}% saída</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Conversão total */}
      <div className="mt-5 pt-4 border-t border-white/5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-white/30 uppercase tracking-widest">Conversão Total</span>
          <span className="text-emerald-400 font-black text-sm">
            {((steps[3].value / steps[0].value) * 100).toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminFunnel;
