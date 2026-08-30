import SchoolSections from '#/views/school/schoolSections'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(school)/school-sections',
)({
  component: SchoolSections,
  staticData: {
    meta: {
      resource: 'config',
    },
  },
})
