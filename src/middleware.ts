import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ZodError, z } from 'zod'
import { FALLBACKCOORDS } from './utils/fallback'

const coordinateValidator = z.object({ lat: z.number().lte(90).gte(-90), lng: z.number().lte(180).gte(-180) })

export function middleware(request: NextRequest) {
  // const { geo, url } = request

  // FIXME: This is totally broken, need to take a look at this with a fresh mind
  // const parsedUrl = new URL(url)
  // const { searchParams } = parsedUrl
  // try {
  //   if (parsedUrl.searchParams.has('lat') && parsedUrl.searchParams.has('lng')) {
  //     // We can safely assert the type string as we checked for their existence before
  //     // TODO: Maybe write a typeguard later, although thats way overkill xD
  //     const lat = parseFloat(searchParams.get('lat') as string)
  //     const lng = parseFloat(searchParams.get('lng') as string)
  //     // Make sure that they're actually valid coords
  //     coordinateValidator.parse({ lat, lng })

  //     return NextResponse.next()
  //   }
  // }
  // catch (e) {
  //   console.error(e)
  //   // if (!(e instanceof ZodError))
  //   //   throw e
  // }
  // let { latitude, longitude } = geo ?? {}

  // if (!latitude || !longitude) {
  //   latitude = FALLBACKCOORDS.lat.toString()
  //   longitude = FALLBACKCOORDS.lng.toString()
  // }

  // // FIXME: This really doesn't seem to be working, no rewrite is happening
  // const resultUrl = new URL(url)
  // resultUrl.search = new URLSearchParams({ lat: latitude, lng: longitude }).toString()
  // return NextResponse.rewrite(resultUrl)
  return NextResponse.next()
}
