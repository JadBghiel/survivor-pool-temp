// distance between two points on a sphere, not perfectly accurate

const EARTH_RADIUS_KM = 6371

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180
}

export function haversineDistanceKm(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const dLat = toRadians(bLat - aLat)
  const dLng = toRadians(bLng - aLng)
  const lat1 = toRadians(aLat)
  const lat2 = toRadians(bLat)

  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h))
}

// we are making a a rectangle around a point, big enough to contain the full radiusKm circle.
// used to prefilter rows in sql instead of rerunnig  haversine every row
// [archivedAt, latitude, longitude] index) before the exact haversine
// distance is computed in js on the much smaller remaining set
export function boundingBoxKm(lat: number, lng: number, radiusKm: number) {
  const latDelta = radiusKm / 111
  // a degree of lgt covers less ground the further you are from the
  // equator, guarded against dividing by approx 0 near the poles
  const lngDelta = radiusKm / (111 * Math.max(Math.cos(toRadians(lat)), 0.01))
  return {
    minLat: lat - latDelta,
    maxLat: lat + latDelta,
    minLng: lng - lngDelta,
    maxLng: lng + lngDelta,
  }
}
