import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import type { InferQueryInput, InferQueryOutput } from '../utils/trpc'
import { trpc } from '../utils/trpc'
import { Prices } from '../components/Prices'

type petrolpricesParamsType = InferQueryInput<'prices.prices'>
export type petrolpricesDataType = InferQueryOutput<'prices.prices'>

export const usePetrolPrices = ({ lat, lng, rad }: petrolpricesParamsType) => {
  return trpc.useQuery(['prices.prices', { lat, lng, rad }], { refetchOnWindowFocus: false })
}

const Home: NextPage = () => {
  // TODO get these values from somewhere, instead of just using these default ones
  const [lat, lng] = [52.520829, 13.408808]
  const prices = usePetrolPrices({ lat, lng })
  const [cookies, setCookies] = useState('')

  useEffect(() => {
    setCookies(document.cookie || 'no cookies')
  }, [])

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
          <div>
            Cookies:
            {cookies}
          </div>
        </div>
        <div className="py-6">
          <Prices prices={prices} />
        </div>
      </div>
    </>
  )
}
// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   return { props: { handled: true } }
// }

export default Home
