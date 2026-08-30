import { useEffect, useState } from 'react'
import { useAuthentication } from '@/hooks/useAuthentication'
import { useTranslation } from 'react-i18next'
import PageHeader from '@/@core/components/ui/page-header'
import Select from '@/@core/components/select'
import PdfViewer from '@/utils/PdfViewer'
import { useClassesQuery } from '@/gql/graphql'
import { Calendar, Clock, FileText } from 'lucide-react'
import {
  CheckboxItem,
  CheckboxInput,
  CheckboxLabel,
  CheckboxIcon,
  PdfContainer,
  EmptyState,
  CheckboxWrapper,
  FilterHeader,
  FilterIcon,
  FilterTitle,
  FilterSubtitle,
  OptionsGrid,
} from '../report.style'
import ReportOptions from '../ReportOptions'

const TimeTableOfStudent = () => {
  const [values, setValues] = useState<{ [key: string]: any }>({
    showAll: false,
  })
  const [reportName, setReportName] = useState<string>('')
  const { enterpriseId } = useAuthentication()
  const { t } = useTranslation()

  const { data, loading } = useClassesQuery({
    variables: {
      id: enterpriseId,
    },
    fetchPolicy: 'network-only',
  })

  const onClassFilterChange = (event: any) => {
    setValues((val) => ({ ...val, clazz: event }))
  }

  useEffect(() => {
    if (values.showAll) {
      setReportName(`reports/all-time-table-${enterpriseId}.pdf`)
    } else if (values.clazz) {
      setReportName(`reports/time-table-${enterpriseId}-${values.clazz.id}.pdf`)
    } else {
      setReportName('')
    }
  }, [values, enterpriseId])

  return (
    <div className="flex flex-col w-full">
      <div className="w-full">
        <PageHeader title={t('label-timeTables')} returnLink="/reports" />
      </div>

      <ReportOptions>
        <FilterHeader>
          <FilterIcon>
            <Calendar size={20} />
          </FilterIcon>
          <div>
            <FilterTitle>
              <Clock size={18} />
              {t('label-timeTables')}
            </FilterTitle>
            <FilterSubtitle>
              {t('label-selectClassOrShowAll') ||
                'Sélectionnez une classe ou affichez tous les emplois du temps'}
            </FilterSubtitle>
          </div>
        </FilterHeader>

        <OptionsGrid>
          <Select
            onChange={onClassFilterChange}
            options={data && data.clazzes ? data.clazzes : undefined}
            getOptionLabel={(option: any) => option.name}
            getOptionValue={(option: any) => option.id}
            placeholder={t('label-selectClass')}
            isLoading={loading}
            isDisabled={values.showAll}
            className="mt-2"
          />

          <CheckboxWrapper>
            <CheckboxItem>
              <CheckboxInput
                type="checkbox"
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
                  <FileText size={18} />
                </CheckboxIcon>
                {t('label-showForAllClasses')}
              </CheckboxLabel>
            </CheckboxItem>
          </CheckboxWrapper>
        </OptionsGrid>
      </ReportOptions>

      {reportName ? (
        <PdfContainer>
          <PdfViewer url={reportName} />
        </PdfContainer>
      ) : (
        <PdfContainer>
          <EmptyState>
            <FileText />
            <p>
              {t('label-selectClassOrShowAllToView') ||
                "Sélectionnez une classe ou activez 'Afficher pour toutes les classes' pour voir l'emploi du temps"}
            </p>
          </EmptyState>
        </PdfContainer>
      )}
    </div>
  )
}

export default TimeTableOfStudent
