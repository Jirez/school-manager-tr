import { Img } from 'react-image'
import placeholder from '@components/image/student-placeholder.jpg'

const Placeholder = () => <img src={placeholder} alt="Placeholder" />

export default function Image({
  key,
  url,
  alt,
  unloader,
  loader,
  className,
  style,
}: {
  key?: any
  url?: string | [string]
  alt?: string
  unloader?: string
  loader?: string
  className?: string
  style?: any
}) {
  return (
    <Img
      draggable={false}
      style={style}
      // @ts-ignore desc
      src={url}
      alt={alt}
      loader={<Placeholder />}
      unloader={<Placeholder />}
      key={key}
      className={className}
    />
  )
}
