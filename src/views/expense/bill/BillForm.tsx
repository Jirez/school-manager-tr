import { useTranslation } from 'react-i18next'
import { Form, Table } from 'reactstrap'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { lazy, useEffect, useRef, useState } from 'react'
import type { FC } from 'react'
import { useAuthentication } from '@/hooks/useAuthentication'
import { useEventEmitter, useKeyPress } from 'ahooks'
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
  Briefcase,
  ShoppingCart,
  Hash,
  Edit3,
  DollarSign,
  Package,
  Tag,
  Layers,
} from 'lucide-react'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import {
  personOptions,
  personSingleValue,
} from '@/utils/select/selectComponents'
// import { useHotkeys } from "react-hotkeys-hook";
import {
  OperationClassCreatedDocument,
  PaymentConditionCreatedDocument,
  SupplierCreatedDocument,
  useOperationClassesQuery,
  usePaymentConditionsQuery,
  useSuppliersQuery,
} from '@/gql/graphql'
import { matchSentence } from '@/utils/SearchFn'
import type { BillType } from './bill.type'
import { billValidation } from './bill.validation'
import ProductAutocompleteHint from '@/utils/ProductAutocompleteHint'
import FormSection from '@/@core/components/ui/forms/form-section'
import { Settings } from 'lucide-react'

const OperationClassAdd = lazy(
  () => import('@/views/core/operationClass/OperationClassAdd'),
)
const PaymentConditionAdd = lazy(
  () => import('@/views/sale/condition/PaymentConditionAdd'),
)
const VendorAdd = lazy(() => import('@/views/sale/supplier/SupplierAdd'))

interface BillFormProps extends BaseFormProps {
  bill?: BillType
  modal?: NiceModalHandler
}

const BillForm: FC<BillFormProps> = ({ bill, action, modal, ...props }) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const [total, setTotal] = useState(0)

  const bottomTableRef = useRef<HTMLSpanElement>(null)

  const focus$ = useEventEmitter()
  const reload$ = useEventEmitter()

  const {
    data: dataCondition,
    loading: loadingCondition,
    subscribeToMore: subscribeToMoreCondition,
  } = usePaymentConditionsQuery({
    variables: { id: enterpriseId },
  })

  const {
    data: dataVendor,
    loading: loadingVendor,
    subscribeToMore: subscribeToMoreVendor,
  } = useSuppliersQuery({
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
    control,
    handleSubmit,
    watch,
    formState: { isDirty },
    setValue,
    getValues,
    register,
  } = useForm<BillType>({
    defaultValues: {
      items: bill ? bill.items : [],
      number: bill ? bill.number : '',
      conditionId: bill ? bill.condition : null,
      operationDate: bill ? dayjs(bill.operationDate).toDate() : new Date(),
      deadline: bill ? dayjs(bill.deadline).toDate() : new Date(),
      note: bill?.note || '',
      supplierId: bill ? bill.supplier : null,
      originalNumber: bill?.originalNumber || '',
    },
    //@ts-ignore
    resolver: yupResolver(billValidation),
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'items' })

  const focusPriceField = focusArrayField(fields, 'quantityF', bottomTableRef)

  const onProductFill = (product: any) => {
    const item = {
      product: {
        id: product.id,
        name: product.name,
        sku: product.sku,
      },
      id: null,
      unitPrice: product.purchasePrice,
      unitPriceF: product.purchasePrice,
      quantity: 1,
      quantityF: 1,
      total: product.purchasePrice,
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
        if (message.name === 'paymentCondition') {
          setValue('conditionId', message.value)
        }

        if (message.name === 'supplier') {
          setValue('supplierId', message.value)
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
      const id = bill?.id

      const items = values.items
        ? values.items
            .filter((item: any) => itemValid(item))
            .map((item: any) => ({
              id: item.id ? Number(item.id) : null,
              productId: Number(item.product.id),
              unitPrice: Number(item.unitPrice),
              quantity: Number(item.quantity),
              description: item.description ? item.description : null,
              discount: item.discount ? Number(item.discount) : null,
              operationClassId: item.operationClassId
                ? Number(item.operationClassId.id)
                : null,
              billId: id,
            }))
        : null

      if (items?.length === 0) {
        toast(`Veuillez spécifier les produits qui font l\'objet de l'achat`)
        return
      }

      action({
        variables: {
          bill: {
            id,
            operationDate: dayjs(values.operationDate).format(
              INPUT_DATE_FORMAT,
            ),
            deadline: dayjs(values.deadline).format(INPUT_DATE_FORMAT),
            number: values.number,
            items: items,
            enterpriseId,
            supplierId: values.supplierId ? Number(values.supplierId.id) : null,
            conditionId: values.conditionId
              ? Number(values.conditionId.id)
              : null,
            note: values.note,
            originalNumber: values.originalNumber || null,
            address: null,
          },
        },
      })
        .then(async ({ data }) => {
          toast.success(`Facture fournisseur enregistrée`, {
            ...TOAST_OPTIONS,
          })

          props.refetch?.()
          modal?.hide()
          reload$.emit()

          if (close) {
            //receiptModal.show({id: data.operation.id, type: data.operation.operationType})
          }
        })
        .catch((error) => {
          toast.error(
            `Impossible d'enregistrer la Facture fournisseur: ${formatError(
              error,
            )}`,
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

  const onConditionChange = (val: any) => {
    setValue('conditionId', val)
    const operationDate = dayjs(getValues('operationDate')).isValid()
      ? dayjs(getValues('operationDate'))
      : dayjs()

    if (val) {
      setValue('deadline', operationDate.add(val.days, 'days').toDate())
    } else {
      setValue('deadline', operationDate)
    }
  }

  useEffect(() => {
    computeTotal()
  }, [])

  useKeyPress('alt+r', () => {
    if (fields.length > 0) {
      remove(fields.length - 1)
      computeTotal()
    }
  })

  return (
    <Form onSubmit={onSubmit} className="flex flex-col gap-1">
      {/* Compact Header with Total */}
      <div className="w-full bg-gradient-to-r from-primary to-[#2d5a9e] rounded-lg shadow-md p-2 flex justify-between items-center">
        <div className="flex items-center gap-1">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              {bill ? t('action.edit_bill') : t('action.add_bill')}
            </h2>
            <p className="text-primary-light text-xs">
              {t('text.fill_bill_details')}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs text-white/80 uppercase tracking-wider font-medium">
            {t('label-total_to_pay')}
          </span>
          <span className="text-2xl font-bold text-white">
            {toCurrency(total)}{' '}
            <span className="text-sm text-white/70">FCFA</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-1">
        {/* Left Sidebar */}
        <div className="xl:col-span-3 flex flex-col gap-1">
          {/* Supplier Section */}
          <FormSection
            icon={<Briefcase />}
            title={t('label-supplier')}
            description={t('text.select_supplier')}
            color="#6366f1"
          >
            <LiveView
              document={SupplierCreatedDocument}
              singleVar="supplier"
              data={dataVendor}
              listVar="suppliers"
              subscribeToMore={subscribeToMoreVendor}
              sortField="name"
              triggerUpdate={true}
              enterpriseId={enterpriseId}
            >
              {({ suppliers }) => (
                <ControlledSelect
                  name="supplierId"
                  control={control}
                  required
                  loading={loadingVendor}
                  onChange={(val) => {
                    setValue('supplierId', val)
                  }}
                  options={
                    suppliers
                      ? suppliers.filter(({ active }: any) => active)
                      : []
                  }
                  getOptionLabel={(option) =>
                    option.lastName || option.displayName
                  }
                  getOptionValue={(option) => option.id}
                  components={{
                    Option: personOptions,
                    SingleValue: personSingleValue,
                  }}
                  filterOption={matchSentence}
                  form={<VendorAdd />}
                  formId="supplier"
                  optionLabel="lastName"
                  formTitle={t('action.add_supplier')}
                />
              )}
            </LiveView>
          </FormSection>

          {/* Payment Condition Section */}
          <FormSection
            icon={<CreditCard />}
            title={t('label-paymentCondition')}
            description={t('text.select_payment_terms')}
            color="#10b981"
          >
            <LiveView
              document={PaymentConditionCreatedDocument}
              singleVar="paymentCondition"
              data={dataCondition}
              listVar="paymentConditions"
              subscribeToMore={subscribeToMoreCondition}
              sortField="name"
              triggerUpdate={true}
              enterpriseId={enterpriseId}
            >
              {({ paymentConditions }) => (
                <ControlledSelect
                  name="conditionId"
                  control={control}
                  loading={loadingCondition}
                  onChange={onConditionChange}
                  options={paymentConditions || undefined}
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option.id}
                  form={<PaymentConditionAdd />}
                  formId="paymentCondition"
                  optionLabel="name"
                  formTitle={t('action.add_paymentCondition')}
                  modalClassName="modal-md"
                />
              )}
            </LiveView>
          </FormSection>

          {/* Invoice Details Section */}
          <FormSection
            icon={<Hash />}
            title={t('label-invoice_details')}
            description={t('text.fill_invoice_info')}
            color="#f59e0b"
          >
            <div className="space-y-1">
              <Input
                name="number"
                control={control}
                placeholder={t('label-number')}
                label={t('label-number')}
              />
              <Input
                name="originalNumber"
                control={control}
                placeholder={t('label-originalNumber')}
                label={t('label-originalNumber')}
              />
              <div className="grid grid-cols-2 gap-1">
                <DatePicker
                  name="operationDate"
                  control={control}
                  required
                  label={t('label-operationDate')}
                />
                <DatePicker
                  name="deadline"
                  control={control}
                  required
                  label={t('label-deadline')}
                />
              </div>
            </div>
          </FormSection>

          {/* Note Section */}
          <FormSection icon={<Edit3 />} title={t('label-note')} color="#6b7280">
            <Input
              name="note"
              control={control}
              type="textarea"
              rows={3}
              placeholder={t('placeholder.add_note')}
            />
          </FormSection>
        </div>

        {/* Main Content - Items Table */}
        <div className="xl:col-span-9">
          <FormSection
            icon={<ShoppingCart />}
            title={t('label-items')}
            description={t('text.add_bill_items')}
            color="#6366f1"
            className="h-full"
          >
            <div className="mb-1">
              <ProductAutocompleteHint
                onFill={onProductFill}
                focus$={focus$}
                reload$={reload$}
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
                        {t('label-product')}
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
                    <th className="w-16 border-0 text-[11px] uppercase tracking-wider text-indigo-700 dark:text-indigo-300 font-bold text-center py-1">
                      Rem.
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
                      <td colSpan={9} className="text-center py-1">
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
                          !bg-gray-200 dark:!bg-slate-900
                          border-1 border-indigo-100 dark:border-indigo-800/50
                          rounded-lg
                          transition-all duration-200
                          hover:border-indigo-300 dark:hover:border-indigo-600
                          hover:shadow-md
                        "
                      >
                        <td className="text-center border-0 py-0 ">
                          <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mx-auto shadow-sm">
                            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">
                              {index + 1}
                            </span>
                          </div>
                        </td>
                        <td className="border py-0" style={{ display: 'none' }}>
                          <SimpleInput
                            {...register(`items.${index}.product.id`)}
                            readOnly
                          />
                          <SimpleInput
                            {...register(`items.${index}.id`)}
                            readOnly
                          />
                        </td>
                        <td className="border p-0 !px-[4px]">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-semibold text-sm text-gray-800 dark:text-gray-200">
                              {watch(`items.${index}.product.name`)}
                            </span>
                            <span className="text-xs text-indigo-500 dark:text-indigo-400">
                              {watch(`items.${index}.product.sku`)}
                            </span>
                          </div>
                        </td>
                        <td className="border p-0">
                          <SimpleInput
                            {...register(`items.${index}.description`)}
                            placeholder={t('label-description')}
                            onKeyPress={preventSubmitting}
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
                        <td className="border p-0 !text-center">
                          <SimpleInput
                            {...register(`items.${index}.discount`)}
                            onKeyPress={preventSubmitting}
                            onKeyUp={(e) => handleFocusAndScroll(e, focus$)}
                            placeholder="0"
                            className="
                              w-full text-center text-sm
                              bg-white dark:!bg-slate-800
                              rounded-none border-0
                              focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400
                              text-gray-900 dark:text-gray-100
                              placeholder:text-gray-400
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
                            onClick={() => {
                              remove(index)
                              computeTotal()
                            }}
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
                            title={t('label-delete')}
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
                            {t('label-total_to_pay')}
                          </span>
                        </div>
                      </td>
                      <td className="border-0 py-1 text-right">
                        <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                          {toCurrency(total)}
                        </span>
                      </td>
                      <td colSpan={3} className="border-0"></td>
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

export default BillForm
