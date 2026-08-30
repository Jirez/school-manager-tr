import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { SiMicrosoftexcel } from 'react-icons/si'

import PageHeader from '@/@core/components/ui/page-header'
import Scrollbar from '@/@core/components/ui/scrollbar'
import StatsVertical from '@/@core/components/widgets/stats/StatsVertical'
import {
  ANNUAL_SCHOOL_BOOK_XLSX,
  PERSONNEL_XSSF,
  STUDENT_XSSF,
} from '@/utils/constants'
import { useTitle } from 'ahooks'

const DataExport = () => {
  const { t } = useTranslation()
  useTitle(t('sidebar.export'))

  return (
    <Scrollbar className="flex flex-col w-full">
      <div className="w-full">
        <PageHeader title={t('sidebar.export')} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Link to={ANNUAL_SCHOOL_BOOK_XLSX}>
          <StatsVertical
            icon={<SiMicrosoftexcel size={21} />}
            color="info"
            //stats='36.9k'
            title={t('label-annualSchoolBook')}
          />
        </Link>

        <Link to={PERSONNEL_XSSF}>
          <StatsVertical
            icon={<SiMicrosoftexcel size={21} />}
            color="danger"
            //stats='36.9k'
            title={t('label-personnelReport')}
          />
        </Link>
        <Link to={STUDENT_XSSF}>
          <StatsVertical
            icon={<SiMicrosoftexcel size={21} />}
            color="danger"
            //stats='36.9k'
            title={t('label-studentReport')}
          />
        </Link>
      </div>
    </Scrollbar>
  )
}

export default DataExport
