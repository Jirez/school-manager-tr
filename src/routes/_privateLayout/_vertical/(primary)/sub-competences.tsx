import SubCompetences from '#/views/primary/sub/SubCompetences'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(primary)/sub-competences',
)({
  component: SubCompetences,
  staticData: {
    meta: {
      resource: 'note',
    },
  },
})
