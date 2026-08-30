import Dashboard from '#/views/dashboard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_privateLayout/_vertical/dashboard')({
  component: Dashboard,
  staticData: {
    meta: {
      action: 'read',
      resource: 'dashboard',
    },
  },
})
