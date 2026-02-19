import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import AdminKPIs from '@/components/admin/AdminKPIs';
import AdminChart from '@/components/admin/AdminChart';
import AdminFunnel from '@/components/admin/AdminFunnel';
import AdminIntegrations from '@/components/admin/AdminIntegrations';
import AdminTopBar from '@/components/admin/AdminTopBar';
import { Toaster } from 'sonner';

export type Period = 'today' | '7days' | '30days';
export type GatewaySetting = {
  id: string;
  gateway_name: string;
  api_token: string;
  product_id: string;
  offer_hash: string;
  is_active: boolean;
};

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'integrations'>('dashboard');
  const [period, setPeriod] = useState<Period>('today');
  const [gateways, setGateways] = useState<GatewaySetting[]>([]);
  const [liveVisitors] = useState(Math.floor(Math.random() * 40) + 8);

  const fetchGateways = useCallback(async () => {
    const { data } = await supabase.from('gateway_settings').select('*').order('gateway_name');
    if (data) setGateways(data as GatewaySetting[]);
  }, []);

  useEffect(() => {
    fetchGateways();
  }, [fetchGateways]);

  const activeGateway = gateways.find(g => g.is_active);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-['Inter',sans-serif]">
      <Toaster position="top-right" theme="dark" />

      {/* Sidebar */}
      <div className="flex h-screen overflow-hidden">
        <aside className="w-56 bg-[#0d0d15] border-r border-white/5 flex flex-col flex-shrink-0">
          <div className="px-5 py-6 border-b border-white/5">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 bg-gradient-to-br from-[#f39b19] to-[#e07b00] rounded flex items-center justify-center">
                <span className="text-xs font-black text-white">A</span>
              </div>
              <span className="font-black text-sm tracking-widest uppercase text-white">Admin</span>
            </div>
            <p className="text-[10px] text-white/30 font-mono">Painel de Controle</p>
          </div>

          <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-[#f39b19]/10 text-[#f39b19] border border-[#f39b19]/20'
                  : 'text-white/40 hover:text-white/70 hover:bg-white/5'
              }`}
            >
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('integrations')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'integrations'
                  ? 'bg-[#f39b19]/10 text-[#f39b19] border border-[#f39b19]/20'
                  : 'text-white/40 hover:text-white/70 hover:bg-white/5'
              }`}
            >
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/>
              </svg>
              Integrações
            </button>
          </nav>

          {/* Gateway ativo no sidebar */}
          <div className="px-3 py-4 border-t border-white/5">
            <p className="text-[9px] text-white/20 uppercase tracking-widest mb-2 px-1">Gateway Ativo</p>
            {activeGateway ? (
              <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse flex-shrink-0" />
                <span className="text-emerald-400 text-xs font-bold truncate">{activeGateway.gateway_name}</span>
              </div>
            ) : (
              <div className="px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg">
                <span className="text-red-400 text-xs">Nenhum ativo</span>
              </div>
            )}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <AdminTopBar
            period={period}
            setPeriod={setPeriod}
            liveVisitors={liveVisitors}
            activeGateway={activeGateway}
          />

          <div className="p-6">
            {activeTab === 'dashboard' && (
              <div className="flex flex-col gap-6">
                <AdminKPIs period={period} />
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  <div className="xl:col-span-2">
                    <AdminChart period={period} />
                  </div>
                  <div>
                    <AdminFunnel period={period} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'integrations' && (
              <AdminIntegrations gateways={gateways} onRefresh={fetchGateways} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Admin;
