import FeePaymentByProductAndClassSummary from '#/views/report/payment/FeePaymentByProductAndClassSummary'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_cleanLayout/(payment)/fee_payment_product_class_summary',
)({
  component: FeePaymentByProductAndClassSummary,
  staticData: {
    meta: {
      resource: 'report',
    },
  },
})
