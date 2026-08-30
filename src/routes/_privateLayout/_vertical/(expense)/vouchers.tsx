import CashVouchers from '#/views/expense/voucher'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(expense)/vouchers',
)({
  component: CashVouchers,
  staticData: {
    meta: {
      resource: 'config',
    },
  },
})
