import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'

const Home: NextPage = () => {
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
        <div className="flex flex-col items-center px-4 py-2 bg-blue-300 rounded">
          <Link href="/search">Go to search!</Link>
        </div>
      </div>
    </>
  )
}

export default Home
