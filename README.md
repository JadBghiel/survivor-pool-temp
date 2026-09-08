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

