import NotAuthorized from '#/views/NotAuthorized'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/not-authorized')({
  component: NotAuthorized,
})
