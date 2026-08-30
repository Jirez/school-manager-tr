import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FileText } from 'lucide-react'

import { useAuthentication } from '@/hooks/useAuthentication'
import PdfViewer from '@/utils/PdfViewer'
import Select from '@/@core/components/select'
import PageHeader from '@/@core/components/ui/page-header'
import {
  useClassesWithAnnualReportCardQuery,
  useSchoolYearsQuery,
} from '@/gql/graphql'
import { PdfContainer, EmptyState } from '../report.style'

const AnnualNoteBook = () => {
  const [values, setValues] = useState<{ [key: string]: any }>({})
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const { data, loading } = useClassesWithAnnualReportCardQuery({
    variables: {
      schoolYear: values.schoolYear
        ? (Number(values.schoolYear.id) as any)
        : null,
    },
    skip: !values.schoolYear,
    fetchPolicy: 'network-only',
  })

  const { data: dataSchoolYear, loading: loadingSchoolYear } =
    useSchoolYearsQuery({
      variables: { id: enterpriseId },
      fetchPolicy: 'network-only',
    })

  const onClassFilterChange = (event: any) => {
    setValues((val) => ({ ...val, clazz: event }))
  }

  const onSchoolYearFilterChange = (event: any) => {
    setValues((val) => ({ ...val, schoolYear: event }))
  }

  return (
    <div className="flex flex-col w-full">
      <div className="w-full">
        <PageHeader title={t('label-annualNoteBook')} returnLink="/reports" />
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <Select
          onChange={onSchoolYearFilterChange}
          options={dataSchoolYear?.schoolYears || undefined}
          getOptionLabel={(option: any) => option.label}
          getOptionValue={(option: any) => option.id}
          placeholder={t('label-selectSchoolYear')}
          className="w-full md:w-4/12"
          isLoading={loadingSchoolYear}
        />

        {values.schoolYear && (
          <Select
            onChange={onClassFilterChange}
            options={data?.classes || undefined}
            getOptionLabel={(option: any) => option.name}
            getOptionValue={(option: any) => option.id}
            placeholder={t('label-selectClass')}
            className="w-full md:w-4/12"
            isLoading={loading}
          />
        )}
      </div>
      <PdfContainer>
        {values.clazz && values.schoolYear ? (
          <PdfViewer
            url={`reports/annual-note-book-${enterpriseId}-${values.clazz.id}-${values.schoolYear.id}.pdf`}
          />
        ) : (
          <EmptyState>
            <FileText />
            <p>
              {t('label-selectSchoolYearAndClassToView') ||
                'Sélectionnez une année scolaire et une classe pour voir le cahier de notes annuel'}
            </p>
          </EmptyState>
        )}
      </PdfContainer>
    </div>
  )
}

export default AnnualNoteBook
