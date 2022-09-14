import { createContext, useContext } from 'react'
import type { LatLng } from './coordinate'
import type { LocationStateType } from './geolocation'

/**
 * A helper to create a Context and Provider with no upfront default value, and
 * without having to check for undefined all the time.
 */
function createSafeContext<A extends {} | null>() {
  const ctx = createContext<A | undefined>(undefined)
  function useCtx() {
    const c = useContext(ctx)
    if (c === undefined)
      throw new Error('useCtx must be inside a Provider with a value')
    return c
  }
  return [useCtx, ctx.Provider] as const
}

interface StationSelectionType {
  select: (id: string) => void
  uuid: string
}

export const [useStationSelectionContext, StationSelectionContextProvider] = createSafeContext<StationSelectionType>()

interface MapContextType {
  map: google.maps.Map | null
  setMap: (map: google.maps.Map) => void

  zoom: number
  setZoom: (newZoom: number) => void
  center: LatLng
  setCenter: (newCoords: LatLng) => void
}

export const [useMapContext, MapContextProvider] = createSafeContext<MapContextType>()

// TODO: protect contexts with this:  https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/context/#extended-example
export const [useGeolocationContext, GeolocationContextProvider] = createSafeContext<LocationStateType>()
