import Classes from '#/views/school/classes'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(school)/classes',
)({
  component: Classes,
  staticData: {
    meta: {
      resource: 'config',
    },
  },
})
