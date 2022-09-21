import Head from 'next/head'
import { useEffect, useState } from 'react'
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'

import Prices from '../components/Prices'
import Map from '../components/map/Map'
import Layout from '../components/layout'

import { trpc } from '../utils/trpc'
import { getLatLngWithFallback, getRadiusFromUrlWithFallback } from '../utils/coordinate'
import { MapContextProvider, StationSelectionContextProvider, useGeolocationContext } from '../utils/contexts'

import type { LatLng } from '../utils/coordinate'
import type { InferQueryInput, InferQueryOutput } from '../utils/trpc'

type petrolpricesParamsType = InferQueryInput<'prices.prices'>
export type petrolpricesDataType = InferQueryOutput<'prices.prices'>

// TODO: Overwork the whole radius fallback stuff, have one place where fallbacks are being used, and everything else requires it or ignores it.
// Setting the fallback at 25 different places throughout the project isnt the smartest idea
export const usePetrolPrices = ({ lat, lng, rad }: petrolpricesParamsType) => {
  return trpc.useQuery(['prices.prices', { lat, lng, rad }], { refetchOnWindowFocus: false })
}

export type usePetrolPricesReturnType = ReturnType<typeof usePetrolPrices>

export default function Page({ lat, lng, radius }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [loc, setLoc] = useState<LatLng>({ lat, lng })

  const location = useGeolocationContext()

  const prices = usePetrolPrices({ ...loc, rad: radius })

  // TODO: Move this into a Stateprovider component
  // This is to know which station has been clicked on the map
  const [uuid, setUUID] = useState('')

  const [map, setMap] = useState<google.maps.Map | null>(null)

  const [zoom, setZoom] = useState(11)
  const [center, setCenter] = useState({ lat, lng })

  const MapContextValue = {
    map,
    setMap,
    zoom,
    setZoom,
    center,
    setCenter,
  }

  useEffect(() => {
    if (!location.position)
      return
    const { position: { coords: { latitude, longitude } } } = location
    const newSearchCenter = { lat: latitude, lng: longitude }
    setLoc(newSearchCenter)
    // eslint-disable-next-line no-console
    console.log(`set new search location due to geolocation changing, lat: ${latitude}, lng: ${longitude}`)
    setCenter(newSearchCenter)
  }, [location])

  return (
    <>
      <Head>
        <title>Petrolprices</title>
        <meta name="description" content="live petrolprices" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <MapContextProvider value={MapContextValue}>
          {/* TODO: Move this into the MapContext */}
          <StationSelectionContextProvider value={{
            uuid,
            select: setUUID,
          }} >
            <div className="py-6">
              <Prices prices={prices} />
            </div>
            <div className="flex flex-col justify-center">
              <h3>Map</h3>
              <Map prices={prices} />
            </div>
          </StationSelectionContextProvider>
        </MapContextProvider>
      </Layout>
    </>
  )
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  // This is just to construct a `URL` that can be passed to the getLatLng function
  const { host = 'couldntgethost' } = ctx.req.headers
  const url = new URL(ctx.resolvedUrl, `http://${host}`).toString()
  const { lat, lng } = getLatLngWithFallback({ url })
  const radius = getRadiusFromUrlWithFallback({ url })
  return {
    props: {
      lat,
      lng,
      radius,
    },
  }
}
