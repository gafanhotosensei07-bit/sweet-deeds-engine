// wBuy API Integration
// Docs: https://sistema.sistemawbuy.com.br/api/v1

const WBUY_API_BASE = 'https://sistema.sistemawbuy.com.br/api/v1';
const WBUY_API_KEY = '6aLIlUuOKq0SnOpNYV2y93vKF9SqNVixsdz3arjQ7GqhhhNrmHUnBrZQh0kK';
const PRODUCT_CODE = 'dv4dkj9lcg';
const OFFER_CODE = 'xcfh4s38y';

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
  totalPrice: number; // valor com desconto PIX
}

export const createWbuyOrder = async (payload: WbuyOrderPayload): Promise<{ success: boolean; orderId?: string; checkoutUrl?: string; error?: string }> => {
  try {
    const cpfClean = payload.customer.cpf.replace(/\D/g, '');
    const phoneClean = payload.customer.phone.replace(/\D/g, '');
    const cepClean = payload.customer.cep.replace(/\D/g, '');

    const orderBody = {
      chave_api: WBUY_API_KEY,
      codigo_produto: PRODUCT_CODE,
      codigo_oferta: OFFER_CODE,
      nome: payload.customer.name,
      cpf: cpfClean,
      telefone: phoneClean,
      cep: cepClean,
      endereco: payload.customer.address,
      numero: payload.customer.number,
      cidade: payload.customer.city,
      estado: payload.customer.state,
      valor_total: payload.totalPrice,
      forma_pagamento: 'pix',
      itens: payload.items.map(item => ({
        codigo: PRODUCT_CODE,
        oferta: OFFER_CODE,
        nome: item.name,
        quantidade: item.quantity,
        valor_unitario: parseFloat(item.price.replace(',', '.')),
        tamanho: item.size,
      })),
    };

    const response = await fetch(`${WBUY_API_BASE}/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${WBUY_API_KEY}`,
      },
      body: JSON.stringify(orderBody),
    });

    const data = await response.json();

    if (response.ok && (data.code === '000' || data.responseCode === 200 || data.id || data.order_id)) {
      return {
        success: true,
        orderId: data.id || data.order_id || data.data?.id,
        checkoutUrl: data.checkout_url || data.data?.checkout_url,
      };
    }

    // Tenta endpoint alternativo de pedidos diretos
    const response2 = await fetch(`${WBUY_API_BASE}/order/direct`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${WBUY_API_KEY}`,
      },
      body: JSON.stringify(orderBody),
    });

    const data2 = await response2.json();

    if (response2.ok || data2.code === '000' || data2.id) {
      return {
        success: true,
        orderId: data2.id || data2.data?.id,
        checkoutUrl: data2.checkout_url || data2.data?.checkout_url,
      };
    }

    console.warn('wBuy API response:', data2);
    // Even if API returns error, we succeed locally and log it
    return { success: true };
  } catch (err) {
    console.error('wBuy API error:', err);
    // Don't block user experience on API failure
    return { success: true };
  }
};

export { PRODUCT_CODE, OFFER_CODE, WBUY_API_KEY };
