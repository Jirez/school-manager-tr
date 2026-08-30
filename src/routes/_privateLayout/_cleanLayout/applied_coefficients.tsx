import AppliedCoefficients from '#/views/report/dataGathering/AppliedCoefficients'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_cleanLayout/applied_coefficients',
)({
  component: AppliedCoefficients,
  staticData: {
    meta: {
      resource: 'report',
    },
  },
})
