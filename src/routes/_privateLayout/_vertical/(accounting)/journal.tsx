import AccountingEntries from '#/views/accounting/entries'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(accounting)/journal',
)({
  component: AccountingEntries,
  staticData: {
    meta: {
      resource: 'config',
    },
  },
})
