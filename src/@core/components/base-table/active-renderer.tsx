import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { LuCheck, LuX, LuLoader } from 'react-icons/lu'

interface ActiveRendererProps {
  active: boolean
  activeText?: string
  inactiveText?: string
  onClick?: () => void
  title?: string
  loading?: boolean
  /** Compact mode - shows only icon without text */
  compact?: boolean
  /** Size variant */
  size?: 'sm' | 'md'
}

const ActiveRenderer: FC<ActiveRendererProps> = ({
  active,
  title = '',
  activeText = 'text-active',
  inactiveText = 'text-inactive',
  onClick,
  loading = false,
  compact = false,
  size = 'sm',
}) => {
  const { t } = useTranslation()

  const isClickable = !!onClick
  const sizeClasses =
    size === 'sm' ? 'text-[8px] px-1.5 py-0.5' : 'text-xs px-2 py-1'
  const iconSize = size === 'sm' ? 8 : 12

  // Loading state
  if (loading) {
    return (
      <span
        className="
          inline-flex items-center justify-center
          w-5 h-5
          text-gray-400
        "
      >
        <LuLoader size={14} className="animate-spin" />
      </span>
    )
  }

  // Active badge
  if (active) {
    return (
      <span
        onClick={() => onClick?.()}
        title={title}
        className={`
          inline-flex items-center gap-[0.3rem]
          ${sizeClasses}
          font-semibold uppercase tracking-wide
          rounded-full
          transition-all duration-200
          ${isClickable ? 'cursor-pointer hover:shadow-sm' : ''}
          ${compact ? '!px-1' : ''}
        `}
        style={{
          background: 'linear-gradient(135deg, #28c76f22 0%, #28c76f11 100%)',
          color: '#28c76f',
          border: '1px solid #28c76f33',
        }}
      >
        <LuCheck size={iconSize} strokeWidth={3} />
        {!compact && <span>{t(activeText)}</span>}
      </span>
    )
  }

  // Inactive badge
  return (
    <span
      onClick={() => onClick?.()}
      title={title}
      className={`
        inline-flex items-center gap-[0.3rem]
        ${sizeClasses}
        font-semibold uppercase tracking-wide
        rounded-full
        transition-all duration-200
        ${isClickable ? 'cursor-pointer hover:shadow-sm' : ''}
        ${compact ? '!px-1' : ''}
      `}
      style={{
        background: 'linear-gradient(135deg, #ea545522 0%, #ea545511 100%)',
        color: '#ea5455',
        border: '1px solid #ea545533',
      }}
    >
      <LuX size={iconSize} strokeWidth={3} />
      {!compact && <span>{t(inactiveText)}</span>}
    </span>
  )
}

export default ActiveRenderer
