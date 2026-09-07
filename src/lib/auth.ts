import jwt from 'jsonwebtoken'
import { prisma } from './db'

// I put it inside a function because otherwise it'd be one of the first things to execute
// and during SSG or build steps on platforms like Vercel, production variables might not be loaded yet.
// and if it's missing at build time, it will fail the entire build
export function getJwtSecret(): string {
    const secret = process.env.JWT_SECRET
    if (!secret) {
        throw new Error('JWT_SECRET environment variable is required')
    }
    return secret
}

export type JwtPayload = { sub: string; email: string; role: 'SEEKER' | 'EMPLOYER' | 'ADMIN' }

// returns null on any auth failure (missing header, bad token, expired),
// callers just check for null instead of wrapping every call in try/catch
export function verifyAuthHeader(authHeader: string | undefined): JwtPayload | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null
    const token = authHeader.replace('Bearer ', '')
    try {
        return jwt.verify(token, getJwtSecret()) as JwtPayload
    } catch {
        return null
    }
}

// helper function to check if a user is suspended before he does anything in the web
export async function verifyActiveUser(authHeader?: string) {
    const payload = verifyAuthHeader(authHeader)
    if (!payload)
        return null

    const user = await prisma.user.findUnique({
        where: { id: payload.sub },
        select: { status: true },
    })
    if (!user || user.status === 'SUSPENDED')
        return null
    return payload
}
