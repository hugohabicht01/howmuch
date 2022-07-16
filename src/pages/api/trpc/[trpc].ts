// src/pages/api/trpc/[trpc].ts
import { createNextApiHandler } from '@trpc/server/adapters/next'
import { appRouter } from '../../../server/router'
import { createContext } from '../../../server/router/context'

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext,
  responseMeta({ ctx, type, errors }) {
    // checking that no procedures errored
    const allOk = errors.length === 0
    // checking we're doing a query request
    const isQuery = type === 'query'

    if (ctx?.res && allOk && isQuery) {
      // cache request for 5 minutes for dev and 10 seconds for prod
      const TEN_SECONDS = 30
      const FIVE_MINUTES = 60 * 5

      const CACHE_AGE = process.env.NODE_ENV === 'development' ? FIVE_MINUTES : TEN_SECONDS
      return {
        headers: {
          'cache-control': `max-age=${CACHE_AGE}`,
        },
      }
    }
    return {}
  },
})
