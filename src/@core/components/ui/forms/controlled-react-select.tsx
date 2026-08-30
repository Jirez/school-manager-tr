import type { FC } from 'react'
import type { Control } from 'react-hook-form'
import { useController } from 'react-hook-form'
import { FormFeedback, Label } from 'reactstrap'
import { useTranslation } from 'react-i18next'
import Select from 'react-select'
import type { Props } from 'react-select'
import cs from 'classnames'

import Required from '@/@core/components/ui/forms/required'
import { selectThemeColors } from '@/utils/Utils'
import { enhancedStyles } from '@/@core/components/select/select.style'

interface ControlledSelectProps extends Props {
  name: string
  label?: string
  required?: boolean
  control: Control<any>
  className?: string
}

const ControlledSelect: FC<ControlledSelectProps> = ({
  label,
  name,
  control,
  className = 'mb-1',
  required = false,
  styles,
  ...props
}) => {
  const {
    field,
    formState: { errors },
  } = useController({ name, control })
  const { t } = useTranslation()
  // const ref = useRef<SelectInstance>(null);
  // const {ref, ... rest} = props

  const mergedStyles = styles
    ? { ...enhancedStyles, ...styles }
    : enhancedStyles

  // Override border color for error state
  if (errors[name] && true) {
    mergedStyles.control = (provided: any, state: any) => ({
      ...enhancedStyles.control!(provided, state),
      borderColor: state.isFocused ? '#ea5455' : '#ea5455',
      boxShadow: state.isFocused ? '0 0 0 3px rgba(234, 84, 85, 0.1)' : 'none',
      '&:hover': {
        borderColor: '#ea5455',
      },
    })
  }

  return (
    <div className={className}>
      {label && (
        <Label for={name}>
          {label}
          {required ? <Required /> : ''}
        </Label>
      )}
      <Select
        id={name}
        className={cs('react-select', { 'is-invalid': errors[name] })}
        classNamePrefix="select"
        theme={selectThemeColors}
        isClearable
        // error={errors[name] && true}
        // @ts-ignore desc
        styles={mergedStyles}
        menuPortalTarget={document.body}
        {...field}
        {...props}
        // ref={ref}
        ref={(ref) => field.ref(ref)}
      />
      {errors[name] ? (
        <FormFeedback>{t(errors?.[name]?.message as string)}</FormFeedback>
      ) : (
        <span />
      )}
    </div>
  )
}

export default ControlledSelect
