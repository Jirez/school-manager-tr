import StudentPaymentDetailByDate from '#/views/report/payment/StudentPaymentDetailByDate'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_cleanLayout/student_payment_detail_by_date',
)({
  component: StudentPaymentDetailByDate,
  staticData: {
    meta: {
      resource: 'report',
    },
  },
})
