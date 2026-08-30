import { Outlet } from '@tanstack/react-router'

// ** Core Layout Import
// !Do not remove the Layout import
import type { Actions } from '@/configs/acl/ability'
import { AbilityContext } from '@/context/Can'
import Layout from '@/@core/layouts/VerticalLayout'

// ** Menu Items Array
import navigation from '@/navigation/vertical'
import { useContext, useMemo } from 'react'
import { useAuthentication } from '@/hooks/useAuthentication'

const VerticalLayout = ({ children, ...rest }: any) => {
  const ability = useContext(AbilityContext)
  const { schoolCategory } = useAuthentication()
  /* const { data } = useSchoolByIdQuery({
    variables: { id: enterpriseId },
  }); */

  /* useUpdateEffect(() => {
    setSchoolCategory(data?.schools?.schoolCategory as string);
    //console.log(data?.schools?.schoolCategory?.includes("PRIMARY"));
  }, [data]); */

  // ** For ServerSide navigation
  // useEffect(() => {
  //   axios.get(URL).then(response => setMenuData(response.data))
  // }, [])

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

  // if the user is authenticated and the school category is not set
  /* if (enterpriseId && isAuthenticated && !schoolCategory) {
    return <div>Loading...</div>;
  } */

  return (
    <Layout menuData={allowedNavigation} {...rest}>
      <Outlet />
    </Layout>
  )
}

export default VerticalLayout
