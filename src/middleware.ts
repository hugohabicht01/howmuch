import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { url } = request
  const redirectUrl = new URL(url)

  const { geo } = request
  const { country, latitude, longitude } = geo ?? { country: undefined, latitude: undefined, longitude: undefined }
  if (country !== undefined && country !== 'DE') {
    redirectUrl.pathname = '/notsupported'
    return NextResponse.redirect(redirectUrl)
  }

  latitude && redirectUrl.searchParams.set('ipbasedlat', latitude)
  longitude && redirectUrl.searchParams.set('ipbasedlng', longitude)

  // avoid infinite redirects
  if (url === redirectUrl.toString())
    return NextResponse.next()
  return NextResponse.redirect(redirectUrl)
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/results',
}
