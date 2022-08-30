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
  zoom?: number
}

// eslint-disable-next-line react/prop-types
const Map: React.FC<MapProps> = ({ children, center, zoom }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: NEXT_PUBLIC_GOOGLE_MAPS_APIKEY,
  })

  const mapcenter = center || FALLBACKCOORDS

  const options: google.maps.MapOptions = {
    zoom: zoom || 8,
    center: mapcenter,
  }

  return (
    <div className="flex justify-center">
      {isLoaded
        ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            options={options}
            // eslint-disable-next-line no-console
            onZoomChanged={() => console.log('zoom changed')}
          >
            {children || <></>}
          </GoogleMap>
          )
        : <p>Still loading the map...</p>
      }
    </div>)
}
export default Map
