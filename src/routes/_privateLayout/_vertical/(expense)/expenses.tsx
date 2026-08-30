import Expenses from '#/views/expense/index'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(expense)/expenses',
)({
  component: Expenses,
  staticData: {
    meta: {
      resource: 'config',
    },
  },
})
