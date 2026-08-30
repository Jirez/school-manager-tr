import Employees from '#/views/payroll/employee'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(payroll)/employees',
)({
  component: Employees,
  staticData: {
    meta: {
      resource: 'payroll',
    },
  },
})
