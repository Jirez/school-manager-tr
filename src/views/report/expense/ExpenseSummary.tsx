import { useTranslation } from 'react-i18next'
import { useModal } from '@ebay/nice-modal-react'
import { Play, Settings } from 'lucide-react'

import { useAuthentication } from '@/hooks/useAuthentication'
import PdfViewer from '@/utils/PdfViewer'
import PageHeader from '@/@core/components/ui/page-header'
import { useSearch } from '../useReportSearch'
import CustomReportModal from '../CustomReportModal'
import { useForm } from 'react-hook-form'
import dayjs from 'dayjs'
import { useEffect } from 'react'
import ReportOptions from '../ReportOptions'
import { Form } from 'reactstrap'
import DatePicker from '@/@core/components/ui/forms/simple-date-picker'
import ControlledSelect from '@/@core/components/ui/forms/controlled-select'
import { useExpenseCategoriesQuery } from '@/gql/graphql'
import { buildPartialFilters } from '@/utils/helpers'
import PeriodSelect from '../report-helper'
import { ActionButton, ReportContainer } from '../report.style'

interface FormValues {
  period: any
  category: any
}

const ExpenseSummary = () => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const {
    setValues,
    params,
    values: currentValues,
    show,
    onSubmit,
  } = useSearch({
    title: t('label-expenseSummary'),
    orientation: 'PORTRAIT',
    columnBorder: true,
    rowNumber: true,
    pageType: 'A4',
    period: [dayjs().startOf('month'), dayjs()],
  })
  const modal = useModal(CustomReportModal)

  const { data, loading } = useExpenseCategoriesQuery({
    variables: { id: enterpriseId },
  })

  const methods = useForm<FormValues>({
    defaultValues: {
      period: [dayjs().startOf('month').toDate(), dayjs().toDate()],
      category: null,
    },
  })

  const categories = methods.watch('category')

  useEffect(() => {
    setValues((val) => ({ ...val, loading: false }))
  }, [methods.formState.touchedFields])

  return (
    <ReportContainer>
      <PageHeader title={t('label-expenseSummary')} />

      <ReportOptions>
        <Form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="flex flex-wrap items-end gap-3">
            <PeriodSelect methods={methods} />

            <DatePicker
              name="period"
              control={methods.control}
              label={t('label-period')}
              options={{
                dateFormat: 'd/m/Y',
                mode: 'range',
                allowInput: true,
              }}
              className="flex-1 min-w-[200px] max-w-[280px]"
            />

            <ControlledSelect
              name="category"
              control={methods.control}
              label={t('label-categories')}
              onChange={(val: any) => methods.setValue('category', val)}
              options={data ? data.expenseCategories : undefined}
              getOptionLabel={(option: any) => option.name}
              getOptionValue={(option: any) => option.id}
              placeholder={t('label-selectCategories')}
              isMulti
              className="flex-1 min-w-[200px] max-w-[320px]"
              isLoading={loading}
            />

            <div className="flex items-center gap-2">
              <ActionButton type="submit" color="primary" className="h-[38px]">
                <Play size={14} />
                {t('label-executeReport')}
              </ActionButton>

              <ActionButton
                type="button"
                color="secondary"
                className="h-[38px]"
                onClick={() =>
                  modal.show({ options: { ...currentValues }, setValues })
                }
              >
                <Settings size={14} />
                {t('label-customizeReport')}
              </ActionButton>
            </div>
          </div>
        </Form>
      </ReportOptions>

      {show && (
        <PdfViewer
          url={`reports/expense-summary-${enterpriseId}.pdf?search=enterprise:${enterpriseId}${categories && categories.length > 0 ? `,category:${buildPartialFilters(categories, 'id')}` : ''},${currentValues.search}&params=${params}`}
        />
      )}
    </ReportContainer>
  )
}

export default ExpenseSummary
