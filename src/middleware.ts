/* eslint-disable @next/next/no-server-import-in-page */
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getLatLng } from './utils/coordinate'

export function middleware(request: NextRequest) {
  const { url } = request
  const coordinate = getLatLng({ request, url: request.url })
  // FIXME: This is totally broken, need to take a look at this with a fresh mind

  const params = new URLSearchParams({ lat: coordinate.lat.toString(), lng: coordinate.lng.toString() }).toString()
  const resultUrl = new URL(url).search = params
  return NextResponse.rewrite(resultUrl)
}
