export interface Currency {
  code: string
  name: string
  symbol: string
}

interface CurrencyState {
  currencies: Currency[]
  loading: boolean
}

export function useCurrency() {
  const state = useState<CurrencyState>('currencies', () => ({
    currencies: [],
    loading: false,
  }))

  const currencies = computed(() => state.value.currencies)
  const loading = computed(() => state.value.loading)

  async function fetchCurrencies() {
    if (state.value.currencies.length > 0) return

    state.value.loading = true
    try {
      const data = await $fetch<Currency[]>('/api/currencies')
      state.value.currencies = data
    } catch (err) {
      console.error('Failed to fetch currencies:', err)
    } finally {
      state.value.loading = false
    }
  }

  async function convert(amount: number, from: string, to: string): Promise<number> {
    if (from === to) return amount

    try {
      const result = await $fetch<{ converted: { amount: number } }>('/api/currencies/convert', {
        params: { amount, from, to },
      })
      return result.converted.amount
    } catch (err) {
      console.error('Conversion failed:', err)
      return amount
    }
  }

  function formatCurrency(amount: number, currency: string, locale = 'en-US'): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  function getCurrencySymbol(code: string): string {
    const currency = state.value.currencies.find((c) => c.code === code)
    return currency?.symbol || code
  }

  return {
    currencies,
    loading,
    fetchCurrencies,
    convert,
    formatCurrency,
    getCurrencySymbol,
  }
}
