// ** React Imports
import { useEffect, useState } from 'react'
import { Outlet } from '@tanstack/react-router'

// ** Custom Hooks
import { useSkin } from '@/hooks/useSkin'

// ** Third Party Components
import classnames from 'classnames'

const BlankLayout = () => {
  // ** States
  const [isMounted, setIsMounted] = useState(false)

  // ** Hooks
  const { skin } = useSkin()

  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <div
      className={classnames('blank-page', {
        'dark-layout': skin === 'dark',
      })}
    >
      <div className="app-content0 content0">
        <div className="content-wrapper0">
          <div className="content-body0">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlankLayout
