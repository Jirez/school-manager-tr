import OldSchools from '#/views/school/oldSchools'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(student)/old-schools',
)({
  component: OldSchools,
  staticData: {
    meta: {
      resource: 'student',
    },
  },
})
