import EvalTypes from '#/views/primary/eval/EvalTypes'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(primary)/eval-types',
)({
  component: EvalTypes,
  staticData: {
    meta: {
      resource: 'note',
    },
  },
})
