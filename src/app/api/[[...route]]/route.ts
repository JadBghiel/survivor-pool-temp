import { OpenAPIHono } from '@hono/zod-openapi'
import { Scalar } from '@scalar/hono-api-reference'
import { handle } from 'hono/vercel'
import { jobs } from '@/lib/routes/jobs'
import { authApp } from '@/lib/routes/auth'

// prisma + pg need a real node runtime, not the edge one.
export const runtime = 'nodejs'

const app = new OpenAPIHono().basePath('/api')

app.route('/', jobs)
app.route('/', authApp)

// 3.1 - documented restful api. the spec is generated from the same zod schemas
// the handlers validate with, so it is always in sync with the code.
app.doc('/openapi.json', {
  openapi: '3.0.0',
  info: {
    title: 'ChomageGo API',
    version: '0.1.0',
    description:
      'Ministère du job & bonheur - JEB/DNI/2026-001. ' +
      'Browsing listings is public and requires no account.',
  },
})

app.get('/docs', Scalar({ url: '/api/openapi.json', pageTitle: 'ChomageGo API' }))

export const GET = handle(app)
export const POST = handle(app)
export const PATCH = handle(app)
export const DELETE = handle(app)
