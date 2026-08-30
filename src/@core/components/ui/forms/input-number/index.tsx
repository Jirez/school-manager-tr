import React, { useState } from 'react'
import type { InputHTMLAttributes } from 'react'
import cn from 'classnames'
import { NumericFormat } from 'react-number-format'

import { toCurrency } from '@/utils/helpers'
import { numberUtils } from '@/utils/numberUtils'

import './tooltip.css'

interface NumberFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string
  inputClassName?: string
  error?: string
  type?: string
  shadow?: boolean
  variant?: 'normal' | 'solid' | 'outline'
  invalid?: boolean
  // value: any
  onValueChange?: (value: any, info: any) => void
}

const classes = {
  root: 'simple-input px-1 h-10 flex items-center w-full roundedn appearance-none outline-none transition duration-300 ease-in-out text-heading text-normal focus:outline-none focus:ring-5',
  normal:
    'bg-primary-100 font-medium cursor-text bordern border-red-600 focus:shadow focus:bg-light focus:border-primary-600 focus:ring-primary-600',
  solid:
    'bg-gray-100 border border-border-100 focus:bg-light focus:border-accent',
  outline: 'border border-border-base focus:border-accent',
  shadow: 'focus:shadow',
}

const InputNumber = React.forwardRef<HTMLInputElement, NumberFieldProps>(
  (
    {
      className,
      inputClassName,
      invalid = false,
      variant = 'normal',
      shadow = true,
      name,
      // onValueChange,
      ...props
    },
    ref,
  ) => {
    // extends React.Component<NumberFieldProps, NumberFieldState> {
    const [isEditing, setEditing] = useState(true)
    const [value, setValue] = useState<string | number>('')

    const onChange = (event: any) => {
      props.onChange?.(event) // event.target.value
      setValue(event.target.value)
    }

    const toggleEditing = (e: any) => {
      setEditing((val) => !val)
      props.onBlur?.(e)
    }

    const rootClassName = cn(
      className,
      classes.root,
      {
        [classes.normal]: variant === 'normal',
        [classes.solid]: variant === 'solid',
        [classes.outline]: variant === 'outline',
      },
      {
        [classes.shadow]: shadow,
      },
      inputClassName,
      { 'form-control is-invalid': invalid },
    )

    const { floatToLetters } = numberUtils()

    // console.log(props.id)

    return (
      <>
        {/* <label htmlFor={props.name}>Income</label>*/}
        {isEditing ? (
          <div className="relative">
            <NumericFormat
              autoFocus={props.autoFocus || true}
              // type="number"
              name={name}
              id={name}
              // title={floatToLetters(value)}
              autoComplete="off"
              className={rootClassName}
              // ref={ref}
              // @ts-ignore desc
              value={props.value}
              {...props}
              // onChange={onChange}
              // onBlur={toggleEditing}
              // @ts-ignore desc
              thousandSeparator=" "
              getInputRef={ref}
            />

            {floatToLetters(value) && (
              <div id="tooltip" className="bottom">
                <div className="tooltip-arrow" />
                <div className="tooltip-label">{floatToLetters(value)}</div>
              </div>
            )}
          </div>
        ) : (
          <input
            type="text"
            id={name}
            className={rootClassName}
            onFocus={toggleEditing}
            value={Number(props.value) ? toCurrency(props.value as number) : ''}
            readOnly
          />
        )}
      </>
    )
  },
)

InputNumber.displayName = 'InputNumber'

export default InputNumber
