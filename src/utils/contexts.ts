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

// TODO: Think about putting this into a store instead of using context for everything
interface ZoomContextType {
  zoom: number
  setZoom: (newZoom: number) => void
  center: LatLng
  setCenter: (newCoords: LatLng) => void
}

export const ZoomContext = createContext<ZoomContextType>({ zoom: 11, center: FALLBACKCOORDS, setZoom: () => { }, setCenter: () => { } })
