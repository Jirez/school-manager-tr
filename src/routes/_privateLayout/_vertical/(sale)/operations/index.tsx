import Invoices from '#/views/sale/invoice'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(sale)/operations/',
)({
  component: Invoices,
  staticData: {
    meta: {
      resource: 'invoice',
    },
  },
})
