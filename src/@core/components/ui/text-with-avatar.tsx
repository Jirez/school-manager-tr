import React from 'react'
import AvatarLetter from './avatar-letter'
import { cutText } from '@/utils/helpers'

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface TextWithAvatarProps {
  /** The letter to display in the avatar */
  letter: string
  /** Main title text */
  title: string
  /** Optional subtitle/secondary text */
  subtitle?: any
  /** Optional metadata/tertiary text (e.g., date, status) */
  metadata?: string
  /** Show native tooltip on title hover */
  showTitleTooltip?: boolean
  /** Maximum characters for title before truncation */
  titleMaxLength?: number
  /** Click handler for the entire component */
  onClick?: () => void
  /** Size variant */
  size?: AvatarSize
  /** Whether the avatar should show a ring */
  showRing?: boolean
  /** Status indicator for the avatar */
  status?: 'online' | 'offline' | 'away' | 'busy'
  /** Additional CSS classes */
  className?: string
  /** Make the component appear as a clickable item */
  interactive?: boolean
  /** Reverse layout (text on left, avatar on right) */
  reversed?: boolean
  /** Custom avatar color */
  avatarColor?: string
  /** Additional CSS classes for the title */
  titleClassName?: string
}

const sizeConfig = {
  xs: {
    avatar: 'md' as const,
    title: 'text-xs',
    subtitle: 'text-xs',
    gap: 'gap-1',
    padding: 'p-0',
  },
  sm: {
    avatar: 'sm' as const,
    title: 'text-sm',
    subtitle: 'text-xs',
    gap: 'gap-2.5',
    padding: 'p-1.5',
  },
  md: {
    avatar: 'md' as const,
    title: 'text-base',
    subtitle: 'text-sm',
    gap: 'gap-3',
    padding: 'p-2',
  },
  lg: {
    avatar: 'lg' as const,
    title: 'text-lg',
    subtitle: 'text-sm',
    gap: 'gap-3.5',
    padding: 'p-2.5',
  },
  xl: {
    avatar: 'xl' as const,
    title: 'text-xl',
    subtitle: 'text-base',
    gap: 'gap-4',
    padding: 'p-3',
  },
}

const TextWithAvatar: React.FC<TextWithAvatarProps> = ({
  letter,
  title,
  subtitle,
  metadata,
  showTitleTooltip = true,
  titleMaxLength,
  onClick,
  size = 'xs',
  showRing = true,
  status,
  className = '',
  interactive = false,
  reversed = false,
  avatarColor,
  titleClassName = '',
}) => {
  const config = sizeConfig[size]
  const isClickable = !!onClick || interactive

  const displayTitle = titleMaxLength ? cutText(title, titleMaxLength) : title

  const containerClasses = `
    flex items-center
    ${config.gap}
    ${reversed ? 'flex-row-reverse' : 'flex-row'}
    w-full
    ${isClickable ? config.padding : ''}
    ${isClickable ? 'rounded-lg cursor-pointer' : ''}
    ${isClickable ? 'transition-all duration-200 ease-in-out' : ''}
    ${isClickable ? 'hover:bg-gray-50 active:bg-gray-100' : ''}
    ${isClickable ? 'dark:hover:bg-gray-800 dark:active:bg-gray-700' : ''}
    ${className}
  `

  const content = (
    <>
      {/* Avatar */}
      <div className="flex-shrink-0">
        <AvatarLetter
          letter={letter}
          size={config.avatar}
          showRing={showRing}
          status={status}
          customColor={avatarColor}
        />
      </div>

      {/* Text Content */}
      <div
        className={`
          flex flex-col justify-center
          min-w-0 flex-1
          ${reversed ? 'items-end text-right' : 'items-start text-left'}
        `}
      >
        {/* Title Row */}
        <div className="flex items-center w-full gap-2">
          <span
            className={`
              ${config.title}
              font-medium
              truncate
              leading-tight
              ${titleClassName}
            `}
            title={showTitleTooltip ? title : undefined}
          >
            {displayTitle}
          </span>

          {/* Metadata badge */}
          {metadata && (
            <span
              className={`
                flex-shrink-0
                text-xs
                text-gray-400 dark:text-gray-500
                font-normal
                ${reversed ? 'mr-auto' : 'ml-auto'}
              `}
            >
              {metadata}
            </span>
          )}
        </div>

        {/* Subtitle */}
        {subtitle && (
          <span
            className={`
              ${config.subtitle}
              text-gray-500 dark:text-gray-400
              truncate
              w-full
              leading-tight
              mt-0.5
            `}
          >
            {subtitle}
          </span>
        )}
      </div>
    </>
  )

  return (
    <div
      className={containerClasses}
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
    >
      {content}
    </div>
  )
}

/**
 * Skeleton loader for TextWithAvatar
 */
export const TextWithAvatarSkeleton: React.FC<{
  size?: AvatarSize
  showSubtitle?: boolean
}> = ({ size = 'md', showSubtitle = true }) => {
  const config = sizeConfig[size]

  const avatarSizes = {
    xs: 'h-6 w-6',
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-14 w-14',
  }

  return (
    <div className={`flex items-center ${config.gap} w-full animate-pulse`}>
      {/* Avatar skeleton */}
      <div
        className={`${avatarSizes[size]} bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0`}
      />

      {/* Text skeleton */}
      <div className="flex flex-col flex-1 min-w-0 gap-1.5">
        <div className={`h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4`} />
        {showSubtitle && (
          <div className={`h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2`} />
        )}
      </div>
    </div>
  )
}

/**
 * List container for multiple TextWithAvatar items
 */
export const TextWithAvatarList: React.FC<{
  children: React.ReactNode
  divided?: boolean
  className?: string
}> = ({ children, divided = false, className = '' }) => {
  return (
    <div
      className={`
        flex flex-col
        ${divided ? 'divide-y divide-gray-100 dark:divide-gray-800' : 'gap-1'}
        ${className}
      `}
    >
      {children}
    </div>
  )
}

export default TextWithAvatar
