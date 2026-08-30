import SequentialDisciplines from '#/views/discipline/sequentialDiscipline'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(discipline)/sequential-discipline',
)({
  component: SequentialDisciplines,
  staticData: {
    meta: {
      resource: 'discipline',
    },
  },
})
