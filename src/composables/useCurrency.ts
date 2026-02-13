import { ref, computed } from 'vue'
import type { TCurrency } from '@/types'
import { USD_TO_TRY_RATE, USD_TO_RUB_RATE } from '@/data/mockData'

const currencies: TCurrency[] = ['USD', 'TRY', 'RUB']

const RATES: Record<TCurrency, number> = {
  USD: 1,
  TRY: USD_TO_TRY_RATE,
  RUB: USD_TO_RUB_RATE,
}

const SYMBOLS: Record<TCurrency, string> = {
  USD: '$',
  TRY: '₺',
  RUB: '₽',
}

const currency = ref<TCurrency>('USD')

export function useCurrency() {
  const rate = computed(() => RATES[currency.value])
  const symbol = computed(() => SYMBOLS[currency.value])

  function convert(usd: number): number {
    return Math.round(usd * rate.value * 100) / 100
  }

  function setCurrency(c: TCurrency) {
    currency.value = c
  }

  function formatPrice(usd: number): string {
    const converted = convert(usd)
    if (currency.value === 'USD') {
      return `$${converted.toFixed(converted % 1 === 0 ? 0 : 2)}`
    }
    return `${converted.toFixed(0)} ${SYMBOLS[currency.value]}`
  }

  return {
    currency,
    currencies,
    rate,
    symbol,
    convert,
    setCurrency,
    formatPrice,
  }
}
