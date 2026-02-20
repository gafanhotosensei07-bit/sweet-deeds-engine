import { supabase } from '@/integrations/supabase/client';

// Gera ou recupera session_id persistente na sessão do navegador
function getSessionId(): string {
  let sid = sessionStorage.getItem('we_session_id');
  if (!sid) {
    sid = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem('we_session_id', sid);
  }
  return sid;
}

type EventType = 'page_view' | 'checkout_started' | 'pix_generated' | 'pix_paid';

interface TrackOptions {
  productName?: string;
  productPrice?: number;
  orderId?: string;
  amount?: number;
  metadata?: Record<string, unknown>;
}

export async function trackEvent(eventType: EventType, options: TrackOptions = {}) {
  try {
    await supabase.from('analytics_events').insert([{
      event_type: eventType,
      session_id: getSessionId(),
      product_name: options.productName ?? null,
      product_price: options.productPrice ?? null,
      order_id: options.orderId ?? null,
      amount: options.amount ?? null,
      metadata: options.metadata ?? {},
    }] as any);
  } catch (err) {
    // Nunca falha silenciosamente para não impactar o fluxo do usuário
    console.warn('[analytics] track error:', err);
  }
}
