import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
})

// FIX: RM EXACT geocoeed adreese we are not doing tjhis anymroe now they are at the 
//  centroides communaux que la migration of (commit a0b4af2)
const jobs = [
  { title: 'Développeur backend Node.js', contractType: 'CDI' as const, address: '12 rue de la Fosse', city: 'Nantes', postalCode: '44000', latitude: 47.239367, longitude: -1.555335 },
  { title: 'Chargé de mission emploi', contractType: 'CDD' as const, address: '5 place Bellecour', city: 'Lyon', postalCode: '69002', latitude: 45.758, longitude: 4.835 },
  { title: 'Alternant data analyst', contractType: 'APPRENTICESHIP' as const, address: '2 rue Sainte-Catherine', city: 'Bordeaux', postalCode: '33000', latitude: 44.851939, longitude: -0.587877 },
]

async function main() {
  const adminPasswordHash = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'testAdmin@gmail.com' },
    update: {},
    create: {
      email: 'testAdmin@gmail.com',
      passwordHash: adminPasswordHash,
      role: 'ADMIN'
    }
  })
  console.log(`Admin account seeded: ${admin.email} (Password: admin123)`)

  // l'employeur de demo s'appelait "Ministère du job & bonheur" avec une adresse
  // .gouv.fr, retire le 2026-09-07 (email 7). la cle d'upsert etant l'email, il faut
  // supprimer explicitement l'ancienne ligne, sinon elle survit dans les bases deja
  // peuplees et le jeu de demo continue d'afficher le Ministere comme employeur.
  const legacyEmployer = await prisma.user.findUnique({
    where: { email: 'recrutement@ministere-job-bonheur.gouv.fr' },
  })
  if (legacyEmployer) {
    await prisma.job.deleteMany({ where: { employerId: legacyEmployer.id } })
    await prisma.employerProfile.deleteMany({ where: { userId: legacyEmployer.id } })
    await prisma.user.delete({ where: { id: legacyEmployer.id } })
    console.log('removed legacy state-branded demo employer')
  }

  const employer = await prisma.user.upsert({
    where: { email: 'recrutement@atlantique-logistique.fr' },
    update: {},
    create: {
      email: 'recrutement@atlantique-logistique.fr',
      // placeholder. milestone 2 replaces this with a real bcrypt hash at register time.
      passwordHash: 'seed-placeholder-not-a-real-hash',
      role: 'EMPLOYER',
      employerProfile: {
        create: {
          companyName: 'Atlantique Logistique',
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
      locationPrecision: 'MUNICIPALITY' as const,
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
