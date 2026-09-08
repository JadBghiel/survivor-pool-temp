// page publique "transparence", demandee par l'email 9 (mme pontaillac, 2026-09-07):
// gratuite de la publication, maille de localisation retenue, duree de conservation,
// contact protection des donnees. decrit l'etat reel du produit au 2026-09-08, pas
// une politique ideale - meme convention que les autres livrables rgpd du dossier.
import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { DemoNotice } from '@/components/DemoNotice'

export const metadata = {
  title: 'Transparence — GéoEmploi',
}

export default function TransparencePage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
      <Logo size={32} textClassName="text-2xl font-semibold tracking-tight" />

      <h1 className="mt-8 text-2xl font-semibold">Transparence</h1>
      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
        Ce que fait réellement GéoEmploi avec les données qu&apos;il manipule.
        Cette page décrit l&apos;état actuel du produit, ce n&apos;est pas une politique prévue.
      </p>

      <section className="mt-10">
        <h2 className="text-lg font-medium">Publication d&apos;une offre</h2>
        <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
          La publication d&apos;une offre par un employeur est <strong>gratuite</strong>.
          Aucun abonnement, aucun tarif et aucune contrepartie financière ne sont
          demandés, ni prévus.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-medium">Précision de localisation</h2>
        <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
          Les offres sont géolocalisées à la <strong>maille communale</strong>, jamais à
          l&apos;adresse exacte. Une offre s&apos;affiche au centroïde officiel de sa
          commune, obtenu via l&apos;API Adresse (service public de l&apos;État). Ce
          centroïde est partagé par toutes les offres d&apos;une même commune.
        </p>
        <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
          Pour tout visiteur, un bouton facultatif (« Offres près de moi ») permet
          d&apos;afficher sa propre position sur la carte. Cette position n&apos;est
          jamais transmise à nos serveurs ni enregistrée : elle vit uniquement dans la
          mémoire de la page et disparaît à la fermeture ou au rechargement de
          l&apos;onglet.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-medium">Durée de conservation des données</h2>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-neutral-700 dark:text-neutral-300">
          <li>
            <strong>Position géographique du visiteur</strong> : aucune conservation.
            Elle n&apos;est jamais écrite en base de données.
          </li>
          <li>
            <strong>Compte et profil</strong> (e-mail, mot de passe haché, nom
            d&apos;entreprise ou profil candidat) : conservés tant que le compte existe.
            Un mécanisme de suppression de compte à la demande de l&apos;utilisateur est
            prévu et n&apos;est pas encore construit.
          </li>
          <li>
            <strong>Offres publiées</strong> : conservées tant qu&apos;elles ne sont pas
            retirées par leur employeur ou par la modération. L&apos;archivage
            automatique des offres de plus de 30 jours est prévu et n&apos;est pas
            encore construit.
          </li>
          <li>
            <strong>Journal des actions d&apos;administration</strong> (suspension d&apos;un
            compte, changement de statut d&apos;une offre) : conservé sans durée limite
            à ce jour.
          </li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-medium">Vos droits</h2>
        <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
          Export de vos données personnelles au format JSON, prévu par l&apos;article 20
          du RGPD : <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-[13px] dark:bg-neutral-800">GET /api/users/me/export</code>,
          accessible en étant connecté. Un compte neuf sans activité produit un export
          valide plutôt qu&apos;une erreur.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-medium">Contact protection des données</h2>
        <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
          Service juridique du cabinet du Ministre — Florine Pontaillac,
          conseillère juridique.
        </p>
      </section>

      <Link
        href="/"
        className="mt-10 inline-block text-sm underline underline-offset-4 text-[var(--color-accent)]"
      >
        Retour à la carte
      </Link>

      <DemoNotice className="mt-10 border-t border-neutral-200 pt-4 dark:border-neutral-800" />
    </main>
  )
}
