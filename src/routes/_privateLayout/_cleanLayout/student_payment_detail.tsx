import StudentPaymentDetail from '#/views/report/payment/StudentPaymentDetail'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_cleanLayout/student_payment_detail',
)({
  component: StudentPaymentDetail,
  staticData: {
    meta: {
      resource: 'report',
    },
  },
})
