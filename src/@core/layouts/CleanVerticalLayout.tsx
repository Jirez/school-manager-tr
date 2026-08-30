// ** React Imports
import { useState, useEffect } from 'react'
import { Outlet, useLocation } from '@tanstack/react-router'

// ** Store & Actions
import { useSelector, useDispatch } from 'react-redux'
import { handleMenuCollapsed } from '@/redux/layout'

// ** Third Party Components
import classnames from 'classnames'
import { ArrowUp } from 'react-feather'

// ** Reactstrap Imports
import { Button } from 'reactstrap'

// ** Configs
import themeConfig from '@/configs/themeConfig'

// ** Custom Components
import ScrollToTop from '@/@core/components/scrolltop'
import SidebarComponent from './components/menu/vertical-menu'

// ** Custom Hooks
import { useSkin } from '@/hooks/useSkin'
import { useNavbarType } from '@/hooks/useNavbarType'
import { useFooterType } from '@/hooks/useFooterType'

// ** Styles
import '@/@core/scss/base/core/menu/menu-types/vertical-menu.scss'
import '@/@core/scss/base/core/menu/menu-types/vertical-overlay-menu.scss'
import LayoutWrapper from './components/layout-wrapper'

const CleanVerticalLayout = (props: any) => {
  // ** Props
  const { menu, children, menuData } = props

  // ** Hooks
  // const [isRtl, setIsRtl] = useRTL()
  const { skin } = useSkin()
  const { navbarType } = useNavbarType()
  const { footerType } = useFooterType()
  // const { layout, setLayout, setLastLayout } = useLayout();
  // const { transition, setTransition } = useRouterTransition();

  // ** States
  const [isMounted, setIsMounted] = useState(false)
  const [menuVisibility, setMenuVisibility] = useState(false)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  // ** Store Vars
  const dispatch = useDispatch()
  const layoutStore = useSelector((state: any) => state.layout)

  // ** Update Window Width
  const handleWindowWidth = () => {
    setWindowWidth(window.innerWidth)
  }

  // ** Vars
  const location = useLocation()
  // const contentWidth = layoutStore.contentWidth
  const menuCollapsed = layoutStore.menuCollapsed
  const isHidden = layoutStore.menuHidden

  // ** Toggles Menu Collapsed
  const setMenuCollapsed = (val: any) => dispatch(handleMenuCollapsed(val))

  // ** Handles Content Width
  // const setContentWidth = (val: any) => dispatch(handleContentWidth(val))

  // ** Handles Content Width
  // const setIsHidden = (val: any) => dispatch(handleMenuHidden(val))

  // ** This function will detect the Route Change and will hide the menu on menu item click
  useEffect(() => {
    if (menuVisibility && windowWidth < 1200) {
      setMenuVisibility(false)
    }
  }, [location])

  //** Sets Window Size & Layout Props
  useEffect(() => {
    if (window !== undefined) {
      window.addEventListener('resize', handleWindowWidth)
    }
  }, [windowWidth])

  // ** ComponentDidMount
  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  // ** Vars
  const footerClasses: any = {
    static: 'footer-hidden',
    sticky: 'footer-hidden',
    hidden: 'footer-hidden',
  }

  const navbarWrapperClasses: any = {
    floating: 'navbar-hidden',
    sticky: 'navbar-hidden',
    static: 'navbar-hidden',
    hidden: 'navbar-hidden',
  }

  if (!isMounted) {
    return null
  }

  return (
    <div
      className={classnames(
        `wrapper vertical-layout ${navbarWrapperClasses[navbarType] || 'navbar-floating'} ${
          footerClasses[footerType] || 'footer-static'
        }`,
        {
          // Modern Menu
          'vertical-menu-modern': windowWidth >= 1200,
          'menu-collapsed': menuCollapsed && windowWidth >= 1200,
          'menu-expanded': !menuCollapsed && windowWidth > 1200,

          // Overlay Menu
          'vertical-overlay-menu': windowWidth < 1200,
          'menu-hide': !menuVisibility && windowWidth < 1200,
          'menu-open': menuVisibility && windowWidth < 1200,
          // 'overflow-scroll': true,
        },
      )}
      {...(isHidden ? { 'data-col': '1-column' } : {})}
    >
      {!isHidden ? (
        <SidebarComponent
          skin={skin}
          menu={menu}
          menuData={menuData}
          menuCollapsed={menuCollapsed}
          menuVisibility={menuVisibility}
          setMenuCollapsed={setMenuCollapsed}
          setMenuVisibility={setMenuVisibility}
        />
      ) : null}

      <LayoutWrapper>{children || <Outlet />}</LayoutWrapper>

      {/* Vertical Nav Menu Overlay */}
      <div
        className={classnames('sidenav-overlay', {
          show: menuVisibility,
        })}
        onClick={() => setMenuVisibility(false)}
      />
      {/* Vertical Nav Menu Overlay */}

      {/* {themeConfig.layout.customizer === true ? (
                <Customizer
                    skin={skin}
                    setSkin={setSkin}
                    footerType={footerType}
                    setFooterType={setFooterType}
                    navbarType={navbarType}
                    setNavbarType={setNavbarType}
                    navbarColor={navbarColor}
                    setNavbarColor={setNavbarColor}
                    isRtl={isRtl}
                    setIsRtl={setIsRtl}
                    layout={props.layout}
                    setLayout={props.setLayout}
                    setLastLayout={setLastLayout}
                    isHidden={isHidden}
                    setIsHidden={setIsHidden}
                    contentWidth={contentWidth}
                    setContentWidth={setContentWidth}
                    menuCollapsed={menuCollapsed}
                    setMenuCollapsed={setMenuCollapsed}
                    transition={props.transition}
                    setTransition={props.setTransition}
                    themeConfig={themeConfig}
                />
            ) : null}*/}

      {themeConfig.layout.scrollTop === true ? (
        <div className="scroll-to-top">
          {/* @ts-ignore desc*/}
          <ScrollToTop showOffset={300} className="scroll-top d-block">
            <Button className="btn-icon" color="primary">
              <ArrowUp size={14} />
            </Button>
          </ScrollToTop>
        </div>
      ) : null}
    </div>
  )
}

export default CleanVerticalLayout
