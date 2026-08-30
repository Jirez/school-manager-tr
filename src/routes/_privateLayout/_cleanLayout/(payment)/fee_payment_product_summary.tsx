import FeePaymentByProductSummary from '#/views/report/payment/FeePaymentByProductSummary'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_cleanLayout/(payment)/fee_payment_product_summary',
)({
  component: FeePaymentByProductSummary,
  staticData: {
    meta: {
      resource: 'report',
    },
  },
})
