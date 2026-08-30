import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useAuthentication } from '@/hooks/useAuthentication'
import Select from '@/@core/components/select'
import PdfViewer from '@/utils/PdfViewer'
import PageHeader from '@/@core/components/ui/page-header'
import { usePeriodsQuery } from '@/gql/graphql'
import ReportOptions from '../ReportOptions'
import { FilterSection } from '../report.style'

const CompetenceInputProgress = () => {
  const [values, setValues] = useState<{ [key: string]: any }>({
    orientation: 'PORTRAIT',
  })
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const { data } = usePeriodsQuery({
    variables: { id: enterpriseId },
    fetchPolicy: 'network-only',
  })

  const onOrientationFilterChange = (event: any) => {
    setValues((val) => ({ ...val, orientation: event.value }))
  }

  const onPeriodFilterChange = (event: any) => {
    setValues((val) => ({ ...val, period: event }))
  }

  const orientationOptions = [
    { value: 'PORTRAIT', label: 'Portrait' },
    { value: 'LANDSCAPE', label: 'Paysage' },
  ]

  return (
    <div className="flex flex-col w-full">
      <div className="w-full">
        <PageHeader
          title={t('label-competenceInputProgress')}
          returnLink="/reports"
        />
      </div>
      <ReportOptions>
        <FilterSection>
          <Select
            onChange={onPeriodFilterChange}
            options={data?.periods || undefined}
            getOptionLabel={(option: any) => option.label}
            getOptionValue={(option: any) => option.id}
            placeholder="Sélectionner une période"
          />

          <Select
            onChange={onOrientationFilterChange}
            options={orientationOptions}
            getOptionLabel={(option: any) => option.label}
            getOptionValue={(option: any) => option.value}
            placeholder="Sélectionner une orientation"
            value={orientationOptions.find(
              (opt) => opt.value === values.orientation,
            )}
          />
        </FilterSection>
      </ReportOptions>
      <div className="w-full mt-2">
        {values.orientation && values.period && (
          <PdfViewer
            url={`reports/${enterpriseId}-${values.period.id}-competence-input-progress.pdf?orientation=${values.orientation}`}
          />
        )}
      </div>
    </div>
  )
}

export default CompetenceInputProgress
