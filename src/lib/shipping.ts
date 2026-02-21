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
const SHIPPING_TABLE: Record<string, { express: number; sedex: number; days_express: string; days_sedex: string; days_free: string }> = {
  // Sudeste
  SP: { express: 24.90, sedex: 17.90, days_express: '1-2 dias', days_sedex: '2-4 dias', days_free: '5-8 dias' },
  RJ: { express: 26.90, sedex: 19.90, days_express: '1-3 dias', days_sedex: '3-5 dias', days_free: '6-10 dias' },
  MG: { express: 27.90, sedex: 20.90, days_express: '2-3 dias', days_sedex: '3-5 dias', days_free: '7-12 dias' },
  ES: { express: 27.90, sedex: 20.90, days_express: '2-3 dias', days_sedex: '3-5 dias', days_free: '7-12 dias' },
  // Sul
  PR: { express: 28.90, sedex: 21.90, days_express: '2-3 dias', days_sedex: '3-5 dias', days_free: '8-13 dias' },
  SC: { express: 28.90, sedex: 21.90, days_express: '2-4 dias', days_sedex: '4-6 dias', days_free: '8-14 dias' },
  RS: { express: 29.90, sedex: 23.90, days_express: '2-4 dias', days_sedex: '4-6 dias', days_free: '9-15 dias' },
  // Centro-Oeste
  GO: { express: 29.90, sedex: 23.90, days_express: '2-4 dias', days_sedex: '4-6 dias', days_free: '9-15 dias' },
  DF: { express: 29.90, sedex: 23.90, days_express: '2-4 dias', days_sedex: '4-6 dias', days_free: '9-15 dias' },
  MT: { express: 29.90, sedex: 25.90, days_express: '3-5 dias', days_sedex: '5-8 dias', days_free: '10-18 dias' },
  MS: { express: 29.90, sedex: 25.90, days_express: '3-5 dias', days_sedex: '5-8 dias', days_free: '10-18 dias' },
  // Nordeste
  BA: { express: 29.90, sedex: 24.90, days_express: '3-5 dias', days_sedex: '5-8 dias', days_free: '10-18 dias' },
  SE: { express: 29.90, sedex: 25.90, days_express: '3-5 dias', days_sedex: '5-8 dias', days_free: '12-20 dias' },
  AL: { express: 29.90, sedex: 26.90, days_express: '3-5 dias', days_sedex: '5-8 dias', days_free: '12-20 dias' },
  PE: { express: 29.90, sedex: 26.90, days_express: '3-5 dias', days_sedex: '5-8 dias', days_free: '12-20 dias' },
  PB: { express: 29.90, sedex: 26.90, days_express: '4-6 dias', days_sedex: '6-9 dias', days_free: '13-22 dias' },
  RN: { express: 29.90, sedex: 26.90, days_express: '4-6 dias', days_sedex: '6-9 dias', days_free: '13-22 dias' },
  CE: { express: 29.90, sedex: 26.90, days_express: '4-6 dias', days_sedex: '6-9 dias', days_free: '13-22 dias' },
  PI: { express: 29.90, sedex: 27.90, days_express: '4-7 dias', days_sedex: '6-10 dias', days_free: '15-25 dias' },
  MA: { express: 29.90, sedex: 27.90, days_express: '4-7 dias', days_sedex: '6-10 dias', days_free: '15-25 dias' },
  // Norte
  TO: { express: 29.90, sedex: 27.90, days_express: '4-7 dias', days_sedex: '6-10 dias', days_free: '15-25 dias' },
  PA: { express: 29.90, sedex: 28.90, days_express: '5-8 dias', days_sedex: '7-12 dias', days_free: '18-28 dias' },
  AP: { express: 29.90, sedex: 28.90, days_express: '5-9 dias', days_sedex: '8-14 dias', days_free: '20-30 dias' },
  AM: { express: 29.90, sedex: 28.90, days_express: '5-9 dias', days_sedex: '8-14 dias', days_free: '20-30 dias' },
  RR: { express: 29.90, sedex: 28.90, days_express: '6-10 dias', days_sedex: '10-15 dias', days_free: '22-35 dias' },
  RO: { express: 29.90, sedex: 28.90, days_express: '5-9 dias', days_sedex: '8-14 dias', days_free: '20-30 dias' },
  AC: { express: 29.90, sedex: 28.90, days_express: '6-10 dias', days_sedex: '10-15 dias', days_free: '22-35 dias' },
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
  const regionData = SHIPPING_TABLE[uf.toUpperCase()] || {
    express: 25.90,
    sedex: 29.90,
    days_express: '7-12 dias',
    days_sedex: '10-18 dias',
    days_free: '20-30 dias',
  };

  const options: ShippingOption[] = [];

  // Frete Grátis (acima de R$100)
  if (cartTotal >= FREE_SHIPPING_THRESHOLD) {
    options.push({
      id: 'free',
      name: 'Frete Grátis',
      price: 0,
      days: regionData.days_free,
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
