import Bills from '#/views/expense/bill'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(sale)/purchases/',
)({
  component: Bills,
  staticData: {
    meta: {
      resource: 'config',
    },
  },
})
