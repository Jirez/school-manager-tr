import QrCode from '#/views/users/users/QrCode'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/qrcode')({
  component: QrCode,
  staticData: {
    meta: {
      resource: 'public',
      restricted: true,
    },
  },
})
