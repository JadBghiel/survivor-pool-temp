import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { prisma } from '@/lib/db'
import { verifyActiveUser } from '@/lib/auth'
import { ErrorSchema } from '@/lib/schemas'

export const employerApp = new OpenAPIHono()

type EmployerAuth =
  | { ok: true; userId: string }
  | { ok: false; error: string; status: 401 | 403 }

async function requireEmployer(authorizationHeader?: string): Promise<EmployerAuth> {
  const payload = await verifyActiveUser(authorizationHeader)
  if (!payload) return { ok: false, error: 'missing or invalid token', status: 401 }
  if (payload.role !== 'EMPLOYER') return { ok: false, error: 'employer access required', status: 403 }
  return { ok: true, userId: payload.sub }
}

// empluer dash: view count, and seeler application
// fed from  POST /jobs/{id}/view)
// apply process always 0 bc not impleented yet 
const DashboardSchema = z
  .object({
    stats: z.object({
      totalJobs: z.number(),
      activeJobs: z.number(),
      pendingJobs: z.number(),
      totalViews: z.number(),
      totalApplications: z.number().openapi({
        description:
          " 0: not done yet, src is applicationsAvailable",
      }),
    }),
    applicationsAvailable: z.boolean().openapi({
      description:
        "false not done yet",
    }),
    jobs: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        city: z.string(),
        contractType: z.string(),
        status: z.string(),
        viewCount: z.number(),
        applicationCount: z.number(),
        archived: z.boolean(),
        publishedAt: z.string(),
      }),
    ),
  })
  .openapi('EmployerDashboard')

const dashboardRoute = createRoute({
  method: 'get',
  path: '/employer/dashboard',
  tags: ['employer'],
  summary: 'Job listings and their counters for the authenticated employer',
  description:
    'requires an EMPLOYER bearer token. returns only the listings belonging to ' +
    'the caller, never another employer\'s. application counters are always 0 ' +
    'until the application feature ships.',
  responses: {
    200: { content: { 'application/json': { schema: DashboardSchema } }, description: 'dashboard data' },
    401: { content: { 'application/json': { schema: ErrorSchema } }, description: 'missing or invalid token' },
    403: { content: { 'application/json': { schema: ErrorSchema } }, description: 'employer access required' },
  },
})

employerApp.openapi(dashboardRoute, async (c) => {
  const auth = await requireEmployer(c.req.header('Authorization'))
  if (!auth.ok) return c.json({ error: auth.error }, auth.status)

  // Job.employerId ref EmployerProfile.userId, account id
  const rows = await prisma.job.findMany({
    where: { employerId: auth.userId },
    select: {
      id: true,
      title: true,
      city: true,
      contractType: true,
      status: true,
      viewCount: true,
      archivedAt: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  const live = rows.filter((job) => job.archivedAt === null)

  return c.json(
    {
      stats: {
        totalJobs: rows.length,
        activeJobs: live.filter((job) => job.status === 'PUBLISHED').length,
        pendingJobs: live.filter((job) => job.status === 'PENDING').length,
        totalViews: rows.reduce((sum, job) => sum + job.viewCount, 0),
        totalApplications: 0,
      },
      applicationsAvailable: false,
      jobs: rows.map((job) => ({
        id: job.id,
        title: job.title,
        city: job.city,
        contractType: job.contractType,
        status: job.status,
        viewCount: job.viewCount,
        applicationCount: 0,
        archived: job.archivedAt !== null,
        publishedAt: job.createdAt.toISOString().slice(0, 10),
      })),
    },
    200,
  )
})
