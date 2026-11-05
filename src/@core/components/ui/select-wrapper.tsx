import type { ReactNode } from 'react'
import cn from 'classnames'

interface SelectWrapperProps {
  label: string
  icon?: ReactNode
  children: ReactNode
  className?: string
  labelClassName?: string
  htmlFor?: string
}

const SelectWrapper = ({
  label,
  icon,
  children,
  className,
  labelClassName,
  htmlFor,
}: SelectWrapperProps) => (
  <div className={cn('min-w-0', className)}>
    <label
      htmlFor={htmlFor}
      className={cn(
        'quarterly-label mb-0.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400',
        labelClassName,
      )}
    >
      {icon}
      {label}
    </label>
    {children}
  </div>
)

export default SelectWrapper
