// Shipping calculation using ViaCEP API + region-based pricing

export interface ShippingOption {
  id: string;
  name: string;
  price: number;
  days: string;
  carrier: string;
}

interface ViaCEPResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

// Tabela de frete por região (preços entre R$15 e R$30)
const SHIPPING_TABLE: Record<string, { express: number; sedex: number; days_express: string; days_sedex: string }> = {
  // Sudeste
  SP: { express: 15.90, sedex: 19.90, days_express: '2-4 dias', days_sedex: '1-2 dias' },
  RJ: { express: 17.90, sedex: 22.90, days_express: '3-5 dias', days_sedex: '2-3 dias' },
  MG: { express: 18.90, sedex: 23.90, days_express: '3-5 dias', days_sedex: '2-3 dias' },
  ES: { express: 18.90, sedex: 23.90, days_express: '3-5 dias', days_sedex: '2-3 dias' },
  // Sul
  PR: { express: 19.90, sedex: 24.90, days_express: '3-5 dias', days_sedex: '2-3 dias' },
  SC: { express: 19.90, sedex: 24.90, days_express: '4-6 dias', days_sedex: '2-4 dias' },
  RS: { express: 21.90, sedex: 26.90, days_express: '4-6 dias', days_sedex: '3-4 dias' },
  // Centro-Oeste
  GO: { express: 21.90, sedex: 26.90, days_express: '4-6 dias', days_sedex: '3-4 dias' },
  DF: { express: 21.90, sedex: 26.90, days_express: '4-6 dias', days_sedex: '3-4 dias' },
  MT: { express: 23.90, sedex: 28.90, days_express: '5-8 dias', days_sedex: '3-5 dias' },
  MS: { express: 23.90, sedex: 28.90, days_express: '5-8 dias', days_sedex: '3-5 dias' },
  // Nordeste
  BA: { express: 22.90, sedex: 27.90, days_express: '5-8 dias', days_sedex: '3-5 dias' },
  SE: { express: 23.90, sedex: 28.90, days_express: '5-8 dias', days_sedex: '3-5 dias' },
  AL: { express: 24.90, sedex: 29.90, days_express: '5-8 dias', days_sedex: '4-6 dias' },
  PE: { express: 24.90, sedex: 29.90, days_express: '5-8 dias', days_sedex: '4-6 dias' },
  PB: { express: 24.90, sedex: 29.90, days_express: '6-9 dias', days_sedex: '4-6 dias' },
  RN: { express: 24.90, sedex: 29.90, days_express: '6-9 dias', days_sedex: '4-6 dias' },
  CE: { express: 24.90, sedex: 29.90, days_express: '6-9 dias', days_sedex: '4-6 dias' },
  PI: { express: 25.90, sedex: 29.90, days_express: '6-10 dias', days_sedex: '4-7 dias' },
  MA: { express: 25.90, sedex: 29.90, days_express: '6-10 dias', days_sedex: '4-7 dias' },
  // Norte
  TO: { express: 25.90, sedex: 29.90, days_express: '6-10 dias', days_sedex: '4-7 dias' },
  PA: { express: 26.90, sedex: 29.90, days_express: '7-12 dias', days_sedex: '5-8 dias' },
  AP: { express: 27.90, sedex: 29.90, days_express: '8-14 dias', days_sedex: '6-9 dias' },
  AM: { express: 27.90, sedex: 29.90, days_express: '8-14 dias', days_sedex: '6-9 dias' },
  RR: { express: 28.90, sedex: 29.90, days_express: '10-15 dias', days_sedex: '7-10 dias' },
  RO: { express: 27.90, sedex: 29.90, days_express: '8-14 dias', days_sedex: '6-9 dias' },
  AC: { express: 28.90, sedex: 29.90, days_express: '10-15 dias', days_sedex: '7-10 dias' },
};

const FREE_SHIPPING_THRESHOLD = 100;

export async function fetchAddressByCEP(cep: string): Promise<ViaCEPResponse | null> {
  const cleanCep = cep.replace(/\D/g, '');
  if (cleanCep.length !== 8) return null;
  
  try {
    const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    if (!res.ok) return null;
    const data: ViaCEPResponse = await res.json();
    if (data.erro) return null;
    return data;
  } catch {
    return null;
  }
}

export function calculateShipping(uf: string, cartTotal: number): ShippingOption[] {
  const regionData = SHIPPING_TABLE[uf.toUpperCase()];
  if (!regionData) {
    // Fallback genérico
    return [
      { id: 'free', name: 'Frete Grátis', price: 0, days: '10-20 dias', carrier: 'Econômico' },
      { id: 'express', name: 'Frete Expresso', price: 24.90, days: '5-8 dias', carrier: 'Loggi' },
      { id: 'sedex', name: 'Sedex', price: 29.90, days: '3-5 dias', carrier: 'Correios' },
    ];
  }

  const options: ShippingOption[] = [];

  // Frete Grátis (acima de R$100)
  if (cartTotal >= FREE_SHIPPING_THRESHOLD) {
    options.push({
      id: 'free',
      name: 'Frete Grátis',
      price: 0,
      days: regionData.days_express,
      carrier: 'Econômico',
    });
  }

  // Frete Expresso
  options.push({
    id: 'express',
    name: 'Frete Expresso',
    price: regionData.express,
    days: regionData.days_express,
    carrier: 'Loggi',
  });

  // Sedex
  options.push({
    id: 'sedex',
    name: 'Sedex',
    price: regionData.sedex,
    days: regionData.days_sedex,
    carrier: 'Correios',
  });

  return options;
}
