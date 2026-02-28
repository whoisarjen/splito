import { z } from 'zod'
import { nanoid } from 'nanoid'
import { requireAuth } from '../../utils/auth'
import { prisma } from '../../utils/db'
import { SUPPORTED_CURRENCIES } from '../../utils/currency'

const createGroupSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  defaultCurrency: z
    .string()
    .length(3)
    .refine((c) => SUPPORTED_CURRENCIES.some((sc) => sc.code === c)),
  settlementCurrency: z
    .string()
    .length(3)
    .refine((c) => SUPPORTED_CURRENCIES.some((sc) => sc.code === c))
    .optional(),
})

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const body = await readBody(event)

  const parsed = createGroupSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request body',
      data: parsed.error.flatten(),
    })
  }

  const { name, description, defaultCurrency, settlementCurrency } = parsed.data

  const group = await prisma.group.create({
    data: {
      name,
      description,
      defaultCurrency,
      settlementCurrency: settlementCurrency || defaultCurrency,
      inviteCode: nanoid(8),
      members: {
        create: {
          userId: user.id,
          role: 'OWNER',
        },
      },
    },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      },
    },
  })

  return {
    id: group.id,
    name: group.name,
    description: group.description,
    defaultCurrency: group.defaultCurrency,
    settlementCurrency: group.settlementCurrency,
    inviteCode: group.inviteCode,
    createdAt: group.createdAt,
    members: group.members.map((m) => ({
      id: m.id,
      userId: m.user.id,
      name: m.user.name,
      avatar: m.user.avatar,
      role: m.role,
    })),
  }
})
