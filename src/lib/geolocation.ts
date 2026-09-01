// on browser, wraps the browser's own Geolocation API
// retunrs coords

export type GeolocationResult =
  | { status: 'success'; latitude: number; longitude: number; accuracy: number }
  | { status: 'unsupported' } // no navigator.geolocation at all (old browser, non browser context)
  | { status: 'denied' } // user clicked block on the browser's own permission prompt
  | { status: 'unavailable' } // browser could not get a fix (no gps, no signal)
  | { status: 'timeout' }

export function requestBrowserLocation(): Promise<GeolocationResult> {
  return new Promise((resolve) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      resolve({ status: 'unsupported' })
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          status: 'success',
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        })
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            resolve({ status: 'denied' })
            break
          case error.POSITION_UNAVAILABLE:
            resolve({ status: 'unavailable' })
            break
          case error.TIMEOUT:
            resolve({ status: 'timeout' })
            break
          default:
            resolve({ status: 'unavailable' })
        }
      },
      {
        enableHighAccuracy: false,
        timeout: 10_000,
        // never accept a cached fix from a previous visit, for gdpr reasons every call asks the
        // browser fresh, so nothing about an earlier session stays here
        maximumAge: 0,
      },
    )
  })
}
