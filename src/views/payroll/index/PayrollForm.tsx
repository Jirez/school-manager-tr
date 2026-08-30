import { useTranslation } from 'react-i18next'
import { Form, Table } from 'reactstrap'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import type { FC } from 'react'
import { useEffect, useRef, useState } from 'react'
import { useAuthentication } from '@/hooks/useAuthentication'
import { useEventEmitter } from 'ahooks'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { messageService } from '@/utils/message.service'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'
import { INPUT_DATE_FORMAT, TOAST_OPTIONS } from '@/utils/constants'
import { formatError } from '@/utils/ErrorHelper'
import {
  computePayrollPartialTotalFn,
  computePayrollTotalFn,
  computeTaxablePayrollTotalFn,
  concat,
  focusArrayField,
  preventSubmitting,
  toCurrency,
} from '@/utils/helpers'
import LiveView from '@/utils/LiveView'
import ControlledSelect from '@/@core/components/ui/forms/controlled-select'
import DatePicker from '@/@core/components/ui/forms/date-picker'
import Input from '@/@core/components/ui/forms/input'
import InputNumber from '@/@core/components/ui/forms/input-number'
import {
  User,
  Calendar,
  DollarSign,
  Hash,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Building,
  FileText,
  Settings,
  Trash2,
} from 'lucide-react'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import {
  EmployeeCreatedDocument,
  PaymentModeCreatedDocument,
  PayrollPeriodCreatedDocument,
  useEmployeesWithoutPayrollQuery,
  usePaymentModesQuery,
  usePayrollPeriodsQuery,
} from '@/gql/graphql'
import type { PayrollType } from './payroll.type'
import { payrollValidation } from './payroll.validation'
import EarningTypeAutoCompleteHint from '@/utils/EarningTypeAutocompleteHint'
import DeductionTypeAutoCompleteHint from '@/utils/DeductionTypeAutocompleteHint'
import {
  employeeOptions,
  employeeSingleValue,
  payrollPeriodOptions,
  payrollPeriodSingleValue,
} from '@/utils/select/selectComponents'
import useActionOnBackNavigation from '@/hooks/useActionOnBackNavigation'
import PaymentModeAdd from '@/views/payment/modes/PaymentModeAdd'
import FormSection from '@/@core/components/ui/forms/form-section'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'
import NumericInput from '@/@core/components/ui/forms/numeric-input'

interface PayrollFormProps extends BaseFormProps {
  payroll?: PayrollType
  modal?: NiceModalHandler
}

const PayrollForm: FC<PayrollFormProps> = ({
  payroll,
  action,
  modal,
  ...props
}) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const [grossSalary, setGrossSalary] = useState(0)
  const [taxableSalary, setTaxableSalary] = useState(0)
  const [totalEmployeeDeduction, setTotalEmployeeDeduction] = useState(0)
  const [totalEmployerDeduction, setTotalEmployerDeduction] = useState(0)

  const bottomTableRef = useRef<HTMLSpanElement>(null)
  const bottomDeductionTableRef = useRef<HTMLSpanElement>(null)
  const bottomEmployerDeductionTableRef = useRef<HTMLSpanElement>(null)

  const focus$ = useEventEmitter()
  const focusDeduction$ = useEventEmitter()
  const focusEmployerDeduction$ = useEventEmitter()

  const {
    control,
    handleSubmit,
    watch,
    formState: { isDirty },
    setValue,
    getValues,
    register,
  } = useForm<PayrollType>({
    defaultValues: {
      number: payroll?.number || '',
      operationDate: payroll ? dayjs(payroll.operationDate).toDate() : null,
      employeeId: payroll
        ? {
            id: payroll.employee.id,
            personnel: {
              lastName: payroll.employee.personnel.lastName,
              firstName: payroll.employee.personnel.firstName,
            },
          }
        : null,
      periodId: payroll ? payroll.period : null,
      paymentModeId: payroll ? payroll.paymentMode : null,
      note: payroll?.note || '',
      baseSalary: payroll?.baseSalary || '',
      baseSalaryF: payroll?.baseSalary || '',
      earnings: payroll ? payroll.earnings : [],
      deductions: payroll ? payroll.deductions : [],
      employerDeductions: payroll ? payroll.employerDeductions : [],
    },
    //@ts-ignore
    resolver: yupResolver(payrollValidation),
  })

  // selected period
  const period = useWatch({ control, name: 'periodId' })

  const {
    data: dataMode,
    loading: loadingMode,
    subscribeToMore: subscribeToMoreMode,
  } = usePaymentModesQuery({
    variables: { id: enterpriseId },
  })

  const {
    data: dataEmployee,
    loading: loadingEmployee,
    subscribeToMore: subscribeToMoreEmployee,
  } = useEmployeesWithoutPayrollQuery({
    variables: {
      enterpriseId: enterpriseId,
      periodId: period?.id || null,
    },
    fetchPolicy: 'network-only',
    skip: period?.id === undefined || period?.id === null,
  })

  const {
    data: dataPeriod,
    loading: loadingPeriod,
    subscribeToMore: subscribeToMorePeriod,
  } = usePayrollPeriodsQuery({
    variables: { id: enterpriseId },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'earnings',
  })

  const {
    fields: fieldDeductions,
    append: appendDeductions,
    remove: removeDeductions,
  } = useFieldArray({
    control,
    name: 'deductions',
  })

  const {
    fields: fieldEmployerDeductions,
    append: appendEmployerDeductions,
    remove: removeEmployerDeductions,
  } = useFieldArray({
    control,
    name: 'employerDeductions',
  })

  const focusPriceField = focusArrayField(
    fields,
    'baseF',
    bottomTableRef,
    'earnings',
  )

  const focusDeductionField = focusArrayField(
    fieldDeductions,
    'baseF',
    bottomDeductionTableRef,
    'deductions',
  )

  const focusEmployerDeductionField = focusArrayField(
    fieldEmployerDeductions,
    'baseF',
    bottomEmployerDeductionTableRef,
    'employerDeductions',
  )

  const onItemFill = (element: any) => {
    const baseSalary = getValues('baseSalary')
    const item = {
      item: {
        id: element.id,
        name: element.name,
      },
      id: null,
      isTaxable: element.isTaxable,
      base: element.calculationType === 'PERCENTAGE' ? baseSalary : null,
      baseF: element.calculationType === 'PERCENTAGE' ? baseSalary : null,
      rate: element.calculationType === 'AMOUNT' ? 100 : null,
      rateF: element.calculationType === 'AMOUNT' ? 100 : null,
    }

    //@ts-ignore
    append(item)

    focusPriceField()
  }

  const onDeductionFill = (element: any) => {
    const totalTaxableSalary = taxableSalary + Number(getValues('baseSalary'))
    const item = {
      item: {
        id: element.id,
        name: element.name,
      },
      id: null,
      base:
        element.calculationType === 'PERCENTAGE' ? totalTaxableSalary : null,
      baseF:
        element.calculationType === 'PERCENTAGE' ? totalTaxableSalary : null,
      rate: element.calculationType === 'AMOUNT' ? 100 : null,
      rateF: element.calculationType === 'AMOUNT' ? 100 : null,
    }

    //@ts-ignore
    appendDeductions(item)

    focusDeductionField()
  }

  const onEmployerDeductionFill = (element: any) => {
    const totalTaxableSalary = taxableSalary + Number(getValues('baseSalary'))
    const item = {
      item: {
        id: element.id,
        name: element.name,
      },
      id: null,
      base:
        element.calculationType === 'PERCENTAGE' ? totalTaxableSalary : null,
      baseF:
        element.calculationType === 'PERCENTAGE' ? totalTaxableSalary : null,
      rate: element.calculationType === 'AMOUNT' ? 100 : null,
      rateF: element.calculationType === 'AMOUNT' ? 100 : null,
    }

    //@ts-ignore
    appendEmployerDeductions(item)

    focusEmployerDeductionField()
  }

  useEffect(() => {
    messageService.getMessage().subscribe((message) => {
      if (message) {
        if (message.name === 'period') {
          setValue('periodId', message.value)
        }

        if (message.name === 'employee') {
          setValue('employeeId', message.value)
        }

        if (message.name === 'paymentMode') {
          setValue('paymentModeId', message.value)
        }
      }
    })
  }, [messageService])

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    close?: boolean,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      const id = payroll ? Number(payroll.id) : undefined

      const earnings = values.earnings
        ? values.earnings
            .filter((item: any) => itemValid(item))
            .map((item: any) => ({
              id: item.id,
              earningId: Number(item.item.id),
              base: parseFloat(String(item.base)),
              rate: parseFloat(String(item.rate)),
              description: item.description ? item.description : null,
              payrollId: id,
              isTaxable: item.isTaxable,
            }))
        : null

      const deductions = values.deductions
        ? values.deductions
            .filter((item: any) => itemValid(item))
            .map((item: any) => ({
              id: item.id,
              deductionId: Number(item.item.id),
              base: parseFloat(String(item.base)),
              rate: parseFloat(String(item.rate)),
              description: item.description ? item.description : null,
              payrollId: id,
            }))
        : null

      const employerDeductions = values.employerDeductions
        ? values.employerDeductions
            .filter((item: any) => itemValid(item))
            .map((item: any) => ({
              id: item.id,
              deductionId: Number(item.item.id),
              base: parseFloat(String(item.base)),
              rate: parseFloat(String(item.rate)),
              description: item.description ? item.description : null,
              payrollId: id,
            }))
        : null

      action({
        variables: {
          payroll: {
            id,
            operationDate: dayjs(values.operationDate).format(
              INPUT_DATE_FORMAT,
            ),
            number: values.number ? values.number : null,
            earnings: earnings,
            enterpriseId,
            employeeId: values.employeeId ? Number(values.employeeId.id) : null,
            periodId: values.periodId ? Number(values.periodId.id) : null,
            paymentModeId: values.paymentModeId
              ? Number(values.paymentModeId.id)
              : null,
            baseSalary: values.baseSalary ? Number(values.baseSalary) : null,
            note: values.note ? values.note : null,
            deductions: deductions,
            employerDeductions: employerDeductions,
          },
        },
      })
        .then(async ({ data }) => {
          toast.success(`Paie enregistrée`, { ...TOAST_OPTIONS })
          modal?.hide()
        })
        .catch((error) => {
          toast.error(`Impossible d'enregistrer la paie: ${formatError(error)}`)
        })
    })(event)
  }

  const itemValid = (item: any) => {
    const { base, rate } = item
    return parseFloat(base) && parseFloat(rate)
  }

  const updatePartialTotal = (
    index: number,
    arrayName: any,
    callback?: any,
  ) => {
    const items = getValues(arrayName)
    computePayrollPartialTotalFn(items, index, arrayName, callback)
  }

  const onChange = (
    index: number,
    arrayName: any,
    callback?: any,
    callback2?: any,
  ) => {
    updatePartialTotal(index, arrayName, callback)
    computeTotal(arrayName, callback2)
  }

  const computeTotal = (arrayName: any, callback?: any) => {
    const items = getValues(arrayName)
    computePayrollTotalFn(items, callback)
    if (arrayName === 'earnings') {
      computeTaxableTotal()
    }
  }

  const computeTaxableTotal = () => {
    const items = getValues('earnings')
    computeTaxablePayrollTotalFn(items, setTaxableSalary)
  }

  useEffect(() => {
    if (payroll?.id) {
      computeTotal('earnings', setGrossSalary)
      computeTotal('deductions', setTotalEmployeeDeduction)
      computeTaxableTotal()
      computeTotal('employerDeductions', setTotalEmployerDeduction)
    }
  }, [])

  const isBackNavigation = useActionOnBackNavigation('/payrolls')

  useEffect(() => {
    if (isBackNavigation) {
      modal?.hide()
    }
  }, [isBackNavigation])

  return (
    <Form onSubmit={onSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-1 gap-y-1">
        <FormSection
          title={t('label-payrollInfo') || 'Informations de la paie'}
          description={
            t('label-payrollInfoDesc') || 'Employé, période et base salariale'
          }
          icon={<Settings size={18} />}
          color="#7367f0"
        >
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
              <LiveView
                document={PayrollPeriodCreatedDocument}
                singleVar="payrollPeriod"
                data={dataPeriod}
                listVar="payrollPeriods"
                subscribeToMore={subscribeToMorePeriod}
                sortField="designation"
                triggerUpdate={true}
                enterpriseId={enterpriseId}
              >
                {({ payrollPeriods }) => (
                  <ControlledSelect
                    name="periodId"
                    control={control}
                    label={t('label-period')}
                    required
                    prepend={<Calendar size={16} />}
                    loading={loadingMode}
                    onChange={(val) => {
                      setValue('periodId', val)
                    }}
                    options={payrollPeriods || []}
                    getOptionLabel={(option) =>
                      option.startDate + ' - ' + option.endDate
                    }
                    getOptionValue={(option) => option.id}
                    formId="period"
                    optionLabel="designation"
                    formTitle={t('action.add_payrollPeriod')}
                    modalClassName="modal-md"
                    isLoading={loadingPeriod}
                    components={{
                      Option: payrollPeriodOptions,
                      SingleValue: payrollPeriodSingleValue,
                    }}
                  />
                )}
              </LiveView>

              <NumericInput
                name="baseSalary"
                nameF="baseSalaryF"
                control={control}
                setValue={setValue}
                label={t('label-baseSalary')}
                prepend={<DollarSign size={16} />}
              />
            </div>

            <LiveView
              document={EmployeeCreatedDocument}
              singleVar="employee"
              data={dataEmployee}
              listVar="employees"
              subscribeToMore={subscribeToMoreEmployee}
              triggerUpdate={true}
              enterpriseId={enterpriseId}
              showLoader={false}
            >
              {({ employees }) => (
                <ControlledSelect
                  name="employeeId"
                  control={control}
                  label={t('label-earner')}
                  prepend={<User size={16} />}
                  //loading={!period?.id ? loadingEmployee : false}
                  //loading={false}
                  onChange={(val) => {
                    setValue('employeeId', val)
                    setValue('baseSalaryF', val?.baseSalary)
                    setValue('baseSalary', val?.baseSalary)
                  }}
                  options={
                    employees?.filter(
                      (employee: any) =>
                        employee.employmentStatus !== 'TERMINATED',
                    ) || []
                  }
                  getOptionValue={(option) => option.id}
                  getOptionLabel={(option) =>
                    concat(
                      option.personnel.lastName,
                      option.personnel.firstName,
                    )
                  }
                  components={{
                    Option: employeeOptions,
                    SingleValue: employeeSingleValue,
                  }}
                  formId="employee"
                  formTitle={t('action.add_employee')}
                  isDisabled={!period}
                />
              )}
            </LiveView>
          </div>
        </FormSection>

        <FormSection
          title={t('label-payrollDetails') || "Détails de l'opération"}
          description={
            t('label-payrollDetailsDesc') || 'Date, référence et paiement'
          }
          icon={<FileText size={18} />}
          color="#28c76f"
        >
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
              <DatePicker
                name="operationDate"
                label={t('label-operationDate')}
                control={control}
                required
              />

              <Input
                name="number"
                label={t('label-number')}
                control={control}
                prepend={<Hash size={16} />}
                placeholder={'Référence'}
              />
            </div>

            <LiveView
              document={PaymentModeCreatedDocument}
              singleVar="paymentMode"
              data={dataMode}
              listVar="paymentModes"
              subscribeToMore={subscribeToMoreMode}
              sortField="name"
              triggerUpdate={true}
              enterpriseId={enterpriseId}
            >
              {({ paymentModes }) => (
                <ControlledSelect
                  name="paymentModeId"
                  control={control}
                  label={t('label-paymentMode')}
                  required
                  prepend={<CreditCard size={16} />}
                  loading={loadingMode}
                  onChange={(val) => {
                    setValue('paymentModeId', val)
                  }}
                  options={paymentModes || []}
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option.id}
                  form={<PaymentModeAdd />}
                  formId="paymentMode"
                  optionLabel="name"
                  formTitle={t('action.add_paymentMode')}
                  modalClassName="modal-md"
                  isLoading={loadingMode}
                />
              )}
            </LiveView>
          </div>
        </FormSection>

        <FormSection
          title={t('label-note')}
          description={t('label-noteDesc') || 'Commentaires sur la paie'}
          icon={<FileText size={18} />}
          color="#ff9f43"
          className="col-span-full"
        >
          <Input
            name="note"
            label=""
            control={control}
            type="textarea"
            rows={2}
          />
        </FormSection>

        <FormSection
          icon={<TrendingUp size={18} />}
          title={t('label-summary', 'Summary')}
          description={t(
            'payroll.summaryDesc',
            'Review calculated totals for this payroll',
          )}
          className="col-span-full"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-1 bg-light dark:bg-transparent p-1 rounded border">
            <div className="flex flex-col">
              <span className="text-muted-foreground text-sm">
                {t('label-grossSalary')}
              </span>
              <span className="font-semibold text-lg text-primary">
                {toCurrency(grossSalary + Number(getValues('baseSalary')))}
              </span>
            </div>

            <div className="flex flex-col border-l pl-1">
              <span className="text-muted-foreground text-sm">
                {t('label-taxableSalary')}
              </span>
              <span className="font-semibold text-lg">
                {toCurrency(taxableSalary + Number(getValues('baseSalary')))}
              </span>
            </div>

            <div className="flex flex-col border-l pl-1">
              <span className="text-muted-foreground text-sm">
                {t('label-totalEmployeeDeduction')}
              </span>
              <span className="font-semibold text-lg text-danger">
                {toCurrency(totalEmployeeDeduction)}
              </span>
            </div>

            <div className="flex flex-col border-l pl-1">
              <span className="text-muted-foreground text-sm">
                {t('label-totalEmployerDeduction')}
              </span>
              <span className="font-semibold text-lg text-warning">
                {toCurrency(totalEmployerDeduction)}
              </span>
            </div>

            <div className="flex flex-col border-l pl-1 bg-primary/10 rounded-r -m-1 p-1">
              <span className="text-primary text-sm font-medium">
                {t('label-netSalary')}
              </span>
              <span className="font-bold text-xl text-primary">
                {toCurrency(
                  grossSalary +
                    Number(getValues('baseSalary')) -
                    totalEmployeeDeduction,
                )}
              </span>
            </div>
          </div>
        </FormSection>

        {/* Earnings */}
        <FormSection
          title={t('label-earnings')}
          description={t('label-earningsDesc') || 'Primes et indemnités'}
          icon={<TrendingUp size={18} />}
          color="#7367f0"
          className="col-span-full"
        >
          <div className="flex flex-col">
            <div className="w-full mb-4">
              <EarningTypeAutoCompleteHint
                onFill={onItemFill}
                focus$={focus$}
              />
            </div>

            <div className="overflow-x-auto">
              <Table className="table table-hover border rounded-lg">
                <thead className="bg-slate-50 dark:bg-slate-800">
                  <tr>
                    <th className="w-10 text-center">#</th>
                    <th className="w-1/4">{t('label-earning')}</th>
                    <th>{t('label-description')}</th>
                    <th className="w-40">{t('label-base')}</th>
                    <th className="w-32">{t('label-rate')} (%)</th>
                    <th className="w-40 text-right">{t('label-total')}</th>
                    <th className="w-10 text-center">
                      <Settings size={14} className="mx-auto" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {fields.map((field, index) => (
                    <tr key={field.id} className="align-middle">
                      <td className="text-center font-medium">{index + 1}</td>
                      <td className="hidden">
                        <input
                          {...register(`earnings.${index}.id`)}
                          type="hidden"
                        />
                        <input
                          {...register(`earnings.${index}.item.id`)}
                          type="hidden"
                        />
                        <input
                          {...register(`earnings.${index}.isTaxable`)}
                          type="hidden"
                        />
                      </td>
                      <td>
                        <span className="font-semibold block truncate max-w-[200px]">
                          {getValues(`earnings.${index}.item.name`)}
                        </span>
                      </td>
                      <td>
                        <Input
                          name={`earnings.${index}.description`}
                          control={control}
                          className="mb-0"
                          placeholder="Note..."
                        />
                      </td>
                      <td>
                        <InputNumber
                          {...register(`earnings.${index}.baseF`)}
                          value={watch(`earnings.${index}.baseF`)}
                          onKeyPress={preventSubmitting}
                          onValueChange={(val) => {
                            setValue(
                              `earnings.${index}.baseF`,
                              val.formattedValue,
                            )
                            setValue(`earnings.${index}.base`, val.value)
                            onChange(
                              index,
                              'earnings',
                              setValue,
                              setGrossSalary,
                            )
                          }}
                        />
                      </td>
                      <td>
                        <InputNumber
                          {...register(`earnings.${index}.rateF`)}
                          value={watch(`earnings.${index}.rateF`)}
                          onKeyPress={preventSubmitting}
                          onValueChange={(val) => {
                            setValue(
                              `earnings.${index}.rateF`,
                              val.formattedValue,
                            )
                            setValue(`earnings.${index}.rate`, val.value)
                            onChange(
                              index,
                              'earnings',
                              setValue,
                              setGrossSalary,
                            )
                          }}
                        />
                      </td>
                      <td className="text-right font-bold text-primary">
                        {toCurrency(watch(`earnings.${index}.total`) || 0)}
                      </td>
                      <td className="text-center">
                        <button
                          type="button"
                          className="btn btn-icon btn-flat-danger btn-sm p-1"
                          onClick={() => remove(index)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {fields.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center py-6 text-slate-400 italic"
                      >
                        Aucun gain spécifié
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
            <span ref={bottomTableRef} />
          </div>
        </FormSection>

        {/* Employee Deductions */}
        <FormSection
          title={t('label-totalEmployeeDeduction')}
          description={
            t('label-totalEmployeeDeductionDesc') || "Déductions de l'employé"
          }
          icon={<TrendingDown size={18} />}
          color="#ea5455"
          className="col-span-full"
        >
          <div className="flex flex-col">
            <div className="w-full mb-4">
              <DeductionTypeAutoCompleteHint
                onFill={onDeductionFill}
                focus$={focusDeduction$}
              />
            </div>

            <div className="overflow-x-auto">
              <Table className="table table-hover border rounded-lg">
                <thead className="bg-slate-50 dark:bg-slate-800">
                  <tr>
                    <th className="w-10 text-center">#</th>
                    <th className="w-1/4">{t('label-deduction')}</th>
                    <th>{t('label-description')}</th>
                    <th className="w-40">{t('label-base')}</th>
                    <th className="w-32">{t('label-rate')} (%)</th>
                    <th className="w-40 text-right">{t('label-total')}</th>
                    <th className="w-10 text-center">
                      <Settings size={14} className="mx-auto" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {fieldDeductions.map((field, index) => (
                    <tr key={field.id} className="align-middle">
                      <td className="text-center font-medium">{index + 1}</td>
                      <td className="hidden">
                        <input
                          {...register(`deductions.${index}.id`)}
                          type="hidden"
                        />
                        <input
                          {...register(`deductions.${index}.item.id`)}
                          type="hidden"
                        />
                      </td>
                      <td>
                        <span className="font-semibold block truncate max-w-[200px]">
                          {getValues(`deductions.${index}.item.name`)}
                        </span>
                      </td>
                      <td>
                        <Input
                          name={`deductions.${index}.description`}
                          control={control}
                          className="mb-0"
                          placeholder="Note..."
                        />
                      </td>
                      <td>
                        <InputNumber
                          {...register(`deductions.${index}.baseF`)}
                          value={watch(`deductions.${index}.baseF`)}
                          onKeyPress={preventSubmitting}
                          onValueChange={(val) => {
                            setValue(
                              `deductions.${index}.baseF`,
                              val.formattedValue,
                            )
                            setValue(`deductions.${index}.base`, val.value)
                            onChange(
                              index,
                              'deductions',
                              setValue,
                              setTotalEmployeeDeduction,
                            )
                          }}
                        />
                      </td>
                      <td>
                        <InputNumber
                          {...register(`deductions.${index}.rateF`)}
                          value={watch(`deductions.${index}.rateF`)}
                          onKeyPress={preventSubmitting}
                          onValueChange={(val) => {
                            setValue(
                              `deductions.${index}.rateF`,
                              val.formattedValue,
                            )
                            setValue(`deductions.${index}.rate`, val.value)
                            onChange(
                              index,
                              'deductions',
                              setValue,
                              setTotalEmployeeDeduction,
                            )
                          }}
                        />
                      </td>
                      <td className="text-right font-bold text-danger">
                        {toCurrency(watch(`deductions.${index}.total`) || 0)}
                      </td>
                      <td className="text-center">
                        <button
                          type="button"
                          className="btn btn-icon btn-flat-danger btn-sm p-1"
                          onClick={() => removeDeductions(index)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            <span ref={bottomDeductionTableRef} />
          </div>
        </FormSection>

        {/* Employer Deductions */}
        <FormSection
          title={t('label-totalEmployerDeduction')}
          description={
            t('label-totalEmployerDeductionDesc') || "Charges de l'employeur"
          }
          icon={<Building size={18} />}
          color="#ff9f43"
          className="col-span-full"
        >
          <div className="flex flex-col">
            <div className="w-full mb-4">
              <DeductionTypeAutoCompleteHint
                onFill={onEmployerDeductionFill}
                focus$={focusEmployerDeduction$}
              />
            </div>

            <div className="overflow-x-auto">
              <Table className="table table-hover border rounded-lg">
                <thead className="bg-slate-50 dark:bg-slate-800">
                  <tr>
                    <th className="w-10 text-center">#</th>
                    <th className="w-1/4">{t('label-deduction')}</th>
                    <th>{t('label-description')}</th>
                    <th className="w-40">{t('label-base')}</th>
                    <th className="w-32">{t('label-rate')} (%)</th>
                    <th className="w-40 text-right">{t('label-total')}</th>
                    <th className="w-10 text-center">
                      <Settings size={14} className="mx-auto" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {fieldEmployerDeductions.map((field, index) => (
                    <tr key={field.id} className="align-middle">
                      <td className="text-center font-medium">{index + 1}</td>
                      <td className="hidden">
                        <input
                          {...register(`employerDeductions.${index}.id`)}
                          type="hidden"
                        />
                        <input
                          {...register(`employerDeductions.${index}.item.id`)}
                          type="hidden"
                        />
                      </td>
                      <td>
                        <span className="font-semibold block truncate max-w-[200px]">
                          {getValues(`employerDeductions.${index}.item.name`)}
                        </span>
                      </td>
                      <td>
                        <Input
                          name={`employerDeductions.${index}.description`}
                          control={control}
                          className="mb-0"
                          placeholder="Note..."
                        />
                      </td>
                      <td>
                        <InputNumber
                          {...register(`employerDeductions.${index}.baseF`)}
                          value={watch(`employerDeductions.${index}.baseF`)}
                          onKeyPress={preventSubmitting}
                          onValueChange={(val) => {
                            setValue(
                              `employerDeductions.${index}.baseF`,
                              val.formattedValue,
                            )
                            setValue(
                              `employerDeductions.${index}.base`,
                              val.value,
                            )
                            onChange(
                              index,
                              'employerDeductions',
                              setValue,
                              setTotalEmployerDeduction,
                            )
                          }}
                        />
                      </td>
                      <td>
                        <InputNumber
                          {...register(`employerDeductions.${index}.rateF`)}
                          value={watch(`employerDeductions.${index}.rateF`)}
                          onKeyPress={preventSubmitting}
                          onValueChange={(val) => {
                            setValue(
                              `employerDeductions.${index}.rateF`,
                              val.formattedValue,
                            )
                            setValue(
                              `employerDeductions.${index}.rate`,
                              val.value,
                            )
                            onChange(
                              index,
                              'employerDeductions',
                              setValue,
                              setTotalEmployerDeduction,
                            )
                          }}
                        />
                      </td>
                      <td className="text-right font-bold text-warning">
                        {toCurrency(
                          watch(`employerDeductions.${index}.total`) || 0,
                        )}
                      </td>
                      <td className="text-center">
                        <button
                          type="button"
                          className="btn btn-icon btn-flat-danger btn-sm p-1"
                          onClick={() => removeEmployerDeductions(index)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            <span ref={bottomEmployerDeductionTableRef} />
          </div>
        </FormSection>
      </div>

      <StickyActions>
        <ActionButtons
          cancelAction={modal?.hide}
          isSubmitting={props.loading}
          popover={props.popover}
          dirty={isDirty}
          onSubmit={onSubmit}
        />
      </StickyActions>
    </Form>
  )
}

export default PayrollForm
