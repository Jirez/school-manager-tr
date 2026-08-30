import ExpenseReport from '#/views/report/expense/ExpenseReport'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_cleanLayout/expense_report',
)({
  component: ExpenseReport,
  staticData: {
    meta: {
      resource: 'report',
    },
  },
})
