import AnnualReportSummary from '#/views/report/statistics/AnnualReportSummary'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_cleanLayout/annual_report_summary',
)({
  component: AnnualReportSummary,
  staticData: {
    meta: {
      resource: 'report',
    },
  },
})
