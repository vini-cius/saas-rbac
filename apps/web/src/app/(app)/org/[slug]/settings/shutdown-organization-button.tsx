import { XCircleIcon } from 'lucide-react'
import { redirect } from 'next/navigation'

import { getCurrentOrg } from '@/auth/auth'
import { Button } from '@/components/ui/button'
import { shutdownOrganization } from '@/http/shutdown-organization'

export function ShutdownOrganizationButton() {
  async function handleShutdownOrganization() {
    'use server'

    const currentOrg = await getCurrentOrg()

    await shutdownOrganization({ org: currentOrg! })

    redirect('/')
  }

  return (
    <form action={handleShutdownOrganization}>
      <Button type="submit" variant="destructive" className="w-56">
        <XCircleIcon className="mr-2 size-4" />
        Shutdown Organization
      </Button>
    </form>
  )
}
