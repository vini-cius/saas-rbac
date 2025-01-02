import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { signInWithGoogle } from '@/http/sign-in-with-google'

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()

  const searchParams = request.nextUrl.searchParams

  const redirectUrl = request.nextUrl.clone()

  if (searchParams.has('error')) {
    redirectUrl.pathname = '/auth/sign-in'
    redirectUrl.search = ''
    redirectUrl.searchParams.set('googleOAuthError', searchParams.get('error')!)

    return NextResponse.redirect(redirectUrl)
  }

  const code = searchParams.get('code')
  const state = searchParams.get('state')

  if (!code) {
    return new Response('Missing Google oAuth code', { status: 400 })
  }

  const { token } = await signInWithGoogle({ code, state })

  cookieStore.set('token', token, {
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })

  redirectUrl.pathname = '/'
  redirectUrl.search = ''

  return NextResponse.redirect(redirectUrl)
}
