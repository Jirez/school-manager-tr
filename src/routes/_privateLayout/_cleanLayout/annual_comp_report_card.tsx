import AnnualCompReportCard from '#/views/report/reportCards/AnnualCompReportCard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_cleanLayout/annual_comp_report_card',
)({
  component: AnnualCompReportCard,
  staticData: {
    meta: {
      resource: 'report',
    },
  },
})
