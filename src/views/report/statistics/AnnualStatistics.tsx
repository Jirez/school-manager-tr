import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthentication } from '@/hooks/useAuthentication'
import PdfViewer from '@/utils/PdfViewer'
import Select from '@/@core/components/select'
import PageHeader from '@/@core/components/ui/page-header'
import { useSchoolSectionsQuery, useSchoolYearsQuery } from '@/gql/graphql'

const AnnualStatistics = () => {
  const [values, setValues] = useState<{ [key: string]: any }>({
    minAverage: '12',
  })
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

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
    setValues({ ...values, schoolYear: event })
  }

  const onSectionFilterChange = (event: any) => {
    setValues({ ...values, section: event })
  }

  return (
    <div className="flex flex-col w-full">
      <div className="w-full">
        <PageHeader title={t('label-annualStatistics')} returnLink="/reports" />
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <Select
          onChange={onSchoolYearFilterChange}
          options={data?.schoolYears || undefined}
          getOptionLabel={(option: any) => option.label}
          getOptionValue={(option: any) => option.id}
          placeholder="Sélectionner une année scolaire"
          className="w-full md:w-4/12"
        />

        <Select
          onChange={onSectionFilterChange}
          options={dataSection?.schoolSections || undefined}
          getOptionLabel={(option: any) => option.name}
          getOptionValue={(option: any) => option.id}
          placeholder="Sélectionner une section"
          className="w-full md:w-4/12"
        />
      </div>
      <div className="w-full mt-2">
        {values.schoolYear && (
          <PdfViewer
            url={`reports/${enterpriseId}-annual-statistics.pdf?search=schoolYear:${
              values.schoolYear.id
            }${values.section ? ',section:' + values.section.id : ''}`}
          />
        )}
      </div>
    </div>
  )
}

export default AnnualStatistics
