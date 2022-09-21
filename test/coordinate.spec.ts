import { describe, expect, it } from 'vitest'
// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextRequest } from 'next/server'
import { Helpers, LocationErrorReason, getLatLngWithFallback } from '../src/utils/coordinate'

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
    expect(() => { throw detectedGeo }).toThrowError(LocationErrorReason.noLatLngData)
  })
})

describe('getLatLngFromUrl', () => {
  it('correctly parses the params from a url', () => {
    const expected = { lat: 51.123, lng: 8.123 }
    const parsed = Helpers.getLatLngFromUrl({ url: `https://someurl.com/?lat=${expected.lat}&lng=${expected.lng}`, latitudeName: 'lat', longitudeName: 'lng' })
    expect(parsed).toEqual(expected)
  })

  it('returns NaN if one of params is not available', () => {
    const parsed = Helpers.getLatLngFromUrl({ url: 'https://someurl.com/?lat=51.123', latitudeName: 'lat', longitudeName: 'lng' })
    expect(() => { throw parsed }).toThrowError(LocationErrorReason.urlWithoutLatLng)
  })
})

describe('getLatLng', () => {
  it('uses fallback if no other data is given', () => {
    const fallback = { lat: 51.123, lng: 8.123 }
    const req = new NextRequest('https://localhost:3000')

    const detectedGeo = getLatLngWithFallback({ url: req.url, fallback })
    expect(detectedGeo).toEqual(fallback)
  })
})
