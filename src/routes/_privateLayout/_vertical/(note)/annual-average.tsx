import AnnualAverageCalculation from '#/views/mark/calculation/AnnualAverageCalculation'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(note)/annual-average',
)({
  component: AnnualAverageCalculation,
  staticData: {
    meta: {
      resource: 'note',
    },
  },
})
