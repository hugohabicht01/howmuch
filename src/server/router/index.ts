// src/server/router/index.ts
import superjson from 'superjson'
import { createRouter } from './context'

import { pricesRouter } from './prices'

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('prices.', pricesRouter)

// export type definition of API
export type AppRouter = typeof appRouter
