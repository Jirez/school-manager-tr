import Accounts from '#/views/accounting/accounts'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(accounting)/accounts',
)({
  component: Accounts,
  staticData: {
    meta: {
      resource: 'config',
    },
  },
})
