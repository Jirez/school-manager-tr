// ** React Imports
import { useEffect } from 'react'

// ** Store Imports
import { handleSkin } from '@/redux/layout'
import { useDispatch, useSelector } from 'react-redux'
import type { SkinType } from '@/utils/types'

export const useSkin = () => {
  // ** Hooks
  const dispatch = useDispatch()
  const store = useSelector((state: any) => state.layout)

  const setSkin = (type: SkinType) => {
    // @ts-ignore desc
    dispatch(handleSkin(type))
  }

  useEffect(() => {
    // ** Get Body Tag
    const element: any = window.document.body

    // ** Define classnames for skins
    const classNames = {
      dark: 'dark-layout',
      bordered: 'bordered-layout',
      'semi-dark': 'semi-dark-layout',
    }

    // ** Remove all classes from Body on mount
    element.classList.remove(...element.classList)

    // ** If skin is not light add skin class
    if (store.skin !== 'light') {
      // @ts-ignore desc
      element.classList.add(classNames[store.skin])
    }

    // ** Config for tailwind
    // const root: any = window.document.html
    document.documentElement.classList.remove('dark')
    if (store.skin === 'dark') {
      document.documentElement.classList.add('dark')
      // console.log(document.documentElement.classList)
    }
  }, [store.skin])

  return { skin: store.skin, setSkin }
}
