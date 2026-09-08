import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { prisma } from '@/lib/db'
import { verifyActiveUser } from '@/lib/auth'
import { ErrorSchema } from '@/lib/schemas'

// gdpr export data from db as json when seeker
const ExportSchema = z
  .object({
    exportedAt: z.string().openapi({ example: '2026-09-08T10:00:00.000Z' }),
    account: z.object({
      id: z.string(),
      email: z.string(),
      role: z.enum(['SEEKER', 'EMPLOYER', 'ADMIN']),
      createdAt: z.string(),
    }),
    seekerProfile: z
      .object({
        firstName: z.string(),
        lastName: z.string(),
        headline: z.string().nullable(),
        skills: z.array(z.string()),
        availability: z.string().nullable(),
      })
      .nullable(),
    employerProfile: z
      .object({
        companyName: z.string(),
        siret: z.string().nullable(),
        verified: z.boolean(),
        // les offres publiees par cet employeur, ce sont ses propres donnees,
        // distinctes des offres d'un autre utilisateur
        jobs: z.array(
          z.object({
            id: z.string(),
            title: z.string(),
            city: z.string(),
            contractType: z.string(),
            status: z.string(),
            createdAt: z.string(),
          }),
        ),
      })
      .nullable(),
    applications: z.array(z.unknown()).openapi({
      description: "toujours vide: la fonctionnalite de candidature n'existe pas dans l'application",
    }),
    locationHistory: z.array(z.unknown()).openapi({
      description:
        "toujours vide: aucun historique de localisation n'est jamais enregistre, voir RGPD_FICHE_TRAITEMENT.md",
    }),
    consentRecords: z.array(z.unknown()).openapi({
      description:
        'toujours vide: le consentement de geolocalisation est redemande a chaque usage, jamais persiste',
    }),
  })
  .openapi('PersonalDataExport')

const exportRoute = createRoute({
  method: 'get',
  path: '/users/me/export',
  tags: ['users'],
  summary: 'Export all personal data held for the authenticated account (RGPD art. 20)',
  description:
    'requires a bearer token, returns only data belonging to the caller. ' +
    'applications, locationHistory and consentRecords are always empty arrays: ' +
    'the app does not implement applications and never stores location history ' +
    'or a consent trace. a brand new account with no activity still returns 200 ' +
    'with a valid, populated account/profile shape - never an error.',
  responses: {
    200: { content: { 'application/json': { schema: ExportSchema } }, description: 'personal data export' },
    401: { content: { 'application/json': { schema: ErrorSchema } }, description: 'missing or invalid token' },
  },
})

export const exportApp = new OpenAPIHono()

exportApp.openapi(exportRoute, async (c) => {
  const payload = await verifyActiveUser(c.req.header('Authorization'))
  if (!payload) return c.json({ error: 'missing or invalid token' }, 401)

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    include: {
      seekerProfile: true,
      employerProfile: { include: { jobs: true } },
    },
  })
  // verifyActiveUser already confirmed this row exists and is not suspended
  if (!user) return c.json({ error: 'missing or invalid token' }, 401)

  return c.json(
    {
      exportedAt: new Date().toISOString(),
      account: {
        id: user.id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt.toISOString(),
      },
      seekerProfile: user.seekerProfile
        ? {
            firstName: user.seekerProfile.firstName,
            lastName: user.seekerProfile.lastName,
            headline: user.seekerProfile.headline,
            skills: user.seekerProfile.skills,
            availability: user.seekerProfile.availability,
          }
        : null,
      employerProfile: user.employerProfile
        ? {
            companyName: user.employerProfile.companyName,
            siret: user.employerProfile.siret,
            verified: user.employerProfile.verified,
            jobs: user.employerProfile.jobs.map((job) => ({
              id: job.id,
              title: job.title,
              city: job.city,
              contractType: job.contractType,
              status: job.status,
              createdAt: job.createdAt.toISOString(),
            })),
          }
        : null,
      applications: [],
      locationHistory: [],
      consentRecords: [],
    },
    200,
  )
})
