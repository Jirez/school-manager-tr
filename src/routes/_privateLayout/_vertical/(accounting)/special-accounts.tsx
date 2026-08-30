import SpecialAccounts from '#/views/accounting/specialAccounts'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(accounting)/special-accounts',
)({
  component: SpecialAccounts,
  staticData: {
    meta: {
      resource: 'config',
    },
  },
})
