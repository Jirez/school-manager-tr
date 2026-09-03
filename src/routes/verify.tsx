import VerifyCode from '#/views/users/users/VerifyCode'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/verify')({
  component: VerifyCode,
  staticData: {
    meta: {
      resource: 'public',
      restricted: true,
    },
  },
})
