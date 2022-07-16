import { z } from 'zod'
import { createRouter } from './context'

export const exampleRouter = createRouter()
  .query('hello', {
    input: z
      .object({
        text: z.string().nullish(),
      })
      .nullish(),
    resolve({ input }) {
      return {
        greeting: `Hello ${input?.text ?? 'world'}`,
      }
    },
  })
  .query('prices', {
    input: z.object({
      lat: z.number(),
      lng: z.number(),
      rad: z.number().default(2),
    }),
    resolve({ input }) {
      const { lat, lng } = input
      return {
        coords: { lat, lng },
        rad: input.rad,
      }
    },
  })
  .query('getAll', {
    async resolve({ ctx }) {
      return await ctx.prisma.example.findMany()
    },
  })
