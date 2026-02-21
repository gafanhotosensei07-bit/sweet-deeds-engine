import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Order, ORDER_STATUSES } from '@/hooks/useOrders';
import { Package, Truck, Shield, Copy, CheckCheck, ArrowLeft, MapPin } from 'lucide-react';

const statusIndex = (status: string) => ORDER_STATUSES.findIndex(s => s.key === status);

const OrderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchOrder = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        setOrder({
          ...data,
          items: (data.items as any) || [],
          status_history: (data.status_history as any) || [],
        } as Order);
      }
      setLoading(false);
    };
    fetchOrder();
  }, [id]);

  const handleCopyTracking = () => {
    if (order?.tracking_code) {
      navigator.clipboard.writeText(order.tracking_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-['Maven_Pro',sans-serif]">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#f39b19] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs uppercase tracking-widest text-gray-400">Carregando pedido...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-['Maven_Pro',sans-serif]">
        <div className="text-center">
          <Package size={48} className="text-gray-300 mx-auto mb-4" />
          <h1 className="font-black text-xl uppercase mb-2">Pedido não encontrado</h1>
          <p className="text-gray-500 text-sm mb-6">Verifique o link e tente novamente.</p>
          <button onClick={() => navigate('/')} className="bg-black text-white px-6 py-3 font-black text-xs uppercase tracking-widest hover:bg-[#f39b19] transition-colors">
            Voltar à Loja
          </button>
        </div>
      </div>
    );
  }

  const currentIdx = statusIndex(order.status);
  const isPaid = order.payment_status === 'paid' || order.status === 'paid' || currentIdx >= 1;

  return (
    <div className="min-h-screen bg-gray-50 font-['Maven_Pro',sans-serif]">
      {/* Header */}
      <div className="bg-black text-white">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-xs uppercase tracking-widest hover:text-[#f39b19] transition-colors">
            <ArrowLeft size={16} /> Voltar
          </button>
          <span className="font-black text-sm uppercase tracking-widest">Meu Pedido</span>
          <div className="w-20" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">

        {/* Success Banner */}
        {isPaid && (
          <div className="bg-green-600 text-white p-5 text-center">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCheck size={28} />
            </div>
            <h1 className="font-black text-lg uppercase tracking-widest mb-1">Pagamento Confirmado!</h1>
            <p className="text-green-100 text-xs">Seu pedido foi aprovado e está sendo processado</p>
          </div>
        )}

        {/* Order Info */}
        <div className="bg-white border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest">Número do Pedido</p>
              <p className="font-black text-lg">{order.order_number}</p>
            </div>
            <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 ${
              isPaid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
            }`}>
              {isPaid ? '✓ Pago' : '⏳ Aguardando'}
            </span>
          </div>
          <div className="text-xs text-gray-500">
            <p>Realizado em {new Date(order.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
          </div>
        </div>

        {/* Tracking Code */}
        {order.tracking_code && (
          <div className="bg-blue-50 border border-blue-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Truck size={16} className="text-blue-600" />
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-700">Código de Rastreio</span>
            </div>
            <div className="flex items-center justify-between bg-white border border-blue-200 p-3">
              <p className="font-mono font-bold text-blue-900 text-lg tracking-wider">{order.tracking_code}</p>
              <button
                onClick={handleCopyTracking}
                className={`flex items-center gap-1 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest transition-colors ${
                  copied ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {copied ? <><CheckCheck size={12} /> Copiado</> : <><Copy size={12} /> Copiar</>}
              </button>
            </div>
          </div>
        )}

        {/* Items */}
        <div className="bg-white border border-gray-200 p-5">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">Produtos do Pedido</p>
          <div className="space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover bg-gray-50" />
                <div className="flex-1">
                  <p className="font-black text-xs uppercase leading-tight">{item.name}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Tamanho: {item.size} · Quantidade: {item.quantity}</p>
                  <p className="font-bold text-sm mt-1">R$ {item.price}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="border-t border-gray-200 mt-4 pt-4 space-y-1">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Subtotal</span>
              <span>R$ {Number(order.subtotal).toFixed(2).replace('.', ',')}</span>
            </div>
            <div className="flex justify-between text-xs text-green-600">
              <span>Desconto PIX (10%)</span>
              <span>-R$ {Number(order.discount).toFixed(2).replace('.', ',')}</span>
            </div>
            <div className="flex justify-between font-black text-lg pt-2 border-t border-gray-100">
              <span>Total</span>
              <span className="text-green-700">R$ {Number(order.total).toFixed(2).replace('.', ',')}</span>
            </div>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="bg-white border border-gray-200 p-5">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">Status do Pedido</p>
          <div className="relative pl-6">
            {ORDER_STATUSES.map((step, i) => {
              const isCompleted = i <= currentIdx;
              const isCurrent = i === currentIdx;
              const historyEntry = order.status_history.find(h => h.status === step.key);

              return (
                <div key={step.key} className="relative pb-6 last:pb-0">
                  {i < ORDER_STATUSES.length - 1 && (
                    <div className={`absolute left-[-15px] top-5 w-0.5 h-full ${
                      i < currentIdx ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                  <div className={`absolute left-[-20px] top-0.5 w-[11px] h-[11px] rounded-full border-2 ${
                    isCurrent ? 'bg-[#f39b19] border-[#f39b19] ring-4 ring-[#f39b19]/20' :
                    isCompleted ? 'bg-green-500 border-green-500' :
                    'bg-white border-gray-300'
                  }`} />
                  <div>
                    <p className={`text-[11px] font-black uppercase tracking-wider leading-none ${
                      isCompleted ? 'text-gray-800' : 'text-gray-300'
                    }`}>
                      {step.icon} {step.label}
                    </p>
                    {isCompleted && (
                      <p className="text-[10px] text-gray-400 mt-0.5">{step.description}</p>
                    )}
                    {historyEntry && (
                      <p className="text-[9px] text-gray-300 mt-0.5">
                        {new Date(historyEntry.date).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Delivery Info */}
        {order.estimated_delivery && order.status !== 'delivered' && (
          <div className="bg-[#f39b19]/10 border border-[#f39b19]/30 p-4 text-center">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Previsão de Entrega</p>
            <p className="font-black text-lg">{new Date(order.estimated_delivery + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
          </div>
        )}

        {/* Trust Bar */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: <Shield size={16} />, text: 'Compra Segura' },
            { icon: <Truck size={16} />, text: 'Entrega Garantida' },
            { icon: <Package size={16} />, text: 'Qualidade Premium' },
          ].map((item, i) => (
            <div key={i} className="bg-white border border-gray-200 p-3 flex flex-col items-center text-center">
              <div className="text-[#f39b19] mb-1">{item.icon}</div>
              <span className="text-[9px] font-black uppercase tracking-widest text-gray-600">{item.text}</span>
            </div>
          ))}
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="w-full bg-black text-white py-4 font-black text-xs uppercase tracking-widest hover:bg-[#f39b19] transition-colors"
        >
          Continuar Comprando
        </button>
      </div>
    </div>
  );
};

export default OrderPage;
