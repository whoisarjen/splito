import type { H3Event } from 'h3'
import { nanoid } from 'nanoid'
import { prisma } from './db'

const SESSION_COOKIE_NAME = 'splito_session'
const SESSION_EXPIRY_DAYS = 30

export interface SessionUser {
  id: string
  email: string
  name: string
  avatar: string | null
  defaultCurrency: string
  locale: string
}

export async function createSession(userId: string): Promise<string> {
  const token = nanoid(32)
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + SESSION_EXPIRY_DAYS)

  await prisma.session.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  })

  return token
}

export async function getUserSession(event: H3Event): Promise<SessionUser | null> {
  const token = getCookie(event, SESSION_COOKIE_NAME)
  if (!token) return null

  const session = await prisma.session.findUnique({
    where: { token },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
          defaultCurrency: true,
          locale: true,
        },
      },
    },
  })

  if (!session) return null

  // Check if session expired
  if (new Date() > session.expiresAt) {
    await prisma.session.delete({ where: { id: session.id } })
    deleteCookie(event, SESSION_COOKIE_NAME)
    return null
  }

  return session.user
}

export async function requireAuth(event: H3Event): Promise<SessionUser> {
  const user = await getUserSession(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }
  return user
}

export function setSessionCookie(event: H3Event, token: string): void {
  setCookie(event, SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60,
    path: '/',
  })
}

export async function deleteSession(event: H3Event): Promise<void> {
  const token = getCookie(event, SESSION_COOKIE_NAME)
  if (token) {
    await prisma.session.deleteMany({ where: { token } })
  }
  deleteCookie(event, SESSION_COOKIE_NAME)
}

export async function findOrCreateUser(profile: {
  googleId: string
  email: string
  name: string
  avatar?: string
  locale?: string
}): Promise<SessionUser> {
  let user = await prisma.user.findUnique({
    where: { googleId: profile.googleId },
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      defaultCurrency: true,
      locale: true,
    },
  })

  if (!user) {
    // Check if user exists with same email (link accounts)
    const existingUser = await prisma.user.findUnique({
      where: { email: profile.email },
    })

    if (existingUser) {
      // Link Google account to existing user
      user = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          googleId: profile.googleId,
          avatar: profile.avatar || existingUser.avatar,
        },
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
          defaultCurrency: true,
          locale: true,
        },
      })
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          googleId: profile.googleId,
          email: profile.email,
          name: profile.name,
          avatar: profile.avatar,
          locale: profile.locale || 'en',
        },
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
          defaultCurrency: true,
          locale: true,
        },
      })
    }
  }

  return user
}
