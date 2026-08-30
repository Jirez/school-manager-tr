import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { components } from 'react-select'
import dayjs from 'dayjs'
import { BookOpen, Printer, FileText } from 'lucide-react'

import ReportOptions from '../ReportOptions'
import { useAuthentication } from '@/hooks/useAuthentication'
import PageHeader from '@/@core/components/ui/page-header'
import Select from '@/@core/components/select'
import PdfViewer from '@/utils/PdfViewer'
import { studentOptions } from '@/utils/select/selectComponents'
import UncontrolledDatePicker from '@/@core/components/ui/uncontrolled-date-picker'
import {
  useClassesWithSubPeriodReportCardQuery,
  useStudentsByClassQuery,
  useSubPeriodsQuery,
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
} from '../report.style'

const SequentialReportCard = () => {
  const [values, setValues] = useState<{ [key: string]: any }>({
    printingDate: dayjs().toDate(),
    apc: true,
  })
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const { data, loading } = useClassesWithSubPeriodReportCardQuery({
    variables: {
      subPeriod: values.subPeriod ? (Number(values.subPeriod.id) as any) : null,
    },
    skip: !values.subPeriod,
    fetchPolicy: 'network-only',
  })

  const { data: dataSubPeriod, loading: loadingSubPeriod } = useSubPeriodsQuery(
    {
      variables: { id: enterpriseId },
      fetchPolicy: 'network-only',
    },
  )

  const { data: dataStudent, loading: loadingStudent } =
    useStudentsByClassQuery({
      variables: { id: values.clazz ? Number(values.clazz.id) : -1 },
      skip: !values.clazz,
      fetchPolicy: 'network-only',
    })

  const onClassFilterChange = (event: any) => {
    setValues((val) => ({ ...val, clazz: event }))
  }

  const onSubPeriodFilterChange = (event: any) => {
    setValues((val) => ({ ...val, subPeriod: event }))
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
          title={t('sidebar.reports.sequentialReport')}
          returnLink="/reports"
        />
      </div>
      <ReportOptions>
        {/* Filters Section */}
        <FilterSection>
          <Select
            onChange={onSubPeriodFilterChange}
            options={dataSubPeriod?.subPeriods || undefined}
            getOptionLabel={(option: any) => option.label}
            getOptionValue={(option: any) => option.id}
            placeholder={t('label-selectSubPeriod')}
            isLoading={loadingSubPeriod}
          />

          {values.subPeriod && (
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

      <div className="w-full mt-2">
        {values.clazz && values.subPeriod && (
          <PdfViewer
            url={`reports/sequential-report-${enterpriseId}-${
              values.subPeriod.id
            }.pdf?search=clazz:${values.clazz.id},subPeriod:${
              values.subPeriod.id
            }${
              values.student ? `,student:${values.student.id}` : ''
            }&sort=BY_MERIT&apc=${values.apc}&printingDate=${dayjs(
              values.printingDate,
            ).format('DD/MM/YYYY')}`}
          />
        )}
      </div>
    </div>
  )
}

export default SequentialReportCard
