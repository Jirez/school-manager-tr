import FeePaymentSummary from '#/views/report/payment/FeePaymentSummary'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_cleanLayout/(payment)/fee_payment_summary',
)({
  component: FeePaymentSummary,
  staticData: {
    meta: {
      resource: 'report',
    },
  },
})
