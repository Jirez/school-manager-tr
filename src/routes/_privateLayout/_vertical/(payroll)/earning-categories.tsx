import EarningCategories from '#/views/payroll/earning/category'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(payroll)/earning-categories',
)({
  component: EarningCategories,
  staticData: {
    meta: {
      resource: 'payroll',
    },
  },
})
