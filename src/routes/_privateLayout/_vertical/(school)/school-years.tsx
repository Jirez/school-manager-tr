import SchoolYears from '#/views/school/schoolYears'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(school)/school-years',
)({
  component: SchoolYears,
  staticData: {
      meta: {
        action: 'read',
        resource: 'config',
      },
    },
})
