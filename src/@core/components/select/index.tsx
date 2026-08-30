import { default as BaseSelect } from 'react-select'
import type { Props } from 'react-select'
import type { FC } from 'react'
import cs from 'classnames'
import { selectThemeColors } from '@/utils/Utils'
import { enhancedStyles } from './select.style'

interface SelectProps extends Props<Record<string, any>> {
  className?: string
  error?: boolean
  variant?: 'default' | 'outlined'
}

const Select: FC<SelectProps> = ({
  className,
  error = false,
  variant = 'default',
  styles,
  ...props
}) => {
  const mergedStyles = styles
    ? { ...enhancedStyles, ...styles }
    : enhancedStyles

  // Override border color for error state
  if (error) {
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
    <BaseSelect
      theme={selectThemeColors}
      className={cs('react-select', {
        'is-invalid': error,
        [className || '']: !!className,
      })}
      classNamePrefix="select"
      isClearable
      styles={mergedStyles}
      menuPortalTarget={document.body}
      {...props}
    />
  )
}

export default Select
