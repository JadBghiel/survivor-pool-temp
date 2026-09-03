"use client"

import "leaflet/dist/leaflet.css"
import { useEffect, useRef } from 'react'
import L from "leaflet"

// ign geoplateforme tiles only, per new emails directive
//  we kept leaflet tho
const IGN_WMTS_URL =
    'https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0' +
    '&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&STYLE=normal&TILEMATRIXSET=PM' +
    '&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image/png'
const IGN_ATTRIBUTION = '&copy; <a href="https://www.ign.fr">IGN-F/Geoportail</a>'

type JobsMapProps = {
    jobs: {
        id: string
        title: string
        city: string
        contractType: string
        latitude: number
        longitude: number
        employer: { companyName: string }
    }[]
}

function JobsMap({ jobs }: JobsMapProps) {
    const map = useRef<L.Map | null>(null);
    const mapContainer = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
    // fall back to 0 0,
    const [centerLat, centerLng] = jobs.length > 0
        ? [jobs[0].latitude, jobs[0].longitude]
        : [0, 0]

    map.current = L.map(mapContainer.current!).setView([centerLat, centerLng], 15)

    L.tileLayer(IGN_WMTS_URL, {
        attribution: IGN_ATTRIBUTION,
        minZoom: 2,
        maxZoom: 19,
    }).addTo(map.current)

    // circleMarker skips leaflets default pin ico
    const markers = jobs.map((job) =>
        L.circleMarker([job.latitude, job.longitude], { radius: 8 }).addTo(map.current!)
    )

    return () => {
        markers.forEach((marker) => marker.remove())
        map.current?.remove()
    }
    }, [jobs])

    return <div ref = {mapContainer} style={{width: "100%", height: "100vh"}}/>
}
export default JobsMap
