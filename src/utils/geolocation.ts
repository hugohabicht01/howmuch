import { useCallback, useEffect, useState } from 'react'

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

// export const useGeolocation = () => {
//   const [location, setLocation] = useState<LocationStateType>({ coords: null, error: null, isLoading: true })

//   const locationSuccessHandler = (pos: GeolocationPosition) => setLocation({ coords: pos, error: null, isLoading: false })
//   const locationErrorHandler = (err: GeolocationPositionError) => setLocation({ coords: null, error: err, isLoading: false })

//   useEffect(() => {
//     if ('geolocation' in navigator)
//       navigator.geolocation.getCurrentPosition(locationSuccessHandler, locationErrorHandler)
//   })

//   return location
// }

export const useGeolocation = (
  { enableHighAccuracy, maximumAge, timeout }: PositionOptions = {},
  callback: (...args: any) => any,
  isEnabled = true,
) => {
  const [coordinates, setCoordinates] = useState<LocationStateType>({
    isLoading: true,
    coords: null,
    error: null,
  })

  const updateCoordinates = useCallback<PositionCallback>(
    (pos) => {
      setCoordinates({
        coords: pos,
        isLoading: false,
        error: null,
      })

      if (typeof callback === 'function')
        callback(coordinates)
    },
    [callback, coordinates],
  )

  const setError = useCallback<PositionErrorCallback>((error) => {
    setCoordinates({
      coords: null,
      isLoading: false,
      error,
    })
  }, [])

  useEffect(() => {
    let watchId: number

    if (isEnabled && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(updateCoordinates, setError)
      watchId = navigator.geolocation.watchPosition(
        updateCoordinates,
        setError,
        {
          enableHighAccuracy,
          maximumAge,
          timeout,
        },
      )
    }

    return () => {
      if (watchId)
        navigator.geolocation.clearWatch(watchId)
    }
  }, [
    isEnabled,
    callback,
    enableHighAccuracy,
    maximumAge,
    setError,
    timeout,
    updateCoordinates,
  ])

  return coordinates
}
