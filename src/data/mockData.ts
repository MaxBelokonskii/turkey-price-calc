import type { TCategory } from '@/types'

export const categories: TCategory[] = [
  {
    id: 'accommodation',
    icon: '🏠',
    title: 'Жильё',
    items: [
      {
        id: 'accommodation-level',
        label: 'Тип жилья',
        type: 'slider',
        priceUsd: 12,
        min: 0,
        max: 5,
        step: 1,
        defaultValue: 1,
        options: [
          { label: 'Хостел (дортуар)', value: 12 }, // ~10-15$ [web:15]
          { label: 'Хостел (приват)', value: 25 },
          { label: 'Airbnb/Гестхаус', value: 45 }, // ~45-65$ [web:2]
          { label: 'Отель 3★', value: 70 }, // ~50-100$ [web:23][web:20]
          { label: 'Отель 4★', value: 120 },
          { label: 'Отель 5★', value: 200 }, // ~150-250$ [web:23]
        ],
      },
    ],
  },
  {
    id: 'food',
    icon: '🍽',
    title: 'Еда',
    items: [
      {
        id: 'food-level',
        label: 'Уровень (на прием пищи)',
        type: 'slider',
        priceUsd: 2,
        min: 0,
        max: 3,
        step: 1,
        defaultValue: 0,
        options: [
          { label: 'Уличная еда', value: 2 }, // ~2-4$ [web:6]
          { label: 'Бюджетное кафе', value: 5 }, // ~5$
          { label: 'Среднее кафе', value: 8 },
          { label: 'Ресторан', value: 15 }, // ~15$ [web:2]
        ],
      },
      {
        id: 'food-breakfast',
        label: 'Завтрак',
        type: 'checkbox',
        priceUsd: 4, // ~3-10$ [web:6]
        defaultEnabled: true,
      },
      {
        id: 'food-lunch',
        label: 'Обед',
        type: 'checkbox',
        priceUsd: 7,
        defaultEnabled: true,
      },
      {
        id: 'food-dinner',
        label: 'Ужин',
        type: 'checkbox',
        priceUsd: 10,
        defaultEnabled: true,
      },
      {
        id: 'food-snacks',
        label: 'Перекусы',
        type: 'checkbox',
        priceUsd: 3, // ~2-4$
        defaultEnabled: false,
      },
      {
        id: 'food-coffee',
        label: 'Кофе/чай',
        type: 'checkbox',
        priceUsd: 2, // ~1.5-3$
        defaultEnabled: true,
      },
    ],
  },
  {
    id: 'transport',
    icon: '🚇',
    title: 'Транспорт',
    items: [
      {
        id: 'transport-istanbulkart',
        label: 'IstanbulKart (метро/автобус/трамвай, поездка)',
        type: 'checkbox',
        priceUsd: 0.7, // ~0.35-0.70€ ~0.7$ [web:6]
        defaultEnabled: true,
      },
      {
        id: 'transport-taxi',
        label: 'Такси (короткая поездка)',
        type: 'checkbox',
        priceUsd: 6, // ~5-10$ за 3 мили [web:24]
        defaultEnabled: false,
      },
      {
        id: 'transport-taxi-rides',
        label: 'Поездок на такси',
        type: 'slider',
        priceUsd: 6,
        min: 0,
        max: 5,
        step: 1,
        defaultValue: 1,
        unit: 'шт',
      },
      {
        id: 'transport-ferry',
        label: 'Паром',
        type: 'checkbox',
        priceUsd: 1.5, // ~1-2$ [web:7]
        defaultEnabled: false,
      },
      {
        id: 'transport-dolmus',
        label: 'Долмуш (минибус)',
        type: 'checkbox',
        priceUsd: 1,
        defaultEnabled: false,
      },
    ],
  },
  {
    id: 'entertainment',
    icon: '🎭',
    title: 'Развлечения',
    items: [
      {
        id: 'entertainment-museum',
        label: 'Музеи (Hagia Sophia, Topkapi)',
        type: 'checkbox',
        priceUsd: 25, // ~20-50$ с учетом TRY~43 [web:25]
        defaultEnabled: false,
      },
      {
        id: 'entertainment-cruise',
        label: 'Босфор-круиз (короткий)',
        type: 'checkbox',
        priceUsd: 12, // ~10-20$ [web:16][web:8]
        defaultEnabled: false,
      },
      {
        id: 'entertainment-hamam',
        label: 'Хамам (стандарт)',
        type: 'checkbox',
        priceUsd: 50, // ~50-100€ [web:26]
        defaultEnabled: false,
      },
      {
        id: 'entertainment-excursion',
        label: 'Экскурсия (полдня)',
        type: 'checkbox',
        priceUsd: 40, // ~30-70$ [web:16]
        defaultEnabled: false,
      },
      {
        id: 'entertainment-nightlife',
        label: 'Ночная жизнь (вход+напиток)',
        type: 'checkbox',
        priceUsd: 12, // ~6-15$ [web:27]
        defaultEnabled: false,
      },
    ],
  },
  {
    id: 'connectivity',
    icon: '📱',
    title: 'Связь',
    items: [
      {
        id: 'connectivity-sim',
        label: 'Турецкая SIM (10GB)',
        type: 'checkbox',
        priceUsd: 15, // ~10-20$ [web:9]
        defaultEnabled: true,
      },
      {
        id: 'connectivity-roaming',
        label: 'Роуминг (день)',
        type: 'checkbox',
        priceUsd: 10, // ~7-15€/день [web:6]
        defaultEnabled: false,
      },
      {
        id: 'connectivity-esim',
        label: 'eSIM (7 дней)',
        type: 'checkbox',
        priceUsd: 12,
        defaultEnabled: false,
      },
    ],
  },
  {
    id: 'shopping',
    icon: '🛍',
    title: 'Шопинг',
    items: [
      {
        id: 'shopping-budget',
        label: 'Бюджет на шопинг/сувениры',
        type: 'slider',
        priceUsd: 0,
        min: 0,
        max: 200,
        step: 10,
        defaultValue: 0,
        unit: '$',
      },
    ],
  },
  {
    id: 'health',
    icon: '💊',
    title: 'Здоровье',
    items: [
      {
        id: 'health-insurance',
        label: 'Страховка (в день)',
        type: 'checkbox',
        priceUsd: 5, // ~3-18$, среднее ~5$ [web:17]
        defaultEnabled: true,
      },
      {
        id: 'health-pharmacy',
        label: 'Аптека (лекарства)',
        type: 'checkbox',
        priceUsd: 10,
        defaultEnabled: false,
      },
    ],
  },
]

export const USD_TO_TRY_RATE = 43.7  // Февраль 2026 [web:18]
export const USD_TO_RUB_RATE = 77.3  // Февраль 2026
