// ** Store Imports
import { handleNavbarType } from '@/redux/layout'
import { useDispatch, useSelector } from 'react-redux'

export const useNavbarType = () => {
  // ** Hooks
  const dispatch = useDispatch()
  const store = useSelector((state: any) => state.layout)

  const setNavbarType = (type: any) => {
    dispatch(handleNavbarType(type))
  }

  return { navbarType: store.navbarType, setNavbarType }
}
