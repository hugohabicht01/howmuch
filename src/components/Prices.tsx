import React from 'react'
import type { petrolpricesDataType, usePetrolPrices } from '../pages/search'
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

type petrolpricesResult = ReturnType<typeof usePetrolPrices>

interface PricesProps {
  prices: petrolpricesResult
}

export const Prices: React.FC<PricesProps> = ({ prices }) => {
  const { isLoading, isError, error, data } = prices

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

  return (
    <>
      <h1>Prices</h1>
      <p>Date fetched: {data.timestamp}</p>
      <p>API version: {data.apiVersion}</p>
      <div className="stations">
        {
          (data.stations.length > 0)
            ? <StationList stations={data.stations} />
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
