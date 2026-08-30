import FeePaymentDetailByDate from '#/views/report/payment/FeePaymentDetailByDate'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_cleanLayout/(payment)/fee_payment_detail_by_date',
)({
  component: FeePaymentDetailByDate,
  staticData: {
    meta: {
      resource: 'report',
    },
  },
})
