import { requireAuth } from '../../../utils/auth'
import { prisma } from '../../../utils/db'
import { getExchangeRates } from '../../../utils/currency'
import { calculateBalances, calculateOptimalSettlements } from '../../../utils/balance'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const groupId = getRouterParam(event, 'id')

  if (!groupId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Group ID is required',
    })
  }

  // Get group with members
  const group = await prisma.group.findUnique({
    where: { id: groupId },
    include: {
      members: {
        where: { leftAt: null },
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

  if (!group) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Group not found',
    })
  }

  // Check membership
  const isMember = group.members.some((m) => m.userId === user.id)
  if (!isMember) {
    throw createError({
      statusCode: 403,
      statusMessage: 'You are not a member of this group',
    })
  }

  // Get all expenses with shares
  const expenses = await prisma.expense.findMany({
    where: {
      groupId,
      isDeleted: false,
    },
    select: {
      id: true,
      payerId: true,
      amount: true,
      currency: true,
      shares: {
        select: {
          userId: true,
          amount: true,
        },
      },
    },
  })

  // Get all settlements
  const settlements = await prisma.settlement.findMany({
    where: { groupId },
    select: {
      payerId: true,
      receiverId: true,
      amount: true,
      currency: true,
    },
  })

  // Get exchange rates
  const rates = await getExchangeRates()
  const settlementCurrency = group.settlementCurrency || group.defaultCurrency

  // Calculate balances
  const balances = calculateBalances(
    expenses.map((e) => ({
      id: e.id,
      payerId: e.payerId,
      amount: Number(e.amount),
      currency: e.currency,
      shares: e.shares.map((s) => ({
        userId: s.userId,
        amount: Number(s.amount),
      })),
    })),
    settlements.map((s) => ({
      payerId: s.payerId,
      receiverId: s.receiverId,
      amount: Number(s.amount),
      currency: s.currency,
    })),
    settlementCurrency,
    rates
  )

  // Get optimal settlements
  const suggestions = calculateOptimalSettlements(balances)

  // Create user lookup map
  const userMap = new Map(
    group.members.map((m) => [
      m.userId,
      { id: m.user.id, name: m.nickname || m.user.name, avatar: m.user.avatar },
    ])
  )

  return {
    currency: settlementCurrency,
    balances: balances.map((b) => ({
      user: userMap.get(b.userId) || { id: b.userId, name: 'Unknown', avatar: null },
      balance: b.balance,
    })),
    settlements: suggestions.map((s) => ({
      from: userMap.get(s.fromUserId) || { id: s.fromUserId, name: 'Unknown', avatar: null },
      to: userMap.get(s.toUserId) || { id: s.toUserId, name: 'Unknown', avatar: null },
      amount: s.amount,
    })),
  }
})
