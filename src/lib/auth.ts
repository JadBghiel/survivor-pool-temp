import jwt from 'jsonwebtoken'

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
