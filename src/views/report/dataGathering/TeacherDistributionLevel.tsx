import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useAuthentication } from '@/hooks/useAuthentication'
import PageHeader from '@/@core/components/ui/page-header'
import Select from '@/@core/components/select'
import PdfViewer from '@/utils/PdfViewer'
import { useLevelsQuery } from '@/gql/graphql'

const TeacherDistributionLevel = () => {
  const [values, setValues] = useState<{ [key: string]: any }>({})
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const { data, loading } = useLevelsQuery({
    variables: { id: enterpriseId },
    fetchPolicy: 'network-only',
  })

  const onLevelFilterChange = (event: any) => {
    setValues((val) => ({ ...val, level: event }))
  }

  return (
    <div className="flex flex-col w-full">
      <div className="w-full">
        <PageHeader
          title={t('label-teachersDistribution')}
          returnLink="/reports"
        />
      </div>
      <div className="w-full">
        <Select
          onChange={onLevelFilterChange}
          options={data?.levels || undefined}
          getOptionLabel={(option: any) => option.name}
          getOptionValue={(option: any) => option.id}
          placeholder={t('label-selectLevel')}
          isLoading={loading}
        />
      </div>

      <div className="w-full mt-2">
        {values.level && (
          <PdfViewer
            url={`reports/teacher-distribution-level-${enterpriseId}.pdf?search=level:${values.level.id}`}
          />
        )}
      </div>
    </div>
  )
}

export default TeacherDistributionLevel
