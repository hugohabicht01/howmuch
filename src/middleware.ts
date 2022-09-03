import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getLatLng } from './utils/coordinate'

export function middleware(request: NextRequest) {
  const { url } = request
  const currentUrl = new URL(url)

  const { geo } = request
  const { country } = geo ?? { country: undefined }
  if (country !== undefined && country !== 'DE') {
    currentUrl.pathname = '/notsupported'
    return NextResponse.redirect(currentUrl)
  }

  const coordinate = getLatLng({ request, url: request.url })

  const params = new URLSearchParams({ lat: coordinate.lat.toString(), lng: coordinate.lng.toString() }).toString()
  currentUrl.search = params

  // avoid infinite redirects
  if (url === currentUrl.toString())
    return NextResponse.next()
  return NextResponse.redirect(currentUrl)
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/results',
}
