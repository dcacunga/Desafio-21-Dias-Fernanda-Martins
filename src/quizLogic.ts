export interface QuizOption {
  label: string;
  image?: string;
  emoji?: string;
}

export type QuizStepType =
  | 'hero'
  | 'single'
  | 'multi'
  | 'name'
  | 'intro'
  | 'break'
  | 'news'
  | 'measure'
  | 'processing'
  | 'summary'
  | 'plan'
  | 'offer-vsl'
  | 'offer';

export interface QuizStep {
  id: string;
  type: QuizStepType;
  title?: string;
  sub?: string;
  cards?: boolean;
  options?: QuizOption[];
  btnText?: string;
  icon?: string;
  stat?: string;
  statSub?: string;
  image?: string;
  headline?: string;
  unit?: string;
  altUnit?: string;
  min?: number;
  max?: number;
  value?: number;
  exclusive?: string[];
  when?: (answers: QuizAnswers) => boolean;
}

export interface QuizAnswers {
  [key: string]: any;
  name?: string;
  age?: string;
  zones?: string[];
  goal?: string;
  experience?: string;
  day?: string;
  flexibility?: string;
  comfort?: string[];
  body?: string;
  desire?: string;
  bestShape?: string;
  activity?: string;
  stairs?: string;
  barriers?: string[];
  sleep?: string;
  energy?: string;
  water?: string;
  food?: string;
  motivation?: string;
  feelings?: string;
  height?: number;
  weight?: number;
  target?: number;
  minutes?: string;
  days?: string;
  intensity?: string;
  commitment?: string;
}

export interface UserProfile {
  name: string;
  minutes: number;
  days: number;
  level: number;
  goal: string;
  caution: boolean;
}

export interface OfferConfig {
  expert: string;
  title: string;
  durationDays: number;
  price: number;
  oldPrice: number;
  currency: string;
  guaranteeDays: number;
  checkoutUrl: string;
  vslHeroId: string;
  vslHeroScript: string;
  vslOfferId: string;
  vslOfferScript: string;
}

export const OFFER_CONFIG: OfferConfig = {
  expert: 'Fernanda Martins',
  title: 'Desafio de Pilates na Parede',
  durationDays: 21,
  price: 6990,
  oldPrice: 35000,
  currency: 'Kz',
  guaranteeDays: 30,
  checkoutUrl: 'https://pay.clickpayon.com/522e8894-04ed-49ef-b70f-4d260e52b072',
  vslHeroId: 'vid-6af3908ea46040eb1d0c3046',
  vslHeroScript: 'https://scripts.converteai.net/0f437237-527a-4535-bdf5-d5d791480e65/players/6af3908ea46040eb1d0c3046/v4/player.js',
  vslOfferId: 'vid-6af39118ca48af3c3652a518',
  vslOfferScript: 'https://scripts.converteai.net/0f437237-527a-4535-bdf5-d5d791480e65/players/6af39118ca48af3c3652a518/v4/player.js',
};

export const OPTION_EMOJIS: Record<string, string> = {
  'Sim, pratico regularmente': '🏅',
  'Já experimentei algumas vezes': '🙂',
  'Nunca fiz Pilates': '🌱',
  'Ombros': '🤷‍♀️',
  'Joelhos': '🦵',
  'Costas': '🔙',
  'Pés ou tornozelos': '🦶',
  'Nenhuma destas zonas': '✅',
  'Mais forte e firme': '💪',
  'Com mais liberdade de movimento': '🤸',
  'Mais confiante': '😊',
  'Com mais energia para o dia a dia': '⚡',
  'Há menos de um ano': '📅',
  'Entre 1 e 2 anos': '🗓️',
  'Há mais de 3 anos': '⏳',
  'Não sei dizer': '🤔',
  'Quase todos os dias': '🔥',
  'Algumas vezes por semana': '👟',
  'Algumas vezes por mês': '🚶‍♀️',
  'Ainda não tenho uma rotina': '🛋️',
  'Preciso de parar para recuperar o fôlego': '😮‍💨',
  'Fico um pouco cansada': '😅',
  'Sinto-me confortável': '😌',
  'Depende do dia': '🔄',
  'Falta de tempo': '⏰',
  'Não saber por onde começar': '🧭',
  'Treinos difíceis de acompanhar': '😓',
  'Falta de motivação': '🔋',
  'Não ter um plano organizado': '📋',
  'Nenhum destes motivos': '✅',
  'Menos de 5 horas': '😴',
  'Entre 5 e 6 horas': '🥱',
  'Entre 7 e 8 horas': '🛌',
  'Mais de 8 horas': '🌙',
  'Costumo sentir-me cansada': '🪫',
  'Sinto uma quebra depois do almoço': '🍽️',
  'Varia bastante ao longo do dia': '📈',
  'Sinto-me disposta na maior parte do dia': '⚡',
  'Menos de 2 copos': '🥛',
  'Entre 2 e 5 copos': '🥤',
  'Entre 1 e 2 litros': '💧',
  'Mais de 2 litros': '🌊',
  'Não costumo contar': '🤷‍♀️',
  'Sentir-me mais confiante': '😊',
  'Cuidar de mim e da minha disposição': '💆‍♀️',
  'Sentir-me melhor nas minhas roupas': '👗',
  'Voltar a reservar tempo para mim': '⏳',
  'Criar um hábito que consiga manter': '🌱',
  'Sim, quero começar o meu desafio hoje!': '🔥',
  'Sim, estou pronta para dedicar este tempo à minha saúde.': '💚',
};

const opt = (label: string, image?: string, emoji?: string): QuizOption => ({
  label,
  image,
  emoji: emoji || OPTION_EMOJIS[label],
});

export const QUESTIONS: QuizStep[] = [
  {
    id: 'urgent-intro',
    type: 'hero',
    title: 'Seca a tua barriga em 21 dias com 10 minutos na parede.',
    btnText: '🟢 COMEÇAR A MINHA AVALIAÇÃO GRATUITA',
  },
  {
    id: 'age',
    type: 'single',
    title: 'O teu desafio de 21 dias começa aqui',
    sub: 'Selecciona a tua faixa etária.',
    cards: true,
    options: [
      opt('18 a 29 anos', 'age-1'),
      opt('30 a 39 anos', 'age-2'),
      opt('40 a 49 anos', 'age-3'),
      opt('50 ou mais', 'age-4'),
    ],
  },
  {
    id: 'zones',
    type: 'multi',
    title: 'Que parte do teu corpo gostarias de trabalhar primeiro?',
    sub: 'Escolhe as opções que quiseres e carrega em “Continuar”.',
    cards: true,
    options: [
      opt('Pneuzinhos', 'zone-sides'),
      opt('Cintura', 'zone-waist'),
      opt('Barriga', 'zone-belly'),
      opt('Glúteos', 'zone-glutes'),
      opt('Pernas', 'zone-legs'),
      opt('Braços', 'zone-arms'),
    ],
  },
  {
    id: 'goal',
    type: 'single',
    title: 'Qual é o teu principal objectivo com o Pilates?',
    options: [
      opt('Trabalhar a barriga', undefined, '🎯'),
      opt('Aumentar a força muscular', undefined, '💪'),
      opt('Melhorar a flexibilidade', undefined, '🤸'),
      opt('Ter um momento para relaxar', undefined, '😌'),
      opt('Movimentar-me com mais conforto', undefined, '🧘'),
    ],
  },
  {
    id: 'name',
    type: 'name',
    title: 'Como te chamas?',
    sub: 'Só precisamos do teu primeiro nome para apresentar o teu resumo.',
  },
  {
    id: 'intro',
    type: 'intro',
    title: 'Chamo-me Professora Fernanda Martins!',
  },
  {
    id: 'experience',
    type: 'single',
    title: 'Já praticaste Pilates antes?',
    options: [
      opt('Sim, pratico regularmente'),
      opt('Já experimentei algumas vezes'),
      opt('Nunca fiz Pilates'),
    ],
  },
  {
    id: 'break-beginner',
    type: 'break',
    when: (a: QuizAnswers) => a.experience === 'Nunca fiz Pilates',
    icon: '🤝',
    title: 'Não estás sozinha 💛',
    stat: '84,7%',
    statSub: 'das nossas alunas',
    sub: 'relatam que começaram do zero, em casa, e foram ganhando confiança aula a aula, mesmo sem experiência prévia.',
    btnText: 'Entendi, quero continuar',
  },
  {
    id: 'news-tvzimbo',
    type: 'news',
    headline:
      'Exercícios de 10 minutos na parede de casa viram a alternativa natural a ginásios e remédios caros em Luanda',
    btnText: 'Continuar',
  },
  {
    id: 'day',
    type: 'single',
    title: 'Como descreverias o teu dia típico?',
    options: [
      opt('Passo a maior parte do dia sentada', undefined, '💻'),
      opt('Movimento-me de vez em quando', undefined, '🚶'),
      opt('Passo boa parte do dia de pé', undefined, '👣'),
    ],
  },
  {
    id: 'flexibility',
    type: 'single',
    title: 'Como está a tua flexibilidade?',
    sub: 'Responde com base no que sentes hoje. Não precisas de testar nenhum movimento agora.',
    options: [
      opt('Sou flexível', undefined, '💃'),
      opt('Sou mais ou menos flexível', undefined, '🙂'),
      opt('Tenho pouca flexibilidade', undefined, '🌱'),
    ],
  },
  {
    id: 'comfort',
    type: 'multi',
    title: 'Há alguma zona que precise de atenção ao treinares?',
    sub: 'Selecciona as zonas que precisam de atenção ou indica que nenhuma se aplica.',
    options: [
      opt('Ombros'),
      opt('Joelhos'),
      opt('Costas'),
      opt('Pés ou tornozelos'),
      opt('Nenhuma destas zonas'),
    ],
    exclusive: ['Nenhuma destas zonas'],
  },
  {
    id: 'body',
    type: 'single',
    title: 'Como descreves o teu corpo hoje?',
    sub: 'Escolhe a opção com que mais te identificas.',
    cards: true,
    options: [
      opt('Magro', 'body-1'),
      opt('Médio', 'body-2'),
      opt('Meio pesado', 'body-3'),
      opt('Excesso de peso', 'body-4'),
    ],
  },
  {
    id: 'desire',
    type: 'single',
    title: 'Como gostarias de te sentir no teu corpo?',
    options: [
      opt('Mais forte e firme'),
      opt('Com mais liberdade de movimento'),
      opt('Mais confiante'),
      opt('Com mais energia para o dia a dia'),
    ],
  },
  {
    id: 'bestShape',
    type: 'single',
    title: 'Há quanto tempo te sentiste na tua melhor forma?',
    options: [
      opt('Há menos de um ano'),
      opt('Entre 1 e 2 anos'),
      opt('Há mais de 3 anos'),
      opt('Não sei dizer'),
    ],
  },
  {
    id: 'activity',
    type: 'single',
    title: 'Com que frequência fazes exercício?',
    options: [
      opt('Quase todos os dias'),
      opt('Algumas vezes por semana'),
      opt('Algumas vezes por mês'),
      opt('Ainda não tenho uma rotina'),
    ],
  },
  {
    id: 'stairs',
    type: 'single',
    title: 'Como te sentes depois de subir escadas?',
    options: [
      opt('Preciso de parar para recuperar o fôlego'),
      opt('Fico um pouco cansada'),
      opt('Sinto-me confortável'),
      opt('Depende do dia'),
    ],
  },
  {
    id: 'barriers',
    type: 'multi',
    title: 'O que mais te dificultou manter uma rotina?',
    sub: 'Podes escolher mais de uma opção.',
    options: [
      opt('Falta de tempo'),
      opt('Não saber por onde começar'),
      opt('Treinos difíceis de acompanhar'),
      opt('Falta de motivação'),
      opt('Não ter um plano organizado'),
      opt('Nenhum destes motivos'),
    ],
    exclusive: ['Nenhum destes motivos'],
  },
  {
    id: 'break-barriers',
    type: 'break',
    when: (a: QuizAnswers) =>
      Array.isArray(a.barriers) &&
      a.barriers.some((x: string) => x !== 'Nenhum destes motivos'),
    title: 'Não és a única 💛',
    sub: 'O que sentes é mais comum do que imaginas. Muitas das nossas alunas passaram pelo mesmo antes do Desafio de 21 Dias. Por isso, o plano é feito de aulas simples de acompanhar, no teu ritmo.',
  },
  {
    id: 'sleep',
    type: 'single',
    title: 'Quantas horas dormes, em média, por noite?',
    options: [
      opt('Menos de 5 horas'),
      opt('Entre 5 e 6 horas'),
      opt('Entre 7 e 8 horas'),
      opt('Mais de 8 horas'),
    ],
  },
  {
    id: 'energy',
    type: 'single',
    title: 'Como está a tua energia durante o dia?',
    options: [
      opt('Costumo sentir-me cansada'),
      opt('Sinto uma quebra depois do almoço'),
      opt('Varia bastante ao longo do dia'),
      opt('Sinto-me disposta na maior parte do dia'),
    ],
  },
  {
    id: 'water',
    type: 'single',
    title: 'Quanto de água costumas beber por dia?',
    options: [
      opt('Menos de 2 copos'),
      opt('Entre 2 e 5 copos'),
      opt('Entre 1 e 2 litros'),
      opt('Mais de 2 litros'),
      opt('Não costumo contar'),
    ],
  },
  {
    id: 'food',
    type: 'single',
    title: 'Qual destas opções se aproxima mais da tua alimentação?',
    cards: true,
    options: [
      opt('Tradicional, como de tudo', 'food-1'),
      opt('Carnes, peixe e ovos', 'food-2'),
      opt('Vegetariana', 'food-3'),
      opt('Comidas rápidas', 'ext-06'),
    ],
  },
  {
    id: 'motivation',
    type: 'single',
    title: 'Qual é o teu maior motivo para começar?',
    options: [
      opt('Sentir-me mais confiante'),
      opt('Cuidar de mim e da minha disposição'),
      opt('Sentir-me melhor nas minhas roupas'),
      opt('Voltar a reservar tempo para mim'),
      opt('Criar um hábito que consiga manter'),
    ],
  },
  {
    id: 'feelings',
    type: 'single',
    title: 'Como te sentes em relação ao teu corpo e às tuas roupas ultimamente?',
    sub: 'Escolhe a opção com que mais te identificas.',
    options: [
      opt('Frustrada porque as minhas roupas favoritas já não me servem bem', undefined, '👗'),
      opt('Sem energia e com a sensação de barriga inchada no final do dia', undefined, '😮‍💨'),
      opt('Insegura com a falta de tonificação', undefined, '🪞'),
    ],
  },
  {
    id: 'break-feelings',
    type: 'break',
    title: 'Obrigada por partilhares 💛',
    sub: 'A maioria das nossas alunas sentia exactamente o mesmo antes de começar o Desafio de 21 Dias. Vamos montar o teu plano a pensar nisso.',
  },
  {
    id: 'height',
    type: 'measure',
    title: 'Qual é a tua altura?',
    sub: 'Indica a tua altura aproximada.',
    unit: 'cm',
    altUnit: 'pol',
    min: 100,
    max: 230,
    value: 165,
  },
  {
    id: 'minutes',
    type: 'single',
    title: 'Quanto tempo gostarias de reservar por dia?',
    sub: 'Escolhe o tempo que realmente cabe na tua rotina.',
    cards: true,
    options: [
      opt('10 minutos', 'minutes-10'),
      opt('20 minutos', 'minutes-20'),
      opt('30 minutos', 'minutes-30'),
      opt('60 minutos', 'minutes-60'),
    ],
  },
  {
    id: 'days',
    type: 'single',
    title: 'Quantos dias por semana consegues reservar?',
    sub: 'Uma rotina possível é mais fácil de manter.',
    cards: true,
    options: [
      opt('1 a 2 dias', 'days-2'),
      opt('3 a 5 dias', 'days-4'),
      opt('Todos os dias', 'days-7'),
    ],
  },
  {
    id: 'intensity',
    type: 'single',
    title: 'Como preferes começar?',
    options: [
      opt('Com movimentos simples e um ritmo tranquilo', undefined, '🌱'),
      opt('Com uma rotina equilibrada', undefined, '🙂'),
      opt('Com mais desafio, respeitando os meus limites', undefined, '💪'),
    ],
  },
  {
    id: 'commitment',
    type: 'single',
    title: 'Estás pronta para reservar este tempo para ti?',
    options: [
      opt('Sim, quero começar o meu desafio hoje!'),
      opt('Sim, estou pronta para dedicar este tempo à minha saúde.'),
    ],
  },
  {
    id: 'processing',
    type: 'processing',
    title: 'Estamos a criar o teu plano de aulas personalizado!',
  },
  {
    id: 'summary',
    type: 'summary',
    title: 'Este é o teu ponto de partida',
  },
  {
    id: 'plan',
    type: 'plan',
    title: 'O teu plano de treino de Pilates está pronto!',
  },
  {
    id: 'offer-vsl',
    type: 'offer-vsl',
    title: 'Assiste ao vídeo',
  },
  {
    id: 'offer',
    type: 'offer',
    title: 'O teu desafio está pronto',
  },
];

export function formatMoney(n: number): string {
  return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function calculateDiscount(price: number, oldPrice: number) {
  const hasDisc = oldPrice > price;
  const pct = hasDisc ? Math.round((1 - price / oldPrice) * 100) : 0;
  const savings = hasDisc ? oldPrice - price : 0;
  return { hasDisc, pct, savings, perDay: price / 21 };
}

export function buildCheckoutUrl(
  baseUrl: string,
  searchString?: string,
  externalRef?: string | null
): string {
  try {
    const u = new URL(baseUrl);
    const params = new URLSearchParams(searchString || (typeof window !== 'undefined' ? window.location.search : ''));
    for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'src', 'sck']) {
      const val = params.get(k);
      if (val) {
        u.searchParams.set(k, val);
      }
    }
    if (externalRef && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(externalRef)) {
      u.searchParams.set('external_reference', externalRef);
    }
    return u.toString();
  } catch {
    return baseUrl;
  }
}

export function calculateProfile(answers: QuizAnswers): UserProfile {
  const name = typeof answers.name === 'string' ? answers.name.trim() : '';
  const parsedMin = parseInt(String(answers.minutes || '10'), 10);
  const minutes = Number.isNaN(parsedMin) ? 10 : parsedMin;
  const days = answers.days === 'Todos os dias' ? 7 : answers.days === '3 a 5 dias' ? 4 : 2;
  const level =
    answers.experience === 'Sim, pratico regularmente'
      ? 3
      : answers.experience === 'Já experimentei algumas vezes'
      ? 2
      : 1;
  const goal = answers.goal || 'Criar uma rotina de movimento';
  const caution =
    Array.isArray(answers.comfort) &&
    answers.comfort.some((x: string) => !['Nenhuma destas zonas'].includes(x));

  return { name, minutes, days, level, goal, caution };
}

export function shouldSkipStep(stepIndex: number, steps: QuizStep[], answers: QuizAnswers): boolean {
  const step = steps[stepIndex];
  if (!step) return false;
  if (step.type === 'break' && typeof step.when === 'function') {
    return !step.when(answers);
  }
  return false;
}

export function getNextStepIndex(currentIndex: number, steps: QuizStep[], answers: QuizAnswers): number {
  let next = currentIndex + 1;
  while (next < steps.length && shouldSkipStep(next, steps, answers)) {
    next++;
  }
  return Math.min(steps.length - 1, next);
}

export function getPrevStepIndex(currentIndex: number, steps: QuizStep[], answers: QuizAnswers): number {
  let prev = currentIndex - 1;
  while (prev >= 0 && (steps[prev]?.type === 'processing' || shouldSkipStep(prev, steps, answers))) {
    prev--;
  }
  return Math.max(0, prev);
}

export function calculateActivityData(activity?: string) {
  const levels = [
    'Ainda não tenho uma rotina',
    'Algumas vezes por mês',
    'Algumas vezes por semana',
    'Quase todos os dias',
  ];
  const rank = Math.max(0, levels.indexOf(activity || 'Ainda não tenho uma rotina'));
  const positions: Array<[number, number]> = [
    [32, 199],
    [117, 174],
    [213, 111],
    [307, 49],
  ];
  const [x, y] = positions[rank];
  const label = rank < 2 ? 'Rotina a construir' : 'Rotina em movimento';
  const heading =
    rank < 2
      ? 'Está na hora de dares espaço a uma nova rotina.'
      : 'O próximo passo é dar continuidade à tua rotina.';
  const note =
    rank < 2
      ? 'Começa com movimentos que consigas acompanhar e organiza os teus momentos de prática.'
      : 'Aproveita a experiência que já tens para seguir uma sequência organizada de aulas.';

  return { rank, x, y, label, heading, note };
}

export function calculatePlanPoints(daysPerWeek: number) {
  return [
    { x: 35, y: 180, label: '0' },
    { x: 145, y: 130, label: String(daysPerWeek) },
    { x: 255, y: 80, label: String(daysPerWeek * 2) },
    { x: 385, y: 30, label: String(daysPerWeek * 3) },
  ];
}
