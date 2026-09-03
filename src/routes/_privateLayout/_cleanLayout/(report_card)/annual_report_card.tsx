import AnnualReportCard from '#/views/report/reportCards/AnnualReportCard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_cleanLayout/(report_card)/annual_report_card',
)({
  component: AnnualReportCard,
  staticData: {
    meta: {
      resource: 'report',
    },
  },
})
