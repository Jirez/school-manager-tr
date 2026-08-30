import cn from 'classnames'
import React, { useEffect, useRef, useImperativeHandle } from 'react'
import type { TextareaHTMLAttributes } from 'react'

export interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string
  inputClassName?: string
  label?: string
  note?: string
  error?: string
  type?: string
  shadow?: boolean
  variant?: 'normal' | 'solid' | 'outline'
  invalid?: boolean
  autoGrow?: boolean
  minRows?: number
  maxRows?: number
}

const TextArea = React.forwardRef<HTMLTextAreaElement, Props>(
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
      autoGrow = true,
      minRows = 1,
      maxRows,
      value,
      defaultValue,
      onChange,
      ...rest
    },
    forwardedRef,
  ) => {
    const internalRef = useRef<HTMLTextAreaElement>(null)

    // Merge refs
    useImperativeHandle(
      forwardedRef,
      () => internalRef.current as HTMLTextAreaElement,
      [],
    )

    // Auto-grow functionality
    useEffect(() => {
      const textarea = internalRef.current
      if (!textarea || !autoGrow) return

      const adjustHeight = () => {
        // Reset height to get accurate scrollHeight
        textarea.style.height = 'auto'

        // Calculate the height
        const lineHeight = parseInt(
          window.getComputedStyle(textarea).lineHeight || '20',
          10,
        )
        const padding =
          parseInt(window.getComputedStyle(textarea).paddingTop || '0', 10) +
          parseInt(window.getComputedStyle(textarea).paddingBottom || '0', 10)

        const minHeight = lineHeight * minRows + padding
        let newHeight = textarea.scrollHeight

        if (maxRows) {
          const maxHeight = lineHeight * maxRows + padding
          newHeight = Math.min(newHeight, maxHeight)
        }

        textarea.style.height = `${Math.max(newHeight, minHeight)}px`
        textarea.style.overflowY =
          maxRows && newHeight >= lineHeight * maxRows + padding
            ? 'auto'
            : 'hidden'
      }

      // Initial adjustment
      adjustHeight()

      // Adjust on input
      textarea.addEventListener('input', adjustHeight)
      textarea.addEventListener('paste', adjustHeight)

      // Adjust on window resize
      window.addEventListener('resize', adjustHeight)

      return () => {
        textarea.removeEventListener('input', adjustHeight)
        textarea.removeEventListener('paste', adjustHeight)
        window.removeEventListener('resize', adjustHeight)
      }
    }, [autoGrow, minRows, maxRows, value, defaultValue])

    // Base classes for normal text field appearance
    const baseClasses = cn(
      'w-full',
      'px-1 py-1',
      'text-sm',
      'leading-relaxed',
      'rounded-md',
      'border',
      'transition-all',
      'duration-200',
      'ease-in-out',
      'outline-none',
      'resize-none',
      'font-normal',
      'text-gray-900',
      'placeholder:text-gray-400',
      {
        // Normal variant - looks like standard input
        'bg-white dark:!bg-gray-800': variant === 'normal',
        'border-gray-300 dark:!border-gray-600 dark:text-gray-400':
          variant === 'normal',
        'focus:border-primary focus:ring-2 focus:ring-primary/20':
          variant === 'normal',
        'hover:border-gray-400 dark:hover:border-gray-500':
          variant === 'normal',

        // Solid variant
        'bg-gray-50 dark:!bg-gray-700/50': variant === 'solid',
        'border-gray-200 dark:border-gray-600': variant === 'solid',
        'focus:border-primary focus:bg-white dark:focus:bg-gray-800':
          variant === 'solid',

        // Outline variant
        'bg-transparent': variant === 'outline',
        'border-gray-300 dark:!border-gray-600': variant === 'outline',
        'focus:border-primary': variant === 'outline',
      },
      {
        'focus:shadow-md': shadow,
      },
      {
        'border-red-500 focus:border-red-500 focus:ring-red-500/20':
          invalid || error,
      },
      inputClassName,
      { 'form-control is-invalid': invalid },
    )

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(e)
    }

    return (
      <span className={className}>
        <textarea
          id={name}
          name={name}
          ref={internalRef}
          className={baseClasses}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="true"
          rows={autoGrow ? minRows : rest.rows || 3}
          aria-invalid={error ? 'true' : 'false'}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          style={{
            minHeight: autoGrow ? 'auto' : undefined,
            overflow: autoGrow ? 'hidden' : undefined,
          }}
          {...rest}
        />
        {note && (
          <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
            {note}
          </p>
        )}
        {error && (
          <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">
            {error}
          </p>
        )}
      </span>
    )
  },
)

TextArea.displayName = 'TextArea'

export default TextArea
