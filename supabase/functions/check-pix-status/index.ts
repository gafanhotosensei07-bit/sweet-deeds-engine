import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

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

    // Busca o gateway ativo para saber qual API consultar
    const { data: gateways } = await supabase
      .from('gateway_settings')
      .select('*')
      .eq('is_active', true)
      .limit(1);

    const gateway = gateways?.[0];
    if (!gateway) {
      return new Response(JSON.stringify({ status: 'unknown' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let status = 'pending';

    try {
      if (gateway.gateway_name === 'ZeroOnePay') {
        const res = await fetch(`https://api.zeroonepay.com.br/api/public/v1/transactions/${orderId}`, {
          headers: { 'Authorization': `Bearer ${gateway.api_token}`, 'Accept': 'application/json' },
        });
        if (res.ok) {
          const data = await res.json();
          const txStatus = data.status || data.transaction?.status || '';
          if (['paid', 'approved', 'completed', 'confirmed'].includes(txStatus.toLowerCase())) {
            status = 'paid';
          }
        }
      } else if (gateway.gateway_name === 'GoatPay') {
        const res = await fetch(`https://api.goatpayments.com.br/api/public/v1/transactions/${orderId}?api_token=${gateway.api_token}`, {
          headers: { 'Accept': 'application/json' },
        });
        if (res.ok) {
          const data = await res.json();
          const txStatus = data.status || data.payment_status || '';
          if (['paid', 'approved', 'completed', 'confirmed'].includes(txStatus.toLowerCase())) {
            status = 'paid';
          }
        }
      } else if (gateway.gateway_name === 'SigmaPay') {
        const res = await fetch(`https://api.sigmapay.com.br/api/public/v1/transactions/${orderId}?api_token=${gateway.api_token}`, {
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
      console.warn('check-pix-status gateway error:', err);
    }

    return new Response(JSON.stringify({ status, orderId }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('check-pix-status error:', err);
    return new Response(JSON.stringify({ status: 'error', error: String(err) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
