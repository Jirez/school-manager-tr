import AverageCalculation from '#/views/mark/calculation/AverageCalculation'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(note)/average-calculation',
)({
  component: AverageCalculation,
  staticData: {
    meta: {
      resource: 'note',
    },
  },
})
