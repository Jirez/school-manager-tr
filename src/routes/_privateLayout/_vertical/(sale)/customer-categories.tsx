import CustomerCategories from '#/views/sale/customer/category'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(sale)/customer-categories',
)({
  component: CustomerCategories,
  staticData: {
    meta: {
      resource: 'customer',
    },
  },
})
