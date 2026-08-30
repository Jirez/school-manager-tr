import { useEffect, Suspense } from 'react'

import { useIdleTimer } from 'react-idle-timer'

// import config from "config";

// ** Router Import
// import Router from "./router/Router";

// ** Routes & Default Routes
// import { getRoutes } from "./router/routes";

// ** Hooks Imports
// import { useLayout } from '@hooks/useLayout'

import { useLogout } from '@/hooks/useLogout'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { useAuthentication } from '@/hooks/useAuthentication'
import Loader from '@/@core/components/spinner/loader'
import { Outlet } from '@tanstack/react-router'

const config = await fetch('/configuration.json').then((res) => res.json())

const App = () => {
  const { logout } = useLogout()
  const { t } = useTranslation()
  const { isAuthenticated } = useAuthentication()
  // const [allRoutes, setAllRoutes] = useState<any[]>([])

  // ** Hooks
  // const { layout } = useLayout()

  const onIdle = () => {
    // Close Modal Prompt
    // Do some idle action like log out your user
    if (isAuthenticated) {
      logout(true)
      toast.info(`${t('label-timeout')}`)
    }
  }

  useIdleTimer({
    timeout: config?.timeout,
    debounce: 250,
    onIdle,
    crossTab: true,
  })

  /* useEffect(() => {
    setAllRoutes(getRoutes(layout));
  }, [layout]); */

  // ** Browser-close logout detection **
  // Strategy:
  //   - beforeunload / pagehide: flag a "pending logout" in localStorage
  //   - storage event:  if another tab is still open it immediately cancels the flag
  //   - visibilitychange: cancel the flag when the page becomes visible again
  //   - sessionStorage marker "school-session-active" survives refresh but NOT
  //     browser close → the startup code in ApiClient.tsx uses this to decide
  //     whether to actually clear the auth data on next load.
  useEffect(() => {
    if (!isAuthenticated) return

    // Mark this tab/session as active (persists across refresh)
    sessionStorage.setItem('school-session-active', 'true')

    const flagPendingLogout = () => {
      localStorage.setItem('school-pending-logout', Date.now().toString())
    }

    const handleBeforeUnload = () => {
      flagPendingLogout()
    }

    const handlePageHide = (e: PageTransitionEvent) => {
      // persisted === true  → page is going into BFCache, will come back
      if (!e.persisted) {
        flagPendingLogout()
      }
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Page became visible again (tab switch back, un-minimize, etc.)
        // → cancel any pending logout
        localStorage.removeItem('school-pending-logout')
      }
    }

    // When *another* tab sets "school-pending-logout" we are still alive
    // → cancel it immediately so that a single tab close doesn't trigger logout.
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'school-pending-logout' && e.newValue !== null) {
        localStorage.removeItem('school-pending-logout')
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('pagehide', handlePageHide)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('storage', handleStorage)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('pagehide', handlePageHide)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('storage', handleStorage)
    }
  }, [isAuthenticated])

  return (
    <Suspense fallback={<Loader />}>
      <Outlet />
    </Suspense>
  )
}

export default App
