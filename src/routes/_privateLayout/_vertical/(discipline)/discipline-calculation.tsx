import DisciplineCalculation from '#/views/discipline/calculation'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(discipline)/discipline-calculation',
)({
  component: DisciplineCalculation,
  staticData: {
    meta: {
      resource: 'discipline',
    },
  },
})
