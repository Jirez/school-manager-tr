// ** React Imports
import { Link as NavLink } from '@tanstack/react-router'

// ** Third Party Components
import classnames from 'classnames'
// ** Translation
import { useTranslation } from 'react-i18next'

// ** Reactstrap Imports
import { Badge } from 'reactstrap'

const VerticalNavMenuLink = ({ item, activeItem }: any) => {
  // ** Conditional Link Tag, if item has newTab or externalLink props use <a> tag else use NavLink
  const LinkTag = item.externalLink ? 'a' : NavLink

  // ** Hooks
  const { t } = useTranslation()

  return (
    <li
      className={classnames({
        'nav-item': !item.children,
        disabled: item.disabled,
        active: item.navLink === activeItem,
      })}
    >
      <LinkTag
        // @ts-ignore desc
        className="d-flex align-items-center"
        target={item.newTab ? '_blank' : undefined}
        /*eslint-disable */
        {...(item.externalLink === true
          ? {
              href: item.navLink || '/',
            }
          : {
              to: item.navLink || '/',
              className: ({ isActive }: any) => {
                if (isActive && !item.disabled) {
                  return 'd-flex align-items-center active'
                } else {
                  return 'd-flex align-items-center'
                }
              },
            })}

        onClick={(e) => {
          if (
            item.navLink.length === 0 ||
            item.navLink === '#' ||
            item.disabled === true
          ) {
            e.preventDefault()
          }
        }}
      >
        {item.icon}
        <span title={t(item.title)} className="menu-item text-truncate">
          {t(item.title)}
        </span>

        {item.badge && item.badgeText ? (
          <Badge className="ms-auto me-1" color={item.badge} pill>
            {item.badgeText}
          </Badge>
        ) : null}
      </LinkTag>
    </li>
  )
}

export default VerticalNavMenuLink
