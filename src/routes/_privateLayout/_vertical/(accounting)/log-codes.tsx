import LogCodes from '#/views/accounting/logCodes'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(accounting)/log-codes',
)({
  component: LogCodes,
  staticData: {
    meta: {
      resource: 'config',
    },
  },
})
