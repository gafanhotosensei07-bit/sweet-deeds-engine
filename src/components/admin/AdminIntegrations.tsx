import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { GatewaySetting } from '@/pages/Admin';
import { toast } from 'sonner';
import { Loader2, Check, Settings2, Zap } from 'lucide-react';

interface Props {
  gateways: GatewaySetting[];
  onRefresh: () => void;
}

const gatewayColors: Record<string, string> = {
  ZeroOnePay: '#f39b19',
  GoatPay: '#10b981',
  SigmaPay: '#8b5cf6',
};

const gatewayLogos: Record<string, string> = {
  ZeroOnePay: '0️⃣',
  GoatPay: '🐐',
  SigmaPay: 'Σ',
};

const AdminIntegrations: React.FC<Props> = ({ gateways, onRefresh }) => {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formState, setFormState] = useState<Record<string, Partial<GatewaySetting>>>({});

  const handleActivate = async (gateway: GatewaySetting) => {
    if (gateway.is_active) return;
    setLoadingId(gateway.id);
    try {
      // Desativar todos
      await supabase.from('gateway_settings').update({ is_active: false }).neq('id', 'none');
      // Ativar selecionado
      const { error } = await supabase
        .from('gateway_settings')
        .update({ is_active: true })
        .eq('id', gateway.id);
      if (error) throw error;
      toast.success(`${gateway.gateway_name} ativado com sucesso!`);
      onRefresh();
    } catch {
      toast.error('Erro ao ativar gateway');
    } finally {
      setLoadingId(null);
    }
  };

  const handleEdit = (gw: GatewaySetting) => {
    setEditingId(gw.id);
    setFormState(prev => ({
      ...prev,
      [gw.id]: { api_token: gw.api_token, product_id: gw.product_id, offer_hash: gw.offer_hash },
    }));
  };

  const handleSave = async (gw: GatewaySetting) => {
    setLoadingId(gw.id);
    try {
      const updates = formState[gw.id] || {};
      const { error } = await supabase
        .from('gateway_settings')
        .update({
          api_token: updates.api_token ?? gw.api_token,
          product_id: updates.product_id ?? gw.product_id,
          offer_hash: updates.offer_hash ?? gw.offer_hash,
        })
        .eq('id', gw.id);
      if (error) throw error;
      toast.success('Credenciais salvas!');
      setEditingId(null);
      onRefresh();
    } catch {
      toast.error('Erro ao salvar credenciais');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-lg font-black uppercase tracking-widest text-white mb-1">Integrações & Gateways</h2>
        <p className="text-white/30 text-sm">Gerencie credenciais e ative o gateway de pagamento. Apenas 1 ativo por vez.</p>
      </div>

      <div className="flex flex-col gap-4">
        {gateways.map(gw => {
          const color = gatewayColors[gw.gateway_name] || '#f39b19';
          const logo = gatewayLogos[gw.gateway_name] || '💳';
          const isEditing = editingId === gw.id;
          const form = formState[gw.id] || {};
          const isLoading = loadingId === gw.id;

          return (
            <div
              key={gw.id}
              className={`bg-[#0d0d15] border rounded-xl overflow-hidden transition-all ${
                gw.is_active ? 'border-[' + color + ']/30' : 'border-white/5'
              }`}
              style={gw.is_active ? { borderColor: `${color}40` } : {}}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-black"
                    style={{ background: `${color}15` }}
                  >
                    {logo}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-white text-sm">{gw.gateway_name}</span>
                      {gw.is_active && (
                        <span
                          className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full flex items-center gap-1"
                          style={{ background: `${color}20`, color }}
                        >
                          <span className="w-1 h-1 rounded-full animate-pulse" style={{ background: color }} />
                          ATIVO
                        </span>
                      )}
                    </div>
                    <p className="text-white/30 text-[10px] mt-0.5">
                      {gw.api_token ? '• Credenciais configuradas' : '• Sem credenciais'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => isEditing ? setEditingId(null) : handleEdit(gw)}
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                  >
                    <Settings2 size={13} className="text-white/40" />
                  </button>

                  <button
                    onClick={() => handleActivate(gw)}
                    disabled={gw.is_active || isLoading}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all disabled:cursor-not-allowed"
                    style={
                      gw.is_active
                        ? { background: `${color}20`, color, borderColor: `${color}30`, border: '1px solid' }
                        : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)' }
                    }
                  >
                    {isLoading ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : gw.is_active ? (
                      <><Check size={12} /> Ativo</>
                    ) : (
                      <><Zap size={12} /> Ativar</>
                    )}
                  </button>
                </div>
              </div>

              {/* Credentials Form */}
              {isEditing && (
                <div className="px-5 pb-5 border-t border-white/5 pt-4">
                  <div className="grid grid-cols-1 gap-3 mb-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1.5">API Token</label>
                      <input
                        type="text"
                        value={form.api_token ?? gw.api_token}
                        onChange={e => setFormState(p => ({ ...p, [gw.id]: { ...p[gw.id], api_token: e.target.value } }))}
                        placeholder="Seu API Token"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30 font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1.5">Product ID / Hash</label>
                        <input
                          type="text"
                          value={form.product_id ?? gw.product_id}
                          onChange={e => setFormState(p => ({ ...p, [gw.id]: { ...p[gw.id], product_id: e.target.value } }))}
                          placeholder="product_id"
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1.5">Offer Hash</label>
                        <input
                          type="text"
                          value={form.offer_hash ?? gw.offer_hash}
                          onChange={e => setFormState(p => ({ ...p, [gw.id]: { ...p[gw.id], offer_hash: e.target.value } }))}
                          placeholder="offer_hash"
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30 font-mono"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingId(null)}
                      className="flex-1 py-2.5 text-xs font-black uppercase tracking-widest border border-white/10 text-white/40 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => handleSave(gw)}
                      disabled={isLoading}
                      className="flex-[2] py-2.5 text-xs font-black uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 transition-colors"
                      style={{ background: color, color: '#000' }}
                    >
                      {isLoading ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                      Salvar Credenciais
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-[#0d0d15] border border-amber-500/20 rounded-xl p-4">
        <div className="flex gap-3">
          <span className="text-amber-400 text-lg flex-shrink-0">⚠️</span>
          <div>
            <p className="text-amber-400 text-xs font-bold mb-1">Regra de Segurança</p>
            <p className="text-white/40 text-xs leading-relaxed">
              As credenciais são armazenadas de forma segura no banco de dados e nunca ficam expostas no código-fonte.
              A Edge Function busca o gateway ativo e as credenciais dinamicamente a cada transação.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminIntegrations;
