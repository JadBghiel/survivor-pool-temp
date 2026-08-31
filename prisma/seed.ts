import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma/client'

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
})

// real coordinates so the demo map looks like a real map, not three dots in a field.
const jobs = [
  { title: 'Développeur backend Node.js', contractType: 'CDI' as const, address: '12 rue de la Fosse', city: 'Nantes', postalCode: '44000', latitude: 47.2135, longitude: -1.5545 },
  { title: 'Chargé de mission emploi', contractType: 'CDD' as const, address: '5 place Bellecour', city: 'Lyon', postalCode: '69002', latitude: 45.7578, longitude: 4.832 },
  { title: 'Alternant data analyst', contractType: 'APPRENTICESHIP' as const, address: '2 rue Sainte-Catherine', city: 'Bordeaux', postalCode: '33000', latitude: 44.8378, longitude: -0.5792 },
]

async function main() {
  const employer = await prisma.user.upsert({
    where: { email: 'recrutement@ministere-job-bonheur.gouv.fr' },
    update: {},
    create: {
      email: 'recrutement@ministere-job-bonheur.gouv.fr',
      // placeholder. milestone 2 replaces this with a real bcrypt hash at register time.
      passwordHash: 'seed-placeholder-not-a-real-hash',
      role: 'EMPLOYER',
      employerProfile: {
        create: {
          companyName: 'Ministère du job & bonheur',
          siret: '12345678900011',
          verified: true,
        },
      },
    },
    include: { employerProfile: true },
  })

  await prisma.job.deleteMany({ where: { employerId: employer.id } })
  await prisma.job.createMany({
    data: jobs.map((j) => ({
      ...j,
      employerId: employer.id,
      description: `${j.title} basé à ${j.city}. Offre de démonstration.`,
      radiusKm: 25,
    })),
  })

  const count = await prisma.job.count()
  console.log(`seeded, ${count} jobs in the database`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
