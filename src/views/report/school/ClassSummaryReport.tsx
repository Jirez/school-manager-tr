import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FileText } from 'lucide-react'

import { useAuthentication } from '@/hooks/useAuthentication'
import PageHeader from '@/@core/components/ui/page-header'
import PdfViewer from '@/utils/PdfViewer'
import ReportOptions from '@/views/report/ReportOptions'
import Select from '@/@core/components/select'
import { useSchoolSectionsQuery, useSchoolYearsQuery } from '@/gql/graphql'
import { PdfContainer, EmptyState } from '../report.style'

const ClassSummaryReport = () => {
  const [values, setValues] = useState<{ [key: string]: any }>({})
  const { enterpriseId } = useAuthentication()
  const { t } = useTranslation()

  const { data, loading } = useSchoolYearsQuery({
    variables: { id: enterpriseId },
    fetchPolicy: 'network-only',
  })

  const { data: dataSection, loading: loadingSection } = useSchoolSectionsQuery(
    {
      variables: { id: enterpriseId },
      fetchPolicy: 'network-only',
    },
  )

  const onSchoolYearFilterChange = (event: any) => {
    setValues((val) => ({ ...val, schoolYear: event }))
  }

  const onSectionFilterChange = (event: any) => {
    setValues((val) => ({ ...val, section: event }))
  }

  return (
    <div className="flex flex-col w-full">
      <div className="w-full">
        <PageHeader
          title={t('sidebar.reports.classSummary')}
          returnLink="/reports"
        />
      </div>
      <ReportOptions>
        <div className="flex flex-col md:flex-row gap-6">
          <Select
            onChange={onSchoolYearFilterChange}
            isLoading={loading}
            options={data?.schoolYears || undefined}
            getOptionLabel={(option: any) => option.label}
            getOptionValue={(option: any) => option.id}
            placeholder={t('label-selectSchoolYear')}
            className="react-select w-full md:w-4/12"
          />

          <Select
            onChange={onSectionFilterChange}
            isLoading={loadingSection}
            options={dataSection?.schoolSections || undefined}
            getOptionLabel={(option: any) => option.name}
            getOptionValue={(option: any) => option.id}
            placeholder={t('label-selectSection')}
            className="react-select w-full md:w-4/12"
          />
        </div>
      </ReportOptions>

      <PdfContainer>
        {values.schoolYear ? (
          <PdfViewer
            url={`reports/${enterpriseId}-class-summary-${
              values.schoolYear.id
            }.pdf?search=schoolYear:${values.schoolYear.id}${
              values.section ? ',section:' + values.section.id : ''
            }`}
          />
        ) : (
          <EmptyState>
            <FileText />
            <p>
              {t('label-selectSchoolYearToView') ||
                'Sélectionnez une année scolaire pour voir le rapport de synthèse des classes'}
            </p>
          </EmptyState>
        )}
      </PdfContainer>
    </div>
  )
}

export default ClassSummaryReport
