import FeeGroups from '#/views/sale/group'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(sale)/fee-groups',
)({
  component: FeeGroups,
  staticData: {
    meta: {
      resource: 'config',
    },
  },
})
