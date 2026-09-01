// server only
// turns an address into coords using nominatim api, limited at 1rq/s,
// requires also a user agent identifying the caller, both are handled here so every future
// caller (the publish endpoint) gets them too
// https://operations.osmfoundation.org/policies/nominatim/
// https://nominatim.org/release-docs/develop/api/Overview/

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search'
const USER_AGENT = 'GeoEmploi/0.1 (+https://survivor-pool-temp.vercel.app)'
// nominatim allows 1/sec, pad a little so we never trip it under load
const MIN_INTERVAL_MS = 1100

export type GeocodeInput = {
  address: string
  city: string
  postalCode: string
}

export type GeocodeResult =
  | { ok: true; latitude: number; longitude: number }
  | {
      ok: false
      // not_found: nominatim understood the request but knows no such place,
      // network_error: nominatim unreachable or timed out
      // invalid_response: nominatim replied but not with the shape we expect
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

export function geocodeAddress(input: GeocodeInput): Promise<GeocodeResult> {
  return throttled(() => doGeocode(input))
}

async function doGeocode({ address, city, postalCode }: GeocodeInput): Promise<GeocodeResult> {
  const params = new URLSearchParams({
    street: address,
    city,
    postalcode: postalCode,
    // the brief and every seeded listing are french, narrowing the search
    // avoids nominatim matching a same named street in the wrong country
    country: 'France',
    format: 'jsonv2',
    limit: '1',
  })

  let response: Response
  try {
    response = await fetch(`${NOMINATIM_URL}?${params.toString()}`, {
      headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' },
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

  if (!Array.isArray(body) || body.length === 0) {
    return { ok: false, reason: 'not_found' }
  }

  const first = body[0] as { lat?: unknown; lon?: unknown }
  const latitude = Number(first.lat)
  const longitude = Number(first.lon)
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return { ok: false, reason: 'invalid_response' }
  }

  return { ok: true, latitude, longitude }
}
