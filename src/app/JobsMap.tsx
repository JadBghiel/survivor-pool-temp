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
    jobs: { id: string; latitude: number; longitude: number }[]
    selectedJobId: string | null
    onSelectJob: (id: string) => void
    userPosition: { lat: number; lng: number } | null
}

function JobsMap({ jobs, selectedJobId, onSelectJob, userPosition }: JobsMapProps) {
    const map = useRef<L.Map | null>(null);
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const markersById = useRef<Record<string, L.CircleMarker>>({});

    // crea el mapa y los marcadores de ofertas
    useEffect(() => {
        const [centerLat, centerLng] = jobs.length > 0
            ? [jobs[0].latitude, jobs[0].longitude]
            : [0, 0]

        map.current = L.map(mapContainer.current!).setView([centerLat, centerLng], 15)

        L.tileLayer(IGN_WMTS_URL, {
            attribution: IGN_ATTRIBUTION,
            minZoom: 2,
            maxZoom: 19,
        }).addTo(map.current)

        const markers = jobs.map((job) => {
            const marker = L.circleMarker([job.latitude, job.longitude], { radius: 8 }).addTo(map.current!)
            marker.on('click', () => onSelectJob(job.id))
            markersById.current[job.id] = marker
            return marker
        })

        return () => {
            markers.forEach((marker) => marker.remove())
            map.current?.remove()
        }
    }, [jobs])

    // vuela a la oferta seleccionada y repinta los puntos
    useEffect(() => {
        Object.entries(markersById.current).forEach(([id, marker]) => {
            if (id === selectedJobId) {
                marker.setStyle({ radius: 12, color: '#ea580c', fillColor: '#ea580c', fillOpacity: 0.9 })
            } else {
                marker.setStyle({ radius: 8, color: '#3388ff', fillColor: '#3388ff', fillOpacity: 0.2 })
            }
        })

        if (!selectedJobId || !map.current) return

        const job = jobs.find((j) => j.id === selectedJobId)
        if (!job) return

        map.current.flyTo([job.latitude, job.longitude], 16)
    }, [selectedJobId, jobs])

    // aro pulsante en la posición del usuario
    useEffect(() => {
        if (!userPosition || !map.current) return

        const icon = L.divIcon({
            className: '',
            html: `<div class="user-pulse"></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10],
        })

        const marker = L.marker([userPosition.lat, userPosition.lng], { icon }).addTo(map.current)
        map.current.setView([userPosition.lat, userPosition.lng], 15)

        return () => { marker.remove() }
    }, [userPosition])

    return <div ref={mapContainer} style={{ width: "100%", height: "100vh" }} />
}

export default JobsMap