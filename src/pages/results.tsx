import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import type { InferQueryInput, InferQueryOutput } from '../utils/trpc'
import { trpc } from '../utils/trpc'
import Prices from '../components/Prices'
import Map from '../components/map/Map'
import { getLatLng } from '../utils/coordinate'
import { MapContext, StationSelectionContext } from '../utils/contexts'
import Layout from '../components/layout'

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
  // TODO: I'm kinda not happy with this being here, since I can't return early cuz of react complaining about conditional hooks
  // at the same time i want to keep prices.tsx to stay purely pure, so I'll probably create a wrapper component
  const prices = usePetrolPrices({ lat, lng, rad: 2 })

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

  return (
    <>
      <Head>
        <title>Petrolprices</title>
        <meta name="description" content="live petrolprices" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        {/* TODO: Move this stuff into a layout component */}
        <MapContext.Provider value={MapContextValue}>
          {/* TODO: Move this into the MapContext */}
          <StationSelectionContext.Provider value={{
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
          </StationSelectionContext.Provider>
        </MapContext.Provider>
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
