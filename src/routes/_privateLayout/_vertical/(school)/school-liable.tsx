import SchoolOfficials from '#/views/school/schoolOfficials'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(school)/school-liable',
)({
  component: SchoolOfficials,
  staticData: {
    meta: {
      resource: 'config',
    },
  },
})
