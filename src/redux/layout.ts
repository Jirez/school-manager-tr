// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

// ** ThemeConfig Import
import themeConfig from '@/configs/themeConfig'

const initialMenuCollapsed = () => {
  const item = window.localStorage.getItem('menuCollapsed')
  //* * Parse stored json or if none return initialValue
  return item ? JSON.parse(item) : themeConfig.layout.menu.isCollapsed
}

const initialDirection = () => {
  const item = window.localStorage.getItem('direction')
  //* * Parse stored json or if none return initialValue
  return item ? JSON.parse(item) : themeConfig.layout.isRTL
}

const initialSkin = () => {
  const item = window.localStorage.getItem('skin')
  //* * Parse stored json or if none return initialValue
  return item ? JSON.parse(item) : themeConfig.layout.skin
}

export const layoutSlice = createSlice({
  name: 'layout',
  initialState: {
    skin: initialSkin(),
    isRTL: initialDirection(),
    layout: themeConfig.layout.type,
    lastLayout: themeConfig.layout.type,
    menuCollapsed: initialMenuCollapsed(),
    footerType: themeConfig.layout.footer.type,
    navbarType: themeConfig.layout.navbar.type,
    menuHidden: themeConfig.layout.menu.isHidden,
    contentWidth: themeConfig.layout.contentWidth,
    routerTransition: themeConfig.layout.routerTransition,
    navbarColor: themeConfig.layout.navbar.backgroundColor,
  },
  reducers: {
    handleRTL: (state: any, action: any) => {
      state.isRTL = action.payload
      window.localStorage.setItem('direction', JSON.stringify(action.payload))
    },
    handleSkin: (state: any, action: any) => {
      state.skin = action.payload
      window.localStorage.setItem('skin', JSON.stringify(action.payload))
    },
    handleLayout: (state: any, action: any) => {
      state.layout = action.payload
    },
    handleFooterType: (state: any, action: any) => {
      state.footerType = action.payload
    },
    handleNavbarType: (state: any, action: any) => {
      state.navbarType = action.payload
    },
    handleMenuHidden: (state: any, action: any) => {
      state.menuHidden = action.payload
    },
    handleLastLayout: (state: any, action: any) => {
      state.lastLayout = action.payload
    },
    handleNavbarColor: (state: any, action: any) => {
      state.navbarColor = action.payload
    },
    handleContentWidth: (state: any, action: any) => {
      state.contentWidth = action.payload
    },
    handleMenuCollapsed: (state: any, action: any) => {
      state.menuCollapsed = action.payload
      window.localStorage.setItem(
        'menuCollapsed',
        JSON.stringify(action.payload),
      )
    },
    handleRouterTransition: (state: any, action: any) => {
      state.routerTransition = action.payload
    },
  },
})

export const {
  handleRTL,
  handleSkin,
  handleLayout,
  handleLastLayout,
  handleMenuHidden,
  handleNavbarType,
  handleFooterType,
  handleNavbarColor,
  handleContentWidth,
  handleMenuCollapsed,
  handleRouterTransition,
} = layoutSlice.actions

export default layoutSlice.reducer
