import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import type { InferQueryInput, InferQueryOutput } from '../utils/trpc'
import { trpc } from '../utils/trpc'
import { Prices } from '../components/Prices'
import { FALLBACKCOORDS } from '../utils/fallback'

type petrolpricesParamsType = InferQueryInput<'prices.prices'>
export type petrolpricesDataType = InferQueryOutput<'prices.prices'>

/**
 * TODO: Fetch the data on the server side
 * @see https://trpc.io/docs/ssg-helpers
 */

export const usePetrolPrices = ({ lat, lng, rad }: petrolpricesParamsType) => {
  return trpc.useQuery(['prices.prices', { lat, lng, rad }], { refetchOnWindowFocus: false })
}

const Home: NextPage = () => {
  const router = useRouter()
  // FIXME: This is not the right way to do this...
  const { lat, lng } = router.query
  let parsedLat: number
  let parsedLng: number
  if (typeof lat === 'string' && typeof lng === 'string') {
    parsedLat = parseFloat(lat)
    parsedLng = parseFloat(lng)
  }
  else {
    parsedLat = FALLBACKCOORDS.lat
    parsedLng = FALLBACKCOORDS.lng
  }

  const prices = usePetrolPrices({ lat: parsedLat, lng: parsedLng, rad: 2 })

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

export default Home
