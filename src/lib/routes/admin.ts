import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { prisma } from '@/lib/db'
import { verifyActiveUser, verifyAuthHeader } from '@/lib/auth'

export const adminApp = new OpenAPIHono()

type AdminJwtPayload = {
  sub: string
  email: string
  role: string
}

// middleware function to check if the incoming request has a valid JWT token.
async function requireAdmin(authorizationHeader?: string) {
  const payload = await verifyActiveUser(authorizationHeader)
  if (!payload)
    return { error: 'missing or invalid token', status: 401 as const }
  if (payload.role !== 'ADMIN')
    return { error: 'admin access required', status: 403 as const }
  return { payload }
}

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

const updateUserStatusRoute = createRoute ({
  method: 'patch',
  path: '/admin/users/{id}/status',
  tags: ['admin'],
  summary: 'Update user status',
  request: {
    params: z.object({ id: z.string() }),
    body: {
      content: {
        'application/json': {
          schema: z.object({
            status: z.enum(['ACTIVE', 'SUSPENDED']),
          }),
        },
      },
    },
  },
  responses: {
    200: { description: 'User status updated successfully' },
    400: { description: 'Invalid payload' },
    401: { description: 'Missing or invalid token' },
    403: { description: 'Admin access required' },
    404: { description: 'User not found' },
  },
})

const updateJobStatusRoute = createRoute ({
  method: 'patch',
  path: '/admin/jobs/{id}/status',
  tags: ['admin'],
  summary: 'Update job post moderation status',
  request: {
    params: z.object({ id: z.string() }),
    body: {
      content: {
        'application/json': {
          schema: z.object({
            status: z.enum(['PUBLISHED', 'PENDING', 'FLAGGED']),
          }),
        },
      },
    },
  },
  responses: {
    200: { description: 'Job status updated successfully' },
    400: { description: 'Invalid payload' },
    401: { description: 'Missing or invalid token' },
    403: { description: 'Adming access required' },
    404: { description: 'Job not found' },
  },
})

// Function responsible to power the dashboard UI. It executes 9 database queries
// formats the values to ISO strings so they can be read
// and returns the structured JSON payload to the dashboard.
adminApp.openapi(overviewRoute, async (c) => {
  const auth = await requireAdmin(c.req.header('Authorization')) //block non-admins
  if ('error' in auth)
    return c.json({ error: auth.error }, auth.status)

  const [totalUsers, seekers, employers, admins, activeJobs, pendingJobs, users, jobs, logs] =
    await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'SEEKER' } }),
      prisma.user.count({ where: { role: 'EMPLOYER' } }),
      prisma.user.count({ where: { role: 'ADMIN' } }),
      prisma.job.count({ where: { archivedAt: null, status: 'PUBLISHED' } }),
      prisma.job.count({ where: { archivedAt: null, status: 'PENDING' } }),
      prisma.user.findMany({
        include: { seekerProfile: true, employerProfile: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.job.findMany({
        where: { archivedAt: null },
        include: { employer: true },
        orderBy: { createdAt: 'desc' },
        take: 30,
      }),
      prisma.auditLog.findMany({
        orderBy: { timestamp: 'desc' },
        take: 50,
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
        pendingJobs,
      },
      users: users.map((user) => ({
        id: user.id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt.toISOString().slice(0, 10),
        status: user.status,
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
        status: job.status,
        publishedAt: job.createdAt.toISOString().slice(0, 10),
      })),
      logs: logs.map((log) => ({
        id: log.id,
        action: log.action,
        target: log.target,
        timestamp: log.timestamp.toISOString().replace('T', ' ').slice(0, 19),
        actor: log.actor,
      })),
    },
    200,
  )
})

// Function responsible to update a user's status.
// It pulls the target userId from the path and target status from the JSON body.
// It'll then update the user's status and insert a record into the AuditLog table.
adminApp.openapi(updateUserStatusRoute, async (c) => {
  const auth = await requireAdmin(c.req.header('Authorization'))
  if ('error' in auth)
    return c.json({ error: auth.error }, auth.status)

  const userId = c.req.param('id')
  const { status } = c.req.valid('json')
  const targetUser = await prisma.user.findUnique({ where: { id: userId } })
  if (!targetUser)
    return c.json({ error: 'User not found' }, 404)

  // nico NEVER selecting passwordHash it would end up in the json response below and be aviabel for everyone to see
  // so i restriced the select
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { status },
    select: { id: true, email: true, role: true, status: true, createdAt: true },
  })

  const actionText = status === 'SUSPENDED' ? 'SUSPEND_USER' : 'ACTIVATE_USER'
  await prisma.auditLog.create({
    data: {
      action: actionText,
      target: `User ${targetUser.email} (${targetUser.id})`,
      actor: auth.payload.email,
      actorId: auth.payload.sub,
    },
  })

  return c.json({ success: true, user: updatedUser }, 200)
})

// Function responsible to update a job's status
// It pulls the target jobId from the path and target status from the JSON body.
// It'll then update the job's status and insert a record in the AuditLog table.
adminApp.openapi(updateJobStatusRoute, async (c) => {
  const auth = await requireAdmin(c.req.header('Authorization'))
  if ('error' in auth) return c.json({ error: auth.error }, auth.status)

  const jobId = c.req.param('id')
  const { status } = c.req.valid('json')

  const targetJob = await prisma.job.findUnique({ where: { id: jobId } })
  if (!targetJob) return c.json({ error: 'Job not found' }, 404)

  const updatedJob = await prisma.job.update({
    where: { id: jobId },
    data: { status },
  })

  const actionText =
    status === 'PUBLISHED' ? 'APPROVE_JOB' : status === 'FLAGGED' ? 'FLAG_JOB' : 'PENDING_JOB'

  await prisma.auditLog.create({
    data: {
      action: actionText,
      target: `Job "${targetJob.title}" (${targetJob.id})`,
      actor: auth.payload.email,
      actorId: auth.payload.sub,
    },
  })

  return c.json({ success: true, job: updatedJob }, 200)
})
