'use client'

import dynamic from 'next/dynamic'

// leaflet touches window on import, breaks next's server render
// ssr false only works in a client component, this wrapper exists so page.tsx can use it
const JobsMap = dynamic(() => import('./JobsMap'), { ssr: false })

export default JobsMap
