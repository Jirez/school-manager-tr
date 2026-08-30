import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthentication } from '@/hooks/useAuthentication'
import PdfViewer from '@/utils/PdfViewer'
import Select from '@/@core/components/select'
import PageHeader from '@/@core/components/ui/page-header'
import { Input, Label } from 'reactstrap'
import { buildOptions } from '@/utils/helpers'
import { useClassesQuery } from '@/gql/graphql'

const QuarterlyMarkSheetReport = () => {
  const [values, setValues] = useState<{ [key: string]: any }>({
    showAll: false,
  })
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

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
        <PageHeader title={t('mark.sheet')} returnLink="/reports" />
      </div>
      <div className="w-full mb-2 flex">
        <Select
          onChange={onClassFilterChange}
          options={data?.clazzes || undefined}
          getOptionLabel={(option: any) => option.name}
          getOptionValue={(option: any) => option.id}
          placeholder={t('label-selectClasses')}
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
              setValues({ ...values, showAll: e.target.checked })
            }
          />
          <Label for="showAll">Afficher pour toutes les classes</Label>
        </span>
      </div>
      <div className="w-full mt-2">
        {values.clazz && (
          <PdfViewer
            url={`reports/${enterpriseId}-all-multicolumn-quarterly-mark-sheet.pdf?classes=${buildOptions(
              values.clazz,
            )}&params=title:Fiches de notes`}
          />
        )}
        {!values.clazz && values.showAll && (
          <PdfViewer
            url={`reports/${enterpriseId}-all-multicolumn-quarterly-mark-sheet.pdf?params=title:Fiches de note`}
          />
        )}
      </div>
    </div>
  )
}

export default QuarterlyMarkSheetReport
