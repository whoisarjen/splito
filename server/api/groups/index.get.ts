import { requireAuth } from '../../utils/auth'
import { prisma } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)

  const groups = await prisma.group.findMany({
    where: {
      isArchived: false,
      members: {
        some: {
          userId: user.id,
          leftAt: null,
        },
      },
    },
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
      _count: {
        select: {
          expenses: {
            where: { isDeleted: false },
          },
        },
      },
    },
    orderBy: { updatedAt: 'desc' },
  })

  return groups.map((group) => ({
    id: group.id,
    name: group.name,
    description: group.description,
    defaultCurrency: group.defaultCurrency,
    settlementCurrency: group.settlementCurrency,
    imageUrl: group.imageUrl,
    inviteCode: group.inviteCode,
    createdAt: group.createdAt,
    memberCount: group.members.length,
    expenseCount: group._count.expenses,
    members: group.members.map((m) => ({
      id: m.id,
      userId: m.user.id,
      name: m.nickname || m.user.name,
      avatar: m.user.avatar,
      role: m.role,
    })),
  }))
})
