import SequentialDiscipline from '#/views/report/students/SequentialDiscipline'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_cleanLayout/sequential_discipline',
)({
  component: SequentialDiscipline,
  staticData: {
    meta: {
      resource: 'report',
    },
  },
})
