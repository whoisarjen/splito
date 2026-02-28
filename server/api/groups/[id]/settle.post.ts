import { z } from 'zod'
import { requireAuth } from '../../../utils/auth'
import { prisma } from '../../../utils/db'

const settleSchema = z.object({
  receiverId: z.string(),
  amount: z.number().positive(),
  currency: z.string().length(3),
  note: z.string().max(255).optional(),
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

  const parsed = settleSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request body',
      data: parsed.error.flatten(),
    })
  }

  const { receiverId, amount, currency, note } = parsed.data

  // Verify receiver is also a member
  const receiverMembership = await prisma.groupMember.findUnique({
    where: {
      groupId_userId: { groupId, userId: receiverId },
    },
  })

  if (!receiverMembership || receiverMembership.leftAt) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Receiver is not a member of this group',
    })
  }

  // Create settlement
  const settlement = await prisma.settlement.create({
    data: {
      groupId,
      payerId: user.id,
      receiverId,
      amount,
      currency,
      note,
    },
    include: {
      payer: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      receiver: {
        select: {
          id: true,
          name: true,
          avatar: true,
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
    id: settlement.id,
    payer: settlement.payer,
    receiver: settlement.receiver,
    amount: Number(settlement.amount),
    currency: settlement.currency,
    note: settlement.note,
    settledAt: settlement.settledAt,
  }
})
