import { api } from './api-client'

interface GetGoogleAuthorizationUrlResponse {
  authorizationUrl: string
}

export async function getGoogleAuthorizationUrl() {
  const result = await api
    .get('sessions/google/authorization-url')
    .json<GetGoogleAuthorizationUrlResponse>()

  return result
}
