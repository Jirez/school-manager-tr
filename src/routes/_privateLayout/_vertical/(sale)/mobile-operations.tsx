import MobileOperations from '#/views/sale/mobile'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(sale)/mobile-operations',
)({
  component: MobileOperations,
  staticData: {
    meta: {
      resource: 'payment',
    },
  },
})
