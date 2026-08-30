import StudentCards from '#/views/report/students/StudentCards'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_cleanLayout/student_card',
)({
  component: StudentCards,
  staticData: {
    meta: {
      resource: 'report',
    },
  },
})
