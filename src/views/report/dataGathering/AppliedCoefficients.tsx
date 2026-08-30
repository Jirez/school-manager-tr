import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useAuthentication } from '@/hooks/useAuthentication'
import PdfViewer from '@/utils/PdfViewer'
import Select from '@/@core/components/select'
import PageHeader from '@/@core/components/ui/page-header'
import { useSchoolYearsQuery } from '@/gql/graphql'

const AppliedCoefficients = () => {
  const [values, setValues] = useState<{ [key: string]: any }>({})
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const { data, loading } = useSchoolYearsQuery({
    variables: { id: enterpriseId },
    fetchPolicy: 'network-only',
  })

  const onSchoolYearFilterChange = (event: any) => {
    setValues((val) => ({ ...val, schoolYear: event }))
  }

  return (
    <div className="flex flex-col w-full">
      <div className="w-full">
        <PageHeader
          title={t('label-appliedCoefficients')}
          returnLink="/reports"
        />
      </div>
      <div className="w-full">
        <Select
          onChange={onSchoolYearFilterChange}
          options={data?.schoolYears || undefined}
          getOptionLabel={(option: any) => option.label}
          getOptionValue={(option: any) => option.id}
          placeholder={t('label-selectSchoolYear')}
          isLoading={loading}
        />
      </div>
      <div className="w-full mt-2">
        {values.schoolYear && (
          <PdfViewer
            url={`reports/applied-coefficients-${enterpriseId}.pdf?search=schoolYear:${values.schoolYear.id}`}
          />
        )}
      </div>
    </div>
  )
}

export default AppliedCoefficients
