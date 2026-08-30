// ** React Imports
import { useAuthentication } from '@/hooks/useAuthentication'
import { Suspense } from 'react'
import { Navigate } from '@tanstack/react-router'

// ** Utils
// import { getUserData, getHomeRouteForLoggedInUser } from '@utils'

const PublicRoute = ({ children, route }: any) => {
  const { isAuthenticated, returnUrl } = useAuthentication()
  if (route) {
    // const user = getUserData()

    const restrictedRoute = route.meta && route.meta.restricted

    if (isAuthenticated && restrictedRoute) {
      return <Navigate to={returnUrl || '/'} />
    }
  }

  return <Suspense fallback={null}>{children}</Suspense>
}

export default PublicRoute
