import QuarterlyAverageCalculation from '#/views/mark/calculation/QuarterlyAverageCalculation'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(note)/quarterly-average',
)({
  component: QuarterlyAverageCalculation,
  staticData: {
    meta: {
      resource: 'note',
    },
  },
})
