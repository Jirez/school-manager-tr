import { useTranslation } from 'react-i18next'
import { Form } from 'reactstrap'
import { Settings, Play, FileText } from 'lucide-react'

import PageHeader from '@/@core/components/ui/page-header'
import { useAuthentication } from '@/hooks/useAuthentication'
import ReportOptions from '../ReportOptions'
import PdfViewer from '@/utils/PdfViewer'
import { useForm } from 'react-hook-form'
import dayjs from 'dayjs'
import ControlledSelect from '@/@core/components/ui/forms/controlled-select'
import { buildOptions } from '@/utils/helpers'
import CustomReportModal from '../CustomReportModal'
import { useModal } from '@ebay/nice-modal-react'
import { useSearch } from '../useReportSearch'
import { useEffect } from 'react'
import { useStudentsQuery } from '@/gql/graphql'
import {
  ActionButtonsContainer,
  FilterSection,
  StyledButton,
  PdfContainer,
  EmptyState,
} from '../report.style'
import SimpleDatePicker from '@/@core/components/ui/forms/simple-date-picker'

interface FormValues {
  period: any
  category: any
}

const FeePaymentDetail = () => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()
  const {
    setValues,
    params,
    show,
    onSubmit,
    values: currentValues,
  } = useSearch({ title: t('sidebar.reports.studentPaymentDetail') })
  const modal = useModal(CustomReportModal)

  const { data } = useStudentsQuery({
    variables: { id: enterpriseId },
  })

  const methods = useForm<FormValues>({
    defaultValues: {
      period: dayjs().toDate(),
      category: null,
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
          title={t('sidebar.reports.studentPaymentDetail')}
          returnLink="/reports"
        />
      </div>
      <ReportOptions>
        <Form onSubmit={methods.handleSubmit(onSubmit)} className="p-0">
          <FilterSection>
            <SimpleDatePicker
              name="period"
              control={methods.control}
              label={t('label-period')}
              options={{
                dateFormat: 'd/m/Y',
                mode: 'range',
                allowInput: true,
              }}
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
            />
          </FilterSection>

          <ActionButtonsContainer>
            <StyledButton type="submit" color="primary" className="round h-10">
              <Play size={16} />
              {t('label-executeReport')}
            </StyledButton>
            <StyledButton
              type="button"
              color="secondary"
              className="round h-10"
              onClick={() =>
                modal.show({ options: { ...currentValues }, setValues })
              }
            >
              <Settings size={16} />
              {t('label-customizeReport')}
            </StyledButton>
          </ActionButtonsContainer>
        </Form>
      </ReportOptions>
      <PdfContainer>
        {show ? (
          <PdfViewer
            url={`reports/fee-payment-detail-${enterpriseId}.pdf?search=enterprise:${enterpriseId}${
              values.category && values.category.length > 0
                ? `,student:${buildOptions(values.category)}`
                : ''
            },${currentValues.search}&params=${params}
                `}
          />
        ) : (
          <EmptyState>
            <FileText />
            <p>
              {t('label-clickExecuteReportToView') ||
                "Cliquez sur 'Exécuter le rapport' pour voir le détail des paiements"}
            </p>
          </EmptyState>
        )}
      </PdfContainer>
    </div>
  )
}

export default FeePaymentDetail
