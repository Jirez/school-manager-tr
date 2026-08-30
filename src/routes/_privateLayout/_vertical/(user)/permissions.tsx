import Permissions from '#/views/users/permission'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(user)/permissions',
)({
  component: Permissions,
  staticData: {
    meta: {
      resource: 'user',
    },
  },
})
