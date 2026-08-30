import SubjectDepartments from '#/views/school/subjectDepartments'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(school)/departments',
)({
  component: SubjectDepartments,
  staticData: {
    meta: {
      resource: 'config',
    },
  },
})
