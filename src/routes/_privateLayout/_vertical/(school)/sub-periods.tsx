import SubPeriods from '#/views/school/subPeriods'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(school)/sub-periods',
)({
  component: SubPeriods,
  staticData: {
    meta: {
      resource: 'config',
    },
  },
})
