import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Input } from 'reactstrap'
import { useDebounce } from 'ahooks'

import { useAuthentication } from '@/hooks/useAuthentication'
import PdfViewer from '@/utils/PdfViewer'
import Select from '@/@core/components/select'
import PageHeader from '@/@core/components/ui/page-header'
import { useSchoolYearsQuery } from '@/gql/graphql'

const AnnualBestStudents = () => {
  const [values, setValues] = useState<{ [key: string]: any }>({
    minAverage: '12',
  })
  const debouncedAverage = useDebounce(values.minAverage, { wait: 1000 })

  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const { data } = useSchoolYearsQuery({
    variables: { id: enterpriseId },
    fetchPolicy: 'network-only',
  })

  const onPeriodFilterChange = (event: any) => {
    setValues({ ...values, schoolYear: event })
  }

  return (
    <div className="flex flex-col w-full">
      <div className="w-full">
        <PageHeader
          title={t('sidebar.reports.studentList')}
          returnLink="/reports"
        />
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <Select
          onChange={onPeriodFilterChange}
          options={data?.schoolYears || undefined}
          getOptionLabel={(option: any) => option.label}
          getOptionValue={(option: any) => option.id}
          placeholder="Sélectionner une année scolaire"
          className="w-full md:w-4/12"
        />

        {/* Limiter à  */}
        <Input
          onChange={(val) =>
            setValues({ ...values, minAverage: val.target.value })
          }
          value={values.minAverage}
          className="w-full md:w-4/12"
        />
      </div>
      <div className="w-full mt-2">
        {values.schoolYear && debouncedAverage && (
          <PdfViewer
            url={`reports/${enterpriseId}-best-${values.schoolYear.id}.pdf?minAverage=${debouncedAverage}&params=columnBorder:true,rowNumber:true,title:Liste des élèves ayant obtenu une moyenne >= ${debouncedAverage}`}
          />
        )}
      </div>
    </div>
  )
}

export default AnnualBestStudents
