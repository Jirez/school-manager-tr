import AccountModels from '#/views/accounting/models'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(accounting)/models',
)({
  component: AccountModels,
  staticData: {
    meta: {
      resource: 'config',
    },
  },
})
