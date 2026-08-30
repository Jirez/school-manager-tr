// ** React Imports
import { Fragment, useState } from 'react'

// ** Third Party Components
import classnames from 'classnames'
import { Eye, EyeOff } from 'react-feather'

// ** Reactstrap Imports
import { InputGroup, Input, InputGroupText } from 'reactstrap'
import type { InputProps } from 'reactstrap'
import { useFieldContext } from '#/hooks/form/form-context'
import { useSelector } from '@tanstack/react-form'
import Required from '../forms/required'
import { StyledFormFeedback, StyledLabel } from '../forms/form.style'
import { useTranslation } from 'react-i18next'

interface InputPasswordToggleProps extends InputProps {
  hideIcon?: React.ReactNode
  showIcon?: React.ReactNode
  visible?: boolean
  className?: string
  placeholder?: string
  iconSize?: number
  inputClassName?: string
  label?: any
  htmlFor?: any
  id?: string
  required?: boolean
}

const InputPasswordToggle = (props: InputPasswordToggleProps) => {
  // ** Props
  const {
    label,
    hideIcon,
    showIcon,
    visible = false,
    className,
    htmlFor,
    placeholder,
    iconSize,
    inputClassName,
    required,
    ...rest
  } = props

  const { t } = useTranslation()
  const field = useFieldContext<string>()
  const errors = useSelector(field.store, (state) => state.meta.errors)
  const invalid = errors.length > 0

  // ** State
  const [inputVisibility, setInputVisibility] = useState(visible)

  // ** Renders Icon Based On Visibility
  const renderIcon = () => {
    const size = iconSize ? iconSize : 14

    if (!inputVisibility) {
      return hideIcon ? hideIcon : <Eye size={size} />
    } else {
      return showIcon ? showIcon : <EyeOff size={size} />
    }
  }

  return (
    <Fragment>
      {label ? (
        <StyledLabel className="form-label" for={htmlFor} $error={invalid}>
          {label} {required && <Required />}
        </StyledLabel>
      ) : null}
      <InputGroup
        className={classnames({
          /* @ts-ignore desc*/
          [className]: className,
          'is-invalid': invalid,
        })}
      >
        <Input
          invalid={invalid}
          type={inputVisibility === false ? 'password' : 'text'}
          placeholder={placeholder ? placeholder : '············'}
          className={classnames({
            /* @ts-ignore desc*/
            [inputClassName]: inputClassName,
          })}
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
          {...rest}
        />
        <InputGroupText
          className="cursor-pointer"
          onClick={() => setInputVisibility(!inputVisibility)}
        >
          {renderIcon()}
        </InputGroupText>
      </InputGroup>
      {invalid && (
        <StyledFormFeedback>{t(errors[0].message)}</StyledFormFeedback>
      )}
    </Fragment>
  )
}

export default InputPasswordToggle
