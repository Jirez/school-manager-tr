import DataExport from '#/views/export'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(export)/data-export',
)({
  component: DataExport,
  staticData: {
    meta: {
      resource: 'report',
    },
  },
})
