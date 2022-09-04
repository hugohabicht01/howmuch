import { useEffect, useState } from 'react'

interface LocationFoundType {
  coords: GeolocationPosition
  error: null
  isLoading: false
}

interface LocationErrorType {
  coords: null
  error: GeolocationPositionError
  isLoading: false
}

interface LocationLoadingType {
  coords: null
  error: null
  isLoading: true
}

export type LocationStateType = LocationFoundType | LocationErrorType | LocationLoadingType

export const useGeolocation = () => {
  const [location, setLocation] = useState<LocationStateType>({ coords: null, error: null, isLoading: true })

  const locationSuccessHandler = (pos: GeolocationPosition) => setLocation({ coords: pos, error: null, isLoading: false })
  const locationErrorHandler = (err: GeolocationPositionError) => setLocation({ coords: null, error: err, isLoading: false })

  useEffect(() => {
    if ('geolocation' in navigator)
      navigator.geolocation.getCurrentPosition(locationSuccessHandler, locationErrorHandler)
  })

  return location
}
