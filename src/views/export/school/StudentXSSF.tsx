import Select from '@/@core/components/select'
import PageHeader from '@/@core/components/ui/page-header'
import { useClassesQuery } from '@/gql/graphql'
import { useAuthentication } from '@/hooks/useAuthentication'
import { BASE_REPORT_URL } from '@/utils/constants'
import { buildOptions } from '@/utils/helpers'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Input, Label } from 'reactstrap'

interface Field {
  name: string
  label: string
}

const StudentXSSF = () => {
  const { t } = useTranslation()
  const [values, setValues] = useState<{ [key: string]: any }>({
    showAll: false,
  })
  const { enterpriseId } = useAuthentication()

  const { data, loading } = useClassesQuery({
    variables: { id: enterpriseId },
    fetchPolicy: 'network-only',
  })

  const onClassFilterChange = (event: any) => {
    setValues((val) => ({ ...val, clazz: event }))
  }

  const fields = useMemo<Field[]>(
    () => [
      { name: 'fullName', label: t('label-fullName') },
      { name: 'registrationNumber', label: t('label-registrationNumber') },
    ],
    [t],
  )

  return (
    <div className="flex flex-col w-full">
      <div className="w-full">
        <PageHeader title={t('label-studentReport')} />
      </div>

      <div className="w-full mb-2 flex">
        <Select
          onChange={onClassFilterChange}
          options={data?.clazzes || undefined}
          getOptionLabel={(option: any) => option.name}
          getOptionValue={(option: any) => option.id}
          placeholder={t('label-selectClasses')}
          isClearable
          className="w-full md:w-10/12"
          isMulti
          isLoading={loading}
        />

        <span className="flex justify-end w-full md:w-2/12">
          <Input
            type="checkbox"
            id="showAll"
            checked={values.showAll}
            onChange={(e) =>
              setValues((val) => ({ ...val, showAll: e.target.checked }))
            }
          />
          <Label for="showAll">{t('label-showForAllClasses')}</Label>
        </span>
      </div>

      {fields.map((field, index) => (
        <span key={index}>{field.label}</span>
      ))}
      {values.clazz && values.clazz.length > 0 && (
        <a
          className="btn btn-primary"
          href={`${BASE_REPORT_URL}/reports/student-list-excel-${enterpriseId}.xlsx?classes=${buildOptions(
            values?.clazz,
          )}`}
        >
          {t('label-download')}
        </a>
      )}

      {(!values.clazz || values.clazz?.length === 0) && values.showAll && (
        <a
          className="btn btn-primary"
          href={`${BASE_REPORT_URL}/reports/student-list-excel-${enterpriseId}.xlsx`}
        >
          {t('label-download')}
        </a>
      )}
    </div>
  )
}

export default StudentXSSF
