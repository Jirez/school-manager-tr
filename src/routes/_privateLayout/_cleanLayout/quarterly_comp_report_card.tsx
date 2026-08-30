import QuarterlyCompReportCard from '#/views/report/reportCards/QuarterlyCompReportCard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_cleanLayout/quarterly_comp_report_card',
)({
  component: QuarterlyCompReportCard,
  staticData: {
    meta: {
      resource: 'report',
    },
  },
})
