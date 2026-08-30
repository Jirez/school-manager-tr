import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FileText } from 'lucide-react'

import { useAuthentication } from '@/hooks/useAuthentication'
import Select from '@/@core/components/select'
import PdfViewer from '@/utils/PdfViewer'
import PageHeader from '@/@core/components/ui/page-header'
import {
  useClassesWithPeriodReportCardQuery,
  usePeriodsQuery,
} from '@/gql/graphql'
import ReportOptions from '../ReportOptions'
import { FilterSection, PdfContainer, EmptyState } from '../report.style'

const QuarterlyNoteBook = () => {
  const [values, setValues] = useState<{ [key: string]: any }>({})
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const { data, loading } = useClassesWithPeriodReportCardQuery({
    variables: {
      period: values.period ? (Number(values.period.id) as any) : null,
    },
    skip: !values.period,
    fetchPolicy: 'network-only',
  })

  const { data: dataPeriod, loading: loadingPeriod } = usePeriodsQuery({
    variables: { id: enterpriseId },
    fetchPolicy: 'network-only',
  })

  const onClassFilterChange = (event: any) => {
    setValues((val) => ({ ...val, clazz: event }))
  }

  const onPeriodFilterChange = (event: any) => {
    setValues((val) => ({ ...val, period: event }))
  }

  return (
    <div className="flex flex-col w-full">
      <div className="w-full">
        <PageHeader
          title={t('label-quarterlyNoteBook')}
          returnLink="/reports"
        />
      </div>
      <ReportOptions>
        <FilterSection>
          <Select
            onChange={onPeriodFilterChange}
            options={dataPeriod?.periods || undefined}
            getOptionLabel={(option: any) => option.label}
            getOptionValue={(option: any) => option.id}
            placeholder={t('label-selectPeriod')}
            isLoading={loadingPeriod}
          />

          {values.period && (
            <Select
              onChange={onClassFilterChange}
              options={data?.classes || undefined}
              getOptionLabel={(option: any) => option.name}
              getOptionValue={(option: any) => option.id}
              placeholder={t('label-selectClass')}
              isLoading={loading}
            />
          )}
        </FilterSection>
      </ReportOptions>
      <PdfContainer>
        {values.clazz && values.period ? (
          <PdfViewer
            url={`reports/quarterly-note-book-${enterpriseId}-${values.clazz.id}-${values.period.id}.pdf`}
          />
        ) : (
          <EmptyState>
            <FileText />
            <p>
              {t('label-selectPeriodAndClassToView') ||
                'Sélectionnez une période et une classe pour voir le cahier de notes trimestriel'}
            </p>
          </EmptyState>
        )}
      </PdfContainer>
    </div>
  )
}

export default QuarterlyNoteBook
