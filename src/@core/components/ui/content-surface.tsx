import type { ReactNode } from 'react'
import cn from 'classnames'

interface ContentSurfaceProps {
  as?: 'div' | 'section'
  className?: string
  children: ReactNode
}

const ContentSurface = ({
  as: Component = 'div',
  className,
  children,
}: ContentSurfaceProps) => (
  <Component
    className={cn(
      'rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800',
      className,
    )}
  >
    {children}
  </Component>
)

export default ContentSurface
