// Generates looping tracking events over 7 days, then expires

export interface TrackingEvent {
  date: string;
  time: string;
  status: string;
  description: string;
  location: string;
  type: 'success' | 'info' | 'warning' | 'neutral';
}

const TRANSIT_CITIES = [
  'São Paulo - SP', 'Guarulhos - SP', 'Campinas - SP', 'Ribeirão Preto - SP',
  'Curitiba - PR', 'Londrina - PR', 'Belo Horizonte - MG', 'Uberlândia - MG',
  'Rio de Janeiro - RJ', 'Goiânia - GO', 'Brasília - DF', 'Salvador - BA',
  'Recife - PE', 'Fortaleza - CE', 'Porto Alegre - RS', 'Florianópolis - SC',
  'Manaus - AM', 'Belém - PA', 'Campo Grande - MS', 'Cuiabá - MT',
];

const LOOP_EVENTS = [
  { status: 'Em Trânsito', description: 'Objeto recebido na unidade de tratamento.', type: 'info' as const },
  { status: 'Em Trânsito', description: 'Objeto encaminhado para a próxima unidade.', type: 'info' as const },
  { status: 'Atraso Operacional', description: 'Aguardando disponibilidade de transporte para redistribuição.', type: 'warning' as const },
  { status: 'Em Trânsito', description: 'Objeto em deslocamento — seguindo fluxo normal.', type: 'info' as const },
  { status: 'Em Trânsito', description: 'Objeto chegou ao centro de triagem regional.', type: 'info' as const },
  { status: 'Fiscalização', description: 'Objeto retido para conferência na unidade de fiscalização.', type: 'warning' as const },
  { status: 'Em Trânsito', description: 'Objeto liberado após conferência. Seguindo para destino.', type: 'info' as const },
  { status: 'Em Trânsito', description: 'Objeto transferido para veículo de longa distância.', type: 'info' as const },
  { status: 'Atraso por Volume', description: 'Alto volume de encomendas na região. Previsão de normalização em breve.', type: 'warning' as const },
  { status: 'Em Trânsito', description: 'Objeto redirecionado e em deslocamento.', type: 'info' as const },
  { status: 'Em Trânsito', description: 'Objeto chegou à unidade intermediária de distribuição.', type: 'info' as const },
  { status: 'Em Trânsito', description: 'Objeto encaminhado para o centro de distribuição do estado de destino.', type: 'info' as const },
];

function addHours(date: Date, hours: number): Date {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false });
}

// Seeded random for consistent events per order
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

export function isTrackingExpired(createdAt: string): boolean {
  const created = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - created.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays >= 7;
}

export function generateTrackingEvents(
  createdAt: string,
  _destinationState: string | null,
  _currentStatus: string,
  _customerCity: string | null
): TrackingEvent[] {
  const events: TrackingEvent[] = [];
  const orderDate = new Date(createdAt);
  const now = new Date();

  // Seed from order timestamp for consistency
  const seed = orderDate.getTime() % 2147483647;
  const rng = seededRandom(seed);

  // Initial events
  events.push({
    date: formatDate(orderDate),
    time: formatTime(orderDate),
    status: 'Pedido Confirmado',
    description: 'Seu pedido foi recebido e confirmado.',
    location: 'Loja Online',
    type: 'info',
  });

  events.push({
    date: formatDate(addHours(orderDate, 1)),
    time: formatTime(addHours(orderDate, 1)),
    status: 'Pagamento Aprovado',
    description: 'Pagamento via PIX confirmado com sucesso.',
    location: 'Sistema de Pagamento',
    type: 'success',
  });

  events.push({
    date: formatDate(addHours(orderDate, 6)),
    time: formatTime(addHours(orderDate, 6)),
    status: 'Objeto Postado',
    description: 'Objeto coletado pela transportadora no centro de distribuição.',
    location: 'Centro de Distribuição - São Paulo, SP',
    type: 'success',
  });

  // Loop events every ~4 hours for 7 days (168 hours)
  // Only show events that have "happened" (before now)
  const maxHours = 168; // 7 days
  let hour = 10; // start after initial events
  let eventIdx = 0;

  while (hour < maxHours) {
    const eventTime = addHours(orderDate, hour);
    if (eventTime > now) break;

    const loopEvent = LOOP_EVENTS[eventIdx % LOOP_EVENTS.length];
    const cityIdx = Math.floor(rng() * TRANSIT_CITIES.length);
    const city = TRANSIT_CITIES[cityIdx];

    events.push({
      date: formatDate(eventTime),
      time: formatTime(eventTime),
      status: loopEvent.status,
      description: loopEvent.description,
      location: `Unidade de Tratamento - ${city}`,
      type: loopEvent.type,
    });

    eventIdx++;
    // Vary interval: 3-6 hours
    hour += 3 + Math.floor(rng() * 4);
  }

  return events.reverse();
}
