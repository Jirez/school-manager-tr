import CompetenceLevel from '#/views/primary/competence/level/CompetenceLevel'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(primary)/primary-competences-level',
)({
  component: CompetenceLevel,
  staticData: {
    meta: {
      resource: 'note',
    },
  },
})
