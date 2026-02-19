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
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Buscar gateway ativo do banco
    const { data: gateway, error: gwError } = await supabase
      .from('gateway_settings')
      .select('*')
      .eq('is_active', true)
      .single();

    if (gwError || !gateway) {
      throw new Error('Nenhum gateway ativo encontrado');
    }

    const { customer, items, totalPrice } = await req.json();

    const cpfClean = customer.cpf.replace(/\D/g, '');
    const phoneClean = customer.phone.replace(/\D/g, '');
    const cepClean = customer.cep.replace(/\D/g, '');
    const amountInCents = Math.round(totalPrice * 100);

    let result;

    if (gateway.gateway_name === 'ZeroOnePay') {
      result = await handleZeroOnePay({ gateway, customer, cpfClean, phoneClean, cepClean, items, amountInCents, totalPrice });
    } else if (gateway.gateway_name === 'GoatPay') {
      result = await handleGoatPay({ gateway, customer, cpfClean, phoneClean, cepClean, items, amountInCents, totalPrice });
    } else if (gateway.gateway_name === 'SigmaPay') {
      result = await handleSigmaPay({ gateway, customer, cpfClean, phoneClean, cepClean, items, amountInCents, totalPrice });
    } else {
      throw new Error(`Gateway '${gateway.gateway_name}' não suportado`);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

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

  const data = await response.json();
  console.log('ZeroOnePay response status:', response.status);
  console.log('ZeroOnePay response data:', JSON.stringify(data));

  const pixQrCode =
    data.pix?.qr_code || data.pix?.emv || data.pix?.copy_paste || data.pix?.code ||
    data.qr_code || data.emv || data.code ||
    data.transaction?.pix?.qr_code || data.transaction?.pix?.emv || data.transaction?.qr_code ||
    undefined;

  const pixQrCodeImage =
    data.pix?.qr_code_url || data.pix?.qr_code_image || data.pix?.base64 || data.pix?.image ||
    data.qr_code_url || data.qr_code_image ||
    data.transaction?.pix?.qr_code_url || data.transaction?.pix?.base64 ||
    undefined;

  return {
    success: true,
    gateway: 'ZeroOnePay',
    checkoutUrl: data.checkout_url || data.pix?.url || CHECKOUT_URL,
    orderId: data.transaction_hash || data.id || data.hash || data.transaction?.hash,
    pixQrCode,
    pixQrCodeImage,
    pixAmount: totalPrice,
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

  const data = await response.json();
  console.log('GoatPay response:', response.status, JSON.stringify(data));

  const pixQrCode = data.pix?.qr_code || data.pix?.emv || data.qr_code || undefined;
  const pixQrCodeImage = data.pix?.qr_code_image || data.pix?.base64 || data.qr_code_url || undefined;

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
  // Estrutura exata conforme documentação SigmaPay
  const body = {
    amount: amountInCents, // valor em centavos: R$ 20,00 = 2000
    offer_hash: gateway.offer_hash,
    payment_method: 'pix',
    customer: {
      name: customer.name,
      email: `${cpfClean}@cliente.com`,
      phone_number: phoneClean,
      document: cpfClean, // CPF sem formatação
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

  const data = await response.json();
  console.log('SigmaPay response status:', response.status);
  console.log('SigmaPay response data:', JSON.stringify(data));

  // Extrair dados PIX da resposta SigmaPay
  // Campos corretos: pix.pix_qr_code (EMV) e pix.qr_code_base64 (imagem)
  const pixQrCode =
    data.pix?.pix_qr_code || data.pix?.qr_code || data.pix?.emv || data.pix?.copy_paste ||
    data.transaction?.pix?.pix_qr_code || data.qr_code || undefined;

  const pixQrCodeImage =
    data.pix?.qr_code_base64 || data.pix?.qr_code_image || data.pix?.base64 || data.pix?.qr_code_url ||
    data.transaction?.pix?.qr_code_base64 || data.qr_code_url || undefined;

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
    pixAmount: totalPrice,
  };
}
