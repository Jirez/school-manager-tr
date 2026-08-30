import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import PageHeader from '@/@core/components/ui/page-header'
import { useAuthentication } from '@/hooks/useAuthentication'
import Select from '@/@core/components/select'

import { BASE_REPORT_URL } from '@/utils/constants'
import { buildOptions } from '@/utils/helpers'
import {
  useBranchesBySchoolYearQuery,
  useSchoolYearsQuery,
} from '@/gql/graphql'

const AnnualSchoolBook = () => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()
  const [values, setValues] = useState<{ [key: string]: any }>({
    schoolYear: null,
    branches: [],
  })

  const { data: dataSchoolYears } = useSchoolYearsQuery({
    variables: { id: enterpriseId },
  })

  const { data: dataBranches } = useBranchesBySchoolYearQuery({
    variables: { id: Number(values.schoolYear?.id) },
    skip: !values.schoolYear,
  })

  const onSchoolYearChange = (event: any) => {
    setValues({ ...values, schoolYear: event, branches: [] })
  }

  const onBranchesChange = (event: any) => {
    setValues({ ...values, branches: event })
  }

  /* const onDownload = (url: string) => {
        const dataSource = new RestDataSource()
        dataSource.get(url, (data: any) => console.log(""))
    } */

  return (
    <div className="flex flex-col w-full">
      <div className="w-full">
        <PageHeader title={t('label-annualSchoolBook')} />
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-2">
        <Select
          onChange={onSchoolYearChange}
          options={dataSchoolYears?.schoolYears || []}
          getOptionLabel={(option: any) => option.label}
          getOptionValue={(option: any) => option.id}
          placeholder="Sélectionner une année scolaire"
          isClearable
          className="w-full md:w-4/12"
        />

        {values.schoolYear && (
          <Select
            onChange={onBranchesChange}
            options={dataBranches?.branches || []}
            getOptionLabel={(option: any) => option.name}
            getOptionValue={(option: any) => option.id}
            placeholder="Sélectionner les séries"
            value={values.branches}
            isClearable
            className="w-full md:w-8/12"
            isMulti
          />
        )}
      </div>

      {values.branches && values.branches.length > 0 && (
        <a
          className="btn btn-primary"
          href={`${BASE_REPORT_URL}/reports/annual-school-book-excel-${enterpriseId}.xlsx?search=schoolYear:${
            values.schoolYear.id
          },branch:${buildOptions(values.branches)}`}
        >
          {t('label-download')}
        </a>
      )}
    </div>
  )
}

export default AnnualSchoolBook
