# geoemploi

geolocated job listings

see below how to test it locally 
## VERCEL IS PAUSED
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

- [ ] **build the publish a listing form.** wire the existing geocoder into an
      employer-facing form so listings can be created from the product itself, rather
      than only from the seed script. the single biggest priority against the week 1
      deliverable ("publication of a geolocated listing") - nothing else on this list
      matters if this doesn't exist by friday
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



