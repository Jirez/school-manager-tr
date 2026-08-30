import Positions from '#/views/payroll/position'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(payroll)/payroll-positions',
)({
  component: Positions,
  staticData: {
    meta: {
      resource: 'payroll',
    },
  },
})
