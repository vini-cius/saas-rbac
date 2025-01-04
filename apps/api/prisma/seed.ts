import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function seed() {
  await prisma.organization.deleteMany()
  await prisma.user.deleteMany()

  const passwordHash = await hash('123456', 1)

  const user = await prisma.user.create({
    data: {
      name: 'Geralt of Rivia',
      email: 'geraltofrivia@acme.com',
      avatarUrl:
        'https://d.furaffinity.net/art/jonhankercheif/1648807071/1648807071.jonhankercheif_geralt_the_witcher_thumbs_up_full.jpg',
      passwordHash,
    },
  })

  const user2 = await prisma.user.create({
    data: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      avatarUrl: faker.image.avatarGitHub(),
      passwordHash,
    },
  })

  const user3 = await prisma.user.create({
    data: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      avatarUrl: faker.image.avatarGitHub(),
      passwordHash,
    },
  })

  await prisma.organization.create({
    data: {
      name: 'ACME Inc (admin)',
      domain: 'acme.com',
      slug: 'acme-admin',
      avatarUrl: faker.image.avatarGitHub(),
      shouldAttachUsersByDomain: true,
      ownerId: user.id,
      projects: {
        createMany: {
          data: [
            {
              name: faker.commerce.productName(),
              description: faker.commerce.productDescription(),
              slug: faker.lorem.slug(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                user2.id,
                user3.id,
              ]),
            },
            {
              name: faker.commerce.productName(),
              description: faker.commerce.productDescription(),
              slug: faker.lorem.slug(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                user2.id,
                user3.id,
              ]),
            },
            {
              name: faker.commerce.productName(),
              description: faker.commerce.productDescription(),
              slug: faker.lorem.slug(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                user2.id,
                user3.id,
              ]),
            },
          ],
        },
      },
      members: {
        createMany: {
          data: [
            { userId: user.id, role: 'ADMIN' },
            { userId: user2.id, role: 'MEMBER' },
            { userId: user3.id, role: 'MEMBER' },
          ],
        },
      },
    },
  })

  await prisma.organization.create({
    data: {
      name: 'ACME Inc (member)',
      slug: 'acme-member',
      avatarUrl: faker.image.avatarGitHub(),
      ownerId: user.id,
      projects: {
        createMany: {
          data: [
            {
              name: faker.commerce.productName(),
              description: faker.commerce.productDescription(),
              slug: faker.lorem.slug(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                user2.id,
                user3.id,
              ]),
            },
            {
              name: faker.commerce.productName(),
              description: faker.commerce.productDescription(),
              slug: faker.lorem.slug(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                user2.id,
                user3.id,
              ]),
            },
            {
              name: faker.commerce.productName(),
              description: faker.commerce.productDescription(),
              slug: faker.lorem.slug(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                user2.id,
                user3.id,
              ]),
            },
          ],
        },
      },
      members: {
        createMany: {
          data: [
            { userId: user.id, role: 'MEMBER' },
            { userId: user2.id, role: 'ADMIN' },
            { userId: user3.id, role: 'MEMBER' },
          ],
        },
      },
    },
  })

  await prisma.organization.create({
    data: {
      name: 'ACME Inc (billing)',
      slug: 'acme-billing',
      avatarUrl: faker.image.avatarGitHub(),
      ownerId: user.id,
      projects: {
        createMany: {
          data: [
            {
              name: faker.commerce.productName(),
              description: faker.commerce.productDescription(),
              slug: faker.lorem.slug(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                user2.id,
                user3.id,
              ]),
            },
            {
              name: faker.commerce.productName(),
              description: faker.commerce.productDescription(),
              slug: faker.lorem.slug(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                user2.id,
                user3.id,
              ]),
            },
            {
              name: faker.commerce.productName(),
              description: faker.commerce.productDescription(),
              slug: faker.lorem.slug(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                user2.id,
                user3.id,
              ]),
            },
          ],
        },
      },
      members: {
        createMany: {
          data: [
            { userId: user.id, role: 'BILLING' },
            { userId: user2.id, role: 'ADMIN' },
            { userId: user3.id, role: 'MEMBER' },
          ],
        },
      },
    },
  })
}

seed().then(() => {
  console.log('database seeded!')
})
