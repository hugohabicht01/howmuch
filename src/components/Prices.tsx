import React from 'react'
import type { petrolpricesDataType, usePetrolPricesReturnType } from '../pages/results'
import { Station } from './Station'

type petrolStationType = petrolpricesDataType['stations'][number]

interface StationListProps {
  stations: petrolStationType[]
}

const NoStations: React.FC<{}> = () => <p>No stations in the searcharea</p>

const StationList: React.FC<StationListProps> = ({ stations }) => {
  return (
    <>
      {stations.map((station, i) => <Station station={station} key={i} />)}
    </>
  )
}

interface PricesProps {
  prices: petrolpricesDataType
}

// TODO: Fix naming of this function and the default export
const Prices: React.FC<PricesProps> = ({ prices }) => {
  return (
    <>
      <h1>Prices</h1>
      <p>Date fetched: {prices.timestamp}</p>
      <p>API version: {prices.apiVersion}</p>
      <div className="stations">
        {
          (prices.stations.length > 0)
            ? <StationList stations={prices.stations} />
            : <NoStations />
        }
      </div>
      <style jsx>{`
        .stations {
          display: grid;
          grid-template-columns: 1fr;
        }

        @media only screen and (min-width: 770px) {
          .stations {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media only screen and (min-width: 1050px) {
          .stations {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        `}
      </style>
    </>
  )
}

interface PricesDataProps {
  prices: usePetrolPricesReturnType
}

export default function PricesData({ prices: { isLoading, isError, error, data } }: PricesDataProps) {
  if (isLoading)
    return <p>Still loading, hang on...</p>

  if (isError || !data) {
    return (
      <div>
        <p>
          Something went wrong, error:
        </p>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </div>
    )
  }

  return <Prices prices={data} />
}
