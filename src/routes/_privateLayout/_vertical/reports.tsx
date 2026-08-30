import Reports from '#/views/report/Reports'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_privateLayout/_vertical/reports')({
  component: Reports,
  staticData: {
    meta: {
      resource: 'report',
    },
  },
})
