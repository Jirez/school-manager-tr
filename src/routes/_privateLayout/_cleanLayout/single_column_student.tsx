import StudentSingleColumnList from '#/views/report/students/StudentSingleColumnList'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_cleanLayout/single_column_student',
)({
  component: StudentSingleColumnList,
  staticData: {
    meta: {
      resource: 'report',
    },
  },
})
