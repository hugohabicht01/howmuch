import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import type { ChangeEventHandler } from 'react'
import { useEffect, useState } from 'react'
import Layout from '../components/layout'
import { useGeolocationContext } from '../utils/contexts'
import type { priceSeachParams } from '../utils/coordinate'
import useDebounce from '../utils/debounce'

const Home: NextPage = () => {
  const [navigationLink, setNavigationLink] = useState('/results')
  const [radius, setRadius] = useState<number | null>(null)

  const location = useGeolocationContext()

  useEffect(() => {
    const locationUrlFragment = location.position ? { gpslat: location.position.coords.latitude.toString(), gpslng: location.position.coords.longitude.toString() } : {}
    const radiusUrlFragment = radius !== null ? { radius: radius.toString() } : {}
    const searchOptions: priceSeachParams = { ...radiusUrlFragment, ...locationUrlFragment }
    const params = new URLSearchParams(searchOptions)
    location.position && setNavigationLink(`/results?${params.toString()}`)
  }, [location, radius])

  return (
    <>
      <Head>
        <title>Petrolprices</title>
        <meta name="description" content="live petrolprices" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <div className="flex flex-col items-center w-8/10 min-h-screen mx-auto">
          <SearchSettings onRadiusChanged={setRadius} />
          <div className="flex flex-col items-center px-4 py-2 bg-blue-300 rounded mt-10">
            <Link href={encodeURI(navigationLink)}>Find stations!</Link>
          </div>
        </div>
      </Layout>
    </>
  )
}

interface SearchSettingsProps {
  onRadiusChanged: (newRadius: number) => void
}

const SearchSettings = ({ onRadiusChanged }: SearchSettingsProps): JSX.Element => {
  const [radius, setRadius] = useState<number>(2)
  const debouncedRadius = useDebounce(radius, 100)

  const onChange: ChangeEventHandler<HTMLInputElement> = e => setRadius(parseFloat(e.target.value))

  useEffect(() => onRadiusChanged(debouncedRadius), [debouncedRadius, onRadiusChanged])

  return (
    <>
      <label htmlFor="rangeslider">Search radius</label>
      <input type="range" min="1" max="40" step={0.5} onChange={onChange} id="rangeslider" value={radius} />
    </>
  )
}

export default Home
