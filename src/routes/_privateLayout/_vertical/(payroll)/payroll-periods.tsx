import PayrollPeriods from '#/views/payroll/periods'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(payroll)/payroll-periods',
)({
  component: PayrollPeriods,
  staticData: {
    meta: {
      resource: 'payroll',
    },
  },
})
