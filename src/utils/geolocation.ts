import { useCallback, useEffect, useState } from 'react'
import haversine from 'haversine'

export interface LocationFoundType {
  position: GeolocationPosition
  error: null
  isLoading: false
}

export interface LocationErrorType {
  position: null
  error: GeolocationPositionError
  isLoading: false
}

export interface LocationLoadingType {
  position: null
  error: null
  isLoading: true
}

export type LocationStateType = LocationFoundType | LocationErrorType | LocationLoadingType

export const useGeolocation = (
  { enableHighAccuracy, maximumAge, timeout }: PositionOptions = {},
  callback: ((newLocation: LocationStateType) => void) | undefined,
  isEnabled = true,
) => {
  const [coordinates, setCoordinates] = useState<LocationStateType>({
    isLoading: true,
    position: null,
    error: null,
  })

  const updateCoordinates = useCallback<PositionCallback>(
    (pos) => {
      setCoordinates({
        position: pos,
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
      position: null,
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

/**
 * Debounces geolocation values according to a distance threshold
 * This is done to avoid recalculations and rerendering after very small coordinate changes
 */
export const geolocationDebouncer = (oldState: LocationStateType, newState: LocationStateType, distanceThreshold: number): { state: LocationStateType; modified: boolean } => {
  // Get the newest error instead of the old one
  if (!newState.position && !oldState.position)
    return { modified: true, state: newState }

  // TODO: Add some checks how old the good data is
  // Don't bother returning error if we still have old good data that can be used
  if (!newState.position)
    return { state: oldState, modified: false }
  // If we didn't have any data previously, returning the new one is a no brainer
  if (!oldState.position)
    return { state: newState, modified: true }

  const newCoords = { lat: newState.position.coords.latitude, lng: newState.position.coords.longitude }
  const oldCoords = { lat: oldState.position.coords.latitude, lng: oldState.position.coords.longitude }
  const distance = haversine(newCoords, oldCoords, { format: '{lat,lng}', unit: 'meter' })
  if (distance > distanceThreshold)
    return { state: newState, modified: true }

  return { state: oldState, modified: false }
}

export const useDebouncedGeolocation = (distanceThreshold: number, isEnabled: boolean) => {
  const [debounced, setDebounced] = useState<LocationStateType>({
    isLoading: true,
    position: null,
    error: null,
  })

  const onLocationChanged = (newLocation: LocationStateType) => {
    const { state, modified } = geolocationDebouncer(debounced, newLocation, distanceThreshold)
    if (modified)
      setDebounced(state)
  }

  useGeolocation({ enableHighAccuracy: true, timeout: 1000 * 60, maximumAge: 1000 * 60 * 10 }, onLocationChanged, isEnabled)

  return debounced
}
