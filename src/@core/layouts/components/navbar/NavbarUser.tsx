// ** Dropdowns Imports
import IntlDropdown from './IntlDropdown'
// import CartDropdown from './CartDropdown'
import UserDropdown from './UserDropdown'
import NavbarSearch from './NavbarSearch'
// import NotificationDropdown from './NotificationDropdown'

// ** Third Party Components
import { Sun, Moon } from 'react-feather'

// ** Reactstrap Imports
import { NavItem, NavLink } from 'reactstrap'
import ReactSwitch from '@/@core/components/react-switch/react-switch'
import { useState } from 'react'

const NavbarUser = (props: any) => {
  // ** Props
  const { skin, setSkin } = props
  const [checked, setChecked] = useState<boolean>(skin === 'dark')

  // ** Function to toggle Theme (Light/Dark)
  const ThemeToggler = () => {
    /* if (skin === 'dark') {
            return <Sun className='ficon' onClick={() => setSkin('light')} />
        } else {
            return <Moon className='ficon' onClick={() => setSkin('dark')} />
        } */
    return (
      <ReactSwitch
        checked={checked}
        onChange={(val) => {
          setChecked(val)
          setSkin(val ? 'dark' : 'light')
        }}
        uncheckedIcon={
          <Sun className="ficon scale-75 ml-1" color="#ffffffdc" />
        }
        checkedIcon={<Moon className="ficon scale-75" color="#a8a3a3" />}
        height={20}
        width={40}
        onColor="#161d31"
        onHandleColor="#fff"
        offColor="#7367f0"
        offHandleColor="#ffffff"
        size="md"
      />
    )
  }

  return (
    <ul className="nav navbar-nav align-items-center ms-auto">
      <IntlDropdown />
      <NavItem className="">
        <NavLink className="nav-link-style theme m-0 p-0">
          <ThemeToggler />
        </NavLink>
      </NavItem>
      <NavbarSearch />
      {/* <CartDropdown />
            <NotificationDropdown />*/}
      <UserDropdown />
    </ul>
  )
}
export default NavbarUser
