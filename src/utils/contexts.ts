import { createContext, useContext } from 'react'
import type { LatLng } from './coordinate'
import { FALLBACKCOORDS } from './coordinate'
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

export const StationSelectionContext = createContext<StationSelectionType>({
  uuid: '',
  select: () => { },
})

interface MapContextType {
  map: google.maps.Map | null
  setMap: (map: google.maps.Map) => void

  zoom: number
  setZoom: (newZoom: number) => void
  center: LatLng
  setCenter: (newCoords: LatLng) => void
}

export const MapContext = createContext<MapContextType>({
  map: null,
  setMap: () => { console.error('default handler for setMap, this should never be called') },

  zoom: 11,
  center: FALLBACKCOORDS,
  setZoom: () => { console.error('default handler for setZoom ran, this should never happen') },
  setCenter: () => { console.error('default handler for setZoom ran, this should never happen') },
})

// TODO: protect contexts with this:  https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/context/#extended-example
export const [useGeolocationContext, GeolocationContextProvider] = createSafeContext<LocationStateType>()
