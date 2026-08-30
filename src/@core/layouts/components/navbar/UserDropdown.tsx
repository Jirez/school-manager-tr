// ** React Imports
// import { Link } from 'react-router-dom'
import { useState } from 'react'

// ** Custom Components
import Avatar from '@/@core/components/avatar'

// ** Utils
// import { isUserLoggedIn } from '@utils'

// ** Third Party Components
import { User, Settings, Power } from 'react-feather'

// ** Translations
import { useTranslation } from 'react-i18next'

// ** Reactstrap Imports
import {
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
} from 'reactstrap'

// ** Default Avatar Image
import defaultAvatar from '@/assets/images/placeholders/avatar.svg'
import { useLogout } from '@/hooks/useLogout'
import { useAuthentication } from '@/hooks/useAuthentication'
import { useNavigate } from '@tanstack/react-router'
import { PROFILE, CONFIGURATION } from '@/utils/constants'

const UserDropdown = () => {
  // ** State
  const [userData] = useState<any>(null)
  const { t } = useTranslation()
  const { logout } = useLogout()
  const { username, displayName } = useAuthentication()
  const navigate = useNavigate()

  //* * ComponentDidMount
  // useEffect(() => {
  //   if (isUserLoggedIn() !== null) {
  //     setUserData(JSON.parse(localStorage.getItem('userData')))
  //   }
  // }, [])

  //* * Vars
  const userAvatar = (userData && userData.avatar) || defaultAvatar

  return (
    <UncontrolledDropdown tag="li" className="dropdown-user nav-item">
      <DropdownToggle
        href="/"
        tag="a"
        className="nav-link dropdown-user-link"
        onClick={(e) => e.preventDefault()}
      >
        <div className="user-nav d-sm-flex d-none text-sm">
          <span className="user-name fw-bold">{displayName}</span>
          <span className="user-status">{username}</span>
        </div>
        <Avatar img={userAvatar} imgHeight="36" imgWidth="36" status="online" />
      </DropdownToggle>
      <DropdownMenu end>
        <DropdownItem
          tag="a"
          href="/profile"
          onClick={(e) => {
            e.preventDefault()
            navigate({ to: PROFILE })
          }}
          className="flex flex-row"
        >
          <User size={14} className="me-75" />
          <span className="align-middle">{t('text-profile')}</span>
        </DropdownItem>
        {/* <DropdownItem tag='a' href='/apps/email' onClick={e => e.preventDefault()} className="flex flex-row">
                    <Mail size={14} className='me-75' />
                    <span className='align-middle'>Inbox</span>
                </DropdownItem>
                <DropdownItem tag='a' href='/apps/todo' onClick={e => e.preventDefault()} className="flex flex-row">
                    <CheckSquare size={14} className='me-75' />
                    <span className='align-middle'>Tasks</span>
                </DropdownItem>
                <DropdownItem tag='a' href='/apps/chat' onClick={e => e.preventDefault()} className="flex flex-row">
                    <MessageSquare size={14} className='me-75' />
                    <span className='align-middle'>Chats</span>
                </DropdownItem>*/}
        <DropdownItem divider />
        <DropdownItem
          tag="a"
          href="/configuration"
          onClick={(e) => {
            e.preventDefault()
            navigate({ to: CONFIGURATION })
          }}
          className="flex flex-row"
        >
          <Settings size={14} className="me-75" />
          <span className="align-middle">{t('sidebar.settings')}</span>
        </DropdownItem>
        {/* <DropdownItem tag='a' href='/pages/pricing' onClick={e => e.preventDefault()} className="flex flex-row">
                    <CreditCard size={14} className='me-75' />
                    <span className='align-middle'>Pricing</span>
                </DropdownItem>
                <DropdownItem tag='a' href='/pages/faq' onClick={e => e.preventDefault()} className="flex flex-row">
                    <HelpCircle size={14} className='me-75' />
                    <span className='align-middle'>FAQ</span>
                </DropdownItem>*/}
        <DropdownItem onClick={() => logout(true)} className="flex flex-row">
          <Power size={14} className="me-75" />
          <span className="align-middle">{t('app.userAuth.logout')}</span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

export default UserDropdown
