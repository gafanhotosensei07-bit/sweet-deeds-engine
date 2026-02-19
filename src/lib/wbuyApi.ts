// ZeroOnePay API Integration
// Docs: https://docs.zeroonepay.com.br
// Base URL: https://api.zeroonepay.com.br/api/public/v1

const ZEROONEPAY_API_BASE = 'https://api.zeroonepay.com.br/api/public/v1';
const ZEROONEPAY_API_TOKEN = '6aLIlUuOKq0SnOpNYV2y93vKF9SqNVixsdz3arjQ7GqhhhNrmHUnBrZQh0kK';
const PRODUCT_HASH = 'dv4dkj9lcg';
const OFFER_HASH = 'rxcfh4s38y';

// URL direta do checkout da oferta (descoberta via API)
export const CHECKOUT_URL = `https://go.zeroonepay.com.br/${OFFER_HASH}`;

export interface WbuyOrderItem {
  name: string;
  price: string; // ex: "129,90"
  size: string;
  quantity: number;
  image?: string;
}

export interface WbuyCustomerData {
  name: string;
  cpf: string;
  phone: string;
  cep: string;
  address: string;
  number: string;
  city: string;
  state: string;
}

export interface WbuyOrderPayload {
  customer: WbuyCustomerData;
  items: WbuyOrderItem[];
  totalPrice: number; // valor com desconto PIX (em reais)
}

export const createZeroOnePayOrder = async (
  payload: WbuyOrderPayload
): Promise<{ success: boolean; checkoutUrl: string; orderId?: string; error?: string }> => {
  try {
    const cpfClean = payload.customer.cpf.replace(/\D/g, '');
    const phoneClean = payload.customer.phone.replace(/\D/g, '');
    const cepClean = payload.customer.cep.replace(/\D/g, '');
    const amountInCents = Math.round(payload.totalPrice * 100);

    const body = {
      api_token: ZEROONEPAY_API_TOKEN,
      product_hash: PRODUCT_HASH,
      offer_hash: OFFER_HASH,
      amount: amountInCents,
      payment_method: 'pix',
      customer: {
        name: payload.customer.name,
        cpf: cpfClean,
        phone: phoneClean,
        email: `${cpfClean}@cliente.com`, // fallback pois não coletamos email
        address: {
          zip_code: cepClean,
          street: payload.customer.address,
          number: payload.customer.number,
          city: payload.customer.city,
          state: payload.customer.state,
        },
      },
      items: payload.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        unit_price: Math.round(parseFloat(item.price.replace(',', '.')) * 100),
        size: item.size,
      })),
    };

    const response = await fetch(`${ZEROONEPAY_API_BASE}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (response.ok && (data.success !== false)) {
      return {
        success: true,
        checkoutUrl: data.checkout_url || data.pix?.url || CHECKOUT_URL,
        orderId: data.transaction_hash || data.id || data.hash,
      };
    }

    console.warn('ZeroOnePay API response:', data);
    // Mesmo com erro de API, redireciona para o checkout da oferta
    return { success: true, checkoutUrl: CHECKOUT_URL };
  } catch (err) {
    console.error('ZeroOnePay API error:', err);
    // Fallback: redireciona para o checkout direto da oferta
    return { success: true, checkoutUrl: CHECKOUT_URL };
  }
};

// Alias para compatibilidade com código existente
export const createWbuyOrder = createZeroOnePayOrder;

export { PRODUCT_HASH, OFFER_HASH, ZEROONEPAY_API_TOKEN };
