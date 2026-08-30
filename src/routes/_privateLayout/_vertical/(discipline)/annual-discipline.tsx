import AnnualDisciplineCalculation from '#/views/discipline/calculation/AnnualDisciplineCalculation'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(discipline)/annual-discipline',
)({
  component: AnnualDisciplineCalculation,
  staticData: {
    meta: {
      resource: 'discipline',
    },
  },
})
