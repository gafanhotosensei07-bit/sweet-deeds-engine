import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

function generateTrackingCode(): string {
  const prefix = 'WE';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = prefix;
  for (let i = 0; i < 9; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code + 'BR';
}

async function checkGatewayStatus(gatewayName: string, apiToken: string, orderId: string): Promise<string> {
  let status = 'pending';

  try {
    if (gatewayName === 'ZeroOnePay') {
      const res = await fetch(`https://api.zeroonepay.com.br/api/public/v1/transactions/${orderId}`, {
        headers: { 'Authorization': `Bearer ${apiToken}`, 'Accept': 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        const txStatus = data.status || data.transaction?.status || '';
        if (['paid', 'approved', 'completed', 'confirmed'].includes(txStatus.toLowerCase())) {
          status = 'paid';
        }
      }
    } else if (gatewayName === 'GoatPay') {
      const res = await fetch(`https://api.goatpayments.com.br/api/public/v1/transactions/${orderId}?api_token=${apiToken}`, {
        headers: { 'Accept': 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        const txStatus = data.status || data.payment_status || '';
        if (['paid', 'approved', 'completed', 'confirmed'].includes(txStatus.toLowerCase())) {
          status = 'paid';
        }
      }
    } else if (gatewayName === 'SigmaPay') {
      const res = await fetch(`https://api.sigmapay.com.br/api/public/v1/transactions/${orderId}?api_token=${apiToken}`, {
        headers: { 'Accept': 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        const txStatus = data.status || data.transaction?.status || '';
        if (['paid', 'approved', 'completed', 'confirmed'].includes(txStatus.toLowerCase())) {
          status = 'paid';
        }
      }
    }
  } catch (err) {
    console.warn(`check-pix-status ${gatewayName} error:`, err);
  }

  return status;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId } = await req.json();
    if (!orderId) {
      return new Response(JSON.stringify({ error: 'orderId required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // First, check if the order has a stored used_gateway
    const { data: orderData } = await supabase
      .from('orders')
      .select('id, status, tracking_code, status_history, used_gateway')
      .eq('pix_order_id', orderId)
      .limit(1);

    const order = orderData?.[0];
    const usedGateway = order?.used_gateway;

    // Find the correct gateway to check
    let gateway = null;

    if (usedGateway) {
      // Use the specific gateway that generated this PIX
      const { data: gw } = await supabase
        .from('gateway_settings')
        .select('*')
        .eq('gateway_name', usedGateway)
        .limit(1);
      gateway = gw?.[0];
      console.log(`Using stored gateway: ${usedGateway}`);
    }

    if (!gateway) {
      // Fallback: try active gateway
      const { data: gw } = await supabase
        .from('gateway_settings')
        .select('*')
        .eq('is_active', true)
        .limit(1);
      gateway = gw?.[0];
      console.log(`Fallback to active gateway: ${gateway?.gateway_name}`);
    }

    if (!gateway) {
      return new Response(JSON.stringify({ status: 'unknown' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const status = await checkGatewayStatus(gateway.gateway_name, gateway.api_token, orderId);

    // If paid, update order with tracking code
    let trackingCode: string | null = null;
    let dbOrderId: string | null = null;

    if (status === 'paid' && order) {
      if (order.status !== 'paid' && order.status !== 'delivered') {
        trackingCode = generateTrackingCode();
        const now = new Date().toISOString();
        const history = Array.isArray(order.status_history) ? order.status_history : [];
        history.push({ status: 'paid', label: 'Pagamento Aprovado', date: now });

        await supabase
          .from('orders')
          .update({
            status: 'paid',
            payment_status: 'paid',
            tracking_code: trackingCode,
            status_history: history,
          })
          .eq('id', order.id);

        dbOrderId = order.id;
      } else {
        trackingCode = order.tracking_code;
        dbOrderId = order.id;
      }
    }

    return new Response(JSON.stringify({ status, orderId, trackingCode, dbOrderId }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('check-pix-status error:', err);
    return new Response(JSON.stringify({ status: 'error', error: String(err) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
