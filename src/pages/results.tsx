import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import type { InferQueryInput, InferQueryOutput } from '../utils/trpc'
import { trpc } from '../utils/trpc'
import Prices from '../components/Prices'
import Map from '../components/map/Map'
import { getLatLng } from '../utils/coordinate'
import { StationSelectionContext } from '../utils/contexts'

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

  return (
    <>
      <Head>
        <title>Petrolprices</title>
        <meta name="description" content="live petrolprices" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* TODO: Move this stuff into a layout component */}
      <div className="flex flex-col items-center w-8/10 min-h-screen mx-auto bg-gradient-to-r from-rose-400 to-orange-300 pb-20">
        <header className="flex border-gray border-b bg-gradient-to-b from-sky-400 to-sky-200 w-full skey-y-4">
          <div className="p-10">
            <h1 className="font-semibold text-5xl w-max bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
              how much
            </h1>
          </div>
        </header>
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
      </div>
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
