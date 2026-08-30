import QuarterlyReportCard from '#/views/report/reportCards/QuarterlyReportCard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_cleanLayout/quarterly_report_card',
)({
  component: QuarterlyReportCard,
  staticData: {
    meta: {
      resource: 'report',
    },
  },
})
