import { useTranslation } from 'react-i18next'
import {
  School,
  Calendar,
  GraduationCap,
  UserCog,
  Shield,
  BookOpen,
  Repeat,
  Layers,
  Monitor,
  Notebook,
  CreditCard,
  FileText,
  Settings,
} from 'lucide-react'
import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'

import { useAuthentication } from '@/hooks/useAuthentication'
import { Content } from './tour'
import DashboardChart from './DashboardChart'
import ErrorComponent from '@/@core/components/ui/error-component'
import StatsVertical from '@/@core/components/widgets/stats/StatsVertical'
import {
  CLASSES,
  CLASS_DISTRIBUTION,
  CONFIGURATION,
  CYCLES,
  FREQUENTS,
  LEVELS,
  OPERATIONS,
  PERSONNEL,
  REPORTS,
  SCHOOL,
  SCHOOL_SECTIONS,
  SEQUENTIAL_NOTES,
  USERS,
} from '@/utils/constants'
import { useDashboardQuery } from '@/gql/graphql'
import type { DashboardQuery } from '@/gql/graphql'
import { useTitle } from 'ahooks'
import { useAbility } from '@/context/Can'
import Loader from '#/@core/components/spinner/loader'

type DashboardMetric = keyof NonNullable<DashboardQuery['dashboard']>
type DashboardSubject =
  'student' | 'teacher' | 'user' | 'config' | 'note' | 'payment' | 'report'

const dashboardCards = [
  {
    to: FREQUENTS,
    icon: <GraduationCap size={21} />,
    color: 'info',
    title: 'label-students',
    metric: 'students',
    subject: 'student',
    className: 'md:row-span-2',
  },
  {
    to: PERSONNEL,
    icon: <UserCog size={21} />,
    color: 'warning',
    title: 'label-personnel',
    metric: 'personnel',
    subject: 'teacher',
    className: 'col-span-1',
  },
  {
    to: USERS,
    icon: <Shield size={21} />,
    color: 'danger',
    title: 'label-users',
    metric: 'users',
    subject: 'user',
    className: 'col-span-1',
  },
  {
    to: SCHOOL_SECTIONS,
    icon: <BookOpen size={21} />,
    color: 'primary',
    title: 'label-section',
    metric: 'sections',
    subject: 'config',
    className: 'col-span-1',
  },
  {
    to: CYCLES,
    icon: <Repeat size={21} />,
    color: 'info',
    title: 'label-cycles',
    metric: 'cycles',
    subject: 'config',
    className: 'col-span-1',
  },
  {
    to: LEVELS,
    icon: <Layers size={21} />,
    color: 'warning',
    title: 'label-levels',
    metric: 'levels',
    subject: 'config',
    className: 'col-span-1',
  },
  {
    to: CLASSES,
    icon: <Monitor size={21} />,
    color: 'success',
    title: 'label-classes',
    metric: 'classes',
    subject: 'config',
    className: 'col-span-1',
  },
  {
    to: SEQUENTIAL_NOTES,
    icon: <Notebook size={21} />,
    color: 'info',
    title: 'label-notes',
    stats: '',
    subject: 'note',
    className: 'col-span-1',
  },
  {
    to: OPERATIONS,
    icon: <CreditCard size={21} />,
    color: 'danger',
    title: 'label-payments',
    stats: '',
    subject: 'payment',
    className: 'col-span-1',
  },
  {
    to: REPORTS,
    icon: <FileText size={21} />,
    color: 'success',
    title: 'label-reports',
    stats: '',
    subject: 'report',
    className: 'col-span-1',
  },
  {
    to: CONFIGURATION,
    icon: <Settings size={21} />,
    color: 'warning',
    title: 'label-configuration',
    stats: '',
    subject: 'config',
    className: 'col-span-1',
  },
] satisfies {
  to: string
  icon: ReactNode
  color: string
  title: string
  metric?: DashboardMetric
  stats?: string
  subject: DashboardSubject
  className: string
}[]

const Dashboard = () => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()
  const ability = useAbility()
  // const steps = useSteps();
  useTitle(t('label-dashboard'))

  const { data, loading, error } = useDashboardQuery({
    variables: { id: enterpriseId },
    pollInterval: 300 * 1000,
  })

  if (loading) return <Loader />

  if (error)
    return (
      <div className="flex flex-row items-center">
        <ErrorComponent title={'Erreur'} message={error.message} />
      </div>
    )

  const { dashboard } = data!

  return (
    <div className="flex flex-col w-full text-sm">
      <div className="flex flex-col md:flex-row md:gap-1">
        <div className="w-full md:w-4/12">
          <Content />
        </div>

        <div className="w-full md:w-4/12 md:mb-[25px]">
          <Link to={SCHOOL}>
            <StatsVertical
              icon={<School size={21} />}
              color="info"
              stats="1"
              title={t('label-school')}
              // className="shadow-md"
            />
          </Link>
        </div>

        <div className="w-full md:w-4/12 md:mb-[25px]">
          <Link to={CLASS_DISTRIBUTION}>
            <StatsVertical
              icon={<Calendar size={21} />}
              color="success"
              stats=""
              title={t('Planning')}
              // className="shadow-md"
            />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-[0.25rem] text-sm">
        {dashboardCards.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className={card.className}
            hidden={!ability.can('read', card.subject)}
          >
            <StatsVertical
              icon={card.icon}
              color={card.color}
              stats={card.metric ? dashboard?.[card.metric] : card.stats}
              title={t(card.title)}
              className={card.to === FREQUENTS ? 'shadow-md' : undefined}
            />
          </Link>
        ))}
      </div>

      <div className="mt-2">
        <DashboardChart dashboard={dashboard} />
      </div>
    </div>
  )
}

export default Dashboard
