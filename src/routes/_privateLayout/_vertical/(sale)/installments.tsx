import Installments from '#/views/sale/installment'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(sale)/installments',
)({
  component: Installments,
  staticData: {
    meta: {
      resource: 'config',
    },
  },
})
