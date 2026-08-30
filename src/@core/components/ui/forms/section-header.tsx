import type { FC } from 'react'

// Section Header Component
const SectionHeader: FC<{
  icon: React.ReactNode
  title: string
  description?: string
}> = ({ icon, title, description }) => (
  <div className="flex items-center gap-2 mb-1 pb-2 border-b border-gray-100 dark:border-gray-700">
    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
      {icon}
    </div>
    <div>
      <h3 className="text-base font-medium text-gray-900 dark:text-white">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
    </div>
  </div>
)

export default SectionHeader
