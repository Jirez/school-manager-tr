import EvalComp from '#/views/mark/evalComp/EvalComp'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(note)/eval-competences',
)({
  component: EvalComp,
  staticData: {
    meta: {
      resource: 'config',
    },
  },
})
