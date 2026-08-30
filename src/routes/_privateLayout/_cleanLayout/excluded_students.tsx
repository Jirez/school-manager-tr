import ExcludedStudents from '#/views/report/statistics/ExcludedStudents'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_cleanLayout/excluded_students',
)({
  component: ExcludedStudents,
  staticData: {
    meta: {
      resource: 'report',
    },
  },
})
