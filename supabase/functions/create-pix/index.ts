import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// Gera QR Code como base64 PNG via Google Chart API (funciona no Deno Edge)
async function generateQRCodeDataURL(text: string): Promise<string | null> {
  try {
    const encoded = encodeURIComponent(text);
    const url = `https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${encoded}&choe=UTF-8`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const buffer = await res.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
    return `data:image/png;base64,${base64}`;
  } catch {
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Buscar TODOS os gateways cadastrados (ativo primeiro, depois os demais como fallback)
    const { data: gateways, error: gwError } = await supabase
      .from('gateway_settings')
      .select('*')
      .order('is_active', { ascending: false }); // ativo primeiro

    if (gwError || !gateways || gateways.length === 0) {
      throw new Error('Nenhum gateway cadastrado encontrado');
    }

    const { customer, items, totalPrice } = await req.json();

    const cpfClean = customer.cpf.replace(/\D/g, '');
    const phoneClean = customer.phone.replace(/\D/g, '');
    const cepClean = customer.cep.replace(/\D/g, '');
    const amountInCents = Math.round(totalPrice * 100);

    const errors: string[] = [];

    // Tenta cada gateway em ordem (ativo primeiro, depois fallbacks)
    for (const gateway of gateways) {
      console.log(`Tentando gateway: ${gateway.gateway_name} (ativo: ${gateway.is_active})`);

      try {
        let result;

        if (gateway.gateway_name === 'ZeroOnePay') {
          result = await handleZeroOnePay({ gateway, customer, cpfClean, phoneClean, cepClean, items, amountInCents, totalPrice });
        } else if (gateway.gateway_name === 'GoatPay') {
          result = await handleGoatPay({ gateway, customer, cpfClean, phoneClean, cepClean, items, amountInCents, totalPrice });
        } else if (gateway.gateway_name === 'SigmaPay') {
          result = await handleSigmaPay({ gateway, customer, cpfClean, phoneClean, cepClean, items, amountInCents, totalPrice });
        } else {
          console.warn(`Gateway '${gateway.gateway_name}' não suportado, pulando...`);
          errors.push(`${gateway.gateway_name}: não suportado`);
          continue;
        }

        // Verifica se o resultado tem dados PIX válidos
        if (result && (result.pixQrCode || result.pixQrCodeImage || result.checkoutUrl)) {
          console.log(`✅ Gateway ${gateway.gateway_name} funcionou com sucesso!`);
          return new Response(JSON.stringify({ ...result, usedGateway: gateway.gateway_name }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const msg = `${gateway.gateway_name}: resposta sem dados PIX válidos`;
        console.warn(msg);
        errors.push(msg);

      } catch (gatewayErr) {
        const msg = `${gateway.gateway_name}: ${String(gatewayErr)}`;
        console.error(`❌ Falha no gateway ${gateway.gateway_name}:`, gatewayErr);
        errors.push(msg);
        // Continua para o próximo gateway
      }
    }

    // Todos os gateways falharam
    console.error('Todos os gateways falharam:', errors);
    return new Response(
      JSON.stringify({ success: false, error: 'Todos os gateways falharam', details: errors }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    console.error('Edge function error:', err);
    return new Response(
      JSON.stringify({ success: false, error: String(err) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function handleZeroOnePay({ gateway, customer, cpfClean, phoneClean, cepClean, items, amountInCents, totalPrice }: any) {
  const CHECKOUT_URL = gateway.offer_hash ? `https://go.zeroonepay.com.br/${gateway.offer_hash}` : '';

  const body = {
    api_token: gateway.api_token,
    product_hash: gateway.product_id,
    offer_hash: gateway.offer_hash,
    amount: amountInCents,
    payment_method: 'pix',
    customer: {
      name: customer.name,
      cpf: cpfClean,
      phone: phoneClean,
      email: `${cpfClean}@cliente.com`,
      address: {
        zip_code: cepClean,
        street: customer.address,
        number: customer.number,
        city: customer.city,
        state: customer.state,
      },
    },
    cart: items.map((item: any) => ({
      product_hash: gateway.product_id,
      title: `${item.name} - Tam. ${item.size}`,
      cover: null,
      price: Math.round(parseFloat(String(item.price).replace(',', '.')) * 100),
      quantity: item.quantity,
      operation_type: 1,
      tangible: true,
    })),
  };

  console.log('ZeroOnePay request amount:', amountInCents);

  const response = await fetch('https://api.zeroonepay.com.br/api/public/v1/transactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`ZeroOnePay HTTP ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  console.log('ZeroOnePay response status:', response.status);
  console.log('ZeroOnePay response data:', JSON.stringify(data));

  if (data.error || data.errors || data.status === 'error') {
    throw new Error(`ZeroOnePay API error: ${JSON.stringify(data.error || data.errors || data.message)}`);
  }

  const pixQrCode =
    data.pix?.pix_qr_code || data.pix?.qr_code || data.pix?.emv || data.pix?.copy_paste ||
    data.qr_code || data.emv ||
    data.transaction?.pix?.pix_qr_code || data.transaction?.pix?.qr_code ||
    undefined;

  let pixQrCodeImage =
    data.pix?.qr_code_base64 || data.pix?.qr_code_url || data.pix?.qr_code_image || data.pix?.base64 ||
    data.qr_code_url || data.qr_code_image ||
    undefined;

  if (!pixQrCodeImage && pixQrCode) {
    pixQrCodeImage = await generateQRCodeDataURL(pixQrCode) ?? undefined;
  }

  return {
    success: true,
    gateway: 'ZeroOnePay',
    checkoutUrl: data.checkout_url || data.pix?.url || CHECKOUT_URL,
    orderId: data.transaction_hash || data.id || data.hash || data.transaction?.hash,
    pixQrCode,
    pixQrCodeImage,
    pixAmount: data.amount ? data.amount / 100 : totalPrice,
  };
}

async function handleGoatPay({ gateway, customer, cpfClean, phoneClean, cepClean, items, amountInCents, totalPrice }: any) {
  const body = {
    amount: amountInCents,
    payment_method: 'pix',
    customer: {
      name: customer.name,
      cpf: cpfClean,
      phone: phoneClean,
      email: `${cpfClean}@cliente.com`,
      address: {
        zip_code: cepClean,
        street: customer.address,
        number: customer.number,
        city: customer.city,
        state: customer.state,
      },
    },
    items: items.map((item: any) => ({
      name: `${item.name} - Tam. ${item.size}`,
      quantity: item.quantity,
      unit_price: Math.round(parseFloat(String(item.price).replace(',', '.')) * 100),
    })),
    product_id: gateway.product_id,
  };

  const response = await fetch(`https://api.goatpayments.com.br/api/public/v1/transactions?api_token=${gateway.api_token}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`GoatPay HTTP ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  console.log('GoatPay response:', response.status, JSON.stringify(data));

  if (data.error || data.errors || data.status === 'error') {
    throw new Error(`GoatPay API error: ${JSON.stringify(data.error || data.errors || data.message)}`);
  }

  const pixQrCode = data.pix?.qr_code || data.pix?.emv || data.qr_code || undefined;
  let pixQrCodeImage = data.pix?.qr_code_image || data.pix?.base64 || data.qr_code_url || undefined;

  if (!pixQrCodeImage && pixQrCode) {
    pixQrCodeImage = await generateQRCodeDataURL(pixQrCode) ?? undefined;
  }

  return {
    success: true,
    gateway: 'GoatPay',
    checkoutUrl: data.checkout_url || '',
    orderId: data.id || data.transaction_id,
    pixQrCode,
    pixQrCodeImage,
    pixAmount: totalPrice,
  };
}

async function handleSigmaPay({ gateway, customer, cpfClean, phoneClean, cepClean, items, amountInCents, totalPrice }: any) {
  const body = {
    amount: amountInCents,
    offer_hash: gateway.offer_hash,
    payment_method: 'pix',
    customer: {
      name: customer.name,
      email: `${cpfClean}@cliente.com`,
      phone_number: phoneClean,
      document: cpfClean,
      street_name: customer.address,
      number: customer.number,
      complement: '',
      neighborhood: '',
      city: customer.city,
      state: customer.state,
      zip_code: cepClean,
    },
    cart: items.map((item: any) => ({
      product_hash: gateway.product_id,
      title: `${item.name} - Tam. ${item.size}`,
      cover: null,
      price: Math.round(parseFloat(String(item.price).replace(',', '.')) * 100),
      quantity: item.quantity,
      operation_type: 1,
      tangible: true,
    })),
    expire_in_days: 1,
    transaction_origin: 'api',
  };

  console.log('SigmaPay request amount (cents):', amountInCents);

  const response = await fetch(`https://api.sigmapay.com.br/api/public/v1/transactions?api_token=${gateway.api_token}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`SigmaPay HTTP ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  console.log('SigmaPay response status:', response.status);
  console.log('SigmaPay response data:', JSON.stringify(data));

  if (data.error || data.errors || data.status === 'error') {
    throw new Error(`SigmaPay API error: ${JSON.stringify(data.error || data.errors || data.message)}`);
  }

  const pixQrCode =
    data.pix?.pix_qr_code || data.pix?.qr_code || data.pix?.emv || data.pix?.copy_paste ||
    data.transaction?.pix?.pix_qr_code || data.qr_code || undefined;

  let pixQrCodeImage =
    data.pix?.qr_code_base64 || data.pix?.qr_code_image || data.pix?.base64 || data.pix?.qr_code_url ||
    data.transaction?.pix?.qr_code_base64 || data.qr_code_url || undefined;

  if (!pixQrCodeImage && pixQrCode) {
    pixQrCodeImage = await generateQRCodeDataURL(pixQrCode) ?? undefined;
  }

  const checkoutUrl = gateway.offer_hash
    ? `https://go.sigmapay.com.br/${gateway.offer_hash}`
    : data.checkout_url || '';

  return {
    success: true,
    gateway: 'SigmaPay',
    checkoutUrl: data.checkout_url || checkoutUrl,
    orderId: data.id || data.transaction_id || data.hash,
    pixQrCode,
    pixQrCodeImage,
    pixAmount: data.amount ? data.amount / 100 : totalPrice,
  };
}
