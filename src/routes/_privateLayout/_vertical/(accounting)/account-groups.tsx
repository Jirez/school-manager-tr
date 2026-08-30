import AccountGroups from '#/views/accounting/groups'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(accounting)/account-groups',
)({
  component: AccountGroups,
  staticData: {
    meta: {
      resource: 'config',
    },
  },
})
