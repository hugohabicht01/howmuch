import { byCoordinates } from 'tankerkoenigv4'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { createRouter } from './context'

const { TANKERKOENIG_APIKEY } = process.env

export const pricesRouter = createRouter()
  .query('prices', {
    input: z.object({
      lat: z.number(),
      lng: z.number(),
      rad: z.number().default(2),
    }),
    resolve: async ({ input }) => {
      if (!TANKERKOENIG_APIKEY) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred, please try again later.',
        })
      }

      const { lat, lng, rad } = input
      return await byCoordinates({ apikey: TANKERKOENIG_APIKEY, lat, lng, rad })
    },
  })
