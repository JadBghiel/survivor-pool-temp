import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma/client'

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
})

// every demo account shares this password, it is written down in PRESS_KIT.md so
// anyone doing a demo can log in without asking
const DEMO_PASSWORD = 'demo1234'

//mockuop jobs for demo
const employers = [
  {
    email: 'recrutement@atlantique-logistique.fr',
    companyName: 'Atlantique Logistique',
    siret: '81234567800019',
    jobs: [
      {
        title: 'Responsable d’exploitation logistique',
        contractType: 'CDI' as const,
        address: '12 quai de Bacalan',
        city: 'Bordeaux',
        postalCode: '33300',
        latitude: 44.8702,
        longitude: -0.5641,
        description:
          "Vous pilotez l'exploitation de notre plateforme des Bassins à flot : 40 collaborateurs, 12 000 m² d'entrepôt et environ 300 expéditions par jour vers toute la Nouvelle-Aquitaine.\n\nVos missions\n- Encadrer les quatre chefs d'équipe et organiser les plannings sur deux rotations\n- Piloter les indicateurs de service : taux de service, casse, délai de préparation\n- Être l'interlocuteur direct des transporteurs et des clients grands comptes\n- Faire vivre la démarche sécurité sur le site, avec un objectif de zéro accident déclaré\n\nProfil recherché\nVous avez au moins cinq ans d'expérience en exploitation logistique, dont deux en management d'équipe. Vous êtes à l'aise avec un WMS et vous savez lire un compte d'exploitation.\n\nCe que nous proposons\nCDI au forfait jour, 13e mois, participation, mutuelle prise en charge à 70 %, deux jours de télétravail par semaine sur la partie pilotage, et un vrai budget formation.",
      },
      {
        title: 'Préparateur de commandes (CACES 1)',
        contractType: 'CDD' as const,
        address: '8 rue Lucien Faure',
        city: 'Bordeaux',
        postalCode: '33300',
        latitude: 44.8681,
        longitude: -0.5677,
        description:
          "CDD de six mois renouvelable sur notre site des Bassins à flot. Préparation de commandes à la vocale, contrôle qualité au départ, participation aux inventaires tournants. CACES 1 exigé, formation assurée sur nos outils. Horaires en équipe fixe, du lundi au vendredi.",
      },
    ],
  },
  {
    email: 'rh@garonne-ingenierie.fr',
    companyName: 'Garonne Ingénierie',
    siret: '81234567800026',
    jobs: [
      {
        title: 'Ingénieur études structures',
        contractType: 'CDI' as const,
        address: '25 cours du Chapeau Rouge',
        city: 'Bordeaux',
        postalCode: '33000',
        latitude: 44.8481,
        longitude: -0.6002,
        description:
          "Bureau d'études de 30 personnes spécialisé dans la réhabilitation d'ouvrages en milieu urbain dense. Vous prenez en charge les notes de calcul et le suivi d'exécution sur des chantiers de la métropole bordelaise. Maîtrise d'un logiciel de calcul aux éléments finis attendue.",
      },
      {
        title: 'Dessinateur projeteur BIM',
        contractType: 'CDI' as const,
        address: '25 cours du Chapeau Rouge',
        city: 'Bordeaux',
        postalCode: '33000',
        latitude: 44.8449,
        longitude: -0.6039,
        description:
          "Vous produisez les maquettes numériques de nos projets de réhabilitation sous Revit et assurez la synthèse avec les autres corps d'état. Poste ouvert aux profils confirmés comme aux jeunes diplômés motivés par la montée en compétence sur le BIM.",
      },
    ],
  },
  {
    email: 'contact@bordeaux-sante-services.fr',
    companyName: 'Bordeaux Santé Services',
    siret: '81234567800033',
    jobs: [
      {
        title: 'Infirmier coordinateur',
        contractType: 'CDI' as const,
        address: '4 place de la Victoire',
        city: 'Bordeaux',
        postalCode: '33000',
        latitude: 44.8253,
        longitude: -0.5687,
        description:
          "Coordination d'une équipe de douze soignants intervenant à domicile sur la rive gauche. Vous construisez les plannings de tournée, assurez le lien avec les médecins traitants et accompagnez les nouveaux arrivants. Diplôme d'État d'infirmier exigé, véhicule de service fourni.",
      },
      {
        title: 'Auxiliaire de vie sociale',
        contractType: 'CDD' as const,
        address: '4 place de la Victoire',
        city: 'Bordeaux',
        postalCode: '33000',
        latitude: 44.8226,
        longitude: -0.5716,
        description:
          "Accompagnement au quotidien de personnes âgées à domicile : aide au lever, préparation des repas, courses, maintien du lien social. Secteur d'intervention limité à Bordeaux centre et Bègles, pour des tournées courtes et régulières. Débutants acceptés, tutorat les trois premières semaines.",
      },
    ],
  },
  {
    email: 'emploi@aquitaine-formation.fr',
    companyName: 'Aquitaine Formation',
    siret: '81234567800040',
    jobs: [
      {
        title: 'Formateur numérique et bureautique',
        contractType: 'FREELANCE' as const,
        address: '18 rue de Tauzia',
        city: 'Bordeaux',
        postalCode: '33800',
        latitude: 44.8339,
        longitude: -0.5849,
        description:
          "Interventions auprès de publics en reconversion, sur des modules de deux à cinq jours : bureautique, outils collaboratifs, culture numérique. Vacations régulières près de la gare Saint-Jean, rémunération à la journée, planning construit un mois à l'avance.",
      },
      {
        title: 'Chargé de relations entreprises',
        contractType: 'CDI' as const,
        address: '18 rue de Tauzia',
        city: 'Bordeaux',
        postalCode: '33800',
        latitude: 44.8306,
        longitude: -0.5883,
        description:
          "Vous développez notre réseau d'entreprises partenaires sur la métropole et placez nos stagiaires en immersion professionnelle. Le poste combine prospection, suivi de parcours et animation d'événements de recrutement.",
      },
    ],
  },
  {
    email: 'jobs@studio-cadran.fr',
    companyName: 'Studio Cadran',
    siret: '81234567800057',
    jobs: [
      {
        title: 'Développeur front-end React',
        contractType: 'CDI' as const,
        address: '7 rue des Faussets',
        city: 'Bordeaux',
        postalCode: '33000',
        latitude: 44.8567,
        longitude: -0.5589,
        description:
          "Studio de dix personnes qui conçoit des interfaces pour des acteurs publics et culturels. Vous travaillez sur des projets de trois à six mois, en binôme avec un designer, avec une attention réelle portée à l'accessibilité (RGAA) et aux performances.",
      },
      {
        title: 'Alternant designer d’interface',
        contractType: 'APPRENTICESHIP' as const,
        address: '7 rue des Faussets',
        city: 'Bordeaux',
        postalCode: '33000',
        latitude: 44.8541,
        longitude: -0.5629,
        description:
          "Alternance de 12 ou 24 mois, rythme trois semaines en entreprise et une semaine en école. Vous participez aux ateliers de cadrage, produisez des maquettes et contribuez à notre système de design interne.",
      },
    ],
  },
  {
    email: 'recrutement@metropole-habitat.fr',
    companyName: 'Métropole Habitat',
    siret: '81234567800064',
    jobs: [
      {
        title: 'Gestionnaire de patrimoine locatif',
        contractType: 'CDI' as const,
        address: '30 avenue Thiers',
        city: 'Bordeaux',
        postalCode: '33100',
        latitude: 44.8381,
        longitude: -0.5461,
        description:
          "Suivi technique et administratif d'un patrimoine de 600 logements sur la rive droite. Visites de parties communes, relation avec les locataires, pilotage des prestataires d'entretien. Permis B nécessaire, déplacements quotidiens sur le secteur.",
      },
      {
        title: 'Chargé de mission rénovation énergétique',
        contractType: 'CDD' as const,
        address: '30 avenue Thiers',
        city: 'Bordeaux',
        postalCode: '33100',
        latitude: 44.8352,
        longitude: -0.5492,
        description:
          "Mission de 18 mois pour accompagner notre plan de rénovation thermique : diagnostic du parc, montage des dossiers de financement, suivi des travaux avec les locataires en place.",
      },
    ],
  },
]

// one seeker account, filled in, so the application flow can be demonstrated
const seeker = {
  email: 'camille.fabre@example.fr',
  firstName: 'Camille',
  lastName: 'Fabre',
  headline: 'Chargée de projet logistique, 4 ans d’expérience',
  skills: ['Logistique', 'Gestion de projet', 'Excel', 'SAP'],
  availability: 'Disponible sous 1 mois',
}

async function main() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10)

  for (const { email, companyName, siret, jobs } of employers) {
    const employer = await prisma.user.upsert({
      where: { email },
      update: { passwordHash },
      create: {
        email,
        passwordHash,
        role: 'EMPLOYER',
        employerProfile: { create: { companyName, siret, verified: true } },
      },
    })

    // rerunnable: an employer's listings are rebuilt from scratch on every seed
    await prisma.job.deleteMany({ where: { employerId: employer.id } })
    await prisma.job.createMany({
      data: jobs.map((j) => ({ ...j, employerId: employer.id, radiusKm: 25 })),
    })
  }

  await prisma.user.upsert({
    where: { email: seeker.email },
    update: { passwordHash },
    create: {
      email: seeker.email,
      passwordHash,
      role: 'SEEKER',
      seekerProfile: {
        create: {
          firstName: seeker.firstName,
          lastName: seeker.lastName,
          headline: seeker.headline,
          skills: seeker.skills,
          availability: seeker.availability,
        },
      },
    },
  })

  const jobCount = await prisma.job.count()
  const userCount = await prisma.user.count()
  console.log(`seeded, ${jobCount} jobs and ${userCount} accounts in the database`)
  console.log(`demo password for every seeded account: ${DEMO_PASSWORD}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
