import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api'
import { useContext, useEffect } from 'react'
import { env } from '../../env/client.mjs'
import type { petrolpricesDataType, usePetrolPricesReturnType } from '../../pages/results'
import { MapContext, StationSelectionContext } from '../../utils/contexts'

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

  const { setZoom, setCenter } = useContext(MapContext)

  const onClick = (id: string) => () => {
    select(id)

    const station = stations.find(s => s.id === id)
    // TODO: Make this fire when clicking on station component as well
    // TODO: Add state to the station itself and make it toggleable
    // TODO: Move this somewhere else and let the station itself own the state
    if (station) {
      setCenter(station.coords)
      setZoom(15)
    }
  }

  if (stations.length === 0)
    return <></>

  return (
    <>
      {stations.map(station =>
        <Marker
          position={station.coords}
          key={station.id}
          onClick={onClick(station.id)}
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

const { NEXT_PUBLIC_GOOGLE_MAPS_APIKEY } = env

const containerStyle = {
  width: '80vw',
  height: '50vh',
}

const loadScriptOptions = {
  id: 'google-map-script',
  libraries: ['geometry'],
  googleMapsApiKey: NEXT_PUBLIC_GOOGLE_MAPS_APIKEY,
} as const

const Map = ({ prices }: ResultsMapProps): JSX.Element => {
  // @ts-expect-error due to the library having retarded type defs
  const { isLoaded, loadError } = useLoadScript(loadScriptOptions)

  const { data } = prices

  const {
    map,
    setMap,
    zoom,
    setZoom,
    center,
  } = useContext(MapContext)

  useEffect(() => {
    // Unfortunately this is the only place the panning to the map actually works.
    // Dont ask me why, I've tried many times to get the panning to work at other places...
    if (map)
      setTimeout(() => map.panTo(center), 1)
  }, [center, map])

  useEffect(() => {
    if (map)
      setTimeout(() => map.setZoom(zoom), 1)
  }, [zoom, map])

  if (loadError) {
    console.error('Error while loading google maps: ', loadError)
    return <div className="flex justify-center">
      Maps couldn&apos;t be loaded
    </div>
  }

  return (
    <div className="flex justify-center">
      {isLoaded
        ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            onLoad={setMap}
            // onZoomChanged={() => {
            //   console.log(`new zoom: ${map?.getZoom()}`)
            // }}
            onZoomChanged={() => {
              if (!map)
                return
              const currentZoom = map.getZoom()
              if (currentZoom)
                setZoom(currentZoom)
            }}
          >
            {data && <MarkerList stations={data.stations} />}
          </GoogleMap>
          )
        : <p>Still loading the map...</p>
      }
    </div>)
}

export default Map
