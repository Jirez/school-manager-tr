import SchoolFeeReport from '#/views/report/payment/SchoolFeeReport'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_cleanLayout/school_fee_report',
)({
  component: SchoolFeeReport,
  staticData: {
    meta: {
      resource: 'report',
    },
  },
})
