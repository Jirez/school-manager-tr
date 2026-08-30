import QuarterlyReportSummary from '#/views/report/statistics/QuarterlyReportSummary'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_cleanLayout/quarterly_report_summary',
)({
  component: QuarterlyReportSummary,
  staticData: {
    meta: {
      resource: 'report',
    },
  },
})
