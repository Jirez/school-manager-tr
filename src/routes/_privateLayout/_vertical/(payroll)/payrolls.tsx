import Payrolls from '#/views/payroll/index'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(payroll)/payrolls',
)({
  component: Payrolls,
  staticData: {
    meta: {
      resource: 'payroll',
    },
  },
})
