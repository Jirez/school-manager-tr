import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Users, FileText } from 'lucide-react'
import Select from '@/@core/components/select'

import { useAuthentication } from '@/hooks/useAuthentication'
import PdfViewer from '@/utils/PdfViewer'
import PageHeader from '@/@core/components/ui/page-header'
import { buildOptions } from '@/utils/helpers'
import { useClassesQuery } from '@/gql/graphql'
import ReportOptions from '../ReportOptions'
import {
  FilterSection,
  OptionsGrid,
  CheckboxItem,
  CheckboxInput,
  CheckboxLabel,
  CheckboxIcon,
  PdfContainer,
  EmptyState,
} from '../report.style'

const StudentMultiColumns = () => {
  const [values, setValues] = useState<{ [key: string]: any }>({
    showAll: false,
  })
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
        <PageHeader
          title={t('sidebar.reports.studentList')}
          returnLink="/reports"
        />
      </div>
      <ReportOptions>
        <FilterSection>
          <Select
            onChange={onClassFilterChange}
            options={data?.clazzes || undefined}
            getOptionLabel={(option: any) => option.name}
            getOptionValue={(option: any) => option.id}
            placeholder={t('label-selectClasses')}
            isClearable
            isMulti
            isLoading={loading}
          />
        </FilterSection>

        <OptionsGrid>
          <CheckboxItem>
            <CheckboxInput
              id="showAll"
              checked={values.showAll}
              onChange={(e) =>
                setValues((val) => ({ ...val, showAll: e.target.checked }))
              }
            />
            <CheckboxIcon>
              <Users size={18} />
            </CheckboxIcon>
            <CheckboxLabel>{t('label-showForAllClasses')}</CheckboxLabel>
          </CheckboxItem>
        </OptionsGrid>
      </ReportOptions>

      <PdfContainer>
        {values.clazz && values.clazz.length > 0 ? (
          <PdfViewer
            url={`reports/${enterpriseId}-all-multicolumn-student-list.pdf?classes=${buildOptions(
              values.clazz,
            )}&params=title:Liste des élèves`}
          />
        ) : values.showAll ? (
          <PdfViewer
            url={`reports/${enterpriseId}-all-multicolumn-student-list.pdf?params=title:Liste des élèves`}
          />
        ) : (
          <EmptyState>
            <FileText />
            <p>
              {t('label-selectClassesOrShowAllToView') ||
                "Sélectionnez des classes ou activez 'Afficher pour toutes les classes' pour voir la liste des élèves"}
            </p>
          </EmptyState>
        )}
      </PdfContainer>
    </div>
  )
}

export default StudentMultiColumns
