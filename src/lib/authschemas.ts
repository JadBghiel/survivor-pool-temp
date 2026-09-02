import { z } from '@hono/zod-openapi'

// Schema for when someone registers. I believe we should have it all in a single export to reduce code
export const RegisterSchema = z.object({
    email: z.string().email().openapi({ example: 'email@example.com'}),
    password: z.string().min(6).openapi({ example: 'tek3Pool'}),
    role: z.enum(['SEEKER', 'EMPLOYER']).openapi({ example: 'SEEKER'}),
    firstName: z.string().optional().openapi({ example: 'Nicolas'}),
    lastName: z.string().optional().openapi({ example: 'Aguado'}),
    companyName: z.string().optional().openapi({ example: 'Epitech'}),
})

// Schema for when someone logs in.
export const LoginSchema = z.object({
    email: z.string().email().openapi({ example: 'email@example.com'}),
    password: z.string().openapi({ example: 'tek3Pool'}),
})

// Schema for the response on a successful signup or login
export const ResponseSchema = z.object({
    token: z.string().openapi({ example: 'eyJhbGciOiJIUzI1NiIsIn...'}),
    user: z.object({
        id: z.string().openapi({ example: 'clx123abc...' }),
        email: z.string().email().openapi({ example: 'seeker@example.com' }),
        role: z.enum(['SEEKER', 'EMPLOYER', 'ADMIN']).openapi({ example: 'SEEKER' }),
    }),
})

// Schema to retrieve the current user's profile
export const RetrieveSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    role: z.enum(['SEEKER', 'EMPLOYER', 'ADMIN']),
    seekerProfile: z.object({
        firstName: z.string(),
        lastName: z.string(),
        headline: z.string().nullable(),
        skills: z.array(z.string()),
        availability: z.string().nullable(),
    }).nullable(),
    employerProfile: z.object({
        companyName: z.string(),
        siret: z.string().nullable(),
        verified: z.boolean(),
    }).nullable(),
})
