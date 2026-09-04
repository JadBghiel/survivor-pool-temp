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

// institutional blue from the ministry charte graphique
const MARKER_BLUE = '#1B3A6B'

type MapJob = {
  id: string
  title: string
  company: string
  city: string
  contractType: string
  latitude: number
  longitude: number
}

type JobsMapProps = {
  jobs: MapJob[]
  onSelectJob?: (id: string) => void
}

function JobsMap({ jobs, onSelectJob }: JobsMapProps) {
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
    const markers = jobs.map((job) => {
        const marker = L.circleMarker([job.latitude, job.longitude], {
            radius: 9,
            color: '#ffffff',
            weight: 2,
            fillColor: MARKER_BLUE,
            fillOpacity: 1,
        }).addTo(map.current!)

        marker.bindTooltip(`${job.title} — ${job.company}`, { direction: 'top', offset: [0, -8] })
        marker.on('click', () => onSelectJob?.(job.id))
        return marker
    })

    // frame every listing at once instead of guessing a zoom level, so a cluster
    // of offers in one city fills the screen rather than sitting off the edge
    if (markers.length > 0) {
        map.current.fitBounds(L.featureGroup(markers).getBounds().pad(0.2))
    }

    return () => {
        markers.forEach((marker) => marker.remove())
        map.current?.remove()
    }
    }, [jobs, onSelectJob])

    return <div ref = {mapContainer} style={{width: "100%", height: "100vh"}}/>
}
export default JobsMap
