import { useState, useEffect } from 'react'
import { useApolloClient } from '@apollo/client'
import { useNavigate, useLocation } from '@tanstack/react-router'

import { authenticationVar } from '../ApiClient'
import TokenStorage from '@/utils/TokenStorage'
import { LOGIN } from '@/utils/constants'

export function useLogout() {
  const client = useApolloClient()
  const navigate = useNavigate()
  const location = useLocation()
  const [done, setDone] = useState(false)
  const [loading, logout] = useState(false)

  useEffect(() => {
    async function clearStore() {
      if (loading) {
        authenticationVar({
          ...authenticationVar(),
          isAuthenticated: false,
          token: null,
        })
        TokenStorage.delete()
        localStorage.removeItem(TokenStorage.authUserKey())
        // localStorage.clear();
        client.resetStore()
        setDone(true)
        logout(false)
        
        navigate({
          to: LOGIN,
          search: {
            returnUrl: location.pathname !== LOGIN ? location.pathname : '/',
          },
        })
      }
    }

    clearStore()
  }, [client, loading, setDone])

  return { done, loading, logout }
}
