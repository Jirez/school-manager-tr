import QuarterlyDisciplineCalculation from '#/views/discipline/calculation/QuarterlyDisciplineCalculation'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(discipline)/quarterly-discipline',
)({
  component: QuarterlyDisciplineCalculation,
  staticData: {
    meta: {
      resource: 'discipline',
    },
  },
})
