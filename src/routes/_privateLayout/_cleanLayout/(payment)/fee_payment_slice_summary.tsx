import FeePaymentSliceSummary from '#/views/report/payment/FeePaymentSliceSummary'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_cleanLayout/(payment)/fee_payment_slice_summary',
)({
  component: FeePaymentSliceSummary,
  staticData: {
    meta: {
      resource: 'report',
    },
  },
})
