import AnnualBestStudents from '#/views/report/statistics/AnnualBestStudents'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_cleanLayout/annual_best',
)({
  component: AnnualBestStudents,
  staticData: {
    meta: {
      resource: 'report',
    },
  },
})
