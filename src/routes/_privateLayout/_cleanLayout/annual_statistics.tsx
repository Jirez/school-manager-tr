import AnnualStatistics from '#/views/report/statistics/AnnualStatistics'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_cleanLayout/annual_statistics',
)({
  component: AnnualStatistics,
  staticData: {
    meta: {
      resource: 'report',
    },
  },
})
