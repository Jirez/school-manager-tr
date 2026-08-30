import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthentication } from '@/hooks/useAuthentication'
import PdfViewer from '@/utils/PdfViewer'
import PageHeader from '@/@core/components/ui/page-header'
import Select from '@/@core/components/select'
import { useClassesQuery, useSubPeriodsQuery } from '@/gql/graphql'

const BlackNoteBook = () => {
  const [values, setValues] = useState<{ [key: string]: any }>({})
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const { data, loading } = useClassesQuery({
    variables: { id: enterpriseId },
    fetchPolicy: 'network-only',
  })

  const { data: dataSubPeriod, loading: loadingSubPeriod } = useSubPeriodsQuery(
    {
      variables: { id: enterpriseId },
      fetchPolicy: 'network-only',
    },
  )

  const onClassFilterChange = (event: any) => {
    setValues((val) => ({ ...val, clazz: event }))
  }

  const onSubPeriodFilterChange = (event: any) => {
    setValues((val) => ({ ...val, subPeriod: event }))
  }

  return (
    <div className="flex flex-col w-full">
      <div className="w-full">
        <PageHeader
          title={t('sidebar.reports.studentList')}
          returnLink="/reports"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <Select
          onChange={onClassFilterChange}
          options={data?.clazzes || undefined}
          getOptionLabel={(option: any) => option.name}
          getOptionValue={(option: any) => option.id}
          placeholder={t('label-selectClass')}
          className="w-full md:w-4/12"
          isLoading={loading}
        />

        <Select
          onChange={onSubPeriodFilterChange}
          options={dataSubPeriod?.subPeriods || undefined}
          getOptionLabel={(option: any) => option.label}
          getOptionValue={(option: any) => option.id}
          placeholder={t('label-selectSubPeriod')}
          className="w-full md:w-4/12"
          isLoading={loadingSubPeriod}
        />
      </div>

      <div className="w-full mt-2">
        {values.clazz && values.subPeriod && (
          <PdfViewer
            url={`reports/${enterpriseId}-${values.subPeriod.id}-blank-note-book.pdf?search=clazz:${values.clazz.id}`}
          />
        )}
      </div>
    </div>
  )
}

export default BlackNoteBook
