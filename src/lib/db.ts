import { PrismaClient } from '@prisma/client'

// Ensure a single PrismaClient instance across hot reloads in development
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // You can enable logs for debugging if needed:
    // log: ['query', 'error', 'warn']
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma