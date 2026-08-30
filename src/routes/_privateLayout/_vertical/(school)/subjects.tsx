import Subjects from '#/views/school/subjects'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(school)/subjects',
)({
  component: Subjects,
  staticData: {
    meta: {
      resource: 'config',
    },
  },
})
