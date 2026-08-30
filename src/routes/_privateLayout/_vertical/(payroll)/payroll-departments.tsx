import Departments from '#/views/payroll/department'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(payroll)/payroll-departments',
)({
  component: Departments,
  staticData: {
    meta: {
      resource: 'payroll',
    },
  },
})
