import { useContext, useMemo } from 'react'

import { Outlet } from '@tanstack/react-router'
// ** Core Layout Import
// !Do not remove the Layout import
import { AbilityContext } from '@/context/Can'
import Layout from '@/@core/layouts/CleanVerticalLayout'

// ** Menu Items Array
import navigation from '@/navigation/vertical'
import type { Actions } from '@/configs/acl/ability'
import { useAuthentication } from '@/hooks/useAuthentication'

const CleanVerticalLayout = ({ children, ...rest }: any) => {
  // const [menuData, setMenuData] = useState([])
  const ability = useContext(AbilityContext)
  const { schoolCategory } = useAuthentication()

  // ** For ServerSide navigation
  // useEffect(() => {
  //   axios.get(URL).then(response => setMenuData(response.data))
  // }, [])

  /* const allowedNavigation = useMemo(() => {
        return navigation.filter((nav: any) => ability.can(nav.meta?.action as Actions || 'read', nav.meta?.resource))
    }, []) */

  const allowedNavigation = useMemo(() => {
    return navigation
      .filter((nav: any) =>
        ability.can(
          (nav.meta?.action as Actions) || 'read',
          nav.meta?.resource,
        ),
      )
      .filter(
        (nav: any) =>
          nav.meta?.isPrimary === undefined ||
          nav.meta?.isPrimary === schoolCategory?.includes('PRIMARY'),
      )
  }, [navigation, schoolCategory])

  return (
    <Layout menuData={allowedNavigation} {...rest}>
      <Outlet />
    </Layout>
  )
}

export default CleanVerticalLayout
