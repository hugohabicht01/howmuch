import React from 'react'
import type { petrolpricesDataType } from '../pages/search'

type petrolStationType = petrolpricesDataType['stations'][number]

interface isOpenProps {
  isOpen: petrolStationType['isOpen']
}

const Open: React.FC<isOpenProps> = ({ isOpen }) => {
  switch (isOpen) {
    case true:
      return <span className="text-green-500">Open</span>
    case false:
      return <span className="text-red-500">Closed</span>
    default:
      return <span className="text-gray-500">Maybe open...</span>
  }
}

type petrolPriceType = petrolStationType['fuels'][number]

interface fuelProps {
  price: petrolPriceType
}

const Fuel: React.FC<fuelProps> = ({ price }) => {
  if (!price)
    return null
  return (
    <tr>
      <td>{price.name}</td>
      <td>{price.price}</td>
    </tr>
  )
}

interface fuelsProps {
  prices: petrolPriceType[]
}

const Fuels: React.FC<fuelsProps> = ({ prices }) => {
  if (prices.length === 0)
    return null
  return (
    <table className="m-4">
      <tbody>
        {prices.map((fuel, i) => (
          <Fuel price={fuel} key={i} />
        ))}
      </tbody>
    </table>
  )
}

interface Props {
  station: petrolStationType
}

const joinStrings = (strings: Array<string | undefined>) => strings.filter(Boolean).join(' ')

const formatName = (name: string | undefined, brand: string | undefined) => {
  if (!name || !brand)
    return joinStrings([brand, name])

  const nameTrimmed = name.trim()
  const brandTrimmed = brand.trim()

  if (nameTrimmed.startsWith(brandTrimmed)) {
    const fixedName = nameTrimmed.replace(brandTrimmed, '').trim()
    return joinStrings([brandTrimmed, fixedName])
  }
  return joinStrings([brandTrimmed, nameTrimmed])
}

const generateNavigationLink = (address: string) => {
  const gmapsNavigationUrl = new URL('https://www.google.com/maps/dir/')
  const params = new URLSearchParams({ api: '1', destination: address, travelmode: 'driving' })
  gmapsNavigationUrl.search = params.toString()
  return gmapsNavigationUrl.toString()
}

export const Station: React.FC<Props> = ({ station }) => {
  const { name, brand, street, postalCode, place, isOpen, fuels } = station

  const formattedLocation = joinStrings([street, postalCode, place])

  const formattedName = formatName(name, brand)

  const navigationLink = generateNavigationLink(formattedLocation)

  return (
    <div className="bg-blue-50 shadow rounded m-4 p-8">
      <h2 className="text-lg font-semibold">{formattedName}</h2>
      <p>{formattedLocation}</p>
      <p><Open isOpen={isOpen} /></p>
      <Fuels prices={fuels} />
      <a className="px-4 py-2 bg-blue-500 text-white rounded" href={navigationLink} target="_blank" rel="noreferrer" >Open Google Maps</a>
    </div>
  )
}
