import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '../../../server/db/client'

import { env } from '../../../env/server.mjs'

export default NextAuth({
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: env.GITHUB_ID ?? '',
      clientSecret: env.GITHUB_SECRET ?? '',
    }),
    // ...add more providers here
  ],
})
