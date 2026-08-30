// ** Icons Import
import { DASHBOARD } from '@/utils/constants'
import { LayoutDashboard } from 'lucide-react'
import NavIcon from './NavIcon'

export default [
  {
    id: 'dashboard',
    title: 'sidebar.dashboard',
    icon: <NavIcon icon={<LayoutDashboard size={14} />} color="#7367f0" />,
    navLink: DASHBOARD,
    badgeText: 2,
    badgeColor: 'orange',
    meta: {
      action: 'read',
      resource: 'dashboard',
    },
  },
]
