import { ability, getCurrentOrg } from '@/auth/auth'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { getOrganization } from '@/http/get-organization'

import { OrganizationForm } from '../../organization-form'
import { Billing } from './billing'
import { ShutdownOrganizationButton } from './shutdown-organization-button'

export default async function Settings() {
  const currentOrg = await getCurrentOrg()
  const permission = await ability()

  const canUpdateOrg = permission?.can('update', 'Organization')
  const canGetBilling = permission?.can('get', 'Billing')
  const canShutdownOrg = permission?.can('delete', 'Organization')

  const { organization } = await getOrganization(currentOrg!)

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="space-y-4">
        {canUpdateOrg && (
          <Card>
            <CardHeader>
              <CardTitle>Organization Settings</CardTitle>
              <CardDescription>
                Update your organization details.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <OrganizationForm
                isUpdating
                initialData={{
                  name: organization.name,
                  domain: organization.domain,
                  shouldAttachUsersByDomain:
                    organization.shouldAttachUsersByDomain,
                }}
              />
            </CardContent>
          </Card>
        )}
      </div>

      {canGetBilling && <Billing />}

      {canShutdownOrg && (
        <Card>
          <CardHeader>
            <CardTitle>Shutdown Organization</CardTitle>
            <CardDescription>
              This will delete all organization data including projects. This
              action cannot be undone.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <ShutdownOrganizationButton />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
