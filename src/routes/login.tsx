import { createFileRoute } from '@tanstack/react-router'
import Login from '#/views/Login'
import { m } from '@/paraglide/messages'

export const Route = createFileRoute('/login')({
  head: () => ({
    meta: [{ title: m.login() }],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    returnUrl: (search.returnUrl as string) ?? '/',
  }),
  component: Login,
})
