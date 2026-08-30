import { useState } from 'react'

import Select from '@/@core/components/select'
import { useAuthentication } from '@/hooks/useAuthentication'
import PdfViewer from '@/utils/PdfViewer'
import { useTranslation } from 'react-i18next'
import ReportOptions from '../ReportOptions'
import PageHeader from '@/@core/components/ui/page-header'
import { useBranchesQuery, useSchoolYearsQuery } from '@/gql/graphql'

const AnnualSchoolBook = () => {
  const [values, setValues] = useState<{ [key: string]: any }>({
    //competence: false,
    //simplified: false,
    //printingDate: moment()
  })
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const { data, loading } = useBranchesQuery({
    variables: { id: enterpriseId },
    fetchPolicy: 'network-only',
  })

  const { data: dataSchoolYear, loading: loadingSchoolYear } =
    useSchoolYearsQuery({
      variables: { id: enterpriseId },
      fetchPolicy: 'network-only',
    })

  const onSchoolYearFilterChange = (event: any) => {
    setValues((val) => ({ ...val, schoolYear: event }))
  }

  const onBranchFilterChange = (event: any) => {
    setValues((val) => ({ ...val, branch: event }))
  }

  return (
    <div className="flex flex-col w-full">
      <div className="w-full">
        <PageHeader
          title={t('sidebar.reports.studentList')}
          returnLink="/reports"
        />
      </div>

      <ReportOptions>
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

          <Select
            onChange={onBranchFilterChange}
            options={data?.branches || undefined}
            getOptionLabel={(option: any) => option.name}
            getOptionValue={(option: any) => option.id}
            placeholder={t('label-selectBranch')}
            className="w-full md:w-4/12"
            isLoading={loading}
          />
        </div>
      </ReportOptions>
      <div className="w-full mt-2">
        {values.branch && values.schoolYear && (
          <PdfViewer
            url={`reports/annual-school-book-${enterpriseId}-${
              values.schoolYear.id
            }.pdf?search=schoolYear:${values.schoolYear.id}${
              values.branch ? `,branch:${values.branch.id}` : ''
            }&title=Livret scolaire de la série ${values.branch.name}`}
          />
        )}
      </div>
    </div>
  )
}

export default AnnualSchoolBook
