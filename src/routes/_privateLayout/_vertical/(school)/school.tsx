import School from '#/views/school/school'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(school)/school',
)({
  component: School,
  staticData: {
      meta: {
        action: 'read',
        resource: 'config',
      },
    },
})
