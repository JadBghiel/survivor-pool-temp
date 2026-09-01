# geoemploi

geolocated job listings

## AVAILABLE ON VERCEL [CLICK HERE](https://survivor-pool-temp.vercel.app/)
## also we have [API REFERENCE](https://survivor-pool-temp.vercel.app/api/docs#tag/jobs)
## and here you can check out [JOBS in the DB as json](https://survivor-pool-temp.vercel.app/api/jobs)


## week 1 deliverable

only 4 things graded friday

- [ ] map interface to browse listings: no account needed
- [ ] job seeker and employer account creation
- [ ] publish at least one geolocated listing
- [ ] oral presentation: demo + technical approach

rest is week 2, applications dashboards admin panel moderation reporting archiving
we design for it now but do not build it

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

this local database is completely separate from the one on vercel. testing
here, however much you break it, cannot affect the live site.



## TODO

### Jad:

- [x] geocoding function: address + city + postalCode in, { latitude, longitude } out
      calls nominatim api server side, rate limited (1.1s between calls, queued
      so concurrent calls cannot bypass it). src/lib/geocode.ts
- [x] geocoding error handling: not_found, rate_limited (>1rq/s), network_error,
      invalid_response, returned as a typed result instead of thrown, so the
      future publish endpoint can reject cleanly without a try/catch
      verified against the real nominatim api: a real address geocodes
      correctly
- [x] browser geolocation: "find jobs near me" button, explicit click only
      src/lib/geolocation.ts (the browser's own Geolocation API, not to be
      confused with geocode.ts above which calls nominatim) +
      src/components/LocateMeButton.tsx (button + consent dialog)
- [x] handle all three geolocation outcomes: denied, unavailable, timeout
      plus a 4th: unsupported (no navigator.geolocation at all). this is the
      browser's Geolocation API failing, a different thing from geocoding
      failing above. fallback in every case is the same message: keep
      browsing all offers, nothing breaks
- [x] privacy notice text next to that button, shown before the browser's own
      permission prompt ever fires - our dialog explains what/why/how long,
      then only on "autoriser" does the native prompt appear. declining closes
      the dialog and never calls the geolocation api at all
- [x] not retained beyond the active usage period (3.3): the coordinates only
      ever exist in this component's react state, never written to
      localStorage, a cookie, or sent to a server (no endpoint uses them yet).
      closing the dialog (including via escape) drops that state, so a page
      refresh already clears it, there is nothing to separately expire
- [x] haversine distance function: in src/lib/haversine.ts
      also a boundingBoxKm() helper: a sql rectangle pre filter (uses the
      existing archivedAt+lat+lng index) so a small radius on a large table
      never needs a full scan, haversine only refines the few rows the box let through more efficient
- [x] nearby jobs query: GET /api/jobs/nearby?lat&lng&radiusKm, given a point +
      a radius, returns jobs within it sorted nearest first. src/lib/routes/jobs.ts
      registered before /jobs/{id}
  - [x] coords validation: the bbox schema is the maps viewport (emma), this one validates lat/lng/radiusKm on this endpoints own query params

for later:
- [ ] wiring the geocoding function into the actual publish ajob form/endpoint on the website, we will make it avaiable wehn singining in a as a employer

### Nico:
- [] user/seeker account creation (OAuth2)

### Emma:
- [] Map





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