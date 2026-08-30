import Earnings from '#/views/payroll/earning'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(payroll)/earnings',
)({
  component: Earnings,
  staticData: {
    meta: {
      resource: 'payroll',
    },
  },
})
