import type { FC, ReactNode } from 'react'
import { ArrowLeft } from 'react-feather'
import { useNavigate, useRouter } from '@tanstack/react-router'

interface PageHeaderProps {
  className?: string
  title: string | ReactNode
  subtitle?: ReactNode
  returnLink?: string
  /** Optional icon to display in the header */
  icon?: ReactNode
  /** Optional gradient color for the icon background (default: primary purple) */
  iconColor?: string
  /** Optional actions to display on the right side */
  actions?: ReactNode
}

const PageHeader: FC<PageHeaderProps> = ({
  title,
  subtitle,
  returnLink,
  className = '',
  icon,
  iconColor = '#7367f0',
  actions,
}) => {
  const navigate = useNavigate()
  const router = useRouter()

  const handleBack = () => {
    if (returnLink) {
      navigate({ to: returnLink })
    } else {
      router.history.back()
    }
  }

  return (
    <div
      className={`
        w-full flex flex-row items-center justify-between
        min-h-[56px] mb-1 px-2 py-0
        bg-white dark:!bg-gray-800
        border border-gray-100 dark:!border-gray-700
        rounded-lg
        shadow-sm
        transition-all duration-200
        ${className}
      `}
      style={
        {
          // background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
        }
      }
    >
      {/* Left section: Back button + Icon + Title */}
      <div className="flex flex-row items-center gap-1">
        {/* Back Button */}
        <button
          onClick={handleBack}
          type="button"
          className="
            group
            flex items-center justify-center
            w-9 h-9
            rounded-lg
            bg-gray-50 dark:!bg-gray-700
            border border-gray-200 dark:!border-gray-600
            cursor-pointer
            transition-all duration-200
            hover:bg-primary hover:border-primary
            hover:shadow-md
            focus:outline-none focus:ring-2 focus:ring-primary/30
          "
          style={{
            transition: 'all 0.2s ease',
          }}
          aria-label="Go back"
        >
          <ArrowLeft
            size={18}
            className="
              text-gray-500 dark:!text-gray-400
              group-hover:text-white
              transition-colors duration-200
            "
          />
        </button>

        {/* Divider */}
        <div className="hidden sm:block w-px h-8 bg-gray-200 dark:!bg-gray-600" />

        {/* Icon Badge (if provided) */}
        {icon && (
          <div
            className="
              hidden sm:flex items-center justify-center
              w-10 h-10 rounded-lg
              flex-shrink-0
            "
            style={{
              background: `linear-gradient(135deg, ${iconColor} 0%, ${iconColor}cc 100%)`,
              boxShadow: `0 4px 12px ${iconColor}40`,
            }}
          >
            <span className="text-white">{icon}</span>
          </div>
        )}

        {/* Title & Subtitle */}
        <div className="flex flex-col justify-center min-w-0">
          <h1
            className="
              text-xl md:text-2xl font-semibold
              text-gray-800 dark:!text-white
              m-0 leading-tight
              truncate
            "
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className="
                text-xs sm:text-sm
                text-gray-500 dark:!text-gray-400
                m-0 mt-0.5
                truncate
              "
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right section: Actions */}
      {actions && <div className="flex items-center gap-2 ml-4">{actions}</div>}

      {/* Dark mode background override */}
      <style>{`
        .dark-layout div[class*="PageHeader"] {
          background: linear-gradient(135deg, #283046 0%, #1e2538 100%) !important;
        }
      `}</style>
    </div>
  )
}

export default PageHeader
