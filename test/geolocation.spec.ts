import { describe, expect, it } from 'vitest'
import type { ReadonlyDeep } from 'type-fest'
import type { LocationErrorType, LocationFoundType } from '../src/utils/geolocation'
import { geolocationDebouncer } from '../src/utils/geolocation'

namespace testData {
  export const locationFoundState: ReadonlyDeep<LocationFoundType> = {
    coords: {
      coords: {
        accuracy: 42,
        altitude: 42,
        altitudeAccuracy: 42,
        heading: 42,
        latitude: 42.123,
        longitude: 42.123,
        speed: 42,
      },
      timestamp: 42,
    },
    isLoading: false,
    error: null,
  }

  export const locationFoundStateTwo: ReadonlyDeep<LocationFoundType> = {
    coords: {
      coords: {
        accuracy: 42,
        altitude: 42,
        altitudeAccuracy: 42,
        heading: 42,
        latitude: 52.5162723, // Brandenburg Gate in Berlin
        longitude: 13.377961,
        speed: 42,
      },
      timestamp: 42,
    },
    isLoading: false,
    error: null,
  }

  export const locationFoundStateThree: ReadonlyDeep<LocationFoundType> = {
    coords: {
      coords: {
        accuracy: 42,
        altitude: 42,
        altitudeAccuracy: 42,
        heading: 42,
        latitude: 52.516285, // 220m from Brandenburg Gate
        longitude: 13.380918,
        speed: 42,
      },
      timestamp: 42,
    },
    isLoading: false,
    error: null,
  }

  export const locationErrorState: ReadonlyDeep<LocationErrorType> = {
    coords: null,
    isLoading: false,
    error: {
      code: 42,
      message: 'some error',
      PERMISSION_DENIED: 42,
      POSITION_UNAVAILABLE: 42,
      TIMEOUT: 42,
    },
  }

  export const locationErrorStateTwo: ReadonlyDeep<LocationErrorType> = {
    coords: null,
    isLoading: false,
    error: {
      code: 1337,
      message: 'some other error',
      PERMISSION_DENIED: 1337,
      POSITION_UNAVAILABLE: 1337,
      TIMEOUT: 1337,
    },
  }

}

describe('geolocationDebouncer', () => {
  it('returns previous good state if new state is bad', () => {
    expect(geolocationDebouncer(testData.locationFoundState, testData.locationErrorState, 50)).toEqual({ modified: false, state: testData.locationFoundState })
  })

  it('returns new bad state if both old and new state are bad', () => {
    expect(geolocationDebouncer(testData.locationErrorState, testData.locationErrorStateTwo, 50)).toEqual({ modified: true, state: testData.locationErrorStateTwo })
  })

  it('returns the new state if it is more than the threshold away from the previous position', () => {
    // 220m in between the points
    expect(geolocationDebouncer(testData.locationErrorStateTwo, testData.locationFoundStateThree, 200)).toEqual({ modified: true, state: testData.locationFoundStateThree })
  })

  it('returns the old state if it is less than the threshold away from the previous position', () => {
    expect(geolocationDebouncer(testData.locationFoundStateTwo, testData.locationFoundStateThree, 250)).toEqual({ modified: false, state: testData.locationFoundStateTwo })
  })
})
