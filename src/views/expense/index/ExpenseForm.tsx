import { useTranslation } from 'react-i18next'
import { Form, Table } from 'reactstrap'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { lazy, useEffect, useRef, useState } from 'react'
import type { FC } from 'react'
import { useAuthentication } from '@/hooks/useAuthentication'
import { useEventEmitter } from 'ahooks'
import { useFieldArray, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { messageService } from '@/utils/message.service'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'
import { INPUT_DATE_FORMAT, TOAST_OPTIONS } from '@/utils/constants'
import { formatError } from '@/utils/ErrorHelper'
import {
  computeCommonPartialTotal,
  computeCommonTotal,
  focusArrayField,
  handleFocusAndScroll,
  preventSubmitting,
  toCurrency,
} from '@/utils/helpers'
import LiveView from '@/utils/LiveView'
import ControlledSelect from '@/@core/components/ui/forms/controlled-select'
import DatePicker from '@/@core/components/ui/forms/date-picker'
import Input from '@/@core/components/ui/forms/input'
import SimpleInput from '@/@core/components/ui/simple-input'
import InputNumber from '@/@core/components/ui/forms/input-number'
import {
  MinusCircle,
  FileText,
  CreditCard,
  Tag,
  ShoppingCart,
  DollarSign,
  Package,
  Layers,
  Settings,
} from 'lucide-react'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import ExpenseCategoryAutoCompleteHint from '@/utils/ExpenseCategoryAutocompleteHint'
import FormSection from '@/@core/components/ui/forms/form-section'
import {
  DepartmentCreatedDocument,
  OperationClassCreatedDocument,
  PaymentModeCreatedDocument,
  SpecialAccountCreatedDocument,
  useCashVoucherAvailableQuery,
  useDepartmentsQuery,
  useOperationClassesQuery,
  usePaymentModesQuery,
  useSpecialAccountsQuery,
} from '@/gql/graphql'
import type { ExpenseType } from './expense.type'
import { expenseValidation } from './expense.validation'
import DepartmentAdd from '@/views/school/subjectDepartments/DepartmentAdd'
import useActionOnBackNavigation from '@/hooks/useActionOnBackNavigation'
import { voucherOptions } from '@/utils/select/selectComponents'

const PaymentModeAdd = lazy(
  () => import('@/views/payment/modes/PaymentModeAdd'),
)
const OperationClassAdd = lazy(
  () => import('@/views/core/operationClass/OperationClassAdd'),
)

interface ExpenseFormProps extends BaseFormProps {
  expense?: ExpenseType
  modal?: NiceModalHandler
}

const ExpenseForm: FC<ExpenseFormProps> = ({
  expense,
  action,
  modal,
  ...props
}) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const [total, setTotal] = useState(0)

  const bottomTableRef = useRef<HTMLSpanElement>(null)

  const focus$ = useEventEmitter()

  const {
    data: dataMode,
    loading: loadingMode,
    subscribeToMore: subscribeToMoreMode,
  } = usePaymentModesQuery({
    variables: { id: enterpriseId },
  })

  const {
    data: dataClass,
    loading: loadingClass,
    subscribeToMore: subscribeToMoreClass,
  } = useOperationClassesQuery({
    variables: { id: enterpriseId },
  })

  const {
    data: dataAccount,
    loading: loadingAccount,
    subscribeToMore: subscribeToMoreAccount,
  } = useSpecialAccountsQuery({
    variables: { id: enterpriseId },
  })

  const {
    data: dataDepartment,
    loading: loadingDepartment,
    subscribeToMore: subscribeToMoreDepartment,
  } = useDepartmentsQuery({
    variables: { id: enterpriseId },
  })

  const {
    data: dataVoucher,
    loading: loadingVoucher,
    subscribeToMore: subscribeToMoreVoucher,
  } = useCashVoucherAvailableQuery({
    variables: { id: enterpriseId },
    fetchPolicy: 'network-only',
  })

  const {
    control,
    handleSubmit,
    watch,
    formState: { isDirty },
    setValue,
    getValues,
    register,
  } = useForm<ExpenseType>({
    defaultValues: {
      items: expense ? expense.items : [],
      number: expense?.number || '',
      operationDate: expense ? dayjs(expense.operationDate).toDate() : null,

      paymentModeId: expense ? expense.paymentMode : null,
      paymentAccountId: expense ? expense.paymentAccount : null,
      departmentId: expense ? expense.department : null,
      voucherId: expense ? expense.voucher : null,
      note: expense?.note || '',
    },
    resolver: yupResolver(expenseValidation),
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'items' })

  const focusPriceField = focusArrayField(fields, 'unitPriceF', bottomTableRef)

  const onCategoryFill = (category: any) => {
    const item = {
      category: {
        id: category.id,
        name: category.name,
      },
      id: null,
      quantity: 1,
      quantityF: 1,
    }

    //@ts-ignore
    append(item)

    //focus quantity Field
    focusPriceField()
    computeTotal()
  }

  useEffect(() => {
    messageService.getMessage().subscribe((message) => {
      if (message) {
        if (message.name === 'paymentMode') {
          setValue('paymentModeId', message.value)
        }

        if (message.name === 'department') {
          setValue('departmentId', message.value)
        }
      }
    })
  }, [messageService])

  useEffect(() => {
    if (!expense && dataAccount) {
      setValue(
        'paymentAccountId',
        dataAccount?.specialAccounts
          ? dataAccount?.specialAccounts.filter(
              ({ specialAccountType, selected }: any) =>
                specialAccountType === 'PAYMENT' && selected,
            )[0]
          : null,
      )
    }
  }, [loadingAccount])

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    close?: boolean,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      const id = expense ? Number(expense.id) : undefined

      const items = values.items
        ? values.items
            .filter((item: any) => itemValid(item))
            .map((item: any) => ({
              id: item.id || null,
              categoryId: Number(item.category.id),
              unitPrice: Number(item.unitPrice),
              quantity: Number(item.quantity),
              description: item.description ? item.description : null,
              operationClassId: item.operationClassId
                ? Number(item.operationClassId.id)
                : null,
              personId: item.personId ? Number(item.personId.id) : null,
              expenseId: id,
            }))
        : null

      if (items?.length === 0) {
        toast("Veuillez spécifier les éléments qui font l'objet la dépense")
        return
      }

      action({
        variables: {
          expense: {
            id,
            operationDate: dayjs(values.operationDate).format(
              INPUT_DATE_FORMAT,
            ),
            number: values.number,
            items: items,
            enterpriseId,
            departmentId: values.departmentId
              ? Number(values.departmentId.id)
              : null,
            voucherId: values.voucherId ? Number(values.voucherId.id) : null,
            paymentModeId: values.paymentModeId
              ? Number(values.paymentModeId.id)
              : null,
            paymentAccountId: values.paymentAccountId
              ? Number(values.paymentAccountId.id)
              : null,
            note: values.note,
          },
        },
      })
        .then(async ({ data }) => {
          toast.success(`Dépense enregistrée`, { ...TOAST_OPTIONS })
          modal?.hide()
        })
        .catch((error) => {
          toast.error(
            `Impossible d'enregistrer la dépense: ${formatError(error)}`,
          )
        })
    })(event)
  }

  const itemValid = (item: any) => {
    const { quantity, unitPrice } = item
    return parseFloat(quantity) && parseFloat(unitPrice)
  }

  const updatePartialTotal = (index: number) => {
    const items = getValues('items')
    computeCommonPartialTotal(items, index, setValue)
  }

  const onChange = (index: number) => {
    updatePartialTotal(index)
    computeTotal()
  }

  const computeTotal = () => {
    const items = getValues('items')
    computeCommonTotal(items, setTotal)
  }

  const onOperationClassChange = (val: any, index: number) => {
    setValue(`items.${index}.operationClassId`, val)
  }

  useEffect(() => {
    computeTotal()
  }, [])

  // close the modal on back button click
  const isBackNavigation = useActionOnBackNavigation('/expenses')

  useEffect(() => {
    if (isBackNavigation) {
      modal?.hide()
    }
  }, [isBackNavigation])

  return (
    <Form onSubmit={onSubmit} className="flex flex-col gap-1">
      {/* Compact Header with Total */}
      <div className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg shadow-md p-2 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              {expense ? t('action.edit_expense') : t('action.add_expense')}
            </h2>
            <p className="text-emerald-100 text-xs">
              {t('text.fill_expense_details')}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs text-emerald-200 uppercase tracking-wider font-medium">
            {t('label-total_amount')}
          </span>
          <span className="text-2xl font-bold text-white">
            {toCurrency(total)}{' '}
            <span className="text-sm text-emerald-200">FCFA</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-1">
        {/* Left Sidebar */}
        <div className="xl:col-span-4 flex flex-col gap-1">
          {/* Payment Information */}
          <FormSection
            icon={<CreditCard />}
            title={t('label-payment_information')}
            description={t('text.select_payment_method')}
            color="#10b981"
          >
            <div className="space-y-3">
              <ControlledSelect
                name="voucherId"
                control={control}
                label={t('label-voucher')}
                loading={loadingVoucher}
                onChange={(val) => {
                  setValue('voucherId', val)
                  if (val) {
                    setValue('operationDate', dayjs(val.date).toDate())
                    setValue('items', [])
                    append({
                      id: undefined,
                      category: val.category as any,
                      unitPrice: val.amount as any,
                      quantity: 1,
                      quantityF: 1,
                      unitPriceF: val.amount as any,
                      description: val.reason,
                      operationClassId: null as any,
                      personId: null as any,
                      person: null as any,
                      operationClass: null as any,
                      total: val.amount as any,
                    })
                  }
                }}
                options={dataVoucher?.cashVouchers || []}
                getOptionLabel={(option) => option.number}
                getOptionValue={(option) => option.id}
                components={{ Option: voucherOptions }}
                optionLabel="number"
              />

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

              <LiveView
                document={SpecialAccountCreatedDocument}
                subscribeToMore={subscribeToMoreAccount}
                data={dataAccount}
                listVar="specialAccounts"
                singleVar="specialAccount"
                loading={loadingAccount}
                enterpriseId={enterpriseId}
              >
                {({ specialAccounts }) => (
                  <ControlledSelect
                    control={control}
                    name="paymentAccountId"
                    label={t('label-paymentAccount')}
                    required
                    options={
                      specialAccounts
                        ? specialAccounts.filter(
                            ({ specialAccountType }: any) =>
                              specialAccountType === 'PAYMENT',
                          )
                        : []
                    }
                    onChange={(val) => setValue('paymentAccountId', val)}
                    getOptionLabel={(o) => o.name}
                    getOptionValue={(o) => o.id}
                    isLoading={loadingAccount}
                  />
                )}
              </LiveView>
            </div>
          </FormSection>

          {/* Expense Details */}
          <FormSection
            icon={<FileText />}
            title={t('label-expense_details')}
            description={t('text.fill_expense_info')}
            color="#3b82f6"
          >
            <div className="space-y-3">
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
                placeholder={t('placeholder.expense_reference')}
              />

              <LiveView
                document={DepartmentCreatedDocument}
                singleVar="department"
                data={dataDepartment}
                listVar="departments"
                subscribeToMore={subscribeToMoreDepartment}
                sortField="name"
                triggerUpdate={true}
                enterpriseId={enterpriseId}
              >
                {({ departments }) => (
                  <ControlledSelect
                    name="departmentId"
                    control={control}
                    label={t('label-department')}
                    loading={loadingDepartment}
                    onChange={(val) => {
                      setValue('departmentId', val)
                    }}
                    options={departments || []}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.id}
                    form={<DepartmentAdd />}
                    formId="department"
                    optionLabel="name"
                    formTitle={t('action.add_department')}
                  />
                )}
              </LiveView>
            </div>
          </FormSection>

          {/* Note */}
          <FormSection icon={<Tag />} title={t('label-note')} color="#6b7280">
            <Input
              name="note"
              control={control}
              type="textarea"
              rows={3}
              placeholder={t('placeholder.add_note')}
            />
          </FormSection>
        </div>

        {/* Right Content - Items */}
        <div className="xl:col-span-8">
          <FormSection
            icon={<ShoppingCart />}
            title={t('label-expense_items')}
            description={t('text.add_expense_items')}
            color="#f59e0b"
            className="h-full"
          >
            <div className="mb-1">
              <ExpenseCategoryAutoCompleteHint
                onFill={onCategoryFill}
                focus$={focus$}
              />
            </div>

            <div className="overflow-x-auto -mx-1 px-0">
              <Table className="table table-bordered table-condensed table-hover0 responsive tableur mb-0">
                <thead className="bg-indigo-50/80 dark:bg-indigo-950/50 backdrop-blur-sm sticky top-0 z-10">
                  <tr className="border-b-2 border-indigo-200 dark:border-indigo-800">
                    <th className="w-10 text-center border-0 text-[11px] uppercase tracking-wider text-indigo-700 dark:text-indigo-300 font-bold py-1">
                      #
                    </th>
                    <th
                      style={{ width: '25%' }}
                      className="border-0 text-[11px] uppercase tracking-wider text-indigo-700 dark:text-indigo-300 font-bold py-1"
                    >
                      <div className="flex items-center gap-1.5">
                        <Package
                          size={12}
                          className="text-indigo-600 dark:text-indigo-400"
                        />
                        {t('label-category')}
                      </div>
                    </th>
                    <th className="border-0 text-[11px] uppercase tracking-wider text-indigo-700 dark:text-indigo-300 font-bold py-1">
                      <div className="flex items-center gap-1.5">
                        <Tag
                          size={12}
                          className="text-indigo-600 dark:text-indigo-400"
                        />
                        {t('label-description')}
                      </div>
                    </th>
                    <th className="w-16 border-0 text-[11px] uppercase tracking-wider text-indigo-700 dark:text-indigo-300 font-bold text-center py-1">
                      <div className="flex items-center gap-1 justify-center">
                        <Layers
                          size={12}
                          className="text-indigo-600 dark:text-indigo-400"
                        />
                        {t('label-qty')}
                      </div>
                    </th>
                    <th className="w-24 border-0 text-[11px] uppercase tracking-wider text-indigo-700 dark:text-indigo-300 font-bold text-right py-1">
                      <div className="flex items-center gap-1 justify-end">
                        <DollarSign
                          size={12}
                          className="text-indigo-600 dark:text-indigo-400"
                        />
                        P.U.
                      </div>
                    </th>
                    <th className="w-28 border-0 text-[11px] uppercase tracking-wider text-indigo-700 dark:text-indigo-300 font-bold text-right py-1">
                      <div className="flex items-center gap-1 justify-end">
                        <DollarSign
                          size={12}
                          className="text-indigo-600 dark:text-indigo-400"
                        />
                        {t('label-total')}
                      </div>
                    </th>
                    <th className="w-1/5 border-0 text-[11px] uppercase tracking-wider text-indigo-700 dark:text-indigo-300 font-bold py-1">
                      {t('label-class')}
                    </th>
                    <th className="w-12 text-center border-0 text-[11px] uppercase tracking-wider text-indigo-700 dark:text-indigo-300 font-bold py-1">
                      <Settings size={12} className="mx-auto" />
                    </th>
                  </tr>
                </thead>
                <tbody className="before:block before:h-0">
                  {fields.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-1">
                        <div className="text-indigo-600 dark:text-indigo-400 text-sm bg-indigo-50 dark:bg-indigo-950/30 rounded-lg border-2 border-dashed border-indigo-200 dark:border-indigo-800 py-2 px-10 inline-block">
                          <div className="flex flex-col items-center gap-1">
                            <ShoppingCart size={24} />
                            <span>{t('text.no_expense_items_added')}</span>
                            <span className="text-xs opacity-70">
                              {t('text.use_category_hint_to_add_items')}
                            </span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    fields.map((field, index) => (
                      <tr
                        key={field.id}
                        className="
                          bg-white dark:!bg-slate-900
                          border-1 border-indigo-100 dark:border-indigo-800/50
                          rounded-lg
                          transition-all duration-200
                          hover:border-indigo-300 dark:hover:border-indigo-600
                          hover:shadow-md
                        "
                      >
                        <td className="text-center border-0 py-0">
                          <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mx-auto shadow-sm">
                            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">
                              {index + 1}
                            </span>
                          </div>
                        </td>
                        <td className="border py-0" style={{ display: 'none' }}>
                          <SimpleInput
                            {...register(`items.${index}.id`)}
                            readOnly
                          />
                          <SimpleInput
                            {...register(`items.${index}.category.id`)}
                            readOnly
                          />
                        </td>
                        <td className="border p-0 !px-[4px]">
                          <span className="font-semibold text-sm text-gray-800 dark:text-gray-200">
                            {watch(`items.${index}.category.name`)}
                          </span>
                        </td>

                        <td className="border p-0">
                          <SimpleInput
                            {...register(`items.${index}.description`)}
                            onKeyPress={preventSubmitting}
                            onKeyUp={(e) => handleFocusAndScroll(e, focus$)}
                            className="
                              w-full text-sm
                              bg-white dark:!bg-slate-800
                              rounded-none border-0
                              focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400
                              text-gray-900 dark:text-gray-100
                              placeholder:text-gray-400
                            "
                          />
                        </td>

                        <td className="border p-0 !text-center">
                          <InputNumber
                            {...register(`items.${index}.quantityF`)}
                            value={watch(`items.${index}.quantityF`)}
                            onKeyPress={preventSubmitting}
                            onKeyUp={(e) => handleFocusAndScroll(e, focus$)}
                            onValueChange={(val) => {
                              setValue(
                                `items.${index}.quantityF`,
                                val.formattedValue,
                              )
                              setValue(`items.${index}.quantity`, val.value)
                              onChange(index)
                            }}
                            className="
                              w-full text-center text-sm font-medium
                              bg-white dark:!bg-slate-800
                              border-0 border-indigo-200 dark:border-indigo-700
                              rounded-none
                              focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400
                              text-gray-900 dark:text-gray-100
                            "
                          />
                        </td>

                        <td className="border p-0 !text-right">
                          <InputNumber
                            {...register(`items.${index}.unitPriceF`)}
                            value={watch(`items.${index}.unitPriceF`)}
                            onKeyPress={preventSubmitting}
                            onKeyUp={(e) => handleFocusAndScroll(e, focus$)}
                            onValueChange={(val) => {
                              setValue(
                                `items.${index}.unitPriceF`,
                                val.formattedValue,
                              )
                              setValue(`items.${index}.unitPrice`, val.value)
                              onChange(index)
                            }}
                            className="
                              w-full text-right text-sm font-medium
                              bg-white dark:!bg-slate-800
                              border-0 border-indigo-200 dark:border-indigo-700
                              rounded-none
                              focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400
                              text-gray-900 dark:text-gray-100
                            "
                          />
                        </td>

                        <td className="border p-0 !text-right">
                          <InputNumber
                            {...register(`items.${index}.total`)}
                            readOnly
                            value={watch(`items.${index}.total`)}
                            className="
                              w-full text-right text-sm font-bold
                              bg-indigo-50 dark:!bg-indigo-900/30
                              border-0
                              text-indigo-700 dark:text-indigo-300
                            "
                          />
                        </td>

                        <td className="border p-0 h-full">
                          <LiveView
                            document={OperationClassCreatedDocument}
                            subscribeToMore={subscribeToMoreClass}
                            listVar="operationClasses"
                            singleVar="operationClass"
                            data={dataClass}
                            sortField="name"
                            enterpriseId={enterpriseId}
                          >
                            {({ operationClasses }) => (
                              <ControlledSelect
                                name={`items.${index}.operationClassId`}
                                control={control}
                                loading={loadingClass}
                                onChange={(val) =>
                                  onOperationClassChange(val, index)
                                }
                                options={
                                  operationClasses ? operationClasses : []
                                }
                                getOptionLabel={(option) => option.name}
                                getOptionValue={(option) => option.id}
                                form={<OperationClassAdd />}
                                formId="operationClass"
                                optionLabel="name"
                                className="text-xs h-full"
                                formTitle={t('action.add_operationClass')}
                                styles={{
                                  control: (provided: any) => ({
                                    ...provided,
                                    borderRadius: '0px',
                                    borderColor: 'none',
                                  }),
                                }}
                              />
                            )}
                          </LiveView>
                        </td>

                        <td className="border-0 py-0 !text-center">
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="
                              p-[5px]
                              text-indigo-500 hover:text-white
                              bg-indigo-50 hover:bg-indigo-500
                              dark:bg-indigo-900/30 dark:hover:bg-indigo-600
                              border-2 border-indigo-200 hover:border-indigo-500
                              dark:border-indigo-800 dark:hover:border-indigo-600
                              rounded-lg
                              transition-all duration-200
                            "
                          >
                            <MinusCircle size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                {fields.length > 0 && (
                  <tfoot className="bg-indigo-50/80 dark:bg-indigo-950/50 border-t-2 border-indigo-200 dark:border-indigo-800">
                    <tr>
                      <td colSpan={5} className="border-0 py-1 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <DollarSign
                            size={16}
                            className="text-indigo-600 dark:text-indigo-400"
                          />
                          <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                            {t('label-total_amount')}
                          </span>
                        </div>
                      </td>
                      <td className="border-0 py-1 text-right">
                        <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                          {toCurrency(total)}
                        </span>
                      </td>
                      <td colSpan={2} className="border-0"></td>
                    </tr>
                  </tfoot>
                )}
              </Table>
              <span ref={bottomTableRef} />
            </div>
          </FormSection>
        </div>
      </div>

      <ActionButtons
        cancelAction={modal?.hide}
        isSubmitting={props.loading}
        popover={props.popover}
        dirty={isDirty}
        onSubmit={onSubmit}
        fixed={true}
      />
    </Form>
  )
}

export default ExpenseForm
