import TimeTableOfStudent from '#/views/report/timeTable/TimeTableOfStudent'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_privateLayout/_cleanLayout/time_table')(
  {
    component: TimeTableOfStudent,
    staticData: {
      meta: {
        resource: 'report',
      },
    },
  },
)
