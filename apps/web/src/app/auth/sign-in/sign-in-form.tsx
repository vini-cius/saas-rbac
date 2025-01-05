'use client'

import { AlertTriangleIcon, Loader2Icon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

import githubIcon from '@/assets/github-icon.svg'
import googleIcon from '@/assets/google-icon.svg'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useFormState } from '@/hooks/use-form-state'

import { signInWithGithub, signInWithGoogle } from '../actions'
import { signInWithEmailAndPassword } from './actions'

export function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [{ success, message, errors }, handleSubmit, isPending] = useFormState(
    signInWithEmailAndPassword,
    () => router.push('/'),
  )

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {success === false && message && (
          <Alert variant="destructive">
            <AlertTriangleIcon className="size-4" />
            <AlertTitle>Sign in failed!</AlertTitle>

            <AlertDescription>
              <p>{message}</p>
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            autoComplete="email"
            inputMode="email"
            defaultValue={searchParams.get('email') ?? ''}
          />

          {errors?.email && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.email[0]}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            name="password"
            autoComplete="current-password"
          />

          {errors?.password && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.password[0]}
            </p>
          )}

          <Link
            href="/auth/forgot-password"
            className="text-xs font-medium text-foreground hover:underline"
          >
            Forgot you password ?
          </Link>
        </div>

        <Button className="w-full" type="submit" disabled={isPending}>
          {isPending ? (
            <Loader2Icon className="size-4 animate-spin" />
          ) : (
            'Sign in with e-mail'
          )}
        </Button>

        <Button className="w-full" type="button" variant={'link'} asChild>
          <Link href="/auth/sign-up">Create new account</Link>
        </Button>
      </form>

      <Separator />

      <form action={signInWithGithub}>
        <Button className="w-full" type="submit" variant={'outline'}>
          <Image src={githubIcon} alt="" className="mr-2 size-4 dark:invert" />
          Sign in with Github
        </Button>
      </form>

      <form action={signInWithGoogle}>
        <Button className="w-full" type="submit" variant={'outline'}>
          <Image src={googleIcon} alt="" className="mr-2 size-4 dark:invert" />
          Sign in with Google
        </Button>
      </form>
    </div>
  )
}
