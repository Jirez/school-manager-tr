import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useAuthentication } from '@/hooks/useAuthentication'
import Select from '@/@core/components/select'
import PdfViewer from '@/utils/PdfViewer'
import PageHeader from '@/@core/components/ui/page-header'
import { useSubPeriodsQuery } from '@/gql/graphql'
import ReportOptions from '../ReportOptions'
import { FilterSection } from '../report.style'

const InputProgress = () => {
  const [values, setValues] = useState<{ [key: string]: any }>({
    orientation: 'PORTRAIT',
  })
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const { data } = useSubPeriodsQuery({
    variables: { id: enterpriseId },
    fetchPolicy: 'network-only',
  })

  const onOrientationFilterChange = (event: any) => {
    setValues((val) => ({ ...val, orientation: event.value }))
  }

  const onSubPeriodFilterChange = (event: any) => {
    setValues((val) => ({ ...val, subPeriod: event }))
  }

  const orientationOptions = [
    { value: 'PORTRAIT', label: 'Portrait' },
    { value: 'LANDSCAPE', label: 'Paysage' },
  ]

  return (
    <div className="flex flex-col w-full">
      <div className="w-full">
        <PageHeader title={t('label-inputProgress')} returnLink="/reports" />
      </div>
      <ReportOptions>
        <FilterSection>
          <Select
            onChange={onSubPeriodFilterChange}
            options={data?.subPeriods || undefined}
            getOptionLabel={(option: any) => option.label}
            getOptionValue={(option: any) => option.id}
            placeholder="Sélectionner une sous-période"
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
        {values.orientation && values.subPeriod && (
          <PdfViewer
            url={`reports/${enterpriseId}-${values.subPeriod.id}-input-progress.pdf?orientation=${values.orientation}`}
          />
        )}
      </div>
    </div>
  )
}

export default InputProgress
