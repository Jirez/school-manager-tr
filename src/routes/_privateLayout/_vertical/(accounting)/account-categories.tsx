import AccountCategories from '#/views/accounting/categories'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(accounting)/account-categories',
)({
  component: AccountCategories,
  staticData: {
    meta: {
      resource: 'config',
    },
  },
})
