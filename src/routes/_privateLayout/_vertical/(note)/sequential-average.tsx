import SequentialAverageCalculation from '#/views/mark/calculation/SequentialAverageCalculation'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(note)/sequential-average',
)({
  component: SequentialAverageCalculation,
  staticData: {
    meta: {
      resource: 'note',
    },
  },
})
