import { useState } from 'react'
import { components } from 'react-select'
import dayjs from 'dayjs'
import { CheckSquare, FileText, Image, BookOpen, Printer } from 'lucide-react'

import ReportOptions from '../ReportOptions'
import { useTranslation } from 'react-i18next'
import { useAuthentication } from '@/hooks/useAuthentication'
import PdfViewer from '@/utils/PdfViewer'
import Select from '@/@core/components/select'
import UncontrolledDatePicker from '@/@core/components/ui/uncontrolled-date-picker'
import PageHeader from '@/@core/components/ui/page-header'
import { studentOptions } from '@/utils/select/selectComponents'
import {
  useClassesWithPeriodReportCardQuery,
  usePeriodsQuery,
  useStudentsByClassQuery,
} from '@/gql/graphql'
import {
  CheckboxIcon,
  CheckboxInput,
  CheckboxItem,
  CheckboxLabel,
  DatePickerWrapper,
  FilterSection,
  OptionsGrid,
  SectionTitle,
  PdfContainer,
  EmptyState,
} from '../report.style'

const QuarterlyReportCard = () => {
  const [values, setValues] = useState<{ [key: string]: any }>({
    competence: false,
    simplified: false,
    apc: true,
    background: false,
    printingDate: dayjs().toDate(),
  })
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const { data, loading } = useClassesWithPeriodReportCardQuery({
    variables: {
      period: values.period ? (Number(values.period.id) as any) : null,
    },
    skip: !values.period,
    fetchPolicy: 'network-only',
  })

  const { data: dataPeriod, loading: loadingPeriod } = usePeriodsQuery({
    variables: { id: enterpriseId },
    fetchPolicy: 'network-only',
  })

  const { data: dataStudent, loading: loadingStudent } =
    useStudentsByClassQuery({
      variables: { id: values.clazz ? Number(values.clazz.id) : -1 },
      skip: !values.clazz,
      fetchPolicy: 'network-only',
    })

  const onClassFilterChange = (event: any) => {
    setValues((val) => ({ ...val, clazz: event }))
  }

  const onPeriodFilterChange = (event: any) => {
    setValues((val) => ({ ...val, period: event }))
  }

  const onStudentFilterChange = (event: any) => {
    setValues((val) => ({ ...val, student: event }))
  }

  const SingleValue = (props: any) => (
    <components.SingleValue {...props}>
      {props.data.registrationNumber +
        ' ' +
        props.data.lastName +
        ' ' +
        (props.data.firstName ? props.data.firstName : '')}
    </components.SingleValue>
  )

  return (
    <div className="flex flex-col w-full">
      <div className="w-full">
        <PageHeader
          title={t('sidebar.reports.quarterlyReport')}
          returnLink="/reports"
        />
      </div>
      <ReportOptions>
        {/* Filters Section */}
        <FilterSection>
          <Select
            onChange={onPeriodFilterChange}
            options={dataPeriod?.periods || undefined}
            getOptionLabel={(option: any) => option.label}
            getOptionValue={(option: any) => option.id}
            placeholder={t('label-selectPeriod')}
            isLoading={loadingPeriod}
          />

          {values.period && (
            <Select
              onChange={onClassFilterChange}
              options={
                data?.classes?.filter((c: any) => !c.competenceClass) || []
              }
              getOptionLabel={(option: any) => option.name}
              getOptionValue={(option: any) => option.id}
              placeholder={t('label-selectClass')}
              isLoading={loading}
            />
          )}

          {values.clazz && (
            <Select
              onChange={onStudentFilterChange}
              options={dataStudent?.students || undefined}
              getOptionLabel={(option: any) => option.lastName}
              getOptionValue={(option: any) => option.id}
              components={{ Option: studentOptions, SingleValue }}
              placeholder={t('label-selectStudent')}
              isLoading={loadingStudent}
            />
          )}
        </FilterSection>

        {/* Report Options Section */}
        <div>
          <SectionTitle>
            <FileText size={16} />
            Options du rapport
          </SectionTitle>
          <OptionsGrid>
            <CheckboxItem>
              <CheckboxInput
                checked={values.competence}
                onChange={(e) =>
                  setValues((val) => ({
                    ...val,
                    competence: e.target.checked,
                  }))
                }
              />
              <CheckboxLabel>
                <CheckboxIcon>
                  <CheckSquare size={18} />
                </CheckboxIcon>
                {t('label-withCompetences')}
              </CheckboxLabel>
            </CheckboxItem>

            <CheckboxItem>
              <CheckboxInput
                checked={values.simplified}
                onChange={(e) =>
                  setValues((val) => ({
                    ...val,
                    simplified: e.target.checked,
                  }))
                }
              />
              <CheckboxLabel>
                <CheckboxIcon>
                  <FileText size={18} />
                </CheckboxIcon>
                {t('label-simplifiedModel')}
              </CheckboxLabel>
            </CheckboxItem>

            <CheckboxItem>
              <CheckboxInput
                id="background"
                checked={values.background}
                onChange={(e) =>
                  setValues({ ...values, background: e.target.checked })
                }
              />
              <CheckboxLabel>
                <CheckboxIcon>
                  <Image size={18} />
                </CheckboxIcon>
                {t('label-withBackground')}
              </CheckboxLabel>
            </CheckboxItem>

            <CheckboxItem>
              <CheckboxInput
                checked={values.apc}
                onChange={(e) =>
                  setValues((val) => ({ ...val, apc: e.target.checked }))
                }
              />
              <CheckboxLabel>
                <CheckboxIcon>
                  <BookOpen size={18} />
                </CheckboxIcon>
                APC
              </CheckboxLabel>
            </CheckboxItem>

            <DatePickerWrapper>
              <label>
                <Printer size={16} />
                Date d'impression
              </label>
              <UncontrolledDatePicker
                onChange={(val) =>
                  setValues((old) => ({ ...old, printingDate: val }))
                }
                value={values.printingDate}
              />
            </DatePickerWrapper>
          </OptionsGrid>
        </div>
      </ReportOptions>

      <PdfContainer>
        {values.clazz && values.period ? (
          <PdfViewer
            url={`reports/quarterly-report-${enterpriseId}-${
              values.period.id
            }.pdf?search=clazz:${values.clazz.id},period:${values.period.id}${
              values.student ? `,student:${values.student.id}` : ''
            }&competence=${values.competence}&simplified=${
              values.simplified
            }&withBackground=${values.background}&apc=${
              values.apc
            }&sort=BY_MERIT&printingDate=${dayjs(values.printingDate).format(
              'DD/MM/YYYY',
            )}`}
          />
        ) : (
          <EmptyState>
            <FileText />
            <p>
              {t('label-selectPeriodAndClassToView') ||
                'Sélectionnez une période et une classe pour voir le bulletin trimestriel'}
            </p>
          </EmptyState>
        )}
      </PdfContainer>
    </div>
  )
}

export default QuarterlyReportCard
