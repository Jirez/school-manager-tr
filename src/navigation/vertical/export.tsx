// ** Icons Import
import { FileSpreadsheet } from 'lucide-react'
import { DATA_EXPORT } from '@/utils/constants'
import NavIcon from './NavIcon'

// ** Roles allowed "ROLE_ADMIN", "ROLE_SUPER_ADMIN"

export default [
  {
    id: 'export',
    title: 'sidebar.export',
    icon: <NavIcon icon={<FileSpreadsheet size={14} />} color="#28c76f" />,
    navLink: DATA_EXPORT,
    meta: {
      resource: 'report',
    },
  },
]
