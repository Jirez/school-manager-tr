import PageHeader from '@/@core/components/ui/page-header'
import Scrollbar from '@/@core/components/ui/scrollbar'
import StatsVertical from '@/@core/components/widgets/stats/StatsVertical'
import { ANNUAL_DISCIPLINE, QUARTERLY_DISCIPLINE } from '@/utils/constants'
import { useTitle } from 'ahooks'
import { Award, Calendar } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { m } from '@/paraglide/messages'

const DisciplineCalculation = () => {
  useTitle(m['sidebar.marks.disciplineCalculation']())

  return (
    <Scrollbar className="flex flex-col w-full">
      <div className="w-full">
        <PageHeader title={m['sidebar.marks.disciplineCalculation']()} />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
        <Link to={QUARTERLY_DISCIPLINE} className="h-full">
          <StatsVertical
            icon={<Calendar size={21} />}
            color="info"
            title={m['label_quarterlyDiscipline']()}
          />
        </Link>

        <Link to={ANNUAL_DISCIPLINE} className="h-full">
          <StatsVertical
            icon={<Award size={21} />}
            color="danger"
            title={m['label_annualDiscipline']()}
          />
        </Link>
      </div>
    </Scrollbar>
  )
}

export default DisciplineCalculation
