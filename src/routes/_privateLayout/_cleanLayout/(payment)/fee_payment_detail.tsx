import FeePaymentDetail from '#/views/report/payment/FeePaymentDetail'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_cleanLayout/(payment)/fee_payment_detail',
)({
  component: FeePaymentDetail,
  staticData: {
    meta: {
      resource: 'report',
    },
  },
})
