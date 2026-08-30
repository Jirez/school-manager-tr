import FeePaymentDashboard from '#/views/report/payment/FeePaymentDashboard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_cleanLayout/(payment)/fee_payment_dashbard',
)({
  component: FeePaymentDashboard,
  staticData: {
    meta: {
      resource: 'report',
    },
  },
})
