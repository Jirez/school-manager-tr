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
import { useTitle } from 'ahooks'
import { useAbility } from '@/context/Can'
import Loader from '#/@core/components/spinner/loader'

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
        <Link
          to={FREQUENTS}
          className="md:row-span-2"
          hidden={!ability.can('read', 'student')}
        >
          <StatsVertical
            icon={<GraduationCap size={21} />}
            color="info"
            stats={dashboard?.students as any}
            title={t('label-students')}
            className="shadow-md"
          />
        </Link>
        <Link
          to={PERSONNEL}
          className="col-span-1"
          hidden={!ability.can('read', 'teacher')}
        >
          <StatsVertical
            icon={<UserCog size={21} />}
            color="warning"
            stats={dashboard?.personnel as any}
            title={t('label-personnel')}
          />
        </Link>

        <Link
          to={USERS}
          className="col-span-1"
          hidden={!ability.can('read', 'user')}
        >
          <StatsVertical
            icon={<Shield size={21} />}
            color="danger"
            stats={dashboard?.users as any}
            title={t('label-users')}
          />
        </Link>

        <Link
          to={SCHOOL_SECTIONS}
          className="col-span-1"
          hidden={!ability.can('read', 'config')}
        >
          <StatsVertical
            icon={<BookOpen size={21} />}
            color="primary"
            stats={dashboard?.sections as any}
            title={t('label-section')}
          />
        </Link>

        <Link
          to={CYCLES}
          className="col-span-1"
          hidden={!ability.can('read', 'config')}
        >
          <StatsVertical
            icon={<Repeat size={21} />}
            color="info"
            stats={dashboard?.cycles as any}
            title={t('label-cycles')}
          />
        </Link>

        <Link
          to={LEVELS}
          className="col-span-1"
          hidden={!ability.can('read', 'config')}
        >
          <StatsVertical
            icon={<Layers size={21} />}
            color="warning"
            stats={dashboard?.levels as any}
            title={t('label-levels')}
          />
        </Link>

        <Link
          to={CLASSES}
          className="col-span-1"
          hidden={!ability.can('read', 'config')}
        >
          <StatsVertical
            icon={<Monitor size={21} />}
            color="success"
            stats={dashboard?.classes as any}
            title={t('label-classes')}
          />
        </Link>

        <Link
          to={SEQUENTIAL_NOTES}
          className="col-span-1"
          hidden={!ability.can('read', 'note')}
        >
          <StatsVertical
            icon={<Notebook size={21} />}
            color="info"
            stats={''}
            title={t('label-notes')}
          />
        </Link>

        <Link
          to={OPERATIONS}
          className="col-span-1"
          hidden={!ability.can('read', 'payment')}
        >
          <StatsVertical
            icon={<CreditCard size={21} />}
            color="danger"
            stats={''}
            title={t('label-payments')}
          />
        </Link>

        <Link
          to={REPORTS}
          className="col-span-1"
          hidden={!ability.can('read', 'report')}
        >
          <StatsVertical
            icon={<FileText size={21} />}
            color="success"
            stats={''}
            title={t('label-reports')}
          />
        </Link>

        <Link
          to={CONFIGURATION}
          className="col-span-1"
          hidden={!ability.can('read', 'config')}
        >
          <StatsVertical
            icon={<Settings size={21} />}
            color="warning"
            stats={''}
            title={t('label-configuration')}
          />
        </Link>
      </div>

      <div className="mt-2">
        <DashboardChart dashboard={dashboard as any} />
      </div>
    </div>
  )
}

export default Dashboard
