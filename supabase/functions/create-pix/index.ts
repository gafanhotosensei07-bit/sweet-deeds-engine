import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const ZEROONEPAY_API_BASE = 'https://api.zeroonepay.com.br/api/public/v1';
const ZEROONEPAY_API_TOKEN = '6aLIlUuOKq0SnOpNYV2y93vKF9SqNVixsdz3arjQ7GqhhhNrmHUnBrZQh0kK';
const PRODUCT_HASH = 'dv4dkj9lcg';
const OFFER_HASH = 'rxcfh4s38y';
const CHECKOUT_URL = `https://go.zeroonepay.com.br/${OFFER_HASH}`;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { customer, items, totalPrice } = await req.json();

    const cpfClean = customer.cpf.replace(/\D/g, '');
    const phoneClean = customer.phone.replace(/\D/g, '');
    const cepClean = customer.cep.replace(/\D/g, '');
    const amountInCents = Math.round(totalPrice * 100);

    const body = {
      api_token: ZEROONEPAY_API_TOKEN,
      product_hash: PRODUCT_HASH,
      offer_hash: OFFER_HASH,
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
      cart: items.map((item: { name: string; quantity: number; price: string; size: string }) => ({
        name: `${item.name} - Tam. ${item.size}`,
        quantity: item.quantity,
        price: Math.round(parseFloat(String(item.price).replace(',', '.')) * 100),
      })),
    };

    console.log('Calling ZeroOnePay API with amount:', amountInCents);

    const response = await fetch(`${ZEROONEPAY_API_BASE}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log('ZeroOnePay response status:', response.status);
    console.log('ZeroOnePay response data:', JSON.stringify(data));

    // Extrair dados PIX de diferentes formatos possíveis da resposta
    const pixQrCode =
      data.pix?.qr_code ||
      data.pix?.emv ||
      data.pix?.copy_paste ||
      data.pix?.code ||
      data.qr_code ||
      data.emv ||
      data.code ||
      data.transaction?.pix?.qr_code ||
      data.transaction?.pix?.emv ||
      data.transaction?.qr_code ||
      undefined;

    const pixQrCodeImage =
      data.pix?.qr_code_url ||
      data.pix?.qr_code_image ||
      data.pix?.base64 ||
      data.pix?.image ||
      data.qr_code_url ||
      data.qr_code_image ||
      data.transaction?.pix?.qr_code_url ||
      data.transaction?.pix?.base64 ||
      undefined;

    const result = {
      success: true,
      checkoutUrl: data.checkout_url || data.pix?.url || CHECKOUT_URL,
      orderId: data.transaction_hash || data.id || data.hash || data.transaction?.hash,
      pixQrCode,
      pixQrCodeImage,
      pixAmount: totalPrice,
      raw: data, // para debug
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('Edge function error:', err);
    return new Response(
      JSON.stringify({ success: false, error: String(err), checkoutUrl: CHECKOUT_URL }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
