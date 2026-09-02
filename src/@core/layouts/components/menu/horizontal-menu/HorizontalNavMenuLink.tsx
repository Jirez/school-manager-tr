// ** React Imports
import { Link } from '@tanstack/react-router'

// ** Third Party Components
import classnames from 'classnames'
import { useTranslation } from 'react-i18next'

const HorizontalNavMenuLink = ({ item, isChild, setMenuOpen }: any) => {
  // ** Conditional Link Tag, if item has newTab or externalLink props use <a> tag else use NavLink
  const LinkTag = item.externalLink ? 'a' : Link

  // ** Hooks
  const { t } = useTranslation()

  const handleClick = () => {
    if (setMenuOpen) {
      setMenuOpen(false)
    }
  }

  return (
    <li
      onClick={handleClick}
      className={classnames('nav-item', {
        disabled: item.disabled,
      })}
    >
      <LinkTag
        className={classnames('d-flex align-items-center', {
          'dropdown-item': isChild,
          'nav-link': !isChild,
        })}
        target={item.newTab ? '_blank' : undefined}
        {...(item.externalLink === true
          ? {
              href: item.navLink || '/',
            }
          : {
              to: item.navLink || '/',
              activeProps: {
                className: 'active',
              },
            })}
      >
        {item.icon}
        <span>{t(item.title)}</span>
      </LinkTag>
    </li>
  )
}

export default HorizontalNavMenuLink
