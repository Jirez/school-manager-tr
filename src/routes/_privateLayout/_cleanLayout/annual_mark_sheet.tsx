import AnnualMarkSheet from '#/views/report/students/AnnualMarkSheet'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_cleanLayout/annual_mark_sheet',
)({
  component: AnnualMarkSheet,
  staticData: {
    meta: {
      resource: 'report',
    },
  },
})
