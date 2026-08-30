import TeacherDistributionLevel from '#/views/report/dataGathering/TeacherDistributionLevel'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_cleanLayout/teacher_distribution_level',
)({
  component: TeacherDistributionLevel,
  staticData: {
    meta: {
      resource: 'report',
    },
  },
})
