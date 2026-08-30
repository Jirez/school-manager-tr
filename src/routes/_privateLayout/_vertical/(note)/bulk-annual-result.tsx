import BulkAnnualResults from '#/views/mark/annualResults/BulkAnnualResults'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(note)/bulk-annual-result',
)({
  component: BulkAnnualResults,
  staticData: {
    meta: {
      resource: 'config',
    },
  },
})
