import ClassSummaryReport from '#/views/report/school/ClassSummaryReport'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_cleanLayout/class_summary',
)({
  component: ClassSummaryReport,
  staticData: {
    meta: {
      resource: 'report',
    },
  },
})
