import React, { useId, useState, useCallback, useRef, useEffect } from 'react'
import { LuCheck } from 'react-icons/lu'

// @ts-ignore desc
interface CheckBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string | React.ReactNode
  size?: 'sm' | 'md'
}

export const PermissionCheckBox = React.forwardRef<
  HTMLInputElement,
  CheckBoxProps
>(
  (
    {
      label,
      size = 'md',
      className = '',
      checked,
      defaultChecked,
      onChange,
      ...rest
    },
    forwardedRef,
  ) => {
    const uniqueId = useId()
    const inputId = `permission-checkbox-${uniqueId}`
    const internalRef = useRef<HTMLInputElement>(null)

    // Merge refs
    const setRef = useCallback(
      (node: HTMLInputElement | null) => {
        ;(
          internalRef as React.MutableRefObject<HTMLInputElement | null>
        ).current = node
        if (typeof forwardedRef === 'function') {
          forwardedRef(node)
        } else if (forwardedRef) {
          ;(
            forwardedRef as React.MutableRefObject<HTMLInputElement | null>
          ).current = node
        }
      },
      [forwardedRef],
    )

    // Track checked state internally for styling
    // Initialize from defaultChecked or checked prop
    const [isChecked, setIsChecked] = useState(() => {
      if (checked !== undefined) return checked
      if (defaultChecked !== undefined) return defaultChecked
      return false
    })

    // Sync with the actual input element's checked state on mount
    useEffect(() => {
      if (internalRef.current) {
        setIsChecked(internalRef.current.checked)
      }
    }, [])

    // Sync with external checked prop if controlled
    useEffect(() => {
      if (checked !== undefined) {
        setIsChecked(checked)
      }
    }, [checked])

    // Handle change to update internal state
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Always read the actual checked state from the event
      setIsChecked(e.target.checked)
      onChange?.(e)
    }

    // Size configurations
    const sizeConfig = {
      sm: {
        box: 'w-4 h-4',
        icon: 10,
        label: 'text-sm',
        gap: 'gap-2',
      },
      md: {
        box: 'w-5 h-5',
        icon: 12,
        label: 'text-base',
        gap: 'gap-2.5',
      },
    }

    const config = sizeConfig[size]

    return (
      <label
        htmlFor={inputId}
        className={`
          group
          inline-flex items-center ${config.gap}
          cursor-pointer
          select-none
          py-1.5
          w-full
          ${className}
        `}
      >
        {/* Hidden native checkbox */}
        <input
          type="checkbox"
          id={inputId}
          ref={setRef}
          className="peer sr-only"
          defaultChecked={defaultChecked}
          onChange={handleChange}
          {...rest}
        />

        {/* Custom checkbox box */}
        <div
          className={`
            ${config.box}
            relative
            flex items-center justify-center
            rounded
            border-2
            transition-all duration-200 ease-out
            flex-shrink-0
            
            ${
              isChecked
                ? 'border-primary bg-primary shadow-[0_0_8px_rgba(115,103,240,0.4)]'
                : 'border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700'
            }
            
            group-hover:border-primary/60 dark:group-hover:border-primary/60
            group-hover:scale-105
            group-active:scale-95
          `}
        >
          {/* Checkmark icon */}
          <LuCheck
            size={config.icon}
            className={`
              text-white
              transition-all duration-200 ease-out
              ${isChecked ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}
            `}
            strokeWidth={3}
          />
        </div>

        {/* Label */}
        <span
          className={`
            ${config.label}
            transition-colors duration-200
            ${
              isChecked
                ? 'text-gray-800 dark:text-white'
                : 'text-gray-600 dark:text-gray-300'
            }
            group-hover:text-gray-800 dark:group-hover:text-white
          `}
        >
          {label}
        </span>
      </label>
    )
  },
)

PermissionCheckBox.displayName = 'PermissionCheckBox'
