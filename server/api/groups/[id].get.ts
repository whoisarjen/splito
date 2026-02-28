import { requireAuth } from '../../utils/auth'
import { prisma } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const groupId = getRouterParam(event, 'id')

  if (!groupId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Group ID is required',
    })
  }

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
              email: true,
              avatar: true,
            },
          },
        },
      },
      categories: {
        orderBy: { name: 'asc' },
      },
      _count: {
        select: {
          expenses: {
            where: { isDeleted: false },
          },
          settlements: true,
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

  // Check if user is a member
  const isMember = group.members.some((m) => m.userId === user.id)
  if (!isMember) {
    throw createError({
      statusCode: 403,
      statusMessage: 'You are not a member of this group',
    })
  }

  const currentUserMember = group.members.find((m) => m.userId === user.id)

  return {
    id: group.id,
    name: group.name,
    description: group.description,
    defaultCurrency: group.defaultCurrency,
    settlementCurrency: group.settlementCurrency,
    imageUrl: group.imageUrl,
    inviteCode: group.inviteCode,
    createdAt: group.createdAt,
    updatedAt: group.updatedAt,
    memberCount: group.members.length,
    expenseCount: group._count.expenses,
    settlementCount: group._count.settlements,
    currentUserRole: currentUserMember?.role,
    members: group.members.map((m) => ({
      id: m.id,
      userId: m.user.id,
      name: m.nickname || m.user.name,
      email: m.user.email,
      avatar: m.user.avatar,
      role: m.role,
      joinedAt: m.joinedAt,
    })),
    categories: group.categories.map((c) => ({
      id: c.id,
      name: c.name,
      icon: c.icon,
      color: c.color,
    })),
  }
})
