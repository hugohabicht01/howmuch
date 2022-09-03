import { z } from 'zod'
import type { NextRequest } from 'next/server'
/**
 * These are some fallback coordinates which can be used if the users location can't be determined instantly
 */
export const FALLBACKCOORDS: LatLng = { lat: 52.520829, lng: 13.408808 }

const isDefined = <T>(value: T | undefined): value is T => value !== undefined && value !== null // != checks undefined and null

const coordinateValidator = z.object({ lat: z.number().lte(90).gte(-90), lng: z.number().lte(180).gte(-180) })

export interface LatLng {
  lat: number
  lng: number
}

// TODO: These two helper functions aren't really well written, they don't error correctly when the data is bad
// I'm not sure if I want them to error, but I really gotta think about a proper error handling concept for all of this

/**
 * Extract the geolocation data from a nextrequest
 * @returns geolocation - this might not be good data, please validate before using
 */
function getLatLngFromIp(request: NextRequest | undefined): LatLng {
  const { geo } = request ?? {}
  const { latitude, longitude } = geo ?? {}
  const lat = parseFloat(latitude ?? '')
  const lng = parseFloat(longitude ?? '')
  return { lat, lng }
}

function getLatLngFromUrl(url: string): LatLng {
  const parsedUrl = new URL(url)
  const { searchParams } = parsedUrl
  if (!(parsedUrl.searchParams.has('lat') && parsedUrl.searchParams.has('lng')))
    return { lat: NaN, lng: NaN }

  // We can safely assert the type string as we checked for their existence before
  // TODO: Maybe write a typeguard later, although thats way overkill xD
  const lat = parseFloat(searchParams.get('lat') as string)
  const lng = parseFloat(searchParams.get('lng') as string)
  return { lat, lng }
}

export const Helpers = { getLatLngFromIp, getLatLngFromUrl }

/**
 * Get location from the different available data sources, if none has any good data, a fallback will be used
 * @param data
 * @param data.request - NextJS request data
 * @param data.url - request url
 * @param data.fallback - fallback coords, if none are supplied, the middle of Berlin will be used
 * @description Order:
    1. params from url
    2. data exstimated from IP
    ...more to come?
    3. fallback
 */
export function getLatLng({ request, url, fallback = FALLBACKCOORDS }: { request?: NextRequest; url?: string; fallback?: LatLng }): LatLng {
  const datasources = [
    getLatLngFromUrl(url ?? ''),
    getLatLngFromIp(request),
  ]

  return datasources
    .map((data) => {
      const result = coordinateValidator.safeParse(data)
      return result.success ? result.data : undefined
    })
    .find(isDefined) ?? fallback
}
