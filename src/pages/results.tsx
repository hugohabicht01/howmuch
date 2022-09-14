import Head from 'next/head'
import { useEffect, useState } from 'react'
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'

import Prices from '../components/Prices'
import Map from '../components/map/Map'
import Layout from '../components/layout'

import { trpc } from '../utils/trpc'
import { getLatLng } from '../utils/coordinate'
import { useDebouncedGeolocation } from '../utils/geolocation'
import { GeolocationContextProvider, MapContextProvider, StationSelectionContextProvider } from '../utils/contexts'

import type { LatLng } from '../utils/coordinate'
import type { InferQueryInput, InferQueryOutput } from '../utils/trpc'

type petrolpricesParamsType = InferQueryInput<'prices.prices'>
export type petrolpricesDataType = InferQueryOutput<'prices.prices'>

/**
 * TODO: Fetch the data on the server side
 * @see https://trpc.io/docs/ssg-helpers
 * Issue: https://github.com/hugohabicht01/howmuch/issues/6
 */

export const usePetrolPrices = ({ lat, lng, rad }: petrolpricesParamsType) => {
  return trpc.useQuery(['prices.prices', { lat, lng, rad }], { refetchOnWindowFocus: false })
}

export type usePetrolPricesReturnType = ReturnType<typeof usePetrolPrices>

export default function Page({ lat, lng }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const context = trpc.useContext()
  const [loc, setLoc] = useState<LatLng>({ lat, lng })

  const prices = usePetrolPrices({ ...loc, rad: 2 })

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

  // TODO: Move this up to a top level thing that can be shared between routes
  const location = useDebouncedGeolocation({ isEnabled: true, distanceThreshold: 500 })
  const { position } = location

  // FIXME: This whole thing is really unclean, gotta think about a better way of implementing this kind of logic
  // It also causes massive performance issues, therefore its not ready for use just yet

  useEffect(() => {
    if (position) {
      const geolocationLatLng = { lat: position.coords.latitude, lng: position.coords.longitude }
      // FIXME: This also causes massive performance issues, therefore its not ready for use just yet
      // if (center !== geolocationLatLng)
      //   setCenter(geolocationLatLng)

      if (window.google?.maps) {
        const distance = window.google.maps.geometry.spherical.computeDistanceBetween(geolocationLatLng, loc)
        // If our current geolocation is off by more than 200 meters, refresh the data
        if (distance > 200) {
          setLoc(geolocationLatLng)
          context.invalidateQueries('prices.prices')
        }
      }
    }
  }, [position])

  return (
    <>
      <Head>
        <title>Petrolprices</title>
        <meta name="description" content="live petrolprices" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <GeolocationContextProvider value={location}>
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
        </GeolocationContextProvider>
      </Layout>
    </>
  )
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { host = 'couldntgethost' } = ctx.req.headers
  const url = new URL(ctx.resolvedUrl, `http://${host}`).toString()
  const { lat, lng } = getLatLng({ url })
  return {
    props: {
      lat,
      lng,
    },
  }
}
