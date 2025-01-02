import { env } from '@saas/env'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { google } from 'googleapis'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

export async function authenticateWithGoogle(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions/google',
    {
      schema: {
        tags: ['auth'],
        summary: 'Authenticate with Google',
        body: z.object({
          code: z.string(),
          state: z.string().nullable(),
        }),
        response: {
          201: z.object({
            token: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { code } = request.body

      const oauth2Client = new google.auth.OAuth2(
        env.GOOGLE_OAUTH_CLIENT_ID,
        env.GOOGLE_OAUTH_CLIENT_SECRET,
        env.GOOGLE_OAUTH_REDIRECT_URI,
      )

      const { tokens } = await oauth2Client.getToken(code)

      oauth2Client.setCredentials(tokens)

      const service = google.people({
        version: 'v1',
        auth: oauth2Client,
      })

      const { data: googleUserData } = await service.people.get({
        resourceName: 'people/me',
        personFields: 'emailAddresses,names,photos',
      })

      const { names, photos, emailAddresses } = z
        .object({
          names: z.array(
            z.object({
              displayName: z.string(),
              metadata: z.object({
                source: z.object({
                  type: z.string(),
                  id: z.string(),
                }),
              }),
            }),
          ),
          photos: z.array(
            z.object({
              url: z.string(),
            }),
          ),
          emailAddresses: z.array(
            z.object({
              value: z.string().email(),
            }),
          ),
        })
        .parse(googleUserData)

      const {
        displayName: name,
        metadata: {
          source: { id: googleUserId },
        },
      } = names[0]
      const { value: email } = emailAddresses[0]
      const { url: avatarUrl } = photos[0]

      let user = await prisma.user.findUnique({
        where: {
          email,
        },
      })

      if (!user) {
        user = await prisma.user.create({
          data: {
            email,
            name,
            avatarUrl,
          },
        })
      }

      let account = await prisma.account.findUnique({
        where: {
          provider_userId: {
            provider: 'GOOGLE',
            userId: user.id,
          },
        },
      })

      if (!account) {
        account = await prisma.account.create({
          data: {
            provider: 'GOOGLE',
            providerAccountId: googleUserId,
            userId: user.id,
          },
        })
      }

      const token = await reply.jwtSign(
        {
          sub: user.id,
        },
        {
          expiresIn: '1d',
        },
      )

      return reply.status(201).send({
        token,
      })
    },
  )
}
