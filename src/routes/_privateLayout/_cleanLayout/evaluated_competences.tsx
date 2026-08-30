import EvaluatedCompetences from '#/views/report/notes/EvaluatedCompetences'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_cleanLayout/evaluated_competences',
)({
  component: EvaluatedCompetences,
  staticData: {
    meta: {
      resource: 'report',
    },
  },
})
