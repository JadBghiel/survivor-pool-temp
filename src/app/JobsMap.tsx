"use client"

import "@maptiler/sdk/dist/maptiler-sdk.css"
import React, { useEffect, useRef } from 'react'
import { config, Map, MapStyle, Marker } from "@maptiler/sdk";

type JobsMapProps = {
    jobs: { id: string; latitude: number; longitude: number }[]
}

function JobsMap({ jobs }: JobsMapProps) {
    const map = useRef<Map | null>(null);
    const mapContainer = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
    // fall back to 0 0,
    const [centerLat, centerLng] = jobs.length > 0
        ? [jobs[0].latitude, jobs[0].longitude]
        : [0, 0]

    map.current = new Map({
        container: mapContainer.current!,
        style: MapStyle.STREETS,
        center: [centerLng, centerLat],
        zoom: 15,
    })

    const markers = jobs.map((job) =>
        new Marker().setLngLat([job.longitude, job.latitude]).addTo(map.current!)
    )

    return () => {
        markers.forEach((marker) => marker.remove())
        map.current?.remove()
    }
    }, [jobs])

    return <div ref = {mapContainer} style={{width: "100%", height: "100vh"}}/>
}
export default JobsMap
