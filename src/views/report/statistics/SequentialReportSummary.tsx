import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthentication } from '@/hooks/useAuthentication'
import PdfViewer from '@/utils/PdfViewer'
import Select from '@/@core/components/select'
import PageHeader from '@/@core/components/ui/page-header'
import { useSubPeriodsQuery } from '@/gql/graphql'

const SequentialReportSummary = () => {
  const [values, setValues] = useState<{ [key: string]: any }>({})
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const { data } = useSubPeriodsQuery({
    variables: { id: enterpriseId },
    fetchPolicy: 'network-only',
  })

  const onSubPeriodFilterChange = (event: any) => {
    setValues({ ...values, subPeriod: event })
  }

  return (
    <div className="flex flex-col w-full">
      <div className="w-full">
        <PageHeader
          title={t('label-sequentialReportSummary')}
          returnLink="/reports"
        />
      </div>
      <div className="w-full">
        <Select
          onChange={onSubPeriodFilterChange}
          options={data?.subPeriods || undefined}
          getOptionLabel={(option: any) => option.label}
          getOptionValue={(option: any) => option.id}
          placeholder="Sélectionner une sous-période"
        />
      </div>
      <div className="w-full mt-2">
        {values.subPeriod && (
          <PdfViewer
            url={`reports/sequential-report-summary-${enterpriseId}-${values.subPeriod.id}.pdf`}
          />
        )}
      </div>
    </div>
  )
}

export default SequentialReportSummary
