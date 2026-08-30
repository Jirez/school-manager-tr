// ** Icons Import
import { Circle } from 'react-feather'
import { School } from 'lucide-react'
import { GUIDED_SETUP, SCHOOL } from '@/utils/constants'
import NavIcon from './NavIcon'

// ** Roles Allowed : ROLE_SUPER_ADMIN, ROLE_AMIN
export default [
  {
    id: 'schoolHome',
    title: 'sidebar.school',
    icon: <NavIcon icon={<School size={14} />} color="#00cfe8" />,
    meta: {
      resource: 'config',
    },
    children: [
      {
        id: 'guidedSetup',
        title: 'label-guidedSetup',
        icon: <Circle size={12} />,
        navLink: GUIDED_SETUP,
      },
      {
        id: 'school',
        title: 'sidebar.school',
        icon: <Circle size={12} />,
        navLink: SCHOOL,
      },
      {
        id: 'schoolYears',
        title: 'sidebar.school.schoolYears',
        icon: <Circle size={12} />,
        navLink: '/school-years',
      },
      {
        id: 'schoolLiable',
        title: 'sidebar.school.liable',
        icon: <Circle size={12} />,
        navLink: '/school-liable',
      },
      {
        id: 'cycles',
        title: 'sidebar.school.cycles',
        icon: <Circle size={12} />,
        navLink: '/cycles',
      },
      {
        id: 'levels',
        title: 'sidebar.school.levels',
        icon: <Circle size={12} />,
        navLink: '/levels',
      },
      {
        id: 'branches',
        title: 'sidebar.school.branches',
        icon: <Circle size={12} />,
        navLink: '/branches',
      },
      {
        id: 'classes',
        title: 'sidebar.school.classes',
        icon: <Circle size={12} />,
        navLink: '/classes',
      },
      {
        id: 'periods',
        title: 'sidebar.school.periods',
        icon: <Circle size={12} />,
        navLink: '/periods',
      },
      {
        id: 'subPeriods',
        title: 'sidebar.school.subPeriods',
        icon: <Circle size={12} />,
        navLink: '/sub-periods',
      },
      {
        id: 'copyOfParameters',
        title: 'sidebar.school.cloneConfig',
        icon: <Circle size={12} />,
        navLink: '/copyOfParameters',
      },
    ],
  },
]
