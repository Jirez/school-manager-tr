import BankAccounts from '#/views/bank/account'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(bank)/bank-accounts',
)({
  component: BankAccounts,
  staticData: {
    meta: {
      resource: 'config',
    },
  },
})
