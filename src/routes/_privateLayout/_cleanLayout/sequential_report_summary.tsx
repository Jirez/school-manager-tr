import SequentialReportSummary from '#/views/report/statistics/SequentialReportSummary'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_cleanLayout/sequential_report_summary',
)({
  component: SequentialReportSummary,
  staticData: {
    meta: {
      resource: 'report',
    },
  },
})
