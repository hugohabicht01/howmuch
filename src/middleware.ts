/* eslint-disable @next/next/no-server-import-in-page */
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getLatLng } from './utils/coordinate'

export function middleware(request: NextRequest) {
  const { url } = request
  const coordinate = getLatLng({ request, url: request.url })

  const params = new URLSearchParams({ lat: coordinate.lat.toString(), lng: coordinate.lng.toString() }).toString()
  const resultUrl = new URL(url)
  resultUrl.search = params

  // Do this check to avoid infinite redirects
  if (url === resultUrl.toString())
    return NextResponse.next()
  return NextResponse.redirect(resultUrl)
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/search',
}
