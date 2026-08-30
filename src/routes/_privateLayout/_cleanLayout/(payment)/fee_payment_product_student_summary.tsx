import FeePaymentByProductAndStudentSummary from '#/views/report/payment/FeePaymentByProductAndStudentSummary'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_cleanLayout/(payment)/fee_payment_product_student_summary',
)({
  component: FeePaymentByProductAndStudentSummary,
  staticData: {
    meta: {
      resource: 'report',
    },
  },
})
