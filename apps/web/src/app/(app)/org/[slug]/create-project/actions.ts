'use server'

import { HTTPError } from 'ky'
import { z } from 'zod'

import { getCurrentOrg } from '@/auth/auth'
import { createProject } from '@/http/create-project'

const projectSchema = z.object({
  name: z.string().min(4, { message: 'Name must be at least 4 characters.' }),
  description: z.string(),
})

export async function createProjectAction(data: FormData) {
  const result = projectSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return {
      success: false,
      message: null,
      errors,
    }
  }

  const { name, description } = result.data

  const org = await getCurrentOrg()

  try {
    await createProject({
      org: org!,
      name,
      description,
    })
  } catch (error) {
    if (error instanceof HTTPError) {
      const { message } = await error.response.json()

      return {
        success: false,
        message,
        errors: null,
      }
    }

    return {
      success: false,
      message: 'Sorry, something went wrong. Please try again later.',
      errors: null,
    }
  }

  return {
    success: true,
    message: 'Project created successfully.',
    errors: null,
  }
}
