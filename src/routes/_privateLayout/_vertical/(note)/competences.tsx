import Competences from '#/views/mark/expectedCompetences/Competences'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(note)/competences',
)({
  component: Competences,
  staticData: {
    meta: {
      resource: 'note',
    },
  },
})
