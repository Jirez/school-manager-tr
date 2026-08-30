import Select from '@/@core/components/select'
import PageHeader from '@/@core/components/ui/page-header'
import UncontrolledDatePicker from '@/@core/components/ui/uncontrolled-date-picker'
import { useAuthentication } from '@/hooks/useAuthentication'
import PdfViewer from '@/utils/PdfViewer'
import { studentOptions } from '@/utils/select/selectComponents'
import dayjs from 'dayjs'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { components } from 'react-select'
import ReportOptions from '../ReportOptions'
import {
  useClassesWithAnnualReportCardQuery,
  useSchoolYearsQuery,
  useStudentsByClassQuery,
} from '@/gql/graphql'

const AnnualReportCardExam = () => {
  const [values, setValues] = useState<{ [key: string]: any }>({
    printingDate: dayjs().toDate(),
  })
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const { data } = useClassesWithAnnualReportCardQuery({
    variables: {
      schoolYear: values.schoolYear
        ? (Number(values.schoolYear.id) as any)
        : null,
    },
    skip: !values.schoolYear,
    fetchPolicy: 'network-only',
  })

  const { data: dataSchoolYear } = useSchoolYearsQuery({
    variables: { id: enterpriseId, removeArchived: true },
    fetchPolicy: 'network-only',
  })

  const { data: dataStudent } = useStudentsByClassQuery({
    variables: { id: values.clazz ? Number(values.clazz.id) : -1 },
    skip: !values.clazz,
    fetchPolicy: 'network-only',
  })

  const onClassFilterChange = (event: any) => {
    setValues((val) => ({ ...val, clazz: event }))
  }

  const onSchoolYearFilterChange = (event: any) => {
    setValues((val) => ({ ...val, schoolYear: event }))
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
          title={t('sidebar.reports.annualReport')}
          returnLink="/reports"
        />
      </div>

      <ReportOptions>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Select
            onChange={onSchoolYearFilterChange}
            options={dataSchoolYear?.schoolYears || undefined}
            getOptionLabel={(option: any) => option.label}
            getOptionValue={(option: any) => option.id}
            placeholder={t('label-selectSchoolYear')}
          />

          {values.schoolYear && (
            <Select
              onChange={onClassFilterChange}
              options={
                data?.classes?.filter((c: any) => !c.competenceClass) || []
              }
              getOptionLabel={(option: any) => option.name}
              getOptionValue={(option: any) => option.id}
              placeholder={t('label-selectClass')}
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
            />
          )}
          <UncontrolledDatePicker
            onChange={(val) =>
              setValues((old) => ({ ...old, printingDate: val }))
            }
            value={values.printingDate}
          />
        </div>
      </ReportOptions>

      <div className="w-full mt-2">
        {values.clazz && values.schoolYear && (
          <PdfViewer
            url={`reports/annual-report-exam-${enterpriseId}-${
              values.schoolYear.id
            }.pdf?search=clazz:${values.clazz.id},schoolYear:${
              values.schoolYear.id
            }${
              values.student ? `,student:${values.student.id}` : ''
            }&sort=BY_MERIT&printingDate=${dayjs(values.printingDate).format(
              'DD/MM/YYYY',
            )}`}
          />
        )}
      </div>
    </div>
  )
}

export default AnnualReportCardExam
