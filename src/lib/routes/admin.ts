import { OpenAPIHono, createRoute } from '@hono/zod-openapi'
import { prisma } from '@/lib/db'
import { verifyAuthHeader } from '@/lib/auth'

const overviewRoute = createRoute({
  method: 'get',
  path: '/admin/overview',
  tags: ['admin'],
  summary: 'Get admin dashboard data',
  responses: {
    200: { description: 'Admin dashboard data' },
    401: { description: 'Missing or invalid token' },
    403: { description: 'Admin access required' },
  },
})

export const adminApp = new OpenAPIHono()

adminApp.openapi(overviewRoute, async (c) => {
  const payload = verifyAuthHeader(c.req.header('Authorization'))
  if (!payload) {
    return c.json({ error: 'missing or invalid token' }, 401)
  }

  if (payload.role !== 'ADMIN') {
    return c.json({ error: 'admin access required' }, 403)
  }

  const [totalUsers, seekers, employers, admins, activeJobs, users, jobs] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: 'SEEKER' } }),
    prisma.user.count({ where: { role: 'EMPLOYER' } }),
    prisma.user.count({ where: { role: 'ADMIN' } }),
    prisma.job.count({ where: { archivedAt: null } }),
    prisma.user.findMany({
      include: {
        seekerProfile: true,
        employerProfile: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.job.findMany({
      where: { archivedAt: null },
      include: {
        employer: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    }),
  ])

  return c.json(
    {
      stats: {
        totalUsers,
        seekers,
        employers,
        admins,
        activeJobs,
        pendingJobs: 0,
      },
      users: users.map((user) => ({
        id: user.id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt.toISOString().slice(0, 10),
        status: 'ACTIVE' as const,
        seekerProfile: user.seekerProfile
          ? {
              firstName: user.seekerProfile.firstName,
              lastName: user.seekerProfile.lastName,
            }
          : null,
        employerProfile: user.employerProfile
          ? {
              companyName: user.employerProfile.companyName,
            }
          : null,
      })),
      jobs: jobs.map((job) => ({
        id: job.id,
        title: job.title,
        company: job.employer.companyName,
        city: job.city,
        contractType: job.contractType,
        status: 'PUBLISHED' as const,
        publishedAt: job.createdAt.toISOString().slice(0, 10),
      })),
      logs: [],
    },
    200,
  )
})
