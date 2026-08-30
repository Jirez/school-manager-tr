import cn from 'classnames'
import type { InputHTMLAttributes } from 'react'
import React from 'react'

export interface Props extends InputHTMLAttributes<HTMLInputElement> {
  className?: string
  inputClassName?: string
  label?: string
  note?: string
  // name: string;/
  error?: string
  type?: string
  shadow?: boolean
  variant?: 'normal' | 'solid' | 'outline' | 'disabled'
  invalid?: boolean
}
const classes = {
  root: 'simple-input text-sm px-1 h-10 flex items-center w-full roundedn appearance-none outline-none transition duration-300 ease-in-out text-heading text-normal focus:outline-none focus:ring-5',
  normal:
    'bg-primary-100 bordern border-red-600 focus:shadow focus:bg-light focus:border-primary-600 focus:ring-primary-600',
  solid:
    'bg-gray-100 border border-border-100 focus:bg-light focus:border-accent',
  outline: 'border border-border-base focus:border-accent',
  shadow: 'focus:shadow',
  disabled: 'bg-red-50',
}

const Input = React.forwardRef<HTMLInputElement, Props>(
  (
    {
      className,
      label,
      note,
      name,
      error,
      children,
      variant = 'normal',
      shadow = true,
      type = 'text',
      inputClassName,
      invalid = false,
      ...rest
    },
    ref,
  ) => {
    const rootClassName = cn(
      className,
      classes.root,
      {
        [classes.normal]: variant === 'normal',
        [classes.solid]: variant === 'solid',
        [classes.outline]: variant === 'outline',
        [classes.disabled]: variant === 'disabled',
      },
      {
        [classes.shadow]: shadow,
      },
      inputClassName,
      { 'form-control is-invalid': invalid },
    )

    return (
      <span>
        {label && (
          <label
            htmlFor={name}
            className="block text-body-dark font-semibold text-sm leading-none mb-1"
          >
            {label}
          </label>
        )}
        <input
          id={name}
          name={name}
          type={type}
          ref={ref}
          className={rootClassName}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          aria-invalid={error ? 'true' : 'false'}
          {...rest}
        />
        {note && <p className="mt-2 text-xs text-body">{note}</p>}
        {error && (
          <p className="my-2 text-xs text-start text-red-500">{error}</p>
        )}
      </span>
    )
  },
)

Input.displayName = 'Input'

export default Input
