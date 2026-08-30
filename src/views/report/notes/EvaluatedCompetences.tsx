import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useAuthentication } from '@/hooks/useAuthentication'
import Select from '@/@core/components/select'
import PdfViewer from '@/utils/PdfViewer'
import PageHeader from '@/@core/components/ui/page-header'
import { usePeriodsQuery } from '@/gql/graphql'

const EvaluatedCompetences = () => {
  const [values, setValues] = useState<{ [key: string]: any }>({
    orientation: 'PORTRAIT',
  })
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const { data } = usePeriodsQuery({
    variables: { id: enterpriseId },
    fetchPolicy: 'network-only',
  })

  const onPeriodFilterChange = (event: any) => {
    setValues((val) => ({ ...val, period: event }))
  }

  return (
    <div className="flex flex-col w-full">
      <div className="w-full">
        <PageHeader
          title={t('sidebar.reports.evaluatedCompetences')}
          returnLink="/reports"
        />
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <Select
          onChange={onPeriodFilterChange}
          options={data?.periods || undefined}
          getOptionLabel={(option: any) => option.label}
          getOptionValue={(option: any) => option.id}
          placeholder="Sélectionner une période"
          className="w-full md:w-4/12"
        />
      </div>
      <div className="w-full mt-2">
        {values.period && (
          <PdfViewer
            url={`reports/eval-comp-${enterpriseId}-${values.period.id}.pdf`}
          />
        )}
      </div>
    </div>
  )
}

export default EvaluatedCompetences
