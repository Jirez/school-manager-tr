import EvalCompSubject from '#/views/mark/evalCompBySubject/EvalCompSubject'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(note)/eval-competences-subject',
)({
  component: EvalCompSubject,
  staticData: {
    meta: {
      resource: 'note',
    },
  },
})
