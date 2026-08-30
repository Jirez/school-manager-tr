import Periods from '#/views/school/periods'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(school)/periods',
)({
  component: Periods,
  staticData: {
    meta: {
      resource: 'config',
    },
  },
})
