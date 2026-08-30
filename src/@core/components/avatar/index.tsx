// ** React Imports
import { forwardRef } from 'react'

// ** Third Party Components
import classnames from 'classnames'

// ** Reactstrap Imports
import { Badge } from 'reactstrap'

interface AvatarProps {
  img?: any
  icon?: React.ReactNode
  src?: string
  badgeUp?: boolean
  content?: string
  badgeText?: string
  className?: string
  imgClassName?: string
  contentStyles?: object
  size?: 'sm' | 'lg' | 'xl'
  tag?: any | string
  status?: 'online' | 'offline' | 'away' | 'busy'
  imgHeight?: string | number
  imgWidth?: string | number
  badgeColor?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'info'
    | 'warning'
    | 'dark'
    | 'light-primary'
    | 'light-secondary'
    | 'light-success'
    | 'light-danger'
    | 'light-info'
    | 'light-warning'
    | 'light-dark'

  color?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'info'
    | 'warning'
    | 'dark'
    | 'light-primary'
    | 'light-secondary'
    | 'light-success'
    | 'light-danger'
    | 'light-info'
    | 'light-warning'
    | 'light-dark'

  initials?: any
  /* initials(props) {
    if (props['initials'] && props['content'] === undefined) {
    return new Error('content prop is required with initials prop.')
}
if (props['initials'] && typeof props['content'] !== 'string') {
    return new Error('content prop must be a string.')
}
if (typeof props['initials'] !== 'boolean' && props['initials'] !== undefined) {
    return new Error('initials must be a boolean!')
}
}*/
}

const Avatar = forwardRef((props: AvatarProps, ref) => {
  // ** Props
  const {
    img,
    size,
    icon,
    color,
    status,
    badgeUp,
    content,
    tag: Tag = 'div',
    initials,
    imgWidth,
    className,
    badgeText,
    imgHeight,
    badgeColor,
    imgClassName,
    contentStyles,
    ...rest
  } = props

  // ** Function to extract initials from content
  const getInitials = (str: string) => {
    const results: string[] = []
    const wordArray = str.split(' ')
    wordArray.forEach((e) => {
      results.push(e[0])
    })
    return results.join('')
  }

  return (
    /* @ts-ignore desc*/
    <Tag
      className={classnames('avatar', {
        /* @ts-ignore desc*/
        [className]: className,
        [`bg-${color}`]: color,
        [`avatar-${size}`]: size,
      })}
      ref={ref}
      {...rest}
    >
      {img === false || img === undefined ? (
        <span
          className={classnames('avatar-content', {
            'position-relative': badgeUp,
          })}
          style={contentStyles}
        >
          {/* @ts-ignore desc*/}
          {initials ? getInitials(content) : content}

          {icon ? icon : null}
          {badgeUp ? (
            <Badge
              color={badgeColor ? badgeColor : 'primary'}
              className="badge-sm badge-up"
              pill
            >
              {badgeText ? badgeText : '0'}
            </Badge>
          ) : null}
        </span>
      ) : (
        <img
          className={classnames({
            /* @ts-ignore desc*/
            [imgClassName]: imgClassName,
          })}
          src={img}
          alt="avatarImg"
          height={imgHeight && !size ? imgHeight : 32}
          width={imgWidth && !size ? imgWidth : 32}
        />
      )}
      {status ? (
        <span
          className={classnames({
            [`avatar-status-${status}`]: status,
            [`avatar-status-${size}`]: size,
          })}
        />
      ) : null}
    </Tag>
  )
})

export default Avatar
