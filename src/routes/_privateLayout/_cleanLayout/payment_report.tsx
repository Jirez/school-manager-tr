import PaymentReport from '#/views/report/payment/PaymentReport'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_cleanLayout/payment_report',
)({
  component: PaymentReport,
  staticData: {
    meta: {
      resource: 'report',
    },
  },
})
