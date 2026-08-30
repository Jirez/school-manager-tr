import PageHeader from '@/@core/components/ui/page-header'
import Scrollbar from '@/@core/components/ui/scrollbar'
import StatsVertical from '@/@core/components/widgets/stats/StatsVertical'
import {
  ANNUAL_AVERAGE,
  ANNUAL_COMP_AVERAGE,
  QUARTERLY_AVERAGE,
  SEQUENTIAL_AVERAGE,
} from '@/utils/constants'
import { useTitle } from 'ahooks'
import { Layers } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { Link } from '@tanstack/react-router'

const AverageCalculation = () => {
  const { t } = useTranslation()
  useTitle(t('sidebar.marks.averageCalculation'))

  return (
    <Scrollbar className="flex flex-col w-full">
      <div className="w-full">
        <PageHeader title={t('sidebar.marks.averageCalculation')} />
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-4/12">
          <Link to={SEQUENTIAL_AVERAGE}>
            <StatsVertical
              icon={<Layers size={21} />}
              color="info"
              //stats='36.9k'
              title={t('label-sequentialAverage')}
            />
          </Link>
        </div>

        <div className="w-full md:w-4/12">
          <Link to={QUARTERLY_AVERAGE}>
            <StatsVertical
              icon={<Layers size={21} />}
              color="primary"
              //stats='36.9k'
              title={t('label-quarterlyAverage')}
            />
          </Link>
        </div>

        <div className="w-full md:w-4/12">
          <Link to={ANNUAL_AVERAGE}>
            <StatsVertical
              icon={<Layers size={21} />}
              color="danger"
              //stats='36.9k'
              title={t('label-annualAverage')}
            />
          </Link>
        </div>

        <div className="w-full md:w-4/12">
          <Link to={ANNUAL_COMP_AVERAGE}>
            <StatsVertical
              icon={<Layers size={21} />}
              color="danger"
              //stats='36.9k'
              title={t('label-annualCompAverage')}
            />
          </Link>
        </div>
      </div>
    </Scrollbar>
  )
}

export default AverageCalculation
