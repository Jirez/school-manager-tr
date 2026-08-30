import Roles from '#/views/users/role'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_privateLayout/_vertical/(user)/roles')({
  component: Roles,
  staticData: {
    meta: {
      resource: 'user',
    },
  },
})
