import HeadDepartments from '#/views/school/subjectDepartments/head/HeadDepartments'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(school)/head-departments',
)({
  component: HeadDepartments,
  staticData: {
    meta: {
      resource: 'config',
    },
  },
})
