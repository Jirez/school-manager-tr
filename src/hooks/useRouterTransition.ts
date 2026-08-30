// ** Store Imports
import { handleRouterTransition } from '@/redux/layout'
import { useDispatch, useSelector } from 'react-redux'
import type { RouterTransitionType } from '@/utils/types'

export const useRouterTransition = () => {
  // ** Hooks
  const dispatch = useDispatch()
  const store = useSelector((state: any) => state.layout)

  const setTransition = (type: RouterTransitionType) => {
    // @ts-ignore desc
    dispatch(handleRouterTransition(type))
  }

  return { transition: store.routerTransition, setTransition }
}
