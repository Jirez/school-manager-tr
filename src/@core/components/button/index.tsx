import type { FC } from 'react'
import { Button as BaseButton, Spinner } from 'reactstrap'
import type { ButtonProps } from 'reactstrap'

interface Props extends ButtonProps {
  loading?: boolean
}

const Button: FC<Props> = ({ loading = false, ...props }) => {
  return (
    <BaseButton {...props}>
      {loading ? <Spinner size="sm" /> : props.children}
    </BaseButton>
  )
}

export default Button
