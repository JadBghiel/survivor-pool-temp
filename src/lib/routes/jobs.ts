import { OpenAPIHono, createRoute } from '@hono/zod-openapi'
import { prisma } from '@/lib/db'
import {
  BboxQuerySchema,
  JobListSchema,
  JobSummarySchema,
  JobNearbyListSchema,
  NearbyQuerySchema,
  PublishJobSchema,
  JobDetailSchema,
  ErrorSchema,
} from '@/lib/schemas'
import { haversineDistanceKm, boundingBoxKm } from '@/lib/haversine'
import { geocodeAddress } from '@/lib/geocode'
import { verifyAuthHeader } from '@/lib/auth'

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

const publishJob = createRoute({
  method: 'post',
  path: '/jobs',
  tags: ['jobs'],
  summary: 'Publish a new job listing',
  description:
    'requires an EMPLOYER bearer token, the address is geocoded server side via ' +
    'api adresse',
  request: { body: { content: { 'application/json': { schema: PublishJobSchema } } } },
  responses: {
    201: { content: { 'application/json': { schema: JobSummarySchema } }, description: 'listing created' },
    400: { content: { 'application/json': { schema: ErrorSchema } }, description: 'validation error or address could not be geocoded' },
    401: { content: { 'application/json': { schema: ErrorSchema } }, description: 'missing or invalid token' },
    403: { content: { 'application/json': { schema: ErrorSchema } }, description: 'only employers can publish listings' },
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
    200: { content: { 'application/json': { schema: JobDetailSchema } }, description: 'The listing' },
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

jobs.openapi(publishJob, async (c) => {
  const payload = verifyAuthHeader(c.req.header('Authorization'))
  if (!payload) return c.json({ error: 'missing or invalid token' }, 401)
  if (payload.role !== 'EMPLOYER') return c.json({ error: 'only employers can publish listings' }, 403)

  const { title, description, contractType, address, city, postalCode, radiusKm } = c.req.valid('json')

  const geocoded = await geocodeAddress({ address, city, postalCode })
  if (!geocoded.ok) {
    return c.json({ error: `Coundt not locate this address (${geocoded.reason})` }, 400)
  }

  const row = await prisma.job.create({
    data: {
      employerId: payload.sub,
      title,
      description,
      contractType,
      address,
      city,
      postalCode,
      radiusKm,
      latitude: geocoded.latitude,
      longitude: geocoded.longitude,
    },
    select,
  })

  return c.json(toSummary(row), 201)
})

jobs.openapi(getJob, async (c) => {
  const { id } = c.req.valid('param')
  const row = await prisma.job.findFirst({
    where: { id, archivedAt: null },
    select: { ...select, description: true, address: true, postalCode: true, radiusKm: true, createdAt: true },
  })
  if (!row) return c.json({ error: 'not found' }, 404)

  return c.json(
    {
      ...toSummary(row),
      description: row.description,
      address: row.address,
      postalCode: row.postalCode,
      radiusKm: row.radiusKm,
      createdAt: row.createdAt.toISOString(),
    },
    200,
  )
})
