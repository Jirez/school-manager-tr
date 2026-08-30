import Suppliers from '#/views/sale/supplier'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(sale)/suppliers',
)({
  component: Suppliers,
  staticData: {
    meta: {
      resource: 'config',
    },
  },
})
