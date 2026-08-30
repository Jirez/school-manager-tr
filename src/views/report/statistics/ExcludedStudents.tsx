import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useAuthentication } from '@/hooks/useAuthentication'
import PageHeader from '@/@core/components/ui/page-header'
import Select from '@/@core/components/select'
import PdfViewer from '@/utils/PdfViewer'
import { useSchoolYearsQuery } from '@/gql/graphql'

const ExcludedStudents = () => {
  const [values, setValues] = useState<{ [key: string]: any }>({
    nth: '5',
    last: false,
  })
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
        <PageHeader title={t('label.excludedStudents')} returnLink="/reports" />
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
      </div>
      <div className="w-full mt-2">
        {values.schoolYear && (
          <PdfViewer
            url={`reports/${enterpriseId}-excluded-${values.schoolYear.id}.pdf?params=columnBorder:true,rowNumber:true,title:Liste des élèves exclus`}
          />
        )}
      </div>
    </div>
  )
}

export default ExcludedStudents
