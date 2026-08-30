import Cycles from '#/views/school/cycles'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(school)/cycles',
)({
  component: Cycles,
  staticData: {
    meta: {
      resource: 'config',
    },
  },
})
