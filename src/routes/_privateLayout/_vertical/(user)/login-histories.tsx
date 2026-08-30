import LoginHistories from '#/views/users/loginHistories'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(user)/login-histories',
)({
  component: LoginHistories,
  staticData: {
    meta: {
      resource: 'user',
    },
  },
})
