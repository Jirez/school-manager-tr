import Competences from '#/views/primary/competence/Competences'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(primary)/primary-competences',
)({
  component: Competences,
  staticData: {
    meta: {
      resource: 'note',
    },
  },
})
