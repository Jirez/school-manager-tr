import { useController } from 'react-hook-form'
import type { Control } from 'react-hook-form'
import type { InputProps } from 'reactstrap'
import { useId } from 'react'
import type { FC } from 'react'

interface Props extends Omit<InputProps, 'type'> {
  name: string
  label: string
  control: Control<any>
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const Switch: FC<Props> = ({
  name,
  label,
  control,
  className = '',
  size = 'md',
  ...props
}) => {
  const uniqueId = useId()
  const inputId = `switch-${name}-${uniqueId}`

  const {
    formState: { errors },
    field,
  } = useController({ name, control })

  const hasError = !!errors[name]
  const isChecked = field.value === true

  // Size configurations
  const sizeConfig = {
    sm: {
      track: 'w-9 h-5',
      knob: 'w-3.5 h-3.5',
      translate: 'translate-x-4',
      label: 'text-sm',
    },
    md: {
      track: 'w-11 h-6',
      knob: 'w-4 h-4',
      translate: 'translate-x-5',
      label: 'text-base',
    },
    lg: {
      track: 'w-14 h-7',
      knob: 'w-5 h-5',
      translate: 'translate-x-7',
      label: 'text-lg',
    },
  }

  const config = sizeConfig[size]

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {/* Custom Switch Toggle */}
      <label
        htmlFor={inputId}
        className="relative inline-flex items-center cursor-pointer group"
      >
        {/* Hidden native input for accessibility */}
        <input
          type="checkbox"
          id={inputId}
          className="sr-only peer"
          // checked={isChecked}
          onChange={(e) => {
            field.onChange(e.target.checked)
            props.onChange?.(e)
          }}
          onBlur={field.onBlur}
          ref={field.ref}
          {...props}
        />

        {/* Track */}
        <div
          className={`
            ${config.track}
            rounded-full
            transition-all duration-300 ease-in-out
            ${
              isChecked
                ? 'bg-gradient-to-r from-primary to-primary/80 shadow-[0_0_12px_rgba(115,103,240,0.4)]'
                : 'bg-gray-300 dark:bg-gray-600'
            }
            ${
              hasError
                ? 'ring-2 ring-danger ring-offset-1'
                : 'peer-focus-visible:ring-2 peer-focus-visible:ring-primary/50 peer-focus-visible:ring-offset-2'
            }
            group-hover:${
              isChecked
                ? 'shadow-[0_0_16px_rgba(115,103,240,0.5)]'
                : 'bg-gray-400 dark:bg-gray-500'
            }
            relative
          `}
        >
          {/* Animated Knob */}
          <div
            className={`
              ${config.knob}
              absolute top-1/2 -translate-y-1/2
              bg-white
              rounded-full
              shadow-md
              transition-all duration-300 ease-in-out
              ${isChecked ? `${config.translate} shadow-lg` : 'translate-x-1'}
              group-hover:scale-110
              group-active:scale-95
            `}
          >
            {/* Inner glow effect when checked */}
            {isChecked && (
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/80 to-white/20" />
            )}
          </div>

          {/* Subtle inner shadow for depth */}
          <div className="absolute inset-0 rounded-full shadow-inner opacity-20" />
        </div>
      </label>

      {/* Label */}
      <label
        htmlFor={inputId}
        className={`
          ${config.label}
          //font-medium
          cursor-pointer
          select-none
          transition-colors duration-200
          text-[#5e5873]
          //text-[0.957rem]
          ${
            hasError
              ? 'text-danger'
              : isChecked
                ? 'text-gray-800 dark:text-white'
                : 'text-gray-600 dark:text-gray-400'
          }
          hover:text-gray-800 dark:hover:text-white
        `}
      >
        {label}
      </label>
    </div>
  )
}

export default Switch
