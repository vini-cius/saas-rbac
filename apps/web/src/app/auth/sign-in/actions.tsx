'use server'

import { HTTPError } from 'ky'
import { z } from 'zod'

import { signInWithPassword } from '@/http/sign-in-with-password'

const signInFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Please enter a password.' }),
})

export async function signInWithEmailAndPassword(data: FormData) {
  const result = signInFormSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return {
      success: false,
      message: null,
      errors,
    }
  }

  const { email, password } = result.data

  try {
    const { token } = await signInWithPassword({
      email,
      password,
    })

    console.log(token)
  } catch (error) {
    if (error instanceof HTTPError) {
      const { message } = await error.response.json()

      return {
        success: false,
        message,
        errors: null,
      }
    }

    console.error(error)

    return {
      success: false,
      message: 'Unknown error',
      errors: null,
    }
  }

  return {
    success: true,
    message: null,
    errors: null,
  }
}
