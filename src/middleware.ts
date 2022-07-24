import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { geo } = request
  if (!geo)
    return NextResponse.next()

  const { latitude, longitude } = geo
  if (!latitude || !longitude)
    return NextResponse.next()

  console.log({ latitude, longitude })
  const response = NextResponse.next()
  response.cookies.set('detected_latitude', latitude)
  response.cookies.set('detected_longitude', longitude)
  return response
}
