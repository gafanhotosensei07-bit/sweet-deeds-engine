import React from 'react';
import { Period } from '@/pages/Admin';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Area, AreaChart,
} from 'recharts';

interface Props {
  period: Period;
}

const todayData = [
  { hora: '00h', vendas: 0, valor: 0 },
  { hora: '02h', vendas: 1, valor: 208 },
  { hora: '04h', vendas: 0, valor: 0 },
  { hora: '06h', vendas: 2, valor: 416 },
  { hora: '08h', vendas: 3, valor: 832 },
  { hora: '10h', vendas: 4, valor: 1040 },
  { hora: '12h', vendas: 5, valor: 1248 },
  { hora: '14h', vendas: 3, valor: 832 },
  { hora: '16h', vendas: 2, valor: 416 },
  { hora: '18h', vendas: 1, valor: 208 },
  { hora: '20h', vendas: 2, valor: 416 },
];

const weekData = [
  { dia: 'Seg', vendas: 18, valor: 3744 },
  { dia: 'Ter', vendas: 22, valor: 4576 },
  { dia: 'Qua', vendas: 15, valor: 3120 },
  { dia: 'Qui', vendas: 28, valor: 5824 },
  { dia: 'Sex', vendas: 34, valor: 7072 },
  { dia: 'Sáb', vendas: 19, valor: 3952 },
  { dia: 'Dom', vendas: 15, valor: 3120 },
];

const monthData = Array.from({ length: 30 }, (_, i) => ({
  dia: `${i + 1}`,
  vendas: Math.floor(Math.random() * 25) + 10,
  valor: Math.floor(Math.random() * 5000) + 2000,
}));

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
  const data = period === 'today' ? todayData : period === '7days' ? weekData : monthData;
  const xKey = period === 'today' ? 'hora' : period === '7days' ? 'dia' : 'dia';

  return (
    <div className="bg-[#0d0d15] border border-white/5 rounded-xl p-5">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-white/80">Vendas & Volume</h3>
          <p className="text-[10px] text-white/30 mt-0.5">Linha do tempo de transações</p>
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
          <XAxis dataKey={xKey} tick={{ fill: '#ffffff30', fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#ffffff30', fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="vendas" stroke="#f39b19" strokeWidth={2} fill="url(#colorVendas)" name="vendas" dot={false} />
          <Area type="monotone" dataKey="valor" stroke="#8b5cf6" strokeWidth={2} fill="url(#colorValor)" name="valor" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AdminChart;
