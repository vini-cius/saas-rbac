import assert from 'node:assert/strict'
import test from 'node:test'

import { defineAbilityFor } from './index'

test('member can delete its own user subject', () => {
  const ability = defineAbilityFor({ id: 'member-1', role: 'MEMBER' })

  assert.equal(
    ability.can('delete', {
      __typename: 'User',
      id: 'member-1',
    }),
    true,
  )
})

test('member cannot delete another user subject', () => {
  const ability = defineAbilityFor({ id: 'member-1', role: 'MEMBER' })

  assert.equal(
    ability.can('delete', {
      __typename: 'User',
      id: 'member-2',
    }),
    false,
  )
})

test('admin can delete any user subject', () => {
  const ability = defineAbilityFor({ id: 'admin-1', role: 'ADMIN' })

  assert.equal(
    ability.can('delete', {
      __typename: 'User',
      id: 'member-2',
    }),
    true,
  )
})
