import { Outlet } from '@tanstack/react-router'

// ** Core Layout Import
// !Do not remove the Layout import
import Layout from '@/@core/layouts/HorizontalLayout'

// ** Menu Items Array
import navigation from '@/navigation/vertical'

const HorizontalLayout = (props: any) => {
  // const [menuData, setMenuData] = useState([])

  // ** For ServerSide navigation
  // useEffect(() => {
  //   axios.get(URL).then(response => setMenuData(response.data))
  // }, [])

  return (
    <Layout menuData={navigation} {...props}>
      <Outlet />
    </Layout>
  )
}

export default HorizontalLayout
