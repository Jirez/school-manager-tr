import PaymentConditions from '#/views/sale/condition'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(sale)/payment-conditions',
)({
  component: PaymentConditions,
  staticData: {
    meta: {
      resource: 'config',
    },
  },
})
