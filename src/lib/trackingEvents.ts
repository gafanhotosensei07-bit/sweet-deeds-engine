// Generates realistic tracking events based on order creation date and destination state
// Simulates a 7-day journey with delays, city transitions and sub-events like Shopee/ML

export interface TrackingEvent {
  date: string; // ISO date
  time: string; // HH:MM
  status: string;
  description: string;
  location: string;
  type: 'success' | 'info' | 'warning' | 'neutral';
}

// Centros de distribuição por região
const DISTRIBUTION_CENTERS: Record<string, string[]> = {
  SP: ['São Paulo - SP', 'Campinas - SP', 'Guarulhos - SP'],
  RJ: ['Rio de Janeiro - RJ', 'Niterói - RJ'],
  MG: ['Belo Horizonte - MG', 'Uberlândia - MG'],
  PR: ['Curitiba - PR', 'Londrina - PR'],
  SC: ['Florianópolis - SC', 'Joinville - SC'],
  RS: ['Porto Alegre - RS', 'Caxias do Sul - RS'],
  BA: ['Salvador - BA', 'Feira de Santana - BA'],
  PE: ['Recife - PE', 'Caruaru - PE'],
  CE: ['Fortaleza - CE'],
  GO: ['Goiânia - GO', 'Anápolis - GO'],
  DF: ['Brasília - DF'],
  PA: ['Belém - PA'],
  AM: ['Manaus - AM'],
  MA: ['São Luís - MA'],
  ES: ['Vitória - ES'],
  MT: ['Cuiabá - MT'],
  MS: ['Campo Grande - MS'],
  RN: ['Natal - RN'],
  PB: ['João Pessoa - PB'],
  AL: ['Maceió - AL'],
  SE: ['Aracaju - SE'],
  PI: ['Teresina - PI'],
  TO: ['Palmas - TO'],
  RO: ['Porto Velho - RO'],
  AC: ['Rio Branco - AC'],
  AP: ['Macapá - AP'],
  RR: ['Boa Vista - RR'],
};

function getCity(state: string): string {
  const cities = DISTRIBUTION_CENTERS[state] || [`Capital - ${state}`];
  return cities[0];
}

function getTransitCity(state: string): string {
  const cities = DISTRIBUTION_CENTERS[state] || [`Capital - ${state}`];
  return cities.length > 1 ? cities[1] : cities[0];
}

function addHours(date: Date, hours: number): Date {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false });
}

export function generateTrackingEvents(
  createdAt: string,
  destinationState: string | null,
  currentStatus: string,
  customerCity: string | null
): TrackingEvent[] {
  const events: TrackingEvent[] = [];
  const orderDate = new Date(createdAt);
  const destState = destinationState?.toUpperCase() || 'SP';
  const destCity = customerCity || getCity(destState);
  const now = new Date();

  // Origem sempre de São Paulo (CD principal)
  const origin = 'Centro de Distribuição - São Paulo, SP';

  // DIA 0 — Pedido confirmado
  const d0 = orderDate;
  events.push({
    date: formatDate(d0),
    time: formatTime(d0),
    status: 'Pedido Confirmado',
    description: 'Seu pedido foi recebido e está aguardando confirmação de pagamento.',
    location: 'Loja Online',
    type: 'info',
  });

  // DIA 0 + 2h — Pagamento aprovado (se status >= paid)
  const statusOrder = ['confirmed', 'paid', 'packaging', 'shipped', 'in_transit', 'delivered'];
  const currentIdx = statusOrder.indexOf(currentStatus);

  if (currentIdx >= 1) {
    const d0_pay = addHours(d0, 2);
    events.push({
      date: formatDate(d0_pay),
      time: formatTime(d0_pay),
      status: 'Pagamento Aprovado',
      description: 'Pagamento via PIX confirmado. Seu pedido será preparado em breve.',
      location: 'Sistema de Pagamento',
      type: 'success',
    });
  }

  // DIA 1 — Em embalagem
  if (currentIdx >= 2) {
    const d1 = addHours(d0, 18);
    events.push({
      date: formatDate(d1),
      time: formatTime(d1),
      status: 'Pedido em Separação',
      description: 'Seu pedido foi enviado ao setor de separação no centro de distribuição.',
      location: origin,
      type: 'info',
    });

    const d1b = addHours(d0, 24);
    events.push({
      date: formatDate(d1b),
      time: formatTime(d1b),
      status: 'Embalagem em Andamento',
      description: 'Produto sendo embalado com cuidado para garantir a segurança na entrega.',
      location: origin,
      type: 'info',
    });
  }

  // DIA 2 — Enviado / Coletado
  if (currentIdx >= 3) {
    const d2 = addHours(d0, 38);
    events.push({
      date: formatDate(d2),
      time: formatTime(d2),
      status: 'Objeto Postado',
      description: 'Objeto postado e coletado pela transportadora.',
      location: origin,
      type: 'success',
    });

    // DIA 2 + 6h — Saiu do CD
    const d2b = addHours(d0, 44);
    events.push({
      date: formatDate(d2b),
      time: formatTime(d2b),
      status: 'Saiu para Transporte',
      description: 'Objeto saiu do centro de distribuição com destino ao seu estado.',
      location: origin,
      type: 'info',
    });
  }

  // DIA 3-6 — Em trânsito com eventos detalhados
  if (currentIdx >= 4) {
    // DIA 3 — Chegou em hub intermediário
    const d3 = addHours(d0, 68);
    const hubCity = destState === 'SP' ? 'Guarulhos - SP' : 'Campinas - SP';
    events.push({
      date: formatDate(d3),
      time: formatTime(d3),
      status: 'Em Trânsito',
      description: `Objeto chegou à unidade de tratamento.`,
      location: `Centro de Tratamento - ${hubCity}`,
      type: 'info',
    });

    // DIA 3 + 8h — Saiu do hub
    const d3b = addHours(d0, 76);
    events.push({
      date: formatDate(d3b),
      time: formatTime(d3b),
      status: 'Em Trânsito',
      description: 'Objeto encaminhado para a próxima unidade de distribuição.',
      location: `Centro de Tratamento - ${hubCity}`,
      type: 'info',
    });

    // DIA 4 — Atraso (situação real)
    if (destState !== 'SP') {
      const d4 = addHours(d0, 96);
      events.push({
        date: formatDate(d4),
        time: formatTime(d4),
        status: 'Atraso no Transporte',
        description: 'Objeto aguardando redistribuição devido ao alto volume de encomendas na região.',
        location: `Centro Logístico - Guarulhos, SP`,
        type: 'warning',
      });

      // DIA 4 + 14h — Saiu do atraso
      const d4b = addHours(d0, 110);
      events.push({
        date: formatDate(d4b),
        time: formatTime(d4b),
        status: 'Em Trânsito',
        description: 'Objeto redirecionado e em deslocamento para a unidade de destino.',
        location: `Rodoviária de Cargas - São Paulo, SP`,
        type: 'info',
      });
    }

    // DIA 5 — Chegou no estado destino
    const d5 = addHours(d0, 120);
    const transitCity = getTransitCity(destState);
    events.push({
      date: formatDate(d5),
      time: formatTime(d5),
      status: 'Chegou ao Estado de Destino',
      description: `Objeto recebido na unidade de distribuição regional.`,
      location: `Centro de Distribuição - ${transitCity}`,
      type: 'info',
    });

    // DIA 6 — Saiu para entrega
    const d6 = addHours(d0, 144);
    events.push({
      date: formatDate(d6),
      time: formatTime(d6),
      status: 'Saiu para Entrega',
      description: 'Objeto saiu para entrega ao destinatário. Aguarde em seu endereço.',
      location: `Unidade de Entrega - ${destCity}`,
      type: 'success',
    });

    // DIA 6 + 4h — Tentativa frustrada (atraso realista)
    const d6b = addHours(d0, 148);
    if (d6b <= now) {
      events.push({
        date: formatDate(d6b),
        time: formatTime(d6b),
        status: 'Tentativa de Entrega',
        description: 'Não foi possível entregar — destinatário ausente. Nova tentativa será realizada.',
        location: destCity,
        type: 'warning',
      });
    }

    // DIA 7 — Nova tentativa
    const d7 = addHours(d0, 164);
    if (d7 <= now) {
      events.push({
        date: formatDate(d7),
        time: formatTime(d7),
        status: 'Saiu para Entrega',
        description: 'Nova tentativa de entrega ao destinatário.',
        location: `Unidade de Entrega - ${destCity}`,
        type: 'info',
      });
    }
  }

  // Entregue
  if (currentIdx >= 5) {
    const d7b = addHours(d0, 168);
    events.push({
      date: formatDate(d7b),
      time: formatTime(d7b),
      status: 'Entregue',
      description: 'Objeto entregue ao destinatário. Obrigado por comprar conosco!',
      location: destCity,
      type: 'success',
    });
  }

  // Return in reverse chronological order (most recent first)
  return events.reverse();
}
