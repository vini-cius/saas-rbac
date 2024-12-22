import { defineAbilitiesFor, projectSchema } from '@saas/auth'

const ability = defineAbilitiesFor({ role: 'MEMBER', id: '1' })

const project = projectSchema.parse({
  id: '1',
  ownerId: '1',
})

console.log(ability.can('get', 'Billing'))
console.log(ability.can('get', 'User'))
console.log(ability.can('delete', project))
