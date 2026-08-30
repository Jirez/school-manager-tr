import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FileText } from 'lucide-react'
import { useAuthentication } from '@/hooks/useAuthentication'
import PdfViewer from '@/utils/PdfViewer'
import PageHeader from '@/@core/components/ui/page-header'
import Select from '@/@core/components/select'
import { usePeriodsQuery } from '@/gql/graphql'
import ReportOptions from '../ReportOptions'
import { FilterSection, PdfContainer, EmptyState } from '../report.style'

const QuarterlyReportSummary = () => {
  const [values, setValues] = useState<{ [key: string]: any }>({})
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const { data, loading } = usePeriodsQuery({
    variables: { id: enterpriseId },
    fetchPolicy: 'network-only',
  })

  const onPeriodFilterChange = (event: any) => {
    setValues({ ...values, period: event })
  }

  return (
    <div className="flex flex-col w-full">
      <div className="w-full">
        <PageHeader
          title={t('label-quarterlyReportSummary')}
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
            placeholder={t('label-selectPeriod')}
            isLoading={loading}
          />
        </FilterSection>
      </ReportOptions>

      <PdfContainer>
        {values.period ? (
          <PdfViewer
            url={`reports/quarterly-report-summary-${enterpriseId}-${values.period.id}.pdf`}
          />
        ) : (
          <EmptyState>
            <FileText />
            <p>
              {t('label-selectPeriodToView') ||
                'Sélectionnez une période pour voir le résumé du rapport trimestriel'}
            </p>
          </EmptyState>
        )}
      </PdfContainer>
    </div>
  )
}

export default QuarterlyReportSummary
