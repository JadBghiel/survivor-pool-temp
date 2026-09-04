# ChomageGO (FKA geoemploi)

chomagego job listings

see below how to test it locally 
## VERCEL IS PAUSED
# AVAILABLE ON VERCEL [CLICK HERE](https://survivor-pool-temp.vercel.app/)
# also we have [API REFERENCE](https://survivor-pool-temp.vercel.app/api/docs#tag/jobs)
# and here you can check out [JOBS in the DB as json](https://survivor-pool-temp.vercel.app/api/jobs)


## week 1 deliverable

only 4 things graded friday

- [x] map interface to browse listings: no account needed
- [x] job seeker and employer account creation
- [x] publish at least one geolocated listing
- [ ] oral presentation: demo + technical approach

rest is week 2, applications dashboards admin panel moderation reporting archiving
we design for it now but do not build it

---

## CLIENT CONSTRAINTS FROM CABINET EMAILS (2026-09-02) - BINDING, READ BEFORE CODING
four emails came in today from the ministry side, transcribed in follow_up_emails.txt.
none of this is optional, quoting the tone: "je ne vais pas faire semblant du contraire".
raw source stays in follow_up_emails.txt, this is the distilled checklist.

### ⚠ known conflict with current code, fix first
- **geocoding currently calls nominatim** (`src/lib/geocode.ts`) - now banned outright,
  must move to **API Adresse** (`api-adresse.data.gouv.fr`), no commercial geocoder allowed
- **map is wired to maptiler** (`src/app/JobsMap.tsx`, needs `NEXT_PUBLIC_MAPTILER_KEY`) -
  a paid third-party map api requiring an account is exactly what's now forbidden, twice over:
  once by the IGN-only tile mandate, once by the "no proprietary-account service" hosting rule
  below. keep leaflet as the rendering lib, swap only the tile source to IGN Géoplateforme
  (`https://data.geopf.fr/geocodage/openapi`)

### cartography & geocoding (Thomas Vignal, technical referent)
- map tiles: IGN Géoplateforme WMTS only, no openstreetmap, no third-party tile provider
- geocoding: API Adresse only, no commercial geocoder
- store per job listing: geocoding source, confidence score, date obtained (schema migration,
  due friday alongside the db schema deliverable)
- admin ui / exports must show coordinates in **Lambert-93 (EPSG:2154)** in addition to the
  WGS84 stored in db, converted server side
- **all existing job listings must be re-geocoded** via API Adresse (nominatim-geocoded ones
  are non-compliant): single rerunnable command, idempotent (safe to stop and rerun mid-way,
  never duplicates or overwrites already-correct rows), rate-limit aware since the api isn't
  unlimited
- any address the api can't resolve -> `localisation à vérifier` state, visible + manually
  correctable in admin, never dropped from the db, never rendered mid-atlantic
- migration report required: rows migrated, rows failed, average position drift in meters,
  the 5 largest displacements with their address (review these yourselves before sending)
- must keep working after the migration: free map browsing without account, job detail page,
  application flow, existing exports (a changed export format must be documented)
- deliverable: 2-page migration note

### architecture & deployment (Thomas Vignal, technical referent)
- openapi 3.0 spec (swagger ui) for every endpoint, **before** deploy not after; each endpoint
  needs a request/response example actually produced by the running app (not hand-written),
  plus the `.http` file or curl script that produced it
- db schema (logical model, cardinalities, indexes), image or dbml, due **friday 17:00**, must
  match the running db at all times (schema change thursday = diagram updated thursday)
- `.env.example` complete, zero secrets ever committed, including history (removing a secret
  in the next commit still counts as published)
- `/health` endpoint: app status, deployed version, db connection state, responds **<200ms**
  even when the tile provider is down
- **no paid/proprietary-account third party to run the app**: no managed object storage, no
  hosted db, no map api, no commercial auth or transactional email service. explicitly
  excludes aws, gcp, azure ("cloud de confiance" doctrine)
- **app must run fully locally from a clean clone using only our install instructions** - this
  is the actual acceptance test: a teammate clones into an empty folder, follows the install
  doc literally, times it, reports back
- 1-page deployment note: where this would be hosted in prod, what resources it needs, what
  data would leave the infra and to whom
- map tiles must go through a **server-side cache**, no direct browser -> tile provider call,
  no api key in the frontend bundle; cache hit/miss counts must be exposed and measured on a
  second load of the same view
- if using websockets: must document a polling fallback (ministry network blocks outbound ws),
  toggle by config not code change, and list what behaves differently between the two modes
- load test before next week's technical review: k6/locust/jmeter, 50 concurrent users x 3min
  on map browsing + job list, db seeded with **≥500 jobs across ≥50 communes**, deliver the
  script, median + p95 response times, error rate, and which line you'd fix first and why

### branding & communication (Benjamin Sellami, comms advisor)
- ministerial charte graphique mandatory **everywhere**, not just the homepage: login, 404,
  500, empty states ("no offers in this area"), loading screens, transactional emails,
  favicon, tab title, pdf exports
- institutional blue `#1B3A6B` as primary color, **never as a button background**
- fonts: Marianne for titles, Spectral for body text
- ministry logo top-left, protection zone respected, never over a photo
- deliverable: checklist of every screen reviewed, each marked "conforme" or "à faire,
  prévu [date]"
- displayed product name is **always "GéoEmploi"**, no nickname/working title, anywhere in
  the ui or in screenshots
  - ⚠ we went with **ChomageGo** in the frontend instead, the name in the v1.1 spec the
    minister rewrote himself, so sellami's directive is knowingly not respected on this point
    (internal names, package.json, docker container stay geoemploi)
- demo video: <2min, 1080p horizontal, burned-in subtitles mandatory (voiceover optional),
  readable on a phone
  - must be a screen capture of the real running app, no mockups/slides/reconstructed
    animation - continuous flow: open app, see the map, spot a listing 300m away, apply
  - seed data must look credible: real-sounding cities, companies, job titles, enough volume
    to fill the map - no listings named "test", no real personal data, no lorem ipsum
  - include 5 lines of intent: the 3 moments chosen to show, and what was cut
  - due **friday 12:00**

### legal & accessibility (Florine Pontaillac, legal advisor)
- geolocation is personal data under RGPD -> need an article 30 register-of-processing sheet
  (purpose, legal basis, retention, recipients) describing what the code **actually** does,
  not what's planned; for each data point, name the table+column it's stored in; end with the
  list of what is explicitly NOT collected
- consent must be free, specific, informed, unambiguous - no pre-checked boxes
- **app must stay fully usable if geolocation is refused**:
  - consent given/withdrawn anytime, mid-session included, without losing account/profile/
    in-progress applications
  - every screen using position needs a defined+tested refusal behavior, including when the
    user is outside the covered territory - deliverable is a table: screen (map, job list,
    job detail, application flow, employer dashboard) x accepted/refused
  - manual city entry stands in as the default position on refusal - refusal never leads to
    an error page or an empty screen
  - screenshots of both flows required, taken on the real running app
- accessibility: RGAA level AA minimum, self-conducted audit required (not a declaration) -
  pick 10 RGAA criteria, justify each in one sentence, test by hand on 3 screens (map,
  application form, employer dashboard), report result + gap per criterion; plus a full
  keyboard-only application walkthrough (no mouse), report where it breaks
- CGU (terms of use) cannot be published without legal's prior review - submit the draft
  before publishing, and every clause marked "existant" vs "intention" (no feature described
  that isn't actually shipped)
- deliverables due **friday 12:00**: art. 30 processing sheet (1 page), accessibility audit +
  results table, position accepted/refused behavior table with screenshots, draft CGU

---

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

- **leaflet + openstreetmap** NOT DONE YET the actual
  map widget, plus the map tiles it draws (roads, cities, coastlines). both
  are free and open source

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

- **jwt** NOT DONE YET: how the app will recognize we're
  logged in. after we log in once, the server hands we a signed note ("this
  is user #12, seeker role"). we show that note on every future request
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

btw i put florine stuff to week two bc i consider the pdf to be the source of truth
THE MORE URGENT STUFF IS AT THE TOP in the list below so please dont do a task if it the very next one 

### done

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
      (src/app/JobsMap.tsx) migrated off maptiler
- [x] register / login / me, bcrypt + jwt, seeker and employer roles
      (src/lib/routes/auth.ts, src/components/AuthHeader.tsx)
- [x] github actions workflow: builds end to end, seeds, publishes the .next build as
      an artifact on every push to main (.github/workflows/build.yml) reconfirm it's
      green on the latest commit each time, it regressed once already
- [x] prototype documented (2 pages), user guide with real screenshots, plan B all
      three exist at repo root, sent as email attachments

---

## 🔴 URGENT — due friday, start here

### core product (original brief's week 1 deliverable)

- [x] **build the publish a listing form.** wire the existing geocoder into an
      employer-facing form so listings can be created from the product itself, rather
      than only from the seed script. the single biggest priority against the week 1
      deliverable ("publication of a geolocated listing")
- [ ] confirm the map interface browses listings with no account required (already
      true today, just verify it stays true as the rest of this list lands)
- [ ] confirm job-seeker and employer account creation both work end to end (done via
      auth.ts/AuthHeader.tsx - reverify after any further changes)
- [ ] **build AR-on-map (simulated is fine).** an unstruck week 1 checkmark in v1.1:
      "map with AR listings (or simulated on a map if real AR is too complicated for
      week 1, but it must be on the roadmap)". badges and the "JEB Work Permit" stay
      week 2, but some version of this - even a simple "catch the listing" animation
      on the existing map - is a friday item, not a week 2 one
- [ ] prepare the oral presentation: functional demo + the technical approach

### cabinet deliverables with a stamped friday deadline

- [ ] db schema diagram (image or dbml), **friday 17:00**, matching the schema
      currently running - Thomas Vignal
- [ ] ministerial charte graphique conformity checklist + the demo video (<2min,
      1080p, burned-in subtitles), **friday 12:00** - Benjamin Sellami

### foundational work friday's review will expect, even without a stamped hour

- [ ] add geocoding traceability columns (source, confidence score, date) via a
      schema migration - feeds directly into the db schema deliverable above
- [ ] write the re-geocode script for existing listings: rerunnable, idempotent,
      rate-limit aware, routing unresolved addresses to a "localisation à vérifier"
      state, plus the migration report (rows migrated/failed, average drift, top 5
      displacements) and the 2-page migration note
- [ ] add server-side Lambert-93 (EPSG:2154) coordinate conversion for the admin ui
      and exports
- [ ] add a server-side tile cache in front of IGN, and expose hit/miss counts
- [ ] build a `/health` endpoint reporting app status, version, and db connection,
      responding within 200ms even when the tile provider is slow
- [ ] capture real request/response examples from the running app for the openapi
      spec, plus the .http file or curl script that produced them
- [ ] write the 1-page deployment note: prod hosting, resources, data leaving the infra
- [ ] apply the ministerial charte graphique everywhere: color, fonts, logo, plus the
      screens people forget - login, 404/500, empty states, loading, transactional
      emails, favicon, tab title, pdf exports

### seed data / demo readiness (blocks a credible friday demo)

- [ ] seed a real, loginable account per role (seeker, employer, admin) with an actual
      bcrypt hash - the current employer account uses a placeholder hash, so generate
      real credentials before any live demo
- [ ] expand the seed data to match Jean-Eudes Berlier's and both spec versions' demo
      bar: several hundred credible jobs across many communes, with varied
      descriptions

### housekeeping (cheap, do alongside the above)

- [ ] point `user_guide.md`'s screenshot paths at `user_guided_images/`, where the
      files actually live
- [ ] update the stack section further down to reflect that leaflet and jwt have shipped

---

## 🟢 week 2 — next week's technical review + keynote

### full feature set (both spec versions' week 2 deliverable)

- [ ] build the apply flow: an apply button on a listing plus application tracking,
      on top of the account system already in place
- [ ] build the employer dashboard: listings published, views, applications received,
      and subscription status (see €400/month below)
- [ ] build the admin panel: moderate listings, activate/suspend accounts, national
      metrics. give it a real ADMIN-role account and guarded routes (v1.1: "admin is
      me or my assistant, give me the highest permissions")
- [ ] build a reporting system so users can flag a fraudulent or non-compliant listing
- [ ] wire a scheduled job that archives listings older than 30 days, using the
      archivedAt column that already exists
- [ ] write the technical documentation (installation, api) and the project
      retrospective

### deprioritized per the team decision above (Florine Pontaillac's email)

- [ ] art. 30 RGPD processing sheet, the consent accepted/refused behavior table with
      screenshots, the RGAA accessibility audit on 3 screens + keyboard-only
      walkthrough, and the CGU draft marked existant vs intention - her email
      requested these for friday 12:00, moved here deliberately, see the note above

### v1.1-specific asks (minister's rewrite, weigh deliberately with the team)

- [ ] implement the €400/month employer subscription with radius-based pricing tiers:
      real payment, and enforcement of the tier against the radius an employer sets
- [ ] build the real-time map update path. start with the config-toggleable polling
      fallback Thomas Vignal's email requires (the ministry network blocks outbound
      websockets), then layer websockets on top if time allows
- [ ] tune the map's display/zoom for street-level precision, v1.1's upgrade from the
      original district/municipality spec - the stored lat/lng is already exact, so
      this is a display decision, cheap enough to pull forward to friday if time allows
- [ ] build the badge system and the "JEB Work Permit" after 10 catches, on top of the
      AR-on-map interaction that's a friday item above
- [ ] decide whether the minister's own admin account should be a literal seed
      account or just a role assignment

### load test (explicitly next week, not friday)

- [ ] run the load test: k6/locust/jmeter, 50 concurrent users for 3 minutes, against a
      db seeded with 500+ jobs across 50+ communes, due **before next week's technical
      review** per Thomas Vignal's email - pairs with the seed data expansion above,
      so the friday seed work doubles as prep for this





---

## why not vite, nestjs and docker compose

the first plan was a vite spa, a nestjs api and docker compose for postgres.
we changed it when we settled on vercel as the host. what actually drove it

### vercel has no always on server
vercel runs serverless functions, not a process that boots once and stays up.
nestjs is built around a long lived server, so putting it there means wrapping the
whole app in one function, eating cold starts and fighting the bundler.
next route handlers are already that shape, so there is nothing to adapt.

### the split was the real cost
keeping nestjs meant deploying it somewhere else, railway or render, and then
running two pipelines, two sets of env vars and cors between them.
one next app is one repo, one deploy, no cors, and the api is a relative path.

### nestjs was only buying us swagger
everything else it gives, structure, di, validation, we get from plain folders and
zod at this size. the brief asks for "swagger or equivalent", an artifact and not a
framework, so any generated openapi document satisfies it.
hono + zod-openapi generates it from the same schemas the handlers validate with,
which is the same single source of truth the nestjs decorators gave us.

### docker compose had nothing left to orchestrate
compose existed to start three services, db + api + web. there is one service now,
and neon is a url in an env var, so there is nothing to compose.
`vercel env pull` gives every teammate the same database with one command.

we kept one plain `docker run` behind `npm run db:local`, for working offline or
before the neon account exists. it is a convenience, not part of the deployed
architecture, and nothing about it ships to vercel.

### vite was not a loss
next has its own bundler, so choosing next answers the build tool question.
no capability was given up.

what we gave up, honestly, is the free swagger generation from decorators, and
nestjs on the slides. we wired the openapi doc by hand instead, once.

---

## design choices

### why not swagger

"swagger" in the brief is not one specific library to install, it is shorthand
for "a live, browsable api doc". two separate things share the name

- **openapi**, the spec format itself, the json describing every endpoint.
  this is the actual thing the brief wants
- **swagger ui**, one specific library that turns that json into a clickable
  page

our app has both: an openapi json file at `/api/openapi.json`, and a clickable
page rendering it at `/api/docs`. the requirement is met. we just used
**scalar** instead of **swagger ui** to draw that page, same job, nicer
default look, no react version fights. swapping it in would be a 10 minute
change if we ever wanted the classic look for the demo.

the place swagger is normally free is **nestjs**, via `@nestjs/swagger`

```ts
@Get()
@ApiOkResponse({ type: JobDto })   // this decorator alone gives you the doc
findAll() { ... }
```

decorate a method and the doc appears, no separate schema file, no manual
wiring. we dropped nestjs specifically because of vercel: vercel runs
serverless functions, not an always on server process, and nestjs is built
assuming the latter. keeping it meant either wrapping the whole app awkwardly
into one function (cold starts, bundler pain) or splitting the deploy across
two hosts, vercel plus railway or render, two pipelines, cors, double the env
var setup. that trade-off is the full "why not vite, nestjs and docker
compose" section below.

once nestjs was off the table, free swagger went with it, but the
requirement itself never needed nestjs, only the automation did. so we
rebuilt the same automation on our own stack

```
we describe the data  ->  @hono/zod-openapi generates the spec  ->  scalar draws it as a page
   (schemas.ts)              (createRoute + app.doc)                  (/api/docs)
```

same property nestjs gave us: the doc cannot drift from the code, because it
is generated from the same zod schemas that validate every request. just
wired by hand once instead of coming from decorators.

we did not skip the requirement, we skipped one specific brand of tool for
satisfying it, because that tool came bundled with a framework that fights
vercel's hosting model. the honest cost is losing the free part: writing this
took an afternoon instead of zero effort.

### no postgis for now
- plain latitude / longitude float columns
- browse = bounding box query on the current viewport
- haversine refine only if a radius is set
- brief asks municipality level precision so bbox is enough
- no extension to install no gist index to tune
- can move to geography point in week 2 without changing the api

### address to coordinates
- employer types an address
- geocoded server side with nominatim at publication time
- coordinates persisted: never geocode on read

### public vs authenticated routes
- get /api/jobs and get /api/jobs/:id fully public: free browsing is a hard requirement
- so no global auth middleware: auth opt in per route group
- applying in week 2 is the first seeker guarded route

### one user table with a role enum
- seekers and employers share email password auth
- specifics in optional seekerprofile / employerprofile relations
- one login flow one jwt shape and admin comes free in week 2

### performance budget: map under 3s
- listings returned slim: id title company city contracttype lat lng
- full detail fetched only when a marker is opened
- markers clustered client side
- viewport scoped queries so payload stays flat as data grows

### data protection: cheap to do now
- passwords hashed with bcrypt: never returned by any endpoint
- short privacy notice on the geolocation prompt
- deletedat on user and cascading relations from day one: retrofitting cascades is painful

### two connection strings
neon's pooled endpoint cannot run migrations. the app uses the pooled url, the
prisma cli uses the unpooled one. prisma7.config.ts is read by the cli only, the
app builds its own adapter in src/lib/db.ts.

---

## data model: week 1 subset

```
user            id email passwordhash role(seeker|employer|admin) createdat deletedat
seekerprofile   userid firstname lastname headline skills availability
employerprofile userid companyname siret verified
job             id employerid title description contracttype address city
                postalcode latitude longitude radiuskm createdat archivedat
```

archivedat exists from day one so week 2 auto archiving is a one line filter.
all of it ships in the first migration even though milestone 0 only reads job,
so adding auth later is a code change and not a schema change.

---

## layout

```
src/app/api/[[...route]]/route.ts   hono mounted, openapi spec + scalar docs
src/app/page.tsx                    listing page, replaced by the map at milestone 1
src/lib/db.ts                       lazy prisma singleton, pg driver adapter
src/lib/schemas.ts                  zod, the single source of truth
src/lib/routes/jobs.ts              route definitions and handlers together
prisma/schema.prisma                full week 1 schema
prisma/seed.ts                      1 employer, 3 jobs on real cities
prisma/migrations/                  first migration, committed
prisma7.config.ts                   read by the prisma cli only, never by the app
```

---

## getting started

neon is provisioned from the vercel dashboard, storage tab, so vercel owns the env
vars and injects them into every deployment. locally, pull the same ones down.

```bash
npm install
npx vercel link                     # once
npx vercel env pull .env.local
npm run db:migrate                  # creates the tables
npm run db:seed                     # 1 employer, 3 jobs
npm run dev
```

### no neon account yet
docker is not part of the architecture, but a throwaway postgres is the quickest
way to run the whole thing locally before anything is deployed.

```bash
npm run db:local            # postgres 16 on port 55432
cp .env.example .env        # then set both urls to
                            # postgresql://postgres:local@localhost:55432/geoemploi
npm run db:migrate
npm run db:seed
npm run dev
```

`npm run db:local:stop` stops it, the data survives. running it again reuses the
same container.

otherwise `cp .env.example .env` and paste the two neon urls.

- app        http://localhost:3000
- api        http://localhost:3000/api/jobs
- api docs   http://localhost:3000/api/docs
- spec       http://localhost:3000/api/openapi.json

vercel runs the build, never the migrations. after a schema change apply it to
production yourself with `npm run db:deploy`.

---

## task list

### milestone 0: built and verified locally, not deployed yet
- [x] next.js + ts + tailwind + eslint
- [x] prisma 7 + pg adapter, full week 1 schema, first migration
- [x] seed script, 1 employer + 3 listings on real cities
- [x] hono under /api, get /api/jobs with a bbox filter, get /api/jobs/:id
- [x] openapi doc generated from the zod schemas, scalar ui on /api/docs
- [x] responsive listing page reading the db per request
- [x] `npm run build` passes with no DATABASE_URL, so the first vercel build cannot fail
- [ ] neon from the vercel storage tab, then `npm run db:deploy && npm run db:seed`
- [ ] first deploy, live url shows the 3 jobs

### milestone 1: the map
- [ ] shadcn init, sheet and dialog
- [ ] leaflet + osm, full height, markers from /api/jobs
- [ ] refetch on moveend with the viewport bbox
- [ ] clustering client side
- [ ] marker popup then detail panel: title company contract location
- [ ] mobile, bottom sheet list under the map
- [ ] privacy notice on the geolocation prompt

### milestone 2: accounts
- [ ] register login me, bcrypt, jwt
- [ ] seeker or employer toggle at register
- [ ] role guard on the routes that need it
- [ ] delete /api/users/me

### milestone 3: publishing
- [ ] employer publish form, address input, live preview marker
- [ ] nominatim geocoding server side, rate limit friendly

### demo prep friday
- [ ] seeded db + scripted 5 min path: browse map then register employer then publish then see it appear
- [ ] slides: scope: stack and the why: architecture diagram: week 2 roadmap
- [ ] install steps checked from a clean clone

---

## week 2 preview: not in scope now

- applications + tracking
- employer dashboard: views and applications received
- admin panel: moderation: account activation and suspension: national metrics
- notification to employer on each new application
- auto archive listings older than 30 days
- reporting system for fraudulent listings
- technical documentation + retrospective

---
limitation: if 2 employer fires the job post button at the same tick its possible that one of them gets rate limited
