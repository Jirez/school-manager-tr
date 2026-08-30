import React, { forwardRef, useState, useEffect } from 'react'
import type { HTMLProps } from 'react'

export const IndeterminateCheckbox = forwardRef<
  HTMLInputElement,
  { indeterminate?: boolean } & HTMLProps<HTMLInputElement>
>(
  (
    {
      indeterminate,
      className = '',
      onChange,
      checked,
      defaultChecked,
      ...rest
    },
    forwardedRef,
  ) => {
    const internalRef = React.useRef<HTMLInputElement>(null)
    const resolvedRef = (forwardedRef ||
      internalRef) as React.MutableRefObject<HTMLInputElement | null>

    // Track checked state internally
    const [isChecked, setIsChecked] = useState<boolean>(
      checked ?? defaultChecked ?? false,
    )

    // Sync with controlled checked prop
    useEffect(() => {
      if (typeof checked === 'boolean') {
        setIsChecked(checked)
      }
    }, [checked])

    // Handle indeterminate state
    useEffect(() => {
      if (resolvedRef.current && typeof indeterminate === 'boolean') {
        resolvedRef.current.indeterminate = !isChecked && indeterminate
      }
    }, [resolvedRef, indeterminate, isChecked])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsChecked(e.target.checked)
      onChange?.(e)
    }

    const showIndeterminate = indeterminate && !isChecked

    return (
      <label
        className={`
        relative inline-flex items-center justify-center
        w-5 h-5
        cursor-pointer
        ${rest.disabled ? 'cursor-not-allowed opacity-50' : ''}
        ${className}
      `}
      >
        {/* Hidden checkbox input */}
        <input
          type="checkbox"
          ref={resolvedRef}
          checked={checked}
          defaultChecked={defaultChecked}
          onChange={handleChange}
          className="absolute opacity-0 w-full h-full cursor-pointer z-20"
          {...rest}
        />

        {/* Custom checkbox visual */}
        <span
          className={`
          absolute inset-0
          rounded-md
          border-2
          transition-all duration-200 ease-in-out
          ${
            isChecked || showIndeterminate
              ? 'bg-primary border-primary hover:bg-primary/90'
              : 'bg-white border-gray-300 hover:border-primary'
          }
        `}
        />

        {/* Checkmark Icon - visible when checked */}
        <svg
          className={`
          relative z-10
          w-3 h-3
          text-white
          transition-all duration-200
          ${isChecked && !showIndeterminate ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}
        `}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>

        {/* Minus Icon - visible when indeterminate */}
        <svg
          className={`
          absolute z-10
          w-3 h-3
          text-white
          transition-all duration-200
          ${showIndeterminate ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}
        `}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
        </svg>
      </label>
    )
  },
)

IndeterminateCheckbox.displayName = 'IndeterminateCheckbox'

export default IndeterminateCheckbox
