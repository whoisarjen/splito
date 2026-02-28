import { z } from 'zod'
import { requireAuth } from '../../../utils/auth'
import { prisma } from '../../../utils/db'

const createExpenseSchema = z.object({
  description: z.string().min(1).max(255),
  amount: z.number().positive(),
  currency: z.string().length(3),
  categoryId: z.string().optional(),
  expenseDate: z.string().optional(),
  splitType: z.enum(['EQUAL', 'UNEQUAL', 'PERCENTAGE']).default('EQUAL'),
  shares: z
    .array(
      z.object({
        userId: z.string(),
        amount: z.number().nonnegative().optional(),
        percentage: z.number().min(0).max(100).optional(),
      })
    )
    .min(1),
  notes: z.string().max(1000).optional(),
})

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const groupId = getRouterParam(event, 'id')
  const body = await readBody(event)

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

  const parsed = createExpenseSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request body',
      data: parsed.error.flatten(),
    })
  }

  const { description, amount, currency, categoryId, expenseDate, splitType, shares, notes } =
    parsed.data

  // Calculate shares based on split type
  let calculatedShares = shares
  if (splitType === 'EQUAL') {
    const shareAmount = Number((amount / shares.length).toFixed(2))
    calculatedShares = shares.map((s) => ({ ...s, amount: shareAmount }))
  } else if (splitType === 'PERCENTAGE') {
    calculatedShares = shares.map((s) => ({
      ...s,
      amount: Number(((amount * (s.percentage || 0)) / 100).toFixed(2)),
    }))
  }

  // Validate share amounts sum to total
  const shareSum = calculatedShares.reduce((sum, s) => sum + (s.amount || 0), 0)
  if (Math.abs(shareSum - amount) > 0.02) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Share amounts must sum to the total expense amount',
    })
  }

  const expense = await prisma.expense.create({
    data: {
      groupId,
      payerId: user.id,
      description,
      amount,
      currency,
      categoryId,
      expenseDate: expenseDate ? new Date(expenseDate) : new Date(),
      splitType,
      notes,
      shares: {
        create: calculatedShares.map((s) => ({
          userId: s.userId,
          amount: s.amount || 0,
          percentage: splitType === 'PERCENTAGE' ? s.percentage : null,
        })),
      },
    },
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
  })

  // Update group's updatedAt
  await prisma.group.update({
    where: { id: groupId },
    data: { updatedAt: new Date() },
  })

  return {
    id: expense.id,
    description: expense.description,
    amount: Number(expense.amount),
    currency: expense.currency,
    splitType: expense.splitType,
    expenseDate: expense.expenseDate,
    notes: expense.notes,
    createdAt: expense.createdAt,
    payer: expense.payer,
    category: expense.category,
    shares: expense.shares.map((s) => ({
      userId: s.user.id,
      name: s.user.name,
      avatar: s.user.avatar,
      amount: Number(s.amount),
      percentage: s.percentage ? Number(s.percentage) : null,
    })),
  }
})
