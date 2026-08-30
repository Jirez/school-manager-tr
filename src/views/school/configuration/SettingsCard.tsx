import type { ReactNode } from 'react'

interface SettingsCardProps {
  title: ReactNode
  description?: ReactNode
  children: ReactNode
  action?: ReactNode
}

const SettingsCard = ({
  title,
  description,
  children,
  action,
}: SettingsCardProps) => {
  return (
    <div className="bg-white dark:!bg-dark2 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="p-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-start gap-2">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-600 dark:text-white m-0">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt- mb-0">
              {description}
            </p>
          )}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
      <div className="p-2">{children}</div>
    </div>
  )
}

export default SettingsCard
