// ** React Imports
import { useLocation, useNavigate } from '@tanstack/react-router'
import { useContext, useEffect, Suspense } from 'react'

// ** Context Imports
import { AbilityContext } from '@/context/Can'
import { useAuthentication } from '@/hooks/useAuthentication'
import { LOGIN } from '@/utils/constants'

const PrivateRoute = ({ children, route }: any) => {
  // ** Hooks & Vars
  const ability = useContext(AbilityContext)
  const location = useLocation()
  const navigate = useNavigate()
  // const user = JSON.parse(localStorage.getItem('userData'))
  const { isAuthenticated } = useAuthentication()
  // console.log(location.pathname, isAuthenticated)

  let action = null
  let resource = null
  let restrictedRoute = false

  if (route?.meta) {
    action = route.meta.action
    resource = route.meta.resource
    restrictedRoute = route.meta.restricted
  }

  useEffect(() => {
    if (!route) return

    if (!isAuthenticated) {
      navigate({
        to: LOGIN,
        search: {
          returnUrl: location.pathname !== LOGIN ? location.pathname : '/',
        },
        replace: true,
      })
    } else if (restrictedRoute) {
      navigate({ to: '/', replace: true })
    } else if (!ability.can(action || 'read', resource)) {
      navigate({ to: '/not-authorized', replace: true })
    }
  }, [
    isAuthenticated,
    restrictedRoute,
    action,
    resource,
    route,
    ability,
    navigate,
    location.pathname,
  ])

  // Don't render children until auth is confirmed
  if (!route || !isAuthenticated) {
    return null
  }

  if (restrictedRoute) {
    return null
  }

  if (!ability.can(action || 'read', resource)) {
    return null
  }

  return <Suspense fallback={null}>{children}</Suspense>
}

export default PrivateRoute
