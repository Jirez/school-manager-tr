import AccountReport from '#/views/report/accounting/AccountReport'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_cleanLayout/account_list',
)({
  component: AccountReport,
  staticData: {
    meta: {
      resource: 'report',
    },
  },
})
