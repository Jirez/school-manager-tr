import { useState } from 'react'

import { useAuthentication } from '@/hooks/useAuthentication'
import { useTranslation } from 'react-i18next'
import PageHeader from '@/@core/components/ui/page-header'
import PdfViewer from '@/utils/PdfViewer'
import Select from '@/@core/components/select'
import { buildOptions } from '@/utils/helpers'
import { useClassesQuery } from '@/gql/graphql'

const SequentialDiscipline = () => {
  const [values, setValues] = useState<{ [key: string]: any }>({})
  const { enterpriseId } = useAuthentication()
  const { t } = useTranslation()

  const { data, loading } = useClassesQuery({
    variables: { id: enterpriseId },
    fetchPolicy: 'network-only',
  })

  const onClassFilterChange = (event: any) => {
    setValues((val) => ({ ...val, clazz: event }))
  }

  return (
    <div className="flex flex-col w-full">
      <div className="w-full">
        <PageHeader title={t('label-annualMarkSheet')} returnLink="/reports" />
      </div>
      <div className="w-full">
        <Select
          onChange={onClassFilterChange}
          options={data?.clazzes || undefined}
          getOptionLabel={(option: any) => option.name}
          getOptionValue={(option: any) => option.id}
          placeholder={t('label-selectClass')}
          isMulti
          isLoading={loading}
        />
      </div>

      <div className="w-full mt-2">
        {values.clazz && (
          <PdfViewer
            url={`reports/sequential-discipline-${enterpriseId}.pdf?search=clazz:${buildOptions(
              values.clazz,
            )}`}
          />
        )}
      </div>
    </div>
  )
}

export default SequentialDiscipline
