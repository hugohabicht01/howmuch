import React from 'react'
import type { usePetrolPrices } from '../pages/search'
import { Station } from './Station'

type petrolpricesResult = ReturnType<typeof usePetrolPrices>

interface Props {
  prices: petrolpricesResult
}

export const Prices: React.FC<Props> = ({ prices }) => {
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
        {data.stations.map((station, i) => <Station station={station} key={i} />)}
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
