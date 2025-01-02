import { api } from './api-client'

interface SignInWithGoogleRequest {
  code: string
  state: string | null
}

interface SignInWithGoogleResponse {
  token: string
}

export async function signInWithGoogle({
  code,
  state,
}: SignInWithGoogleRequest) {
  const result = await api
    .post('sessions/google', {
      json: {
        code,
        state,
      },
    })
    .json<SignInWithGoogleResponse>()

  return result
}
