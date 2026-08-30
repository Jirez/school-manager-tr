import ExpenseCategories from '#/views/expense/category'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(expense)/expense-categories',
)({
  component: ExpenseCategories,
  staticData: {
    meta: {
      resource: 'config',
    },
  },
})
