// ** Icons Import
import { Circle } from 'react-feather'
import { Gavel } from 'lucide-react'
import NavIcon from './NavIcon'
import { m } from '@/paraglide/messages'

// ** Roles Allowed : ROLE_SUPER_ADMIN, ROLE_AMIN, ROLE_SURVEILLANT_GENERAL
export default [
  {
    id: 'discipline',
    title: 'sidebar.discipline',
    icon: <NavIcon icon={<Gavel size={14} />} color="#ea5455" />,
    meta: {
      resource: 'discipline',
    },
    children: [
      {
        id: 'discipline-distribution',
        title: m.discipline_distribution(),
        icon: <Circle size={12} />,
        navLink: '/discipline-distribution',
      },
      {
        id: 'sequential-discipline',
        title: 'sidebar.discipline.sequentialDiscipline',
        icon: <Circle size={12} />,
        navLink: '/sequential-discipline',
      },
      {
        id: 'disciplineCalculation',
        title: 'sidebar.marks.disciplineCalculation',
        icon: <Circle size={12} />,
        navLink: '/discipline-calculation',
      },
    ],
  },
]
