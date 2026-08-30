import StudentPaymentSliceSummary from '#/views/report/payment/StudentPaymentSliceSummary'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_cleanLayout/student_payment_slice_summary',
)({
  component: StudentPaymentSliceSummary,
  staticData: {
    meta: {
      resource: 'report',
    },
  },
})
