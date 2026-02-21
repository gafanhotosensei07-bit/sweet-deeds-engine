import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Order, ORDER_STATUSES } from '@/hooks/useOrders';
import { Package, Truck, Shield, Copy, CheckCheck, ArrowLeft, MapPin, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { generateTrackingEvents, isTrackingExpired } from '@/lib/trackingEvents';

const statusIndex = (status: string) => ORDER_STATUSES.findIndex(s => s.key === status);

const OrderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<(Order & { shipping_state?: string; shipping_city?: string }) | null>(null);
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

  const trackingEvents = useMemo(() => {
    return generateTrackingEvents(
      order.created_at,
      order.shipping_state || null,
      order.status,
      order.shipping_city || null
    );
  }, [order.created_at, order.shipping_state, order.status, order.shipping_city]);

  const expired = useMemo(() => isTrackingExpired(order.created_at), [order.created_at]);

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

        {/* Tracking Code - hidden after 7 days */}
        {order.tracking_code && !expired && (
          <div className="bg-blue-50 border border-blue-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Truck size={16} className="text-blue-600" />
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-700">Código de Rastreio</span>
            </div>
            <div className="bg-white border border-blue-200 p-3 flex items-center justify-between">
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

        {expired && (
          <div className="bg-green-50 border border-green-200 p-5 text-center">
            <CheckCircle size={24} className="text-green-600 mx-auto mb-2" />
            <p className="font-black text-sm uppercase tracking-widest text-green-700">Pedido Entregue</p>
            <p className="text-[10px] text-gray-500 mt-1">O rastreamento foi encerrado. Obrigado pela compra!</p>
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

        {/* Rastreamento Detalhado - hidden after 7 days */}
        {!expired && <div className="bg-white border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Rastreamento do Pedido</p>
            <span className="text-[9px] text-gray-400">{trackingEvents.length} atualizações</span>
          </div>

          <div className="relative pl-7">
            {trackingEvents.map((event, i) => {
              const isFirst = i === 0;
              const iconColor = event.type === 'success' ? 'text-green-600' : event.type === 'warning' ? 'text-yellow-600' : 'text-blue-500';
              const bgColor = event.type === 'success' ? 'bg-green-500 border-green-500' : event.type === 'warning' ? 'bg-yellow-500 border-yellow-500' : 'bg-blue-500 border-blue-500';
              const EventIcon = event.type === 'success' ? CheckCircle : event.type === 'warning' ? AlertTriangle : Info;

              return (
                <div key={i} className={`relative pb-5 last:pb-0 ${isFirst ? '' : ''}`}>
                  {/* Line */}
                  {i < trackingEvents.length - 1 && (
                    <div className="absolute left-[-18px] top-5 w-0.5 h-full bg-gray-200" />
                  )}
                  {/* Dot */}
                  <div className={`absolute left-[-22px] top-0.5 w-[13px] h-[13px] rounded-full border-2 ${
                    isFirst ? `${bgColor} ring-4 ring-opacity-20 ${event.type === 'success' ? 'ring-green-500' : event.type === 'warning' ? 'ring-yellow-500' : 'ring-blue-500'}` : 'bg-gray-300 border-gray-300'
                  }`} />
                  {/* Content */}
                  <div className={`${isFirst ? 'bg-gray-50 border border-gray-100 p-3 -mt-1' : ''}`}>
                    <div className="flex items-start gap-2">
                      <EventIcon size={14} className={`${iconColor} mt-0.5 flex-shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-[11px] font-black uppercase tracking-wider leading-tight ${
                          event.type === 'warning' ? 'text-yellow-700' : event.type === 'success' ? 'text-green-700' : 'text-gray-800'
                        }`}>
                          {event.status}
                        </p>
                        <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">{event.description}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[9px] text-gray-400 flex items-center gap-1">
                            <MapPin size={8} /> {event.location}
                          </span>
                          <span className="text-[9px] text-gray-300">
                            {new Date(event.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} às {event.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>}

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
