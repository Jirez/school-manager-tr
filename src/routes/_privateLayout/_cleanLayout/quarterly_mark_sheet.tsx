import QuarterlyMarkSheetReport from '#/views/report/dataGathering/QuarterlyMarkSheet'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_cleanLayout/quarterly_mark_sheet',
)({
  component: QuarterlyMarkSheetReport,
  staticData: {
    meta: {
      resource: 'report',
    },
  },
})
