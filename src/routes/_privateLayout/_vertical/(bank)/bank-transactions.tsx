import BankTransactions from '#/views/bank/transaction'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(bank)/bank-transactions',
)({
  component: BankTransactions,
  staticData: {
    meta: {
      resource: 'config',
    },
  },
})
