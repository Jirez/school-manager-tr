import QuarterlyHonorRoll from '#/views/report/statistics/QuarterlyHonorRoll'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_cleanLayout/quarterly_honor_roll',
)({
  component: QuarterlyHonorRoll,
  staticData: {
    meta: {
      resource: 'report',
    },
  },
})
