import Deductions from '#/views/payroll/deduction'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(payroll)/deductions',
)({
  component: Deductions,
  staticData: {
    meta: {
      resource: 'payroll',
    },
  },
})
