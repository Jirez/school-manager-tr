import { useTranslation } from 'react-i18next'
import { Form } from 'reactstrap'

import PageHeader from '@/@core/components/ui/page-header'
import { useAuthentication } from '@/hooks/useAuthentication'
import ReportOptions from '../ReportOptions'
import PdfViewer from '@/utils/PdfViewer'
import { useForm } from 'react-hook-form'
import dayjs from 'dayjs'
import ControlledSelect from '@/@core/components/ui/forms/controlled-select'
import Button from '@/@core/components/button'
import { buildOptions } from '@/utils/helpers'
import CustomReportModal from '../CustomReportModal'
import { useModal } from '@ebay/nice-modal-react'
import { useSearch } from '../useReportSearch'
import { useEffect } from 'react'
import { usePaymentSlicesQuery, useStudentsQuery } from '@/gql/graphql'
import SimpleDatePicker from '@/@core/components/ui/forms/simple-date-picker'

interface FormValues {
  period: any
  category: any
  slices: any
}

const StudentPaymentSliceSummary = () => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()
  const {
    setValues,
    params,
    show,
    onSubmit,
    values: currentValues,
  } = useSearch({
    title: t('sidebar.reports.studentPaymentSummary'),
    orientation: 'LANDSCAPE',
  })
  const modal = useModal(CustomReportModal)

  const { data } = useStudentsQuery({
    variables: { id: enterpriseId },
  })

  const { data: dataSlice } = usePaymentSlicesQuery({
    variables: { id: enterpriseId },
  })

  const methods = useForm<FormValues>({
    defaultValues: {
      period: dayjs().toDate(),
      category: null,
      slices: null,
    },
  })

  const values = methods.watch()

  useEffect(() => {
    setValues((val) => ({ ...val, loading: false }))
  }, [methods.formState.touchedFields])

  return (
    <div className="flex flex-col w-full">
      <div className="w-full">
        <PageHeader
          title={t('sidebar.reports.studentPaymentSummary')}
          returnLink="/reports"
        />
      </div>
      <ReportOptions>
        <Form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="grid gid-cols-1 md:grid-cols-12 gap-6 items-end">
            <SimpleDatePicker
              name="period"
              control={methods.control}
              label={t('label-period')}
              options={{
                dateFormat: 'd/m/Y',
                mode: 'range',
                //defaultDate: [dayjs().toDate(), dayjs().toDate()],
                allowInput: true,
              }}
              className="md:col-span-3"
            />

            <ControlledSelect
              name="category"
              control={methods.control}
              label={t('label-students')}
              onChange={(val: any) => methods.setValue('category', val)}
              options={data ? data.students : undefined}
              getOptionLabel={(option: any) => option.lastName}
              getOptionValue={(option: any) => option.id}
              placeholder={t('label-selectStudents')}
              isMulti
              className="md:col-span-6"
            />

            <ControlledSelect
              name="slices"
              control={methods.control}
              label={t('label-paymentSlice')}
              onChange={(val: any) => methods.setValue('slices', val)}
              options={dataSlice ? dataSlice.paymentSlices : undefined}
              getOptionLabel={(option: any) => option.name}
              getOptionValue={(option: any) => option.id}
              placeholder="Sélectionner des tranches de paiement"
              isMulti
              className="md:col-span-3"
            />
          </div>

          <div className="flex justify-end mt-1">
            <Button type="submit" color="primary" className="round h-10">
              {t('label-executeReport')}
            </Button>

            <Button
              type="button"
              color="secondary"
              className="round h-10"
              onClick={() =>
                modal.show({ options: { ...currentValues }, setValues })
              }
            >
              {t('label-customizeReport')}
            </Button>
          </div>
        </Form>
      </ReportOptions>
      <br />
      <div className="w-full mt-2">
        {show && (
          <PdfViewer
            url={`reports/student-payment-slice-summary-${enterpriseId}.pdf?search=enterprise:${enterpriseId}${
              values.slices && values.slices.length > 0
                ? `,paymentSlice:${buildOptions(values.slices)}`
                : ''
            }${
              values.category && values.category.length > 0
                ? `,student:${buildOptions(values.category)}`
                : ''
            },${currentValues.search}&params=${params}
                `}
          />
        )}
      </div>
    </div>
  )
}

export default StudentPaymentSliceSummary
