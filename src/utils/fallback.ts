import type { Merge } from 'type-fest'

export const FALLBACKCOORDS = { lat: 52.520829, lng: 13.408808 }

type DefinedValueType = number | object | string | Array<DefinedValueType>
type ValueType = DefinedValueType | undefined | null

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Last<T extends any[]> = T extends [...infer items, infer lastItem] ? lastItem : never

export function getDataWithFallback
  <TKey extends PropertyKey, TValue extends ValueType>(input: Merge<Record<TKey, TValue>, { [Last<typeof order>]: DefinedValueType }>,
  order: Array<keyof typeof input>) {
  for (const item of order) {
    const val = input[item]
    if (val !== undefined || val !== null)
      return val
  }
}

const location = getDataWithFallback({
  locationByIP: { lat: 51.213, lng: 8.8123 },
  locationByQueryParams: null,
  locationByNavigator: { lat: 51.8909, lng: 9.8989 },
  fallback: FALLBACKCOORDS,
},
['locationByQueryParams', 'locationByNavigator', 'locationByIP'],
)
