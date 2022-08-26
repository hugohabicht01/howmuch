import { Marker, useGoogleMap } from '@react-google-maps/api'
import { useContext, useState } from 'react'
import type { petrolpricesDataType, usePetrolPricesReturnType } from '../../pages/results'
import { GoogleMapsContext, StationSelectionContext } from '../../utils/contexts'
import Map from './Map'

type petrolStationType = petrolpricesDataType['stations'][number]

interface MarkerListProps {
  stations: petrolpricesDataType['stations']
}

const MarkerList = ({ stations }: MarkerListProps): JSX.Element => {
  const PetrolStationIcon: google.maps.Symbol = {
    strokeColor: 'black',
    fillColor: 'black',
    fillOpacity: 1,
    strokeOpacity: 1,
    strokeWeight: 0.01,
    scale: 2,
    anchor: new window.google.maps.Point(9, 21),
    path: 'M18 10a1 1 0 0 1-1-1a1 1 0 0 1 1-1a1 1 0 0 1 1 1a1 1 0 0 1-1 1m-6 0H6V5h6m7.77 2.23l.01-.01l-3.72-3.72L15 4.56l2.11 2.11C16.17 7 15.5 7.93 15.5 9a2.5 2.5 0 0 0 2.5 2.5c.36 0 .69-.08 1-.21v7.21a1 1 0 0 1-1 1a1 1 0 0 1-1-1V14a2 2 0 0 0-2-2h-1V5a2 2 0 0 0-2-2H6c-1.11 0-2 .89-2 2v16h10v-7.5h1.5v5A2.5 2.5 0 0 0 18 21a2.5 2.5 0 0 0 2.5-2.5V9c0-.69-.28-1.32-.73-1.77Z',
  }

  const CurrentPetrolStationIcon = { ...PetrolStationIcon, strokeColor: 'blue', fillColor: 'blue' }

  // Intercomponent communication using context, could be replaced by a state management lib
  const { select, uuid } = useContext(StationSelectionContext)

  const map = useGoogleMap()
  const [markers, setMarkers] = useState<Record<string, google.maps.Marker>>({})

  if (!map)
    return <></>

  const bounceStation = (id: string) => {
    const marker = markers[id]
    if (!marker) {
      console.error(`Couldnt access marker for some reason, id: ${id}`)
      return
    }

    marker.setAnimation(window.google.maps.Animation.BOUNCE)
    setTimeout(() => marker.setAnimation(null), 100)
  }

  const onClick = (id: string) => () => {
    select(id)
    bounceStation(id)

    const station = stations.find(s => s.id === uuid)
    if (map && station) {
      // FIXME: This doesn't work for some reason
      // Its beyond me, why it doesn't, but it doesn't
      map.panTo(station.coords)
      map.setZoom(17)
    }
  }

  const onLoad = (station: petrolStationType) => (marker: google.maps.Marker) => {
    // TODO: This onLoad will be fired several times for each marker, I'm not 100% sure if the old markers memory will be cleaned up properly, gotta investigate
    setMarkers(oldMarkers => ({ ...oldMarkers, [station.id]: marker }))
  }

  if (stations.length === 0)
    return <></>

  // If one of the stations is selected, make the station jump
  stations.find(s => s.id === uuid) && bounceStation(uuid)

  return (
    <>
      {stations.map(station =>
        <Marker
          position={station.coords}
          key={station.id}
          onClick={onClick(station.id)}
          onLoad={onLoad(station)}
          icon={station.id === uuid ? CurrentPetrolStationIcon : PetrolStationIcon}
          animation={window.google.maps.Animation.DROP}
        />,
      )}
    </>
  )
}

interface ResultsMapProps {
  prices: usePetrolPricesReturnType
}

export const ResultsMap = ({ prices }: ResultsMapProps): JSX.Element => {
  const { data } = prices
  return (
    <Map zoom={data ? 11 : 8}>
      {data && <MarkerList stations={data.stations} />}
    </Map>
  )
}
