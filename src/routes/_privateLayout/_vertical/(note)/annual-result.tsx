import AnnualResults from '#/views/mark/annualResults'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(note)/annual-result',
)({
  component: AnnualResults,
  staticData: {
    meta: {
      resource: 'config',
    },
  },
})
