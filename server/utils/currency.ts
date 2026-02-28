import { prisma } from './db'

const RATE_TTL_MS = 24 * 60 * 60 * 1000 // 24 hours
const EXCHANGE_API_URL = 'https://api.exchangerate-api.com/v4/latest/USD'

export const SUPPORTED_CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '\u20ac' },
  { code: 'GBP', name: 'British Pound', symbol: '\u00a3' },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'z\u0142' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '\u00a5' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '\u00a5' },
  { code: 'INR', name: 'Indian Rupee', symbol: '\u20b9' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'MX$' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr' },
  { code: 'CZK', name: 'Czech Koruna', symbol: 'K\u010d' },
  { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft' },
  { code: 'RON', name: 'Romanian Leu', symbol: 'lei' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '\u20ba' },
  { code: 'THB', name: 'Thai Baht', symbol: '\u0e3f' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '\u20bd' },
  { code: 'KRW', name: 'South Korean Won', symbol: '\u20a9' },
] as const

export type CurrencyCode = (typeof SUPPORTED_CURRENCIES)[number]['code']

export async function getExchangeRates(): Promise<Record<string, number>> {
  // Check cache
  const cached = await prisma.exchangeRate.findMany({
    where: {
      baseCurrency: 'USD',
      fetchedAt: { gte: new Date(Date.now() - RATE_TTL_MS) },
    },
  })

  if (cached.length > 0) {
    return Object.fromEntries(cached.map((r) => [r.targetCurrency, Number(r.rate)]))
  }

  // Fetch fresh rates
  try {
    const response = await fetch(EXCHANGE_API_URL)
    const data = await response.json()

    // Update cache (upsert each rate)
    const now = new Date()
    const rates: Record<string, number> = data.rates

    await Promise.all(
      Object.entries(rates).map(([currency, rate]) =>
        prisma.exchangeRate.upsert({
          where: {
            baseCurrency_targetCurrency: {
              baseCurrency: 'USD',
              targetCurrency: currency,
            },
          },
          update: { rate: rate as number, fetchedAt: now },
          create: {
            baseCurrency: 'USD',
            targetCurrency: currency,
            rate: rate as number,
            fetchedAt: now,
          },
        })
      )
    )

    return rates
  } catch (error) {
    console.error('Failed to fetch exchange rates:', error)
    // Return cached rates even if expired
    const fallback = await prisma.exchangeRate.findMany({
      where: { baseCurrency: 'USD' },
    })
    return Object.fromEntries(fallback.map((r) => [r.targetCurrency, Number(r.rate)]))
  }
}

export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: Record<string, number>
): number {
  if (fromCurrency === toCurrency) return amount

  const fromRate = fromCurrency === 'USD' ? 1 : rates[fromCurrency]
  const toRate = toCurrency === 'USD' ? 1 : rates[toCurrency]

  if (!fromRate || !toRate) {
    throw new Error(`Unknown currency: ${fromCurrency} or ${toCurrency}`)
  }

  // Convert to USD first, then to target currency
  const amountInUsd = amount / fromRate
  return Number((amountInUsd * toRate).toFixed(2))
}

export function formatCurrency(amount: number, currency: string, locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}
