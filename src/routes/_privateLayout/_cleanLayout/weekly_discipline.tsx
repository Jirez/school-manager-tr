import WeeklyDiscipline from '#/views/report/students/WeeklyDiscipline'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_cleanLayout/weekly_discipline',
)({
  component: WeeklyDiscipline,
  staticData: {
    meta: {
      resource: 'report',
    },
  },
})
