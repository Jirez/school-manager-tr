import Products from '#/views/sale/product'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(sale)/products',
)({
  component: Products,
  staticData: {
    meta: {
      resource: 'product',
    },
  },
})
