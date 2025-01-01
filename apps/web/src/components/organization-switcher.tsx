import { ChevronsUpDownIcon, PlusCircleIcon } from 'lucide-react'
import { cookies } from 'next/headers'
import Link from 'next/link'

import { getOrganizations } from '@/http/get-organizations'
import { getInitials } from '@/lib/utils'

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

export async function OrganizationSwitcher() {
  const cookieStore = await cookies()

  const currentOrg = cookieStore.get('org')?.value

  const { organizations } = await getOrganizations()

  const currentOrganization = organizations.find(
    (organization) => organization.slug === currentOrg,
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-[168px] items-center gap-2 p-1 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-primary">
        {currentOrganization ? (
          <>
            <Avatar className="mr-2 size-4">
              {currentOrganization.avatarUrl && (
                <AvatarImage src={currentOrganization.avatarUrl} />
              )}
              <AvatarFallback>
                {getInitials(currentOrganization.name)}
              </AvatarFallback>
            </Avatar>

            <span className="truncate text-left">
              {currentOrganization.name}
            </span>
          </>
        ) : (
          <span className="text-muted-foreground">Select organization</span>
        )}

        <ChevronsUpDownIcon className="ml-auto size-4 text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        alignOffset={-16}
        sideOffset={12}
        className="w-[200px]"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>Organizations</DropdownMenuLabel>
          {organizations.map((organization) => (
            <DropdownMenuItem key={organization.id} asChild>
              <Link href={`/org/${organization.slug}`}>
                <Avatar className="mr-2 size-4">
                  {organization.avatarUrl && (
                    <AvatarImage src={organization.avatarUrl} />
                  )}
                  <AvatarFallback>
                    {getInitials(organization.name)}
                  </AvatarFallback>
                </Avatar>

                <span className="line-clamp-1">{organization.name}</span>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/create-organization">
            <PlusCircleIcon className="mr-2 size-4" />
            Create new
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
