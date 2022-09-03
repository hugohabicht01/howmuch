import { createContext } from 'react'
import type { LatLng } from './coordinate'
import { FALLBACKCOORDS } from './coordinate'

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
