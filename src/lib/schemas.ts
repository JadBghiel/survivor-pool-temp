import { z } from '@hono/zod-openapi'

// one schema per shape, used to validate the request AND to generate the
// openapi document. they cannot drift apart because there is only one of them.

export const ContractTypeSchema = z
  .enum(['CDI', 'CDD', 'INTERNSHIP', 'APPRENTICESHIP', 'FREELANCE'])
  .openapi({ example: 'CDI' })

// what the map needs for a marker, and nothing more.
// 3.4 - the payload stays flat as the dataset grows, which is what keeps the
// map under 3s. the full record is only fetched when a marker is opened.
export const JobSummarySchema = z
  .object({
    id: z.string().openapi({ example: 'clx0000000000000000000000' }),
    title: z.string().openapi({ example: 'Développeur backend' }),
    company: z.string().openapi({ example: 'Ministère du job & bonheur' }),
    city: z.string().openapi({ example: 'Nantes' }),
    contractType: ContractTypeSchema,
    latitude: z.number().openapi({ example: 47.2184 }),
    longitude: z.number().openapi({ example: -1.5536 }),
  })
  .openapi('JobSummary')

export const JobListSchema = z.array(JobSummarySchema).openapi('JobList')

// the map will send its viewport here at milestone 1. accepted already so the
// contract does not change when leaflet lands.
export const BboxQuerySchema = z.object({
  minLat: z.coerce.number().min(-90).max(90).optional().openapi({ example: 47.0 }),
  maxLat: z.coerce.number().min(-90).max(90).optional().openapi({ example: 49.0 }),
  minLng: z.coerce.number().min(-180).max(180).optional().openapi({ example: -2.0 }),
  maxLng: z.coerce.number().min(-180).max(180).optional().openapi({ example: 2.5 }),
})

// the "find jobs near me" query: a point plus how far someone is willing to
// travel. all three are required, this endpoints whole reason to exist is
// a point and a radius, unlike the bbox query above where every field is
// optional
export const NearbyQuerySchema = z.object({
  lat: z.coerce.number().min(-90).max(90).openapi({ example: 47.2135 }),
  lng: z.coerce.number().min(-180).max(180).openapi({ example: -1.5545 }),
  radiusKm: z.coerce.number().positive().max(200).openapi({ example: 25 }),
})

export const JobNearbySchema = JobSummarySchema.extend({
  distanceKm: z.number().openapi({ example: 3.2 }),
}).openapi('JobNearby')

export const JobNearbyListSchema = z.array(JobNearbySchema).openapi('JobNearbyList')

export const ErrorSchema = z
  .object({ error: z.string().openapi({ example: 'not found' }) })
  .openapi('Error')
