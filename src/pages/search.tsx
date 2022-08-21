import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import type { InferQueryInput, InferQueryOutput } from '../utils/trpc'
import { trpc } from '../utils/trpc'
import { Prices } from '../components/Prices'
import { getLatLng } from '../utils/coordinate'

type petrolpricesParamsType = InferQueryInput<'prices.prices'>
export type petrolpricesDataType = InferQueryOutput<'prices.prices'>

/**
 * TODO: Fetch the data on the server side
 * @see https://trpc.io/docs/ssg-helpers
 */

export const usePetrolPrices = ({ lat, lng, rad }: petrolpricesParamsType) => {
  return trpc.useQuery(['prices.prices', { lat, lng, rad }], { refetchOnWindowFocus: false })
}

export default function Page({ lat, lng }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  // TODO: I'm kinda not happy with this being here, since I can't return early cuz of react complaining about conditional hooks
  // at the same time i want to keep prices.tsx to stay purely pure, so I'll probably create a wrapper component
  const prices = usePetrolPrices({ lat, lng, rad: 2 })

  return (
    <>
      <Head>
        <title>Petrolprices</title>
        <meta name="description" content="live petrolprices" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col items-center w-8/10 min-h-screen mx-auto">
        <div>
          <h1 className="font-semibold text-lg">
            Detected coords
          </h1>
        </div>
        <div className="py-6">
          <Prices prices={prices} />
        </div>
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
