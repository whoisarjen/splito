import { requireAuth } from '../../../utils/auth'
import { prisma } from '../../../utils/db'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const inviteCode = getRouterParam(event, 'code')

  if (!inviteCode) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invite code is required',
    })
  }

  const group = await prisma.group.findUnique({
    where: { inviteCode },
    include: {
      members: {
        where: { userId: user.id },
      },
    },
  })

  if (!group) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Invalid invite code',
    })
  }

  if (group.isArchived) {
    throw createError({
      statusCode: 400,
      statusMessage: 'This group has been archived',
    })
  }

  // Check if already a member
  const existingMember = group.members.find((m) => m.userId === user.id)
  if (existingMember) {
    if (existingMember.leftAt) {
      // Rejoin the group
      await prisma.groupMember.update({
        where: { id: existingMember.id },
        data: { leftAt: null },
      })
    }
    // Already a member, redirect to group
    return { groupId: group.id, alreadyMember: true }
  }

  // Add user to group
  await prisma.groupMember.create({
    data: {
      groupId: group.id,
      userId: user.id,
      role: 'MEMBER',
    },
  })

  return { groupId: group.id, alreadyMember: false }
})
