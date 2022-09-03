import React, { useContext } from 'react'
import cn from 'classnames'
import type { petrolpricesDataType } from '../pages/results'
import { MapContext, StationSelectionContext } from '../utils/contexts'

type petrolStationType = petrolpricesDataType['stations'][number]

interface IsOpenProps {
  isOpen: petrolStationType['isOpen']
}

const Open: React.FC<IsOpenProps> = ({ isOpen }) => {
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

interface FuelProps {
  price: petrolPriceType
}

const Fuel: React.FC<FuelProps> = ({ price }) => {
  if (!price)
    return null
  return (
    <tr>
      <td>{price.name}</td>
      <td>{price.price}</td>
    </tr>
  )
}

interface FuelsProps {
  prices: petrolPriceType[]
}

const Fuels: React.FC<FuelsProps> = ({ prices }) => {
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
  const { uuid, select } = useContext(StationSelectionContext)
  const { setZoom, setCenter } = useContext(MapContext)

  const isSelected = uuid === station.id
  const { name, brand, street, postalCode, place, isOpen, fuels } = station

  const formattedLocation = joinStrings([street, postalCode, place])

  const formattedName = formatName(name, brand)

  const navigationLink = generateNavigationLink(formattedLocation)

  // TODO: Remove this code duplication and instead write a custom hook that can be used both here and inside the resultsmap
  const onClick = (id: string) => () => {
    select(id)
    setCenter(station.coords)
    setZoom(15)
  }

  return (
    <div className={cn({
      'rounded': true,
      'm-4': true,
      'p-8': true,
      'cursor-pointer': true,
      'bg-blue-50': !isSelected,
      'bg-blue-100': isSelected,
      'border': true,
      'border-gray-200': true,
      'border-blue-500': isSelected,
    })}
      onClick={onClick(station.id)}>
      <h2 className="text-lg font-semibold">{formattedName}</h2>
      <p>{formattedLocation}</p>
      <p><Open isOpen={isOpen} /></p>
      <Fuels prices={fuels} />
      <a className="px-4 py-2 bg-blue-500 text-white rounded" href={navigationLink} target="_blank" rel="noreferrer" >Open Google Maps</a>
    </div>
  )
}
