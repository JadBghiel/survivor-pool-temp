import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@/generated/prisma/client'

// next dev hot reloads this module on every edit, and vercel imports it once per
// cold start. without the global cache we would open a new pg pool each time and
// exhaust neon's connection limit.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

function createClient() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set. copy .env.example to .env and fill it in.')
  }
  // prisma 7 talks to postgres through a driver adapter. pg is the plain tcp
  // driver, which is what neon's pooled endpoint expects.
  const client = new PrismaClient({ adapter: new PrismaPg({ connectionString }) })
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = client
  return client
}

// built lazily on first query, never at import time. `next build` imports every
// route module to collect metadata, and env vars are not guaranteed to be there
// yet - connecting eagerly would fail the build instead of the request.
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client = globalForPrisma.prisma ?? createClient()
    return Reflect.get(client, prop, receiver)
  },
})
