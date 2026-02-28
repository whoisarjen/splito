import { z } from 'zod'
import { getExchangeRates, convertCurrency } from '../../utils/currency'

const querySchema = z.object({
  amount: z.coerce.number().positive(),
  from: z.string().length(3),
  to: z.string().length(3),
})

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const parsed = querySchema.safeParse(query)
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid query parameters',
    })
  }

  const { amount, from, to } = parsed.data

  const rates = await getExchangeRates()
  const converted = convertCurrency(amount, from, to, rates)

  return {
    original: { amount, currency: from },
    converted: { amount: converted, currency: to },
    rate: converted / amount,
  }
})
