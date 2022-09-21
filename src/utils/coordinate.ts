import { z } from 'zod'
import type { NextRequest } from 'next/server'

// TODO: Maybe create a custom error that also specifies the source where the error came from, might be useful for debugging

export enum LocationErrorReason {
  noGeoData = 'noGeoData',
  noLatLngData = 'noLatLngData',
  badLatLng = 'badLatLng',
  urlWithoutLatLng = 'urlWithoutLatLng',
  noGoodDataSources = 'noGoodDataSources',
  noRadius = 'noRadius',
  badRadius = 'badRadius',
}

/**
 * These are some fallback coordinates which can be used if the users location can't be determined instantly
 */
export const FALLBACKCOORDS: LatLng = { lat: 52.520829, lng: 13.408808 }
export const FALLBACKRADIUS = 2 as const

export const didntError = <T>(value: T | Error): value is T => value instanceof Error !== true

const coordinateValidator = z.object({ lat: z.number().lte(90).gte(-90), lng: z.number().lte(180).gte(-180) })

export interface LatLng {
  lat: number
  lng: number
}

/**
 * Extract the geolocation data from a nextrequest
 * @returns geolocation - this might not be good data, please validate before using
 */
function getLatLngFromIp(request: NextRequest | undefined): LatLng | Error {
  const { geo } = request ?? {}
  if (!geo)
    return new Error(LocationErrorReason.noGeoData)
  const { latitude, longitude } = geo ?? {}
  if (latitude === undefined || longitude === undefined)
    return new Error(LocationErrorReason.noLatLngData)

  const lat = Number(latitude)
  const lng = Number(longitude)
  const coords = { lat, lng }
  const result = coordinateValidator.safeParse(coords)
  if (!result.success)
    return new Error(LocationErrorReason.badLatLng)

  return result.data
}

interface getLatLngFromUrlParams {
  url: string
  latitudeName: string
  longitudeName: string
}

/**
 * Gets lat and lng param from url
 * If you the lat and lng properties use different url param names, they can be specified in the options
 * @param options
 * @param options.url - full request url
 * @param options.latitudeName - what string to look for in the url params for the latitude value
 * @param options.longitudeName - what string to look for in the url params for the longitude value
 * @returns Location or Error if no location can be found
 */
function getLatLngFromUrl({ url, latitudeName, longitudeName }: getLatLngFromUrlParams): LatLng | Error {
  const parsedUrl = new URL(url)
  const { searchParams } = parsedUrl
  if (!(parsedUrl.searchParams.has(latitudeName) && parsedUrl.searchParams.has(longitudeName)))
    return new Error(LocationErrorReason.urlWithoutLatLng)

  // We can safely assert the type string as we checked for their existence before
  const lat = parseFloat(searchParams.get(latitudeName) as string)
  const lng = parseFloat(searchParams.get(longitudeName) as string)

  const result = coordinateValidator.safeParse({ lat, lng })

  if (!result.success)
    return new Error(LocationErrorReason.badLatLng)

  return { lat, lng }
}

function getRadiusFromUrl({ url }: { url: string }): number | Error {
  const parsedUrl = new URL(url)
  const { searchParams } = parsedUrl
  if (!searchParams.has('radius'))
    return new Error(LocationErrorReason.noRadius)

  const radius = Number(searchParams.get('radius') as string)
  const result = z.number().safeParse(radius)
  if (!result.success)
    return new Error(LocationErrorReason.badRadius)

  return result.data
}

export function getRadiusFromUrlWithFallback({ url }: { url: string }): number {
  const result = getRadiusFromUrl({ url })
  if (didntError(result))
    return result
  return FALLBACKRADIUS
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
export function getLatLngWithFallback({ url, fallback = FALLBACKCOORDS }: { url?: string; fallback?: LatLng }): LatLng {
  const location = getLatLng({ url })
  return location instanceof Error ? fallback : location
}

/**
 * Get location from the different available data sources
 * @param data
 * @param data.request - NextJS request data
 * @param data.url - request url
 * @description Order:
    1. params from url
    2. data exstimated from IP
    ...more to come?
 */
export function getLatLng({ url }: { url?: string }) {
  // TODO: instead of running all of them on every request, we could run the first, check the value and the next and so on
  const datasources = [
    getLatLngFromUrl({ url: url ?? '', latitudeName: 'gpslat', longitudeName: 'gpslng' }), // they are usually provided by the user, therefore take the highest prio
    getLatLngFromUrl({ url: url ?? '', latitudeName: 'iplat', longitudeName: 'iplng' }), // they are usually provided by the user, therefore take the highest prio
  ]

  const goodLocationData = datasources.find(didntError)
  if (goodLocationData)
    return goodLocationData

  return new Error(LocationErrorReason.noGoodDataSources)
}

type locationDataSourcesType = 'gps' | 'ip' | 'fallback'

type locationParamType = `${locationDataSourcesType}${keyof LatLng}`

// IDEA: Maybe keep 'fallback' separated as it will always be available
export type priceSeachParams = Partial<{
  [Property in locationParamType]: string
} & { radius: string }>
