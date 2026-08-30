import { useTranslation } from 'react-i18next'
import { Form } from 'reactstrap'
import {
  Settings,
  Play,
  FileSpreadsheet,
  AlertCircle,
  FileText,
} from 'lucide-react'

import PageHeader from '@/@core/components/ui/page-header'
import { useAuthentication } from '@/hooks/useAuthentication'
import ReportOptions from '../ReportOptions'
import PdfViewer from '@/utils/PdfViewer'
import { useForm } from 'react-hook-form'
import dayjs from 'dayjs'
import ControlledSelect from '@/@core/components/ui/forms/controlled-react-select'
import { buildOptions } from '@/utils/helpers'
import CustomReportModal from '../CustomReportModal'
import { useModal } from '@ebay/nice-modal-react'
import { useSearch } from '../useReportSearch'
import { useEffect } from 'react'
import {
  useClassesQuery,
  useInstallmentsQuery,
  useProductsQuery,
  useStudentsQuery,
} from '@/gql/graphql'
import { BASE_REPORT_URL } from '@/utils/constants'
import {
  ActionButtonsContainer,
  ExportButton,
  FilterSection,
  OptionsGrid,
  CheckboxItem,
  CheckboxInput,
  CheckboxLabel,
  CheckboxIcon,
  StyledButton,
  PdfContainer,
  EmptyState,
} from '../report.style'
import SimpleDatePicker from '@/@core/components/ui/forms/simple-date-picker'

interface FormValues {
  period: any
  category: any
  product: any
  clazz: any
  showOnlyIncomplete: boolean
  installment: any
}

const FeePaymentDashboard = () => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()
  const {
    setValues,
    params,
    show,
    onSubmit,
    values: currentValues,
  } = useSearch({
    title: t('sidebar.reports.studentPaymentDashboard'),
    orientation: 'PORTRAIT',
    columnBorder: true,
    rowNumber: true,
  })
  const modal = useModal(CustomReportModal)

  const { data } = useStudentsQuery({
    variables: { id: enterpriseId },
  })

  const { data: productsData } = useProductsQuery({
    variables: { id: enterpriseId },
  })

  const { data: classesData } = useClassesQuery({
    variables: { id: enterpriseId },
  })

  const { data: installmentsData } = useInstallmentsQuery({
    variables: { id: enterpriseId },
  })

  const methods = useForm<FormValues>({
    defaultValues: {
      period: dayjs().toDate(),
      category: null,
      product: null,
      clazz: null,
      showOnlyIncomplete: false,
      installment: null,
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
          title={t('sidebar.reports.studentPaymentDashboard')}
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
              name="product"
              control={methods.control}
              label={t('label-products')}
              onChange={(val: any) => methods.setValue('product', val)}
              options={productsData ? productsData.products : ([] as any)}
              getOptionLabel={(option: any) => option.name}
              getOptionValue={(option: any) => option.id}
              placeholder={t('label-selectProducts')}
              isMulti
            />

            <ControlledSelect
              name="clazz"
              control={methods.control}
              label={t('label-classes')}
              onChange={(val: any) => methods.setValue('clazz', val)}
              options={classesData ? classesData.clazzes : ([] as any)}
              getOptionLabel={(option: any) => option.name}
              getOptionValue={(option: any) => option.id}
              placeholder={t('label-selectClasses')}
              isMulti
            />

            <ControlledSelect
              name="category"
              control={methods.control}
              label={t('label-students')}
              onChange={(val: any) => methods.setValue('category', val)}
              options={data ? data.students : ([] as any)}
              getOptionLabel={(option: any) => option.lastName}
              getOptionValue={(option: any) => option.id}
              placeholder={t('label-selectStudents')}
              isMulti
            />

            <ControlledSelect
              name="installment"
              control={methods.control}
              label={t('label-installments')}
              onChange={(val: any) => methods.setValue('installment', val)}
              options={
                installmentsData ? installmentsData.installments : ([] as any)
              }
              getOptionLabel={(option: any) => option.name}
              getOptionValue={(option: any) => option.id}
              placeholder={t('label-selectInstallments')}
              isMulti
            />
          </FilterSection>

          <OptionsGrid>
            <CheckboxItem>
              <CheckboxInput
                id="showOnlyIncomplete"
                checked={values.showOnlyIncomplete}
                onChange={(e) =>
                  methods.setValue('showOnlyIncomplete', e.target.checked)
                }
              />
              <CheckboxIcon>
                <AlertCircle size={18} />
              </CheckboxIcon>
              <CheckboxLabel>{t('label-showOnlyIncomplete')}</CheckboxLabel>
            </CheckboxItem>
          </OptionsGrid>

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
            <ExportButton
              as="a"
              href={`${BASE_REPORT_URL}/reports/fee-payment-dashboard-${enterpriseId}.xlsx?search=enterprise:${enterpriseId}${
                values.category && values.category.length > 0
                  ? `,student:${buildOptions(values.category)}`
                  : ''
              }${
                values.product && values.product.length > 0
                  ? `,product:${buildOptions(values.product)}`
                  : ''
              }${
                values.clazz && values.clazz.length > 0
                  ? `,clazz:${buildOptions(values.clazz)}`
                  : ''
              }${
                values.installment && values.installment.length > 0
                  ? `,installment:${buildOptions(values.installment)}`
                  : ''
              },${currentValues.search}&params=${params}&showOnlyIncomplete=${
                values.showOnlyIncomplete
              }`}
              className="round h-10 px-1"
            >
              <FileSpreadsheet size={16} />
              {t('label-exportToExcel')}
            </ExportButton>
          </ActionButtonsContainer>
        </Form>
      </ReportOptions>
      <PdfContainer>
        {show ? (
          <PdfViewer
            url={`reports/fee-payment-dashboard-${enterpriseId}.pdf?search=enterprise:${enterpriseId}${
              values.category && values.category.length > 0
                ? `,student:${buildOptions(values.category)}`
                : ''
            }${
              values.product && values.product.length > 0
                ? `,product:${buildOptions(values.product)}`
                : ''
            }${
              values.clazz && values.clazz.length > 0
                ? `,clazz:${buildOptions(values.clazz)}`
                : ''
            }${
              values.installment && values.installment.length > 0
                ? `,installment:${buildOptions(values.installment)}`
                : ''
            },${currentValues.search}&params=${params}&showOnlyIncomplete=${
              values.showOnlyIncomplete
            }
                `}
          />
        ) : (
          <EmptyState>
            <FileText />
            <p>
              {t('label-clickExecuteReportToView') ||
                "Cliquez sur 'Exécuter le rapport' pour voir le tableau de bord des paiements"}
            </p>
          </EmptyState>
        )}
      </PdfContainer>
    </div>
  )
}

export default FeePaymentDashboard
