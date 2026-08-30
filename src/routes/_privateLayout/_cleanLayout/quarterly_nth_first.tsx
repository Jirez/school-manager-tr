import QuarterlyNthFirst from '#/views/report/statistics/QuarterlyNthFirst'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_cleanLayout/quarterly_nth_first',
)({
  component: QuarterlyNthFirst,
  staticData: {
    meta: {
      resource: 'report',
    },
  },
})
