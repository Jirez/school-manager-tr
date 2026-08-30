import { useSize } from 'ahooks'
import cn from 'classnames'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react'
// import 'overlayscrollbars/css/OverlayScrollbars.css';

type ScrollbarProps = {
  options?: OverlayScrollbars.Options
  style?: React.CSSProperties
  className?: string
  children: any
}

const Scrollbar: React.FunctionComponent<ScrollbarProps> = ({
  options,
  className,
  style,
  ...props
}) => {
  const size = useSize(document.querySelector('body'))

  return (
    <OverlayScrollbarsComponent
      options={{
        className: cn('os-theme-dark', className),
        scrollbars: {
          // @ts-ignore desc
          autoHide: 'never',
          // snapHandle: false,
        },
        nativeScrollbarsOverlaid: {
          showNativeScrollbars: size && size.width <= 400,
          initialize: true,
        },
        ...(options ? options : {}),
      }}
      style={style}
      {...props}
    />
  )
}

export default Scrollbar
