import FeeStructures from '#/views/sale/structure/FeeStructures'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(sale)/fee-structures',
)({
  component: FeeStructures,
  staticData: {
    meta: {
      resource: 'payment',
    },
  },
})
