// ZeroOnePay API Integration via Edge Function (proxy to avoid CORS)
// Fallback URL removido — PIX é gerado inline via edge function
export const CHECKOUT_URL = '';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

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

export interface ZeroOnePayResult {
  success: boolean;
  checkoutUrl: string;
  orderId?: string;
  error?: string;
  pixQrCode?: string;       // código copia-e-cola (EMV)
  pixQrCodeImage?: string;  // imagem base64 ou URL do QR code
  pixAmount?: number;       // valor em reais
}

export const createZeroOnePayOrder = async (
  payload: WbuyOrderPayload
): Promise<ZeroOnePayResult> => {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/create-pix`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({
        customer: payload.customer,
        items: payload.items,
        totalPrice: payload.totalPrice,
      }),
    });

    const data = await response.json();
    console.log('Edge Function response:', data);

    if (data.success !== false) {
      return {
        success: true,
        checkoutUrl: data.checkoutUrl || CHECKOUT_URL,
        orderId: data.orderId,
        pixQrCode: data.pixQrCode,
        pixQrCodeImage: data.pixQrCodeImage,
        pixAmount: payload.totalPrice,
        usedGateway: data.usedGateway,
      } as ZeroOnePayResult & { usedGateway?: string };
    }

    console.warn('PIX generation failed:', data);
    return {
      success: true,
      checkoutUrl: CHECKOUT_URL,
      pixAmount: payload.totalPrice,
    };
  } catch (err) {
    console.error('Error calling create-pix edge function:', err);
    return { success: true, checkoutUrl: CHECKOUT_URL, pixAmount: payload.totalPrice };
  }
};

// Alias para compatibilidade com código existente
export const createWbuyOrder = createZeroOnePayOrder;
