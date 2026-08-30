import { useEffect, useState } from 'react'
import { useNavigate, useRouter } from '@tanstack/react-router'

export default function useActionOnBackNavigation(link?: string) {
  const [isBackNavigation, setIsBackNavigation] = useState(false)
  const router = useRouter()
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = router.history.subscribe(({ action }) => {
      if (
        action.type === 'BACK' ||
        (action.type === 'GO' && action.index < 0)
      ) {
        setIsBackNavigation(true)
        if (link) {
          navigate({ to: link as any })
        }
      } else {
        setIsBackNavigation(false)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [router, navigate, link])

  return isBackNavigation
}
