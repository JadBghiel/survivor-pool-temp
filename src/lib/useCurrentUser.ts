'use client'

import { useEffect, useState } from 'react'

export type User = {
  id: string
  email: string
  role: 'SEEKER' | 'EMPLOYER' | 'ADMIN'
  seekerProfile?: { firstName: string; lastName: string } | null
  employerProfile?: { companyName: string } | null
}

// fetches /me from the saved token on mount, prevnts logging out wheen refrehsing the page
export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    if (!savedToken) return

    fetch('/api/auth/me', { headers: { Authorization: `Bearer ${savedToken}` } })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setUser(data)
        } else {
          localStorage.removeItem('token')
          setUser(null)
        }
      })
      .catch(() => {
        localStorage.removeItem('token')
        setUser(null)
      })
  }, [])

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return { user, setUser, logout }
}
