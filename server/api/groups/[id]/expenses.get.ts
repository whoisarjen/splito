import { z } from 'zod'
import { requireAuth } from '../../../utils/auth'
import { prisma } from '../../../utils/db'

const querySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().max(100).optional(),
  categoryId: z.string().optional(),
  payerId: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const groupId = getRouterParam(event, 'id')
  const query = getQuery(event)

  if (!groupId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Group ID is required',
    })
  }

  // Verify membership
  const membership = await prisma.groupMember.findUnique({
    where: {
      groupId_userId: { groupId, userId: user.id },
    },
  })

  if (!membership || membership.leftAt) {
    throw createError({
      statusCode: 403,
      statusMessage: 'You are not a member of this group',
    })
  }

  const parsed = querySchema.safeParse(query)
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid query parameters',
    })
  }

  const { page, limit, search, categoryId, payerId } = parsed.data
  const skip = (page - 1) * limit

  const where = {
    groupId,
    isDeleted: false,
    ...(search && {
      description: { contains: search, mode: 'insensitive' as const },
    }),
    ...(categoryId && { categoryId }),
    ...(payerId && { payerId }),
  }

  const [expenses, total] = await Promise.all([
    prisma.expense.findMany({
      where,
      include: {
        payer: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            icon: true,
            color: true,
          },
        },
        shares: {
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
      orderBy: { expenseDate: 'desc' },
      skip,
      take: limit,
    }),
    prisma.expense.count({ where }),
  ])

  return {
    expenses: expenses.map((e) => ({
      id: e.id,
      description: e.description,
      amount: Number(e.amount),
      currency: e.currency,
      splitType: e.splitType,
      expenseDate: e.expenseDate,
      notes: e.notes,
      receiptUrl: e.receiptUrl,
      createdAt: e.createdAt,
      payer: {
        id: e.payer.id,
        name: e.payer.name,
        avatar: e.payer.avatar,
      },
      category: e.category
        ? {
            id: e.category.id,
            name: e.category.name,
            icon: e.category.icon,
            color: e.category.color,
          }
        : null,
      shares: e.shares.map((s) => ({
        userId: s.user.id,
        name: s.user.name,
        avatar: s.user.avatar,
        amount: Number(s.amount),
        percentage: s.percentage ? Number(s.percentage) : null,
      })),
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    },
  }
})
