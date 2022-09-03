import { byCoordinates } from 'tankerkoenigv4'
import { z } from 'zod'
import { env } from '../../env/server.mjs'
import { createRouter } from './context'

const { TANKERKOENIG_APIKEY } = env

export const pricesRouter = createRouter()
  .query('prices', {
    input: z.object({
      lat: z.number(),
      lng: z.number(),
      rad: z.number().default(2),
    }),
    resolve: async ({ input }) => {
      const { lat, lng, rad } = input
      return await byCoordinates({ apikey: TANKERKOENIG_APIKEY, lat, lng, rad })
    },
  })
