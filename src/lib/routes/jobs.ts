import { OpenAPIHono, createRoute } from '@hono/zod-openapi'
import { prisma } from '@/lib/db'
import {
  BboxQuerySchema,
  JobListSchema,
  JobSummarySchema,
  JobNearbyListSchema,
  NearbyQuerySchema,
  ErrorSchema,
} from '@/lib/schemas'
import { haversineDistanceKm, boundingBoxKm } from '@/lib/haversine'

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

// registered before /jobs/{id} below so the literal path "nearby" can never
// be swallowed by the :id param matcher and treated as a job id.
const nearbyJobs = createRoute({
  method: 'get',
  path: '/jobs/nearby',
  tags: ['jobs'],
  summary: 'List job listings near a point, nearest first',
  description:
    'Public endpoint, no authentication. Given a point and a radius in ' +
    'kilometers, returns listings within that radius, ordered by distance. ' +
    'Distance is computed with the haversine formula - no postgis required.',
  request: { query: NearbyQuerySchema },
  responses: {
    200: {
      content: { 'application/json': { schema: JobNearbyListSchema } },
      description: 'Matching listings within radiusKm, nearest first',
    },
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

jobs.openapi(nearbyJobs, async (c) => {
  const { lat, lng, radiusKm } = c.req.valid('query')

  // cheap rectangle prefilter in sql, using the existing
  // [archivedAt, latitude, longitude] index, so we never haversinescan the
  // whole table for a small radius on a large dataset wuold be too much
  const box = boundingBoxKm(lat, lng, radiusKm)

  const rows = await prisma.job.findMany({
    where: {
      archivedAt: null,
      latitude: { gte: box.minLat, lte: box.maxLat },
      longitude: { gte: box.minLng, lte: box.maxLng },
    },
    select,
    take: 500,
  })

  // the rectangles corners can be further than radiusKm from the point (a
  // circle inscribed in a square), so the exact distance still has to be
  // computed and filtered here, the sql query only narrowed the candidates
  const withDistance = rows
    .map((row) => ({
      ...toSummary(row),
      distanceKm: Math.round(haversineDistanceKm(lat, lng, row.latitude, row.longitude) * 10) / 10,
    }))
    .filter((job) => job.distanceKm <= radiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm)

  return c.json(withDistance, 200)
})

jobs.openapi(getJob, async (c) => {
  const { id } = c.req.valid('param')
  const row = await prisma.job.findFirst({ where: { id, archivedAt: null }, select })
  if (!row) return c.json({ error: 'not found' }, 404)
  return c.json(toSummary(row), 200)
})
