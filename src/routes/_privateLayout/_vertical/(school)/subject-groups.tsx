import SubjectGroups from '#/views/school/subjectGroups'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(school)/subject-groups',
)({
  component: SubjectGroups,
  staticData: {
    meta: {
      resource: 'config',
    },
  },
})
