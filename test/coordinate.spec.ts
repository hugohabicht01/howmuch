import { describe, expect, it } from 'vitest'
// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextRequest } from 'next/server'
import { Helpers, getLatLng } from '../src/utils/coordinate'

describe('getLatLngFromIp', () => {
  it('correctly parses the geodata from a nextrequest', () => {
    const GEO = { latitude: 51.123, longitude: 8.123 }
    const expected = { lat: GEO.latitude, lng: GEO.longitude }
    // @ts-expect-error the next request constructor doesn't accept the data although its using it
    const req = new NextRequest('https://localhost:3000', { geo: GEO })

    const detectedGeo = Helpers.getLatLngFromIp(req)
    expect(detectedGeo).toEqual(expected)
  })

  it('returns empty data if nothing can be determined', () => {
    const req = new NextRequest('https://localhost:3000', { geo: undefined })

    const detectedGeo = Helpers.getLatLngFromIp(req)
    expect(detectedGeo).toEqual({ lat: NaN, lng: NaN })
  })
})

describe('getLatLngFromUrl', () => {
  it('correctly parses the params from a url', () => {
    const expected = { lat: 51.123, lng: 8.123 }
    const parsed = Helpers.getLatLngFromUrl('https://someurl.com/?lat=51.123&lng=8.123')
    expect(parsed).toEqual(expected)
  })

  it('returns NaN if one of params is not available', () => {
    const expected = { lat: NaN, lng: NaN }
    const parsed = Helpers.getLatLngFromUrl('https://someurl.com/?lat=51.123')
    expect(parsed).toEqual(expected)
  })
})

describe('getLatLng', () => {
  it('uses the params even if the ip based location is defined', () => {
    const expected = { lat: 51.123, lng: 8.123 }
    const GEO = { latitude: expected.lat + 1, longitude: expected.lng + 1 }

    // @ts-expect-error the next request constructor doesn't accept the data although its using it
    const req = new NextRequest(`https://localhost:3000?lat=${expected.lat}&lng=${expected.lng}`, { geo: GEO })

    const detectedGeo = getLatLng({ request: req, url: req.url })
    expect(detectedGeo).toEqual(expected)
  })

  it('uses the geolocation if the url is bad', () => {
    const urlgeo = { lat: 51.123, lng: 'somebadstring' }
    const GEO = { latitude: 51.123, longitude: 8.123 }

    // @ts-expect-error the next request constructor doesn't accept the data although its using it
    const req = new NextRequest(`https://localhost:3000?lat=${urlgeo.lat}&lng=${urlgeo.lng}`, { geo: GEO })

    const detectedGeo = getLatLng({ request: req, url: req.url })
    expect(detectedGeo).toEqual({ lat: GEO.latitude, lng: GEO.longitude })
  })

  it('uses fallback if no other data is given', () => {
    const fallback = { lat: 51.123, lng: 8.123 }
    const req = new NextRequest('https://localhost:3000')

    const detectedGeo = getLatLng({ request: req, url: req.url, fallback })
    expect(detectedGeo).toEqual(fallback)
  })
})
