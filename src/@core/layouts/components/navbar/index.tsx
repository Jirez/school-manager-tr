// ** Custom Components
import NavbarUser from './NavbarUser'
// import NavbarBookmarks from './NavbarBookmarks'

// ** Third Party Components
// import { Menu } from 'react-feather'

// ** Reactstrap Imports
// import { NavItem, NavLink } from 'reactstrap'
import { useAuthentication } from '@/hooks/useAuthentication'
import { NavItem, NavLink } from 'reactstrap'
import { Menu } from 'react-feather'

const ThemeNavbar = (props: any) => {
  // ** Props
  const { skin, setSkin, setMenuVisibility } = props

  // ** Hooks
  const { enterprise } = useAuthentication()

  return (
    <>
      <ul className="navbar-nav d-xl-none">
        <NavItem className="mobile-menu me-auto d-flex align-items-center">
          <NavLink
            className="nav-menu-main menu-toggle hidden-xs is-active"
            onClick={() => setMenuVisibility(true)}
          >
            <Menu className="ficon" />
          </NavLink>
        </NavItem>
      </ul>
      <div className="bookmark-wrapper d-flex align-items-center">
        <span className="truncate text-xs md:text-sm font-medium w-44 md:w-full">
          {enterprise}
        </span>
        {/* <NavbarBookmarks setMenuVisibility={setMenuVisibility} /> */}
      </div>
      <NavbarUser skin={skin} setSkin={setSkin} />
    </>
  )
}

export default ThemeNavbar
