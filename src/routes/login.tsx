import { createFileRoute } from '@tanstack/react-router'
import Login from '#/views/Login'

export const Route = createFileRoute('/login')({
  validateSearch: (search: Record<string, unknown>) => ({
      returnUrl: (search.returnUrl as string) ?? '/',
    }),
    component: Login,
})
