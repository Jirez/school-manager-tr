import TeacherTimeTableReport from '#/views/report/timeTable/TeacherTimeTableReport'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_cleanLayout/teacher_time_table',
)({
  component: TeacherTimeTableReport,
  staticData: {
    meta: {
      resource: 'report',
    },
  },
})
