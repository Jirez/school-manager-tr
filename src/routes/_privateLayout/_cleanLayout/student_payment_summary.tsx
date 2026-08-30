import StudentPaymentSummary from '#/views/report/payment/StudentPaymentSummary'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_cleanLayout/student_payment_summary',
)({
  component: StudentPaymentSummary,
  staticData: {
    meta: {
      resource: 'report',
    },
  },
})
