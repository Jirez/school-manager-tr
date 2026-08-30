import { useEffect, useState } from 'react'
import { useAuthentication } from '@/hooks/useAuthentication'
import { useTranslation } from 'react-i18next'
import PageHeader from '@/@core/components/ui/page-header'
import Select from '@/@core/components/select'
import PdfViewer from '@/utils/PdfViewer'
import { useAssignedTeachersQuery } from '@/gql/graphql'
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

const TeacherTimeTableReport = () => {
  const [values, setValues] = useState<{ [key: string]: any }>({
    showAll: false,
  })
  const [reportName, setReportName] = useState<string>('')
  const { enterpriseId } = useAuthentication()
  const { t } = useTranslation()

  const { data, loading } = useAssignedTeachersQuery({
    variables: {
      schoolId: enterpriseId,
    },
    fetchPolicy: 'network-only',
  })

  const onTeacherFilterChange = (event: any) => {
    setValues((val) => ({ ...val, teacher: event }))
  }

  useEffect(() => {
    if (values.showAll) {
      setReportName(`reports/all-teacher-time-table-${enterpriseId}.pdf`)
    } else if (values.teacher) {
      setReportName(
        `reports/teacher-time-table-${enterpriseId}-${values.teacher.id}.pdf`,
      )
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
              {t('label-selectTeacherOrShowAll') ||
                'Sélectionnez un enseignant ou affichez tous les emplois du temps'}
            </FilterSubtitle>
          </div>
        </FilterHeader>

        <OptionsGrid>
          <Select
            onChange={onTeacherFilterChange}
            options={data && data.teachers ? data.teachers : undefined}
            getOptionLabel={(option: any) =>
              `${option.lastName} ${option.firstName ?? ''}`
            }
            getOptionValue={(option: any) => option.id}
            placeholder={t('label-selectTeacher') || t('label-selectClass')}
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
                    teacher: e.target.checked ? undefined : val.teacher,
                  }))
                }}
              />
              <CheckboxLabel>
                <CheckboxIcon>
                  <FileText size={18} />
                </CheckboxIcon>
                {t('label-showForAllTeachers')}
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
              {t('label-selectTeacherOrShowAllToView') ||
                "Sélectionnez un enseignant ou activez 'Afficher pour tous les enseignants' pour voir l'emploi du temps"}
            </p>
          </EmptyState>
        </PdfContainer>
      )}
    </div>
  )
}

export default TeacherTimeTableReport
