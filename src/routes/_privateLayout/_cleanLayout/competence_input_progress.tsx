import CompetenceInputProgress from '#/views/report/notes/CompetenceInputProgress'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_cleanLayout/competence_input_progress',
)({
  component: CompetenceInputProgress,
  staticData: {
    meta: {
      resource: 'report',
    },
  },
})
