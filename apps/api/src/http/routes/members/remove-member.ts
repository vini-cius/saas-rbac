import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { BadRequestError } from '../_errors/bad-request-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function removeMember(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/organizations/:slug/members/:memberId',
      {
        schema: {
          tags: ['members'],
          summary: 'Remove a member of an organization',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            memberId: z.string().uuid(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug, memberId } = request.params

        const userId = await request.getCurrentUserId()
        const { membership, organization } =
          await request.getUserMembership(slug)

        const member = await prisma.member.findUnique({
          where: {
            id: memberId,
            organizationId: organization.id,
          },
        })

        if (!member) {
          throw new BadRequestError('Member not found in this organization')
        }

        if (member.userId === organization.ownerId) {
          throw new BadRequestError(
            'You cannot remove the organization owner. Transfer ownership first.',
          )
        }

        const { cannot } = getUserPermissions(userId, membership.role)

        if (
          cannot('delete', {
            __typename: 'User',
            id: member.userId,
          })
        ) {
          throw new UnauthorizedError('You are not allowed to remove this user')
        }

        await prisma.member.delete({
          where: {
            id: memberId,
            organizationId: organization.id,
          },
        })

        return reply.status(204).send()
      },
    )
}
