import Customers from '#/views/sale/customer'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(sale)/customers',
)({
  component: Customers,
  staticData: {
    meta: {
      resource: 'customer',
    },
  },
})
