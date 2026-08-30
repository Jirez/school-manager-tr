import AnnualNthFirst from '#/views/report/statistics/AnnualNthFirst'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_cleanLayout/annual_nth_first',
)({
  component: AnnualNthFirst,
  staticData: {
    meta: {
      resource: 'report',
    },
  },
})
