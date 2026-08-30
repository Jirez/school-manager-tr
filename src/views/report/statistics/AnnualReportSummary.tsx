import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthentication } from '@/hooks/useAuthentication'
import Select from '@/@core/components/select'
import PdfViewer from '@/utils/PdfViewer'
import PageHeader from '@/@core/components/ui/page-header'
import { useSchoolYearsQuery } from '@/gql/graphql'

const AnnualReportSummary = () => {
  const [values, setValues] = useState<{ [key: string]: any }>({})
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
          title={t('label-annualReportSummary')}
          returnLink="/reports"
        />
      </div>
      <div className="w-full">
        <Select
          onChange={onPeriodFilterChange}
          options={data?.schoolYears || undefined}
          getOptionLabel={(option: any) => option.label}
          getOptionValue={(option: any) => option.id}
          placeholder="Sélectionner une année scolaire"
        />
      </div>
      <div className="w-full mt-2">
        {values.schoolYear && (
          <PdfViewer
            url={`reports/annual-report-summary-${enterpriseId}-${values.schoolYear.id}.pdf`}
          />
        )}
      </div>
    </div>
  )
}

export default AnnualReportSummary
