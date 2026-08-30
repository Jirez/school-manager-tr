import Avatar from '@/@core/components/avatar'
import { XOctagon, AlertOctagon, Info } from 'react-feather'

interface Props {
  title: string
  content?: string
  type: 'success' | 'warning' | 'danger'
}

export const ToastContent: React.FC<Props> = ({ title, content, type }) => {
  const Icons = { success: Info, warning: AlertOctagon, danger: XOctagon }
  const Icon = Icons[type]

  return (
    <div className="flex w-56 items-center gap-1">
      <Avatar size="sm" color={type} icon={<Icon size={12} />} />
      <div className="flex flex-col">
        {title && <h6 className="font-bold text-sm">{title}</h6>}
        {content && <span className="text-sm font-light">{content}</span>}
      </div>
    </div>
  )
}
