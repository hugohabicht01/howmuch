import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Layout from '../components/layout'

const Home: NextPage = () => {
  interface LocationFoundType {
    coords: GeolocationPosition
    error: null
    isLoading: false
  }

  interface LocationErrorType {
    coords: null
    error: GeolocationPositionError
    isLoading: false
  }

  interface LocationLoadingType {
    coords: null
    error: null
    isLoading: true
  }

  type LocationStateType = LocationFoundType | LocationErrorType | LocationLoadingType

  const [location, setLocation] = useState<LocationStateType>({ coords: null, error: null, isLoading: true })

  const [navigationLink, setNavigationLink] = useState('/results')

  const locationSuccessHandler = (pos: GeolocationPosition) => setLocation({ coords: pos, error: null, isLoading: false })
  const locationErrorHandler = (err: GeolocationPositionError) => setLocation({ coords: null, error: err, isLoading: false })

  useEffect(() => {
    if ('geolocation' in navigator)
      navigator.geolocation.getCurrentPosition(locationSuccessHandler, locationErrorHandler)
  })

  useEffect(() => {
    location.coords && setNavigationLink(`/results?lat=${location.coords.coords.latitude}&lng=${location.coords.coords.longitude}`)
  }, [location])

  return (
    <>
      <Head>
        <title>Petrolprices</title>
        <meta name="description" content="live petrolprices" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <div className="flex flex-col items-center w-8/10 min-h-screen mx-auto">
          <div className="flex flex-col items-center px-4 py-2 bg-blue-300 rounded mt-10">
            <Link href={encodeURI(navigationLink)}>Find stations!</Link>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default Home
