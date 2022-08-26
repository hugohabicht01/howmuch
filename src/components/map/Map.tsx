import { memo, useCallback, useState } from 'react'
import type { ReactNode } from 'react'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api'
import { FALLBACKCOORDS } from '../../utils/coordinate'
import { env } from '../../env/client.mjs'
import type { LatLng } from '../../utils/coordinate'

const containerStyle = {
  width: '80vw',
  height: '50vh',
}

const { NEXT_PUBLIC_GOOGLE_MAPS_APIKEY } = env

interface MapProps {
  children?: ReactNode
  center?: LatLng
}

// eslint-disable-next-line react/prop-types
const Map: React.FC<MapProps> = ({ children, center }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: NEXT_PUBLIC_GOOGLE_MAPS_APIKEY,
  })

  const [map, setMap] = useState<google.maps.Map | null>(null)

  const onLoad = useCallback((map: google.maps.Map) => {
    // const bounds = new window.google.maps.LatLngBounds(center)
    // map.fitBounds(bounds)
    setMap(map)
  }, [])

  const onUnmount = useCallback(() => {
    setMap(null)
  }, [])

  const mapcenter = center || FALLBACKCOORDS

  const options: google.maps.MapOptions = {
    zoom: 8,
    center: mapcenter,
  }

  return (isLoaded
    ? (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        onLoad={onLoad}
        options={options}
        onUnmount={onUnmount}
      >
        {children || <></>}
      </GoogleMap>
      )
    : <></>)
}
export default memo(Map)
