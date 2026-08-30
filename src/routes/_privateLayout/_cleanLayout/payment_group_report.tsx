import PaymentGroupReport from '#/views/report/payment/PaymentGroupReport'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_cleanLayout/payment_group_report',
)({
  component: PaymentGroupReport,
  staticData: {
    meta: {
      resource: 'report',
    },
  },
})
