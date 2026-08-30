import Profile from '#/views/users/users/Profile'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(user)/profile',
)({
  component: Profile,
  staticData: {
    meta: {
      resource: 'public',
    },
  },
})
