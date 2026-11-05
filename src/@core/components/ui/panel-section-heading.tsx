import type { ReactNode } from 'react'

interface PanelSectionHeadingProps {
  icon: ReactNode
  title: string
  description: string
}

const PanelSectionHeading = ({
  icon,
  title,
  description,
}: PanelSectionHeadingProps) => (
  <div className="mb-1 flex items-start gap-1">
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
      {icon}
    </div>
    <div>
      <h2 className="quarterly-heading m-0 text-sm font-semibold text-slate-800 dark:text-white sm:text-base">
        {title}
      </h2>
      <p className="quarterly-copy m-0 !text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
        {description}
      </p>
    </div>
  </div>
)

export default PanelSectionHeading
