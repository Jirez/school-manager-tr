import Discounts from '#/views/sale/discount'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(sale)/discounts',
)({
  component: Discounts,
  staticData: {
    meta: {
      resource: 'config',
    },
  },
})
