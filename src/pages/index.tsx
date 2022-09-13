import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Layout from '../components/layout'
import { useDebouncedGeolocation } from '../utils/geolocation'

const Home: NextPage = () => {
  const [navigationLink, setNavigationLink] = useState('/results')

  const location = useDebouncedGeolocation({ distanceThreshold: 200, isEnabled: true })

  useEffect(() => {
    location.position && setNavigationLink(`/results?lat=${location.position.coords.latitude}&lng=${location.position.coords.longitude}`)
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
