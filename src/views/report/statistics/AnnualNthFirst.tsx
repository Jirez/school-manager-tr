import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Input, Label } from 'reactstrap'
import { useDebounce } from 'ahooks'

import { useAuthentication } from '@/hooks/useAuthentication'
import PageHeader from '@/@core/components/ui/page-header'
import Select from '@/@core/components/select'
import PdfViewer from '@/utils/PdfViewer'
import { useSchoolYearsQuery } from '@/gql/graphql'

const AnnualNthFirst = () => {
  const [values, setValues] = useState<{ [key: string]: any }>({
    nth: '5',
    last: false,
  })
  const debouncedValue = useDebounce(values.nth, { wait: 1000 })
  //const [nth, setNth] = useState("5");
  const { enterpriseId } = useAuthentication()
  const { t } = useTranslation()

  const { data } = useSchoolYearsQuery({
    variables: { id: enterpriseId },
    fetchPolicy: 'network-only',
  })

  const onPeriodFilterChange = (event: any) => {
    setValues({ ...values, schoolYear: event })
  }

  return (
    <div className="flex flex-col w-full">
      <div className="w-full">
        <PageHeader title={t('label.annualNthFirst')} returnLink="/reports" />
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <Select
          onChange={onPeriodFilterChange}
          options={data?.schoolYears || undefined}
          getOptionLabel={(option: any) => option.label}
          getOptionValue={(option: any) => option.id}
          placeholder="Sélectionner une année scolaire"
          className="w-full md:w-4/12"
        />

        <div className="w-full md:w-4/12">
          <Input
            onChange={(val) => setValues({ ...values, nth: val.target.value })}
            value={values.nth}
            placeholder="Limiter à"
          />
        </div>

        <span className="flex justify-end w-full md:w-2/12">
          <Input
            type="checkbox"
            id="last"
            checked={values.last}
            onChange={(e) => setValues({ ...values, last: e.target.checked })}
          />
          <Label for="last">{t('label-includeLastStudents')}</Label>
        </span>
      </div>
      <div className="w-full mt-2">
        {values.schoolYear && debouncedValue && (
          <PdfViewer
            url={`reports/${enterpriseId}-nth-first-${values.schoolYear.id}.pdf?nth=${debouncedValue}&last=${values.last}&params=columnBorder:true,rowNumber:true,title:Liste des ${debouncedValue} premiers annuel`}
          />
        )}
      </div>
    </div>
  )
}

export default AnnualNthFirst
