import ExpenseSummary from '#/views/report/expense/ExpenseSummary'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_cleanLayout/expense_report_summary',
)({
  component: ExpenseSummary,
  staticData: {
    meta: {
      resource: 'report',
    },
  },
})
