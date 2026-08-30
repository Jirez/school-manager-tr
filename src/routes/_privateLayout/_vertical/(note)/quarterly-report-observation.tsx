import QuarterlyReportObservation from '#/views/mark/quarterlyObservations'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(note)/quarterly-report-observation',
)({
  component: QuarterlyReportObservation,
  staticData: {
    meta: {
      resource: 'config',
    },
  },
})
