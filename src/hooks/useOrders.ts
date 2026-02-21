import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  status: string;
  payment_status: string;
  total: number;
  subtotal: number;
  discount: number;
  items: Array<{
    name: string;
    image: string;
    size: string;
    quantity: number;
    price: string;
  }>;
  tracking_code: string | null;
  created_at: string;
  estimated_delivery: string | null;
  status_history: Array<{
    status: string;
    label: string;
    date: string;
  }>;
}

const SESSION_KEY = 'we_session_id';
const ORDERS_KEY = 'we_order_ids';

function getSessionId(): string {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function getStoredOrderIds(): string[] {
  try {
    return JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
  } catch {
    return [];
  }
}

function addStoredOrderId(id: string) {
  const ids = getStoredOrderIds();
  if (!ids.includes(id)) {
    ids.unshift(id);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(ids.slice(0, 50)));
  }
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = useCallback(async () => {
    const ids = getStoredOrderIds();
    if (ids.length === 0) {
      setOrders([]);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .in('id', ids)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setOrders(data.map(d => ({
          ...d,
          items: (d.items as any) || [],
          status_history: (d.status_history as any) || [],
        })) as Order[]);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const createOrder = useCallback(async (orderData: {
    customer: { name: string; cpf: string; phone: string; cep: string; address: string; number: string; city: string; state: string };
    items: Array<{ name: string; image: string; size: string; quantity: number; price: string }>;
    total: number;
    subtotal: number;
    discount: number;
    pixOrderId?: string;
    usedGateway?: string;
  }): Promise<Order | null> => {
    const sessionId = getSessionId();
    const now = new Date().toISOString();
    const estimatedDelivery = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const statusHistory = [
      { status: 'confirmed', label: 'Pedido Confirmado', date: now },
    ];

    const { data, error } = await supabase
      .from('orders')
      .insert({
        customer_name: orderData.customer.name,
        customer_cpf: orderData.customer.cpf,
        customer_phone: orderData.customer.phone,
        shipping_address: `${orderData.customer.address}, ${orderData.customer.number}`,
        shipping_city: orderData.customer.city,
        shipping_state: orderData.customer.state,
        shipping_cep: orderData.customer.cep,
        status: 'confirmed',
        payment_status: 'pending',
        subtotal: orderData.subtotal,
        discount: orderData.discount,
        total: orderData.total,
        items: orderData.items as any,
        session_id: sessionId,
        pix_order_id: orderData.pixOrderId || null,
        used_gateway: orderData.usedGateway || null,
        status_history: statusHistory as any,
        estimated_delivery: estimatedDelivery,
      })
      .select()
      .single();

    if (!error && data) {
      const order: Order = {
        ...data,
        items: (data.items as any) || [],
        status_history: (data.status_history as any) || [],
      };
      addStoredOrderId(data.id);
      setOrders(prev => [order, ...prev]);
      return order;
    }
    return null;
  }, []);

  return { orders, loading, fetchOrders, createOrder };
}

export const ORDER_STATUSES = [
  { key: 'confirmed', label: 'Pedido Confirmado', icon: '✓', description: 'Seu pedido foi recebido e confirmado' },
  { key: 'paid', label: 'Pagamento Aprovado', icon: '💰', description: 'Pagamento via PIX confirmado' },
  { key: 'packaging', label: 'Em Embalagem', icon: '📦', description: 'Seu pedido está sendo preparado' },
  { key: 'shipped', label: 'Enviado', icon: '🚚', description: 'Pedido saiu para entrega' },
  { key: 'in_transit', label: 'Em Trânsito', icon: '🛣️', description: 'A caminho do seu endereço' },
  { key: 'delivered', label: 'Entregue', icon: '🏠', description: 'Pedido entregue com sucesso!' },
];
