import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FileText, Users } from 'lucide-react'

import { useAuthentication } from '@/hooks/useAuthentication'
import PdfViewer from '@/utils/PdfViewer'
import Select from '@/@core/components/select'
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

const StudentCards = () => {
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
          title={t('sidebar.reports.studentCard')}
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
            isDisabled={values.showAll}
          />
        </FilterSection>

        <OptionsGrid>
          <CheckboxItem>
            <CheckboxInput
              id="showAll"
              checked={values.showAll}
              onChange={(e) => {
                setValues((val) => ({
                  ...val,
                  showAll: e.target.checked,
                  clazz: e.target.checked ? undefined : val.clazz,
                }))
              }}
            />
            <CheckboxLabel>
              <CheckboxIcon>
                <Users size={18} />
              </CheckboxIcon>
              {t('label-showForAllClasses')}
            </CheckboxLabel>
          </CheckboxItem>
        </OptionsGrid>
      </ReportOptions>

      <PdfContainer>
        {values.showAll ? (
          <PdfViewer
            url={`reports/student-card-${enterpriseId}.pdf?params=title:Liste des élèves`}
          />
        ) : values.clazz && values.clazz.length > 0 ? (
          <PdfViewer
            url={`reports/student-card-${enterpriseId}.pdf?search=clazz:${buildOptions(
              values.clazz,
            )}&params=title:Liste des élèves`}
          />
        ) : (
          <EmptyState>
            <FileText />
            <p>
              {t('label-selectClassesOrShowAllToView') ||
                "Sélectionnez des classes ou activez 'Afficher pour toutes les classes' pour voir les cartes d'élèves"}
            </p>
          </EmptyState>
        )}
      </PdfContainer>
    </div>
  )
}

export default StudentCards
