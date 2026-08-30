import SequentialReportCard from '#/views/report/reportCards/SequentialReportCard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_cleanLayout/sequential_report_card',
)({
  component: SequentialReportCard,
  staticData: {
    meta: {
      resource: 'report',
    },
  },
})
