import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Order, ORDER_STATUSES } from '@/hooks/useOrders';
import { Package, ChevronDown, ChevronUp } from 'lucide-react';
import { isTrackingExpired } from '@/lib/trackingEvents';

interface OrderTrackerProps {
  orders: Order[];
  loading: boolean;
}

const statusIndex = (status: string) => ORDER_STATUSES.findIndex(s => s.key === status);

const OrderCard: React.FC<{ order: Order }> = ({ order }) => {
  const [expanded, setExpanded] = React.useState(false);
  const currentIdx = statusIndex(order.status);
  const createdDate = new Date(order.created_at);

  return (
    <div className="border border-gray-200 bg-white mb-3 overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 bg-[#f39b19]/10 flex items-center justify-center flex-shrink-0">
            <Package size={18} className="text-[#f39b19]" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-black uppercase tracking-widest text-gray-800 truncate">
              {order.order_number}
            </p>
            <p className="text-[10px] text-gray-400">
              {createdDate.toLocaleDateString('pt-BR')} · {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 ${
            order.status === 'delivered' ? 'bg-green-100 text-green-700' :
            order.status === 'shipped' || order.status === 'in_transit' ? 'bg-blue-100 text-blue-700' :
            order.status === 'packaging' ? 'bg-yellow-100 text-yellow-700' :
            'bg-gray-100 text-gray-600'
          }`}>
            {ORDER_STATUSES[currentIdx]?.icon} {ORDER_STATUSES[currentIdx]?.label || order.status}
          </span>
          {expanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
        </div>
      </div>

      {/* Expanded */}
      {expanded && (
        <div className="border-t border-gray-100 px-4 py-4">
          {/* Items */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
            {order.items.map((item, i) => (
              <div key={i} className="flex-shrink-0 flex items-center gap-2 bg-gray-50 px-2 py-1.5 border border-gray-100">
                <img src={item.image} alt={item.name} className="w-10 h-10 object-cover" />
                <div>
                  <p className="text-[9px] font-black uppercase leading-tight line-clamp-1 max-w-[120px]">{item.name}</p>
                  <p className="text-[9px] text-gray-400">Tam. {item.size} · Qtd. {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div className="relative pl-6">
            {ORDER_STATUSES.map((step, i) => {
              const isCompleted = i <= currentIdx;
              const isCurrent = i === currentIdx;
              const historyEntry = order.status_history.find(h => h.status === step.key);

              return (
                <div key={step.key} className="relative pb-5 last:pb-0">
                  {/* Line */}
                  {i < ORDER_STATUSES.length - 1 && (
                    <div className={`absolute left-[-15px] top-5 w-0.5 h-full ${
                      i < currentIdx ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                  {/* Dot */}
                  <div className={`absolute left-[-20px] top-0.5 w-[11px] h-[11px] rounded-full border-2 ${
                    isCurrent ? 'bg-[#f39b19] border-[#f39b19] ring-4 ring-[#f39b19]/20' :
                    isCompleted ? 'bg-green-500 border-green-500' :
                    'bg-white border-gray-300'
                  }`} />
                  {/* Content */}
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

          {/* Tracking code */}
          {order.tracking_code && !isTrackingExpired(order.created_at) && (
            <div className="mt-4 bg-blue-50 border border-blue-200 p-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-700 mb-2">Rastreamento</p>
              <p className="text-sm font-mono font-bold text-blue-900 mb-2">{order.tracking_code}</p>
              <button
                onClick={() => window.location.href = `/pedido/${order.id}`}
                className="inline-flex items-center gap-1 text-[10px] bg-blue-600 text-white px-3 py-1.5 font-bold uppercase tracking-widest hover:bg-blue-700 transition-colors"
              >
                📦 Ver Rastreamento
              </button>
            </div>
          )}

          {/* Estimated delivery */}
          {order.estimated_delivery && order.status !== 'delivered' && (
            <div className="mt-3 text-center">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                Previsão de entrega: <strong className="text-gray-700">{new Date(order.estimated_delivery + 'T00:00:00').toLocaleDateString('pt-BR')}</strong>
              </p>
            </div>
          )}

          {/* Total */}
          <div className="mt-3 flex justify-between items-center border-t border-gray-100 pt-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Total Pago</span>
            <span className="font-black text-green-700">R$ {Number(order.total).toFixed(2).replace('.', ',')}</span>
          </div>
        </div>
      )}
    </div>
  );
};

const OrderTracker: React.FC<OrderTrackerProps> = ({ orders, loading }) => {
  if (loading) {
    return (
      <div className="py-8 text-center">
        <div className="w-8 h-8 border-2 border-[#f39b19] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-[10px] uppercase tracking-widest text-gray-400">Carregando pedidos...</p>
      </div>
    );
  }

  if (orders.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Package size={16} className="text-[#f39b19]" />
        <h3 className="text-xs font-black uppercase tracking-widest">Meus Pedidos ({orders.length})</h3>
      </div>
      {orders.map(order => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
};

export default OrderTracker;
