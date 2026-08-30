import Users from '#/views/users/users'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_privateLayout/_vertical/(user)/users')({
  component: Users,
  staticData: {
    meta: {
      resource: 'user',
    },
  },
})
