// ** Store Imports
import { handleMenuCollapsed } from '@/redux/layout'
import { useDispatch, useSelector } from 'react-redux'

export const useMenuCollapsed = () => {
  // ** Hooks
  const dispatch = useDispatch()
  const store = useSelector((state: any) => state.layout)

  const setMenuCollapsed = (val: any) => {
    dispatch(handleMenuCollapsed(val))
  }

  return { menuCollapsed: store.menuCollapsed, setMenuCollapsed }
}
