import { PrismaNeon } from '@prisma/adapter-neon'
import { Prisma, PrismaClient } from '../../generated/prisma/client'
import { createError } from 'h3'

export const PRISMA_TO_HTTP_MAP: Record<string, number> = {
  P2002: 409,
  P2003: 400,
  P2014: 400,
  P2021: 500,
  P2022: 500,
  P2025: 404,
}

export const handlePrismaError = (error: unknown): never => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const knownError = error as Prisma.PrismaClientKnownRequestError
    const httpStatus = PRISMA_TO_HTTP_MAP[knownError.code] ?? 500
    throw createError({
      statusCode: httpStatus,
      statusMessage: knownError.message,
    })
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    const validationError = error as Prisma.PrismaClientValidationError
    throw createError({
      statusCode: 400,
      statusMessage: validationError.message,
    })
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    const initError = error as Prisma.PrismaClientInitializationError
    throw createError({
      statusCode: 503,
      statusMessage: initError.message,
    })
  }

  console.error('[Prisma] Unknown error type:', error)
  throw createError({
    statusCode: 500,
    statusMessage: 'Unknown error occurred',
  })
}

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL!
  const adapter = new PrismaNeon({ connectionString })

  const client = new PrismaClient({
    adapter,
    log: ['error', 'warn'],
  })

  return client.$extends({
    query: {
      $allOperations({
        args,
        query,
      }: {
        args: unknown
        query: (args: unknown) => Promise<unknown>
      }) {
        return query(args).catch(handlePrismaError)
      },
    },
  })
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>
} & typeof global

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma
}
