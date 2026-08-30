import PageHeader from '@/@core/components/ui/page-header'
import Scrollbar from '@/@core/components/ui/scrollbar'
import StatsVertical from '@/@core/components/widgets/stats/StatsVertical'
import {
  ANNUAL_NOTE,
  ANNUAL_COMP_NOTE,
  QUARTERLY_NOTE,
} from '@/utils/constants'
import { useTitle } from 'ahooks'
import { Layers } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { Link } from '@tanstack/react-router'

const NoteCalculation = () => {
  const { t } = useTranslation()
  useTitle(t('sidebar.marks.noteCalculation'))

  return (
    <Scrollbar className="flex flex-col w-full">
      <div className="w-full">
        <PageHeader title={t('sidebar.marks.noteCalculation')} />
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-4/12">
          <Link to={QUARTERLY_NOTE}>
            <StatsVertical
              icon={<Layers size={21} />}
              color="info"
              //stats='36.9k'
              title={t('label-quarterlyNote')}
            />
          </Link>
        </div>

        <div className="w-full md:w-4/12">
          <Link to={ANNUAL_NOTE}>
            <StatsVertical
              icon={<Layers size={21} />}
              color="danger"
              //stats='36.9k'
              title={t('label-annualNote')}
            />
          </Link>
        </div>

        <div className="w-full md:w-4/12">
          <Link to={ANNUAL_COMP_NOTE}>
            <StatsVertical
              icon={<Layers size={21} />}
              color="danger"
              //stats='36.9k'
              title={t('label-annualCompNote')}
            />
          </Link>
        </div>
      </div>
    </Scrollbar>
  )
}

export default NoteCalculation
