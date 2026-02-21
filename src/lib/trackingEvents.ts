// Generates looping tracking events over 7 days based on real route, then expires

export interface TrackingEvent {
  date: string;
  time: string;
  status: string;
  description: string;
  location: string;
  type: 'success' | 'info' | 'warning' | 'neutral';
}

// Real route maps: from São Paulo to destination state, with intermediate cities
const ROUTES: Record<string, string[]> = {
  'SP': ['Guarulhos - SP', 'Campinas - SP', 'Ribeirão Preto - SP'],
  'RJ': ['Guarulhos - SP', 'Volta Redonda - RJ', 'Niterói - RJ', 'Rio de Janeiro - RJ'],
  'MG': ['Guarulhos - SP', 'Pouso Alegre - MG', 'Varginha - MG', 'Belo Horizonte - MG'],
  'PR': ['Guarulhos - SP', 'Registro - SP', 'Curitiba - PR', 'Londrina - PR'],
  'SC': ['Guarulhos - SP', 'Curitiba - PR', 'Joinville - SC', 'Florianópolis - SC'],
  'RS': ['Guarulhos - SP', 'Curitiba - PR', 'Florianópolis - SC', 'Porto Alegre - RS'],
  'BA': ['Guarulhos - SP', 'Belo Horizonte - MG', 'Vitória da Conquista - BA', 'Salvador - BA'],
  'PE': ['Guarulhos - SP', 'Salvador - BA', 'Aracaju - SE', 'Recife - PE'],
  'CE': ['Guarulhos - SP', 'Salvador - BA', 'Teresina - PI', 'Fortaleza - CE'],
  'GO': ['Guarulhos - SP', 'Uberlândia - MG', 'Goiânia - GO'],
  'DF': ['Guarulhos - SP', 'Uberlândia - MG', 'Brasília - DF'],
  'PA': ['Guarulhos - SP', 'Brasília - DF', 'Palmas - TO', 'Marabá - PA', 'Belém - PA'],
  'AM': ['Guarulhos - SP', 'Brasília - DF', 'Palmas - TO', 'Belém - PA', 'Manaus - AM'],
  'MA': ['Guarulhos - SP', 'Salvador - BA', 'Teresina - PI', 'São Luís - MA'],
  'MT': ['Guarulhos - SP', 'Campo Grande - MS', 'Cuiabá - MT'],
  'MS': ['Guarulhos - SP', 'Presidente Prudente - SP', 'Campo Grande - MS'],
  'ES': ['Guarulhos - SP', 'Juiz de Fora - MG', 'Vitória - ES'],
  'PI': ['Guarulhos - SP', 'Salvador - BA', 'Teresina - PI'],
  'RN': ['Guarulhos - SP', 'Recife - PE', 'João Pessoa - PB', 'Natal - RN'],
  'PB': ['Guarulhos - SP', 'Recife - PE', 'João Pessoa - PB'],
  'AL': ['Guarulhos - SP', 'Salvador - BA', 'Aracaju - SE', 'Maceió - AL'],
  'SE': ['Guarulhos - SP', 'Salvador - BA', 'Aracaju - SE'],
  'TO': ['Guarulhos - SP', 'Uberlândia - MG', 'Palmas - TO'],
  'RO': ['Guarulhos - SP', 'Cuiabá - MT', 'Porto Velho - RO'],
  'AC': ['Guarulhos - SP', 'Cuiabá - MT', 'Porto Velho - RO', 'Rio Branco - AC'],
  'AP': ['Guarulhos - SP', 'Belém - PA', 'Macapá - AP'],
  'RR': ['Guarulhos - SP', 'Manaus - AM', 'Boa Vista - RR'],
};

const DEFAULT_ROUTE = ['Guarulhos - SP', 'Campinas - SP', 'Ribeirão Preto - SP', 'Uberlândia - MG'];

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
  destinationState: string | null,
  _currentStatus: string,
  customerCity: string | null
): TrackingEvent[] {
  const events: TrackingEvent[] = [];
  const orderDate = new Date(createdAt);
  const now = new Date();

  const seed = orderDate.getTime() % 2147483647;
  const rng = seededRandom(seed);

  // Get the route for this destination
  const stateKey = (destinationState || '').toUpperCase().trim();
  const routeCities = ROUTES[stateKey] || DEFAULT_ROUTE;

  // If customer city is known and not already last in route, append it
  const finalCity = customerCity
    ? `${customerCity} - ${stateKey || 'BR'}`
    : routeCities[routeCities.length - 1];

  // Build full location cycle: route cities loop, mixing with the route
  const allLocations: string[] = [];
  for (const city of routeCities) {
    allLocations.push(`Unidade de Tratamento - ${city}`);
  }
  // After route cities, loop back through them
  for (const city of [...routeCities].reverse()) {
    allLocations.push(`Centro de Distribuição - ${city}`);
  }

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

  // Loop events every ~4 hours for 7 days
  const maxHours = 168;
  let hour = 10;
  let eventIdx = 0;
  let locationIdx = 0;

  while (hour < maxHours) {
    const eventTime = addHours(orderDate, hour);
    if (eventTime > now) break;

    const loopEvent = LOOP_EVENTS[eventIdx % LOOP_EVENTS.length];
    const location = allLocations[locationIdx % allLocations.length];

    events.push({
      date: formatDate(eventTime),
      time: formatTime(eventTime),
      status: loopEvent.status,
      description: loopEvent.description,
      location,
      type: loopEvent.type,
    });

    eventIdx++;
    locationIdx++;
    hour += 3 + Math.floor(rng() * 4);
  }

  return events.reverse();
}
