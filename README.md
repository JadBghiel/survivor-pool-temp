# ChomageGO (FKA geoemploi)

chomagego job listings

# AVAILABLE ON VERCEL [CLICK HERE](https://survivor-pool-temp.vercel.app/)
### also we have [API REFERENCE](https://survivor-pool-temp.vercel.app/api/docs#tag/jobs)
### and here you can check out [JOBS in the DB as json](https://survivor-pool-temp.vercel.app/api/jobs)
you can also see below how to test it locally 


## week 1 deliverable

only 4 things graded friday

- [x] map interface to browse listings: no account needed
- [x] job seeker and employer account creation
- [x] publish at least one geolocated listing
- [ ] oral presentation: demo + technical approach

rest is week 2, applications dashboards admin panel moderation reporting archiving
we design for it now but do not build it


## stack

we answer 3 things:
1) what does the visitor see
2) where does the data live
3) and how do those two talk to each other

- **next.js**: the app itself. draws the pages we see in the browser, and
  it is also secretly the mailman: when the page needs data it asks next.js,
  it goes and gets it, and hands it back. one project does both jobs, so
  there is only one thing to build and one thing to deploy

- **typescript**: javascript with a spellchecker for logic, if
  we write code that expects a job to have a `city` and later try to use
  `job.citty`, it is flagged red before we ever run it, instead of breaking

- **tailwind**: instead of writing a paragraph of css for every button, we
  write short class names directly on the html tag, like `text-sm` for small
  text or `p-4` for some padding. it is a big box of lego bricks for styling,
  faster than naming and writing a new css rule for everything

- **leaflet + IGN Géoplateforme**: the actual map widget, plus the map tiles it
  draws (roads, cities, coastlines). tiles migrated off openstreetmap to IGN's
  keyless flux per the ministry's convention (see CLIENT CONSTRAINTS above)

- **hono**: a tiny doorman living at `/api`. every request for data (get me
  the jobs, get me job #4) walks through this door first. it checks the
  request makes sense, then goes and fetches what was asked for

- **zod**: the doorman's rulebook. it describes exactly what a valid request
  and a valid job listing look like ("title is text, latitude is a number
  between -90 and 90"). the same rulebook both rejects bad requests and
  generates the documentation page below, so the rules and the docs can never
  disagree with each other

- **openapi doc + scalar, at `/api/docs`**: a web page listing every
  endpoint the api offers, what we can send it, and what it sends back. this
  is what the brief means by "documented rest api": a stranger can open this
  page and use the api without reading any code

- **prisma**: the translator between typescript and the database. instead of
  writing raw sql like `SELECT * FROM job WHERE city = 'Nantes'`, we write
  normal looking typescript, and prisma turns it into sql. it also keeps a
  history of every change to the database's shape (a "migration"), so the
  database can be rebuilt from scratch on any machine

- **postgresql (hosted by neon)**: the actual database, the filing cabinet
  where every job listing and user account is permanently stored. postgres is
  the software who lives in neon (direclty integrated in vercel)

- **jwt**: how the app recognizes we're logged in. after we log in once, the
  server hands us a signed note ("this is user #12, seeker role"). we show
  that note on every future request
  instead of typing wer password again each time

- **vercel**: the host, the computer that runs the app so anyone on the internet
  can open the url. `git push` is the entire
  deploy step: vercel notices the new code and rebuilds the site by itself

---

## TRY FEATURES LOCALLT BEFORE PUSHING
## bc any push redploys the vercel, when testing a feature make sure to do it locally first before pushing

you can use docker to have a throwaway database on your own
machine, good enough to test stuff

```bash
npm install                 # download the packages, once
npm run db:local             # starts a postgres 16 container on port 55432
cp .env.example .env         # then set both DATABASE_URL and DIRECT_URL to
                              # postgresql://postgres:local@localhost:55432/geoemploi
npm run db:migrate           # creates the tables inside that container
npm run db:seed              # fills them with 1 employer and 3 jobs
npm run dev                  # starts the site
```

now open, in your browser:

- http://localhost:3000 - the site itself, with the 3 seeded jobs
- http://localhost:3000/api/jobs - the same jobs as raw json
- http://localhost:3000/api/docs - the api documentation page

edit a file and save it, the browser updates itself, no restart needed

when you are done, `npm run db:local:stop` stops the container. the data
stays saved inside it, so running `npm run db:local` again later picks up
right where you left off, no need to migrate or seed twice.


## TODO

status re-checked 2026-09-05. two separate task lists below, kept deliberately apart
because they come from two different sources of truth that don't always agree:

- **spec tasks** — from `SECOND_VERSION_instructions.md` (v1.1, the minister's own
  rewrite) only. this is the product spec.
- **email tasks** — from `docs/EMAILS.md` only. these are the cabinet's operational
  asks, each with its own sender and deadline, layered on top of the spec.

cross-cutting items (done list, the seed data warning) apply to both and sit above
the split. THE MORE URGENT STUFF IS AT THE TOP within each list.

### ⚠ seed data contradicts what's already been sent out - fix this first

`docs/PRESS_KIT.md` (already answered to Benjamin, email 5) describes 6 employers,
12 bordeaux jobs, and real demo logins (`demo1234`). **`prisma/seed.ts` on `main`
does not produce that** - it's still the original 1-employer/3-job version with a
placeholder password hash nobody can log in with. that richer seed (6 employers, 30
jobs across bordeaux/paris/lyon/marseille, a loginable seeker) exists and was
verified working, but only ever lived on `test/kit_presse` and was never merged to
`main`. bring it over before doing anything else - right now the deliverable already
sent describes a database that doesn't exist here.

### done (cross-cutting)

- [x] geocoding: address in, { latitude, longitude } out, via API Adresse
      (src/lib/geocode.ts) - migrated per Thomas Vignal's email
- [x] geocoding error handling: not_found, rate_limited, network_error, invalid_response,
      each returned as a typed result
- [x] browser geolocation: "find jobs near me" button, explicit click only, all four
      outcomes handled (denied, unavailable, timeout, unsupported), position stays in
      client state only (src/lib/geolocation.ts + src/components/LocateMeButton.tsx)
- [x] haversine distance + boundingBoxKm sql prefilter (src/lib/haversine.ts)
- [x] nearby jobs query: GET /api/jobs/nearby?lat&lng&radiusKm, sorted nearest first
- [x] map tiles: IGN Géoplateforme WMTS, leaflet kept as the rendering lib, keyless flux
      (src/app/JobsMap.tsx) migrated off maptiler - confirmed live on main
- [x] register / login / me, bcrypt + jwt, seeker and employer roles
      (src/lib/routes/auth.ts, src/components/AuthHeader.tsx)
- [x] publish a listing: POST /api/jobs, employer-only, geocodes server side, rejects
      if the address doesn't resolve (src/lib/routes/jobs.ts)
- [x] github actions workflow: builds end to end, seeds, publishes the .next build as
      an artifact on every push to main (.github/workflows/build.yml) - reconfirm it's
      green on the latest commit each time, it regressed once already
- [x] prototype documented (2 pages), user guide with real screenshots, plan B - all
      live in docs/ (PROTOTYPE_DOCUMENTE.md, USER_GUIDE.md + user_guided_images/,
      PLAN_B.md), sent to JEB (email 4)
- [x] kit presse (email 5): 5 press-ready screenshots in docs/PRESS_KIT_SCREENSHOTS/,
      3 taglines in docs/PRESS_KIT.md, sent to Benjamin - see the seed data warning
      above though, the doc oversells what main's db currently holds
- [x] db schema diagram: docs/schema.dbml (source) + docs/schema.svg (rendered),
      matches the running schema.prisma exactly, sent to Thomas (email 2 reply)
- [x] `.env.example` complete - was missing `DIRECT_URL`, added

---

## 📘 spec tasks — from SECOND_VERSION_instructions.md only

### week 1 (unstruck in v1.1, none of these four are optional)

- [ ] confirm the map interface browses listings with no account required (already
      true today, just verify it stays true as the rest of this list lands)
- [ ] **build AR-on-map (simulated is fine).** "map with AR listings (or simulated on
      a map if real AR is too complicated for week 1, but it must be on the roadmap)".
      badges and the Work Permit stay week 2 - see the AR proposal already sent to
      JEB in docs/EMAILS.md (email 4, réponse 2), pick one of the two options and
      build it
- [x] job-seeker and employer account creation
- [x] publication of a geolocated listing

### week 2 (unstruck in v1.1)

- [ ] all features, including the badge system and the "JEB Work Permit" after 10
      catches, on top of whichever AR-on-map interaction lands above
- [ ] employer dashboard: stats + subscription management - exists on
      `test/kit_presse` (source of the "tableau de bord employeur" press screenshot,
      currently mock data), needs merging to main and wiring to real numbers
- [ ] complete admin: moderate listings, activate/suspend accounts, national metrics,
      real ADMIN-role account and guarded routes (v1.1: "admin is me or my assistant,
      give me the highest permissions")
- [ ] technical doc + retrospective

### v1.1-specific technical asks (JEB's marginalia in sections 2-3, weigh deliberately)

- [ ] implement the €400/month employer subscription with radius-based pricing tiers:
      real payment, and enforcement of the tier against the radius an employer sets
- [ ] build the real-time map update path (JEB: "websockets or whatever you want") -
      note this collides with Thomas's email 2 ask for a polling fallback, see below
- [ ] tune the map's display/zoom for street-level precision, v1.1's upgrade from the
      original district/municipality spec - the stored lat/lng is already exact, so
      this is a display decision, not new plumbing
- [ ] decide whether the minister's own admin account should be a literal seed
      account or just a role assignment
- [ ] apply flow (apply button + application tracking) - not in v1.1's explicit
      deliverable checkmarks (implied under "all features"), exists on
      `test/kit_presse` already (source of the "parcours de candidature" press
      screenshot), needs merging to main

---

## 📧 email tasks — from docs/EMAILS.md only

read docs/EMAILS.md for the full email text and what's already been sent back.

### Email 1a — Thomas Vignal, cartography (no stamped deadline, but "the day it lands")

- [ ] add geocoding traceability columns (source, confidence score, date) via a
      schema migration - changes the db schema, re-render docs/schema.svg after
- [ ] write the re-geocode script for existing listings: rerunnable, idempotent,
      rate-limit aware, routing unresolved addresses to a "localisation à vérifier"
      state
- [ ] the migration report (rows migrated/failed, average drift, top 5 displacements)
      and the 2-page migration note - nothing written yet
- [ ] add server-side Lambert-93 (EPSG:2154) coordinate conversion for the admin ui
      and exports

### Email 1b — Benjamin Sellami, charte graphique / name / video — friday 12:00

- [ ] apply the ministerial charte graphique everywhere: `#1B3A6B` primary (never as
      a button background), Marianne for titles / Spectral for body, logo top-left -
      checked, none of this exists in src/ yet
- [ ] produce the conformity checklist: every screen reviewed, "conforme" or "à
      faire, prévu [date]"
- [ ] trim or re-cut the demo video - `docs/raw-survivor-pool.webm` is 2:03, Benjamin's
      limit here is 2:00 (JEB's email 4 limit is 3:00, that one's fine as-is, this is
      a stricter, separate requirement)
- [x] name: staying with "ChomageGo" instead of Benjamin's "GéoEmploi" ask - team
      call, not a blocker, no action needed

### Email 2 — Thomas Vignal, architecture & deployment — schema sent, rest still open

- [x] db schema (image + dbml), sent - see done list above
- [x] `.env.example` complete, sent
- [x] openapi spec live at `/api/docs`, generated from the same zod schemas the
      handlers validate with - mentioned in the reply, not a new attachment
- [ ] capture real request/response examples from the running app, plus the `.http`
      file or curl script that produced them - the spec exists, the proof-of-real
      examples doesn't
- [ ] build a `/health` endpoint: app status, version, db connection, <200ms even
      when the tile provider is slow
- [ ] write the 1-page deployment note: prod hosting, resources, data leaving the infra
- [ ] add a server-side tile cache in front of IGN, expose hit/miss counts, measure
      them on a second load of the same view
- [ ] if the real-time map (v1.1 ask above) ships as websockets: document the
      config-toggleable polling fallback this email requires (ministry network
      blocks outbound websockets), list what differs between the two modes
- [ ] load test before next week's technical review: k6/locust/jmeter, 50 concurrent
      users x 3min on map + job list, db seeded with ≥500 jobs across ≥50 communes -
      not friday, but pairs with the seed data fix at the top of this file

### Email 3 — Florine Pontaillac, RGPD/accessibility/CGU — deprioritized, team decision

- [ ] ⚠ team decision (logged in prior README revision): v1.1 itself tells the team
      to deprioritize Florine's "additional requirements" in favor of JEB's document.
      nothing here is built. still open: art. 30 processing sheet, consent
      accepted/refused behavior table + screenshots, RGAA audit on 3 screens +
      keyboard-only walkthrough, CGU draft marked existant vs intention
- [ ] consider sending Florine a short note explaining the deprioritization decision
      rather than leaving her unanswered - not drafted yet, see docs/EMAILS.md

### Email 4 — Jean-Eudes Berlier, TV emergency — answered twice, done

- [x] prototype + guide + video + plan B + demo accounts, sent - see done list above
- [x] AR proposal (simulated markers vs radar effect) sent as a follow-up, awaiting
      his pick - once chosen, build it under the week 1 spec task above

### Email 5 — Benjamin Sellami, kit presse — done

- [x] 5 screenshots + 3 taglines, sent - see done list above

### Email 6 — Florine Pontaillac, AIPD — new, due tuesday 12:00 (or flag a delay by monday 12:00)

- [ ] AIPD allégée, 3 pages max: description du traitement, nécessité/proportionnalité,
      risques (ce que l'app fait réellement, au moins 2 risques non traités + pourquoi),
      mesures de réduction
- [ ] purge automatisée des historiques de localisation au-delà de 90 jours: commande
      unique, affiche examinés/supprimés, couvre aussi les enregistrements antérieurs
      à l'introduction de la durée, ne touche ni offres ni candidatures ni comptes
      (décompte avant/après à fournir), rejouable sans dégât
- [ ] export des données personnelles (art. 20, portabilité), JSON/CSV, déclenchable
      depuis l'espace personnel, complet (candidatures, historique de localisation,
      consentements), rien d'un autre utilisateur, un compte neuf sans activité
      produit un fichier valide et non une erreur
- [ ] mention d'information avant la première activation de la géolocalisation (pas
      dans les CGU), consultable depuis les réglages, contenu identique à la fiche
      de registre déjà transmise
- [ ] si le délai de mardi n'est pas tenable: écrire à Florine avant **lundi 12h00**
      en précisant lequel des quatre points est reporté et pourquoi - elle l'a dit
      explicitement, un report motivé passe, un manquant découvert mardi midi non
