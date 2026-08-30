import { createFileRoute, Outlet, useMatches } from '@tanstack/react-router'
import PrivateRoute from '#/@core/components/routes/PrivateRoute'

export const Route = createFileRoute('/_privateLayout')({
  component: RouteComponent,
})

function RouteComponent() {
  const matches = useMatches()
  const lastMatch = matches[matches.length - 1]

  const route = {
    ...lastMatch,
    meta: lastMatch.staticData.meta,
  }

  return (
    <PrivateRoute route={route}>
      <Outlet />
    </PrivateRoute>
  )
}
