import { createContext } from 'react'

interface StationSelectionType {
  select: (id: string) => void
  uuid: string
}

export const StationSelectionContext = createContext<StationSelectionType>({
  uuid: '',
  select: () => { },
})
