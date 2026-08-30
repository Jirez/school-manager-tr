import StudentListReport from '#/views/report/students/StudentListReport'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_cleanLayout/multi_column_student',
)({
  component: StudentListReport,
  staticData: {
    meta: {
      resource: 'report',
    },
  },
})
