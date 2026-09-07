// server only
// turns a commune name into its official centroid using api adresse, the only
// geocoder the ministry allows now nominatim and every commercial geocoder are banned
// https://adresse.data.gouv.fr/api-doc/adresse
//
// 2026/09/08 (email 9, mme pontaillac): geocoding no longer resolves the street
// address. an offer is displayed at its commune's centroid, never the exact
// address, reverted from street level per cahier des charges v1.0 point 3.2
// api adresse's type=municipality already collapses paris/lyon/marseille
// arrondissements to the single official commune (they are not separate insee
// communes), so one centroid per (city, postcode) is exactly "commune level"

const API_ADRESSE_URL = 'https://api-adresse.data.gouv.fr/search/'
// no hard limit like nominatim's 1/sec, staying under the ~50/sec the docs mention
const MIN_INTERVAL_MS = 100

export type GeocodeMunicipalityInput = {
  city: string
  postalCode: string
}

export type GeocodeResult =
  | { ok: true; latitude: number; longitude: number }
  | {
      ok: false
      // not_found, api adresse understood the request but knows no such place
      // network_error, api adresse unreachable or timed out
      // invalid_response, api adresse replied but not with the shape we expect
      reason: 'not_found' | 'rate_limited' | 'network_error' | 'invalid_response'
    }

// 1  queue shared by the whole process every call waits for the
// previous one to finish, then waits out the interval, so two geocode calls
// can never leave less than MIN_INTERVAL_MS apart no matter how many
// requests arrive at once
let queue: Promise<unknown> = Promise.resolve()

function throttled<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(async () => {
    const result = await fn()
    await new Promise((resolve) => setTimeout(resolve, MIN_INTERVAL_MS))
    return result
  })
  // takes the failure here so one bad call does not break throttling for
  // every call quued
  queue = run.catch(() => undefined)
  return run
}

export function geocodeMunicipality(input: GeocodeMunicipalityInput): Promise<GeocodeResult> {
  return throttled(() => doGeocodeMunicipality(input))
}

async function doGeocodeMunicipality({ city, postalCode }: GeocodeMunicipalityInput): Promise<GeocodeResult> {
  const params = new URLSearchParams({
    q: city,
    type: 'municipality',
    postcode: postalCode,
    limit: '1',
  })

  let response: Response
  try {
    response = await fetch(`${API_ADRESSE_URL}?${params.toString()}`, {
      headers: { Accept: 'application/json' },
    })
  } catch {
    return { ok: false, reason: 'network_error' }
  }

  if (response.status === 429) return { ok: false, reason: 'rate_limited' }
  if (!response.ok) return { ok: false, reason: 'network_error' }

  let body: unknown
  try {
    body = await response.json()
  } catch {
    return { ok: false, reason: 'invalid_response' }
  }

  const features = (body as { features?: unknown }).features
  if (!Array.isArray(features) || features.length === 0) {
    return { ok: false, reason: 'not_found' }
  }

  const geometry = (features[0] as { geometry?: { coordinates?: unknown } }).geometry
  const coordinates = geometry?.coordinates
  if (!Array.isArray(coordinates) || coordinates.length !== 2) {
    return { ok: false, reason: 'invalid_response' }
  }

  // geojson order is longitude then latitude, reverse
  const [longitude, latitude] = coordinates.map(Number)
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return { ok: false, reason: 'invalid_response' }
  }

  return { ok: true, latitude, longitude }
}
