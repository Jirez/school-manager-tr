import SequentialNthFirst from '#/views/report/statistics/SequentialNthFirst'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_cleanLayout/sequential_nth_fist',
)({
  component: SequentialNthFirst,
  staticData: {
    meta: {
      resource: 'report',
    },
  },
})
