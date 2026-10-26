// ** React Imports
import { useEffect, memo } from 'react'

// ** Third Party Components
import classnames from 'classnames'

// ** Store & Actions
import { useSelector, useDispatch } from 'react-redux'
import {
  handleContentWidth,
  handleMenuCollapsed,
  handleMenuHidden,
} from '@/redux/layout'

// ** Styles
import 'animate.css/animate.css'

const LayoutWrapper = (props: any) => {
  // ** Props
  // const { layout, children, appLayout, wrapperClass, transition, routeMeta } = props
  const { children, routeMeta } = props

  // ** Store Vars
  const dispatch = useDispatch()
  const navbarQuery = useSelector((state: any) => state.navbar.query)
  const layout = useSelector((state: any) => state.layout.layout)
  const contentWidth = useSelector((state: any) => state.layout.contentWidth)
  const transition = useSelector((state: any) => state.layout.routerTransition)

  //* * Vars
  // const Tag = layout === 'HorizontalLayout' && !appLayout ? 'div' : Fragment
  const appLayoutCondition =
    (layout === 'horizontal' && !routeMeta) ||
    (layout === 'horizontal' && routeMeta && !routeMeta.appLayout)

  // ** Clean Up Function
  const cleanUp = () => {
    if (routeMeta) {
      if (routeMeta.contentWidth) {
        // @ts-ignore desc
        dispatch(handleContentWidth('full'))
      }
      if (routeMeta.menuCollapsed) {
        // @ts-ignore desc
        dispatch(handleMenuCollapsed(!routeMeta.menuCollapsed))
      }
      if (routeMeta.menuHidden) {
        // @ts-ignore desc
        dispatch(handleMenuHidden(!routeMeta.menuHidden))
      }
    }
  }

  // ** ComponentDidMount
  useEffect(() => {
    if (routeMeta) {
      if (routeMeta.contentWidth) {
        dispatch(handleContentWidth(routeMeta.contentWidth))
      }
      if (routeMeta.menuCollapsed) {
        dispatch(handleMenuCollapsed(routeMeta.menuCollapsed))
      }
      if (routeMeta.menuHidden) {
        dispatch(handleMenuHidden(routeMeta.menuHidden))
      }
    }
    return () => cleanUp()
  }, [routeMeta])

  return (
    <div
      className={classnames('app-content content overflow-hidden', {
        [routeMeta ? routeMeta.className : '']:
          routeMeta && routeMeta.className,
        'show-overlay': navbarQuery.length,
      })}
    >
      <div className="content-overlay" />
      <div className="header-navbar-shadow" />
      <div
        className={classnames({
          'content-wrapper': !routeMeta || !routeMeta.appLayout,
          'content-area-wrapper': routeMeta && routeMeta.appLayout,
          'container-xxl p-0': contentWidth === 'boxed',
          [`animate__animated animate__${transition}`]:
            transition !== 'none' && transition.length,
        })}
      >
        {appLayoutCondition ? (
          <div className="content-body">{children}</div>
        ) : (
          <>{children}</>
        )}
      </div>
    </div>
  )
}

export default memo(LayoutWrapper)
