import Levels from '#/views/school/levels'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(school)/levels',
)({
  component: Levels,
  staticData: {
    meta: {
      resource: 'config',
    },
  },
})
