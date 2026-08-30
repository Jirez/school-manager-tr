import QuarterlyDiscipline from '#/views/report/students/QuarterlyDiscipline'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_cleanLayout/quarterly_discipline',
)({
  component: QuarterlyDiscipline,
  staticData: {
    meta: {
      resource: 'report',
    },
  },
})
