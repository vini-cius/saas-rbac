import { randomUUID } from 'node:crypto'

import { env } from '@saas/env'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { google } from 'googleapis'
import { z } from 'zod'

export function getGoogleAuthorizationUrl(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/sessions/google/authorization-url',
    {
      schema: {
        tags: ['auth'],
        summary: 'Get Google OAuth2 authorization URL',
        response: {
          201: z.object({
            authorizationUrl: z.string(),
          }),
        },
      },
    },
    async () => {
      const oauth2Client = new google.auth.OAuth2(
        env.GOOGLE_OAUTH_CLIENT_ID,
        env.GOOGLE_OAUTH_CLIENT_SECRET,
        env.GOOGLE_OAUTH_REDIRECT_URI,
      )

      const secureRandomState = randomUUID()

      const authorizationUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['email', 'profile'],
        include_granted_scopes: true,
        state: secureRandomState,
      })

      return {
        authorizationUrl,
      }
    },
  )
}
