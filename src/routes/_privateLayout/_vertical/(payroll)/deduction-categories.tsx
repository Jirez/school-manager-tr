import DeductionCategories from '#/views/payroll/deduction/category'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(payroll)/deduction-categories',
)({
  component: DeductionCategories,
  staticData: {
    meta: {
      resource: 'payroll',
    },
  },
})
