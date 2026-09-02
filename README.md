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


## TODO

### Jad:

- [x] geocoding function: address + city + postalCode in, { latitude, longitude } out
      calls nominatim api /lib/geocode.ts
- [x] geocoding error handling: not_found, rate_limited (>1rq/s), network_error,
      invalid_response, returned as a typed result
- [x] browser geolocation: "find jobs near me" button, explicit click only
      src/lib/geolocation.ts + src/components/LocateMeButton.tsx (button + consent dialog)
      do this cmd in the console or your browser to test it: 
      `navigator.geolocation.getCurrentPosition(p => console.log(p.coords.latitude, p.coords.longitude))`
- [x] handle all three geolocation outcomes: denied, unavailable, timeout
      plus a 4th: unsupported (no navigator.geolocation at all). this is the
      browser's Geolocation API failing
- [x] privacy notice text next to that button
- [x] not retained beyond the active usage period: the coordinates only
      ever exist in this components react state
- [x] haversine distance function: in src/lib/haversine.ts
      also a boundingBoxKm() helper: a sql rectangle pre filter (uses the
      existing archivedAt+lat+lng index) so a small radius on a large table
      never needs a full scan, haversine refines the few rows the box let through more efficient
- [x] nearby jobs query: GET /api/jobs/nearby?lat&lng&radiusKm, given a point +
      a radius, returns jobs within it sorted nearest first src/lib/routes/jobs.ts
      registered before /jobs/{id}
  - [x] coords validation: the bbox schema is the maps viewport (emma), this one validates lat/lng/radiusKm on this endpoints own query params

for later:
- [ ] wiring the geocoding function into the actual publish ajob form/endpoint on the website, we will make it avaiable wehn singining in a as a employer

### Nico:
- [] user/seeker account creation (OAuth2)

### Emma:
- [] Map


