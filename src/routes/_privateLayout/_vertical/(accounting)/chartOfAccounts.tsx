import ChartOfAccounts from '#/views/accounting/charts'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(accounting)/chartOfAccounts',
)({
  component: ChartOfAccounts,
  staticData: {
    meta: {
      resource: 'config',
    },
  },
})
