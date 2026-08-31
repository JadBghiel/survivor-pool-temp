# geoemploi

geolocated job listings

## AVAILABLE ON VERCEL [CLICK HERE](https://survivor-pool-temp.vercel.app/)
## also we have [API REFERENCE](https://survivor-pool-temp.vercel.app/api/docs#tag/jobs)
## and here you can check out [JOBS in the DB as json](https://survivor-pool-temp.vercel.app/api/jobs)


## week 1 deliverable

only 4 things graded friday

- [ ] map interface to browse listings - no account needed
- [ ] job seeker and employer account creation
- [ ] publish at least one geolocated listing
- [ ] oral presentation - demo + technical approach

rest is week 2, applications dashboards admin panel moderation reporting archiving
we design for it now but do not build it

---

## stack

- app, next.js 15 + typescript, app router, front and api in one project
- ui, tailwind. shadcn/ui at milestone 1, when the map needs a sheet and a dialog
- map, leaflet + react-leaflet + osm tiles, milestone 1, not installed yet.
  recommended in the brief, free, no api key
- api, hono mounted as a catch all route handler under /api
- validation, zod, one schema validates the request and generates the openapi doc
- api docs, @hono/zod-openapi + scalar, live on /api/docs
- orm, prisma 7 + the pg driver adapter, typed client, easy migrations
- db, neon postgres, provisioned from the vercel dashboard
- auth, jwt, milestone 2, not built yet
- host, vercel, git push deploys

