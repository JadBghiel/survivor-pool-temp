import { OpenAPIHono, createRoute } from '@hono/zod-openapi'
import { prisma } from '@/lib/db'
import { BboxQuerySchema, JobListSchema, JobSummarySchema, ErrorSchema } from '@/lib/schemas'

// route definition and handler sit next to each other. the definition is what
// becomes the openapi doc, so documenting an endpoint is not a separate chore.

const listJobs = createRoute({
  method: 'get',
  path: '/jobs',
  tags: ['jobs'],
  summary: 'List published job listings',
  description:
    'Public endpoint, no authentication. Optionally filtered to a map bounding box. ' +
    'Archived listings are never returned.',
  request: { query: BboxQuerySchema },
  responses: {
    200: { content: { 'application/json': { schema: JobListSchema } }, description: 'Matching listings' },
  },
})

const getJob = createRoute({
  method: 'get',
  path: '/jobs/{id}',
  tags: ['jobs'],
  summary: 'Get one job listing',
  description: 'Public endpoint, no authentication.',
  request: { params: JobSummarySchema.pick({ id: true }) },
  responses: {
    200: { content: { 'application/json': { schema: JobSummarySchema } }, description: 'The listing' },
    404: { content: { 'application/json': { schema: ErrorSchema } }, description: 'No such listing' },
  },
})

// prisma row -> api shape. the api never leaks column names or the employer id.
type JobRow = {
  id: string
  title: string
  city: string
  contractType: string
  latitude: number
  longitude: number
  employer: { companyName: string }
}

const toSummary = (j: JobRow) => ({
  id: j.id,
  title: j.title,
  company: j.employer.companyName,
  city: j.city,
  contractType: j.contractType as 'CDI' | 'CDD' | 'INTERNSHIP' | 'APPRENTICESHIP' | 'FREELANCE',
  latitude: j.latitude,
  longitude: j.longitude,
})

const select = {
  id: true,
  title: true,
  city: true,
  contractType: true,
  latitude: true,
  longitude: true,
  employer: { select: { companyName: true } },
} as const

export const jobs = new OpenAPIHono()

jobs.openapi(listJobs, async (c) => {
  const { minLat, maxLat, minLng, maxLng } = c.req.valid('query')

  const rows = await prisma.job.findMany({
    where: {
      archivedAt: null,
      ...(minLat !== undefined && maxLat !== undefined
        ? { latitude: { gte: minLat, lte: maxLat } }
        : {}),
      ...(minLng !== undefined && maxLng !== undefined
        ? { longitude: { gte: minLng, lte: maxLng } }
        : {}),
    },
    select,
    orderBy: { createdAt: 'desc' },
    take: 200,
  })

  return c.json(rows.map(toSummary), 200)
})

jobs.openapi(getJob, async (c) => {
  const { id } = c.req.valid('param')
  const row = await prisma.job.findFirst({ where: { id, archivedAt: null }, select })
  if (!row) return c.json({ error: 'not found' }, 404)
  return c.json(toSummary(row), 200)
})
