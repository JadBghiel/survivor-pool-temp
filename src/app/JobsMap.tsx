"use client"

import "@maptiler/sdk/dist/maptiler-sdk.css"
import React, {useState, useEffect, useRef }from 'react'
import { config, Map, MapStyle, Marker } from "@maptiler/sdk";

function JobsMap() {
    const map = useRef(null);
    const mapContainer = useRef(null);

    useEffect(() => {
    config.apiKey = process.env.NEXT_PUBLIC_MAPTILER_KEY

    map.current = new Map({
        container: mapContainer.current,
        style: MapStyle.STREETS,
        center: [-3.70, 40.42],
        zoom: 15,
    })
    }, [])

    return <div ref = {mapContainer} style={{width: "100%", height: "100vh"}}/>
}
export default JobsMap
