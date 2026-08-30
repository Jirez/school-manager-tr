import LoginHistoryReport from '#/views/report/security/LoginHistoryReport'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_cleanLayout/login_history',
)({
  component: LoginHistoryReport,
  staticData: {
    meta: {
      resource: 'report',
    },
  },
})
