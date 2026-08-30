import SupplierCategories from '#/views/sale/supplier/category'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(sale)/supplier-categories',
)({
  component: SupplierCategories,
  staticData: {
    meta: {
      resource: 'config',
    },
  },
})
