import { OpenAPIHono, createRoute } from '@hono/zod-openapi'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/db'
import { RegisterSchema, LoginSchema, ResponseSchema, RetrieveSchema } from '@/lib/authschemas'
import { ErrorSchema } from '@/lib/schemas'

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required')
}

//Register route definition
const registerRoute = createRoute({
    method: 'post',
    tags: ['auth'],
    summary: 'Register a new user',
    request: {
        body: {
            content: {
                'application/json': { schema: RegisterSchema },
            },
        },
    },
    responses: {
        201: {
            content: { 'application/json': { schema: ResponseSchema } },
            description: 'User successfully created',
        },
        400: {
            content: { 'application/json': { schema: ErrorSchema } },
            description: 'Validation error or email already in use',
        }
    },
    path: '/auth/register',
})

// Login route definition
const loginRoute = createRoute({
    method: 'post',
    tags: ['auth'],
    summary: 'Log in with email and password',
    request: {
        body: {
            content: {
                'application/json': { schema: LoginSchema },
            },
        },
    },
    responses: {
        200: {
            content: { 'application/json': { schema: ResponseSchema } },
            description: 'Login successful',
        },
        401: {
            content: { 'application/json': { schema: ErrorSchema } },
            description: 'Invalid credentials',
        },
    },
    path: '/auth/login',
})

// Retrieve current user route definition
const retrieveRoute = createRoute({
    method: 'get',
    tags: ['auth'],
    summary: 'Get current user info from Authorization',
    responses: {
        200: {
            content: { 'application/json': { schema: RetrieveSchema } },
            description: 'Current user data'
        },
        401: {
            content: { 'application/json': { schema: ErrorSchema } },
            description: 'Invalid Token',
        },
    },
    path: '/auth/me',
})

export const authApp = new OpenAPIHono()

// register
authApp.openapi(registerRoute, async (c) => {
    const { email, password, role, firstName, lastName, companyName } = c.req.valid('json')
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
        return c.json({ error: 'User with this email already exists' }, 400)
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const newUser = await prisma.user.create({
        data: {
            email,
            passwordHash,
            role,
            ...(role === 'SEEKER' && {
                seekerProfile: {
                    create: {
                        firstName: firstName || '',
                        lastName: lastName || '',
                    },
                },
            }),
            ...(role === 'EMPLOYER' && {
                employerProfile: {
                    create: {
                        companyName: companyName || 'Unknown Company',
                    },
                },
            }),
        },
    })

    const token = jwt.sign(
        { sub: newUser.id, email: newUser.email, role: newUser.role },
        JWT_SECRET,
        { expiresIn: '7d' }
    )
    return c.json(
        {
            token,
            user: {
                id: newUser.id,
                email: newUser.email,
                role: newUser.role,
            },
        },
        201
    )
})

// login
authApp.openapi(loginRoute, async (c) => {
    const { email, password } = c.req.valid('json')
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
        return c.json({ error: 'Invalid email or password' }, 401)
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash)
    if (!isMatch) {
        return c.json({ error: 'Invalid email or password' }, 401)
    }

    const token = jwt.sign(
        { sub: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' },
    )
    return c.json(
        {
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
        },
        200
    )
})

// retrieve current user
authApp.openapi(retrieveRoute, async (c) => {
    const authHeader = c.req.header('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return c.json({ error: 'Missing authorization header' }, 401)
    }

    const token = authHeader.replace('Bearer ', '')
    try {
        const payload = jwt.verify(token, JWT_SECRET) as {
            sub: string,
            email: string,
            role: 'SEEKER' | 'EMPLOYER' | 'ADMIN'
        }
        const user = await prisma.user.findUnique({
            where: { id: payload.sub },
            include: {
                seekerProfile: true,
                employerProfile: true,
            },
        })
        if (!user) {
            return c.json({ error: 'User not found' }, 401)
        }
        return c.json(
            {
                id: user.id,
                email: user.email,
                role: user.role,
                seekerProfile: user.seekerProfile ? {
                    firstName: user.seekerProfile.firstName,
                    lastName: user.seekerProfile.lastName,
                    headline: user.seekerProfile.headline,
                    skills: user.seekerProfile.skills,
                    availability: user.seekerProfile.availability,
                } : null,
                employerProfile: user.employerProfile ? {
                    companyName: user.employerProfile.companyName,
                    siret: user.employerProfile.siret,
                    verified: user.employerProfile.verified,
                } : null,
            },
            200
        )
    } catch (err) {
        return c.json({ error: 'Invalid or expired token' }, 401)
    }
})
