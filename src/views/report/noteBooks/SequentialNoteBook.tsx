import { useState } from 'react'
import { useAuthentication } from '@/hooks/useAuthentication'
import { useTranslation } from 'react-i18next'
import PageHeader from '@/@core/components/ui/page-header'
import Select from '@/@core/components/select'
import PdfViewer from '@/utils/PdfViewer'
import {
  useClassesWithSubPeriodReportCardQuery,
  useSubPeriodsQuery,
} from '@/gql/graphql'

const SequentialNoteBook = () => {
  const [values, setValues] = useState<{ [key: string]: any }>({})
  const { enterpriseId } = useAuthentication()
  const { t } = useTranslation()

  const { data, loading } = useClassesWithSubPeriodReportCardQuery({
    variables: {
      subPeriod: values.subPeriod ? (Number(values.subPeriod.id) as any) : null,
    },
    skip: !values.subPeriod,
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
          title={t('label-sequentialNoteBook')}
          returnLink="/reports"
        />
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <Select
          onChange={onSubPeriodFilterChange}
          options={dataSubPeriod?.subPeriods || undefined}
          getOptionLabel={(option: any) => option.label}
          getOptionValue={(option: any) => option.id}
          placeholder={t('label-selectSubPeriod')}
          className="w-full md:w-4/12"
          isLoading={loadingSubPeriod}
        />
        {values.subPeriod && (
          <Select
            onChange={onClassFilterChange}
            options={data && data.classes ? data.classes : undefined}
            getOptionLabel={(option: any) => option.name}
            getOptionValue={(option: any) => option.id}
            placeholder={t('label-selectClass')}
            className="w-full md:w-4/12"
            isLoading={loading}
          />
        )}
      </div>
      <div className="w-full mt-2">
        {values.clazz && values.subPeriod && (
          <PdfViewer
            url={`reports/sequential-note-book-${enterpriseId}-${values.clazz.id}-${values.subPeriod.id}.pdf`}
          />
        )}
      </div>
    </div>
  )
}

export default SequentialNoteBook
