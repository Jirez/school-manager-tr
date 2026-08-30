import ProductCategories from '#/views/sale/product/category'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(sale)/product-categories',
)({
  component: ProductCategories,
  staticData: {
    meta: {
      resource: 'product',
    },
  },
})
