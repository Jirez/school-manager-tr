import { useTranslation } from 'react-i18next'
import { Alert, Form, Table } from 'reactstrap'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { lazy, useEffect, useRef, useState } from 'react'
import type { FC } from 'react'
import { useEventEmitter } from 'ahooks'
import { useAuthentication } from '@/hooks/useAuthentication'
import { useFieldArray, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { messageService } from '@/utils/message.service'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'
import { INPUT_DATE_FORMAT, TOAST_OPTIONS } from '@/utils/constants'
import { formatError } from '@/utils/ErrorHelper'
import {
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
import NumericInput from '@/@core/components/ui/forms/numeric-input'
import { AlertCircle, MinusCircle } from 'react-feather'
import {
  DollarSign,
  Briefcase,
  CreditCard,
  Hash,
  Edit3,
  FileText,
  Calendar,
  Settings,
  Receipt,
} from 'lucide-react'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import FormSection from '@/@core/components/ui/forms/form-section'
import {
  personOptions,
  personSingleValue,
} from '@/utils/select/selectComponents'
import { matchSentence } from '@/utils/SearchFn'
import {
  PaymentModeCreatedDocument,
  SpecialAccountCreatedDocument,
  SupplierCreatedDocument,
  usePaymentModesQuery,
  useSpecialAccountsQuery,
  useSuppliersQuery,
} from '@/gql/graphql'
import type { BillPaymentType } from './bill.payment.type'
import { usePendingSupplierBills } from '../bill/usePendingSupplierBills'
import { billPaymentValidation } from './bill.payment.validation'

// import CardForm from "@/@core/components/ui/card-form";

const SupplierAdd = lazy(() => import('@/views/sale/supplier/SupplierAdd'))
const PaymentModeAdd = lazy(
  () => import('@/views/payment/modes/PaymentModeAdd'),
)

interface PaymentFormProps extends BaseFormProps {
  payment?: BillPaymentType
  modal?: NiceModalHandler
  supplier: any
  items?: any
}

const BillPaymentForm: FC<PaymentFormProps> = ({
  payment,
  supplier,
  items,
  modal,
  action,
  ...props
}) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()
  const [total, setTotal] = useState(0)
  const [supplierId, setSupplierId] = useState<number | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  //const client = useApolloClient()
  //const receiptModal = useModal(SaleReceiptModal)

  const bottomTableRef = useRef<HTMLSpanElement>(null)

  const focus$ = useEventEmitter()

  const {
    data: dataMode,
    loading: loadingMode,
    subscribeToMore: subscribeToMoreMode,
  } = usePaymentModesQuery({
    variables: { id: enterpriseId },
  })

  const { bills } = usePendingSupplierBills(supplierId)

  const {
    data: dataSupplier,
    loading: loadingSupplier,
    subscribeToMore: subscribeToMoreSupplier,
  } = useSuppliersQuery({
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
    control,
    handleSubmit,
    watch,
    formState: { isDirty },
    setValue,
    getValues,
    register,
  } = useForm<BillPaymentType>({
    defaultValues: {
      items: [],
      number: '',
      amount: payment ? payment.balance : 0,
      amountF: payment ? payment.balance : 0,
      operationDate: payment ? new Date() : null,
      supplierId: supplier ? supplier : null,
    },
    resolver: yupResolver(billPaymentValidation),
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'items' })

  useEffect(() => {
    if (items) {
      setValue('items', [])
      setMessage(null)
      const defaultValues = {
        id: items.id,
        description: items.description,
        deadline: items.deadline,
        amount: items.amount,
        balance: items.balance,
        paidAmount: items.paidAmount,
        paidAmountF: items.paidAmountF,
      }

      //@ts-ignore
      append(defaultValues)

      if (items) {
        computeTotal()
      }
    }
  }, [items])

  useEffect(() => {
    if (!payment) {
      setValue('items', [])
      const invoices = bills //.filter((item) => item.operationType == "INVOICE");
      if (invoices.length > 0) {
        setMessage(null)
        const defaultValues = invoices.map((item) => ({
          id: item.id,
          description: `Facture # ${item.number} (${item.operationDate})`,
          deadline: item.deadline,
          amount: item.amount,
          balance: item.balance,
          paidAmount: payment ? item.balance : null,
          paidAmountF: payment ? item.balance : null,
        }))

        for (let i = 0; i < defaultValues.length; i++) {
          //@ts-ignore
          append(defaultValues[i])
        }
        if (payment) {
          computeTotal()
        }
      }

      if (invoices.length === 0) {
        setMessage(
          "Nous allons enregistrer ce paiement sous la forme d'un crédit pour votre client, car vous n'avez aucun encaissement en cours.",
        )
      }

      /* const credits = operations.filter(
        (item) => item.operationType != "INVOICE"
      );

      if (credits.length > 0) {
        setValue("credits", []);
        const defaultValues = credits.map((item) => ({
          id: item.id,
          description: `${
            item.operationType == "CREDIT" ? "Avoir" : "Paiement non appliqué"
          } # ${item.number} (${item.operationDate})`,
          amount: item.amount,
          balance: item.balance,
          type: item.operationType,
        }));

        for (let i = 0; i < defaultValues.length; i++) {
          //@ts-ignore
          cAppend(defaultValues[i]);
        }
      } */
    }
  }, [bills])

  useEffect(() => {
    messageService.getMessage().subscribe((message) => {
      if (message) {
        if (message.name === 'paymentMode') {
          setValue('paymentModeId', message.value)
        }

        if (message.name === 'supplier') {
          setValue('supplierId', message.value)
        }
      }
    })
  }, [messageService])

  useEffect(() => {
    if (dataAccount) {
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
      const id = payment ? Number(payment.id) : null

      const items = values.items
        ? values.items
            .filter((item: any) => itemValid(item))
            .map((item) => ({
              billId: Number(item.id),
              amount: Number(item.paidAmount),
            }))
        : null

      if (items?.length === 0 && !values.amount) {
        toast.error(
          "Veuillez spécifier les factures qui font l'objet du paiement",
        )
        return
      }

      action({
        variables: {
          payment: {
            id,
            operationDate: dayjs(values.operationDate).format(
              INPUT_DATE_FORMAT,
            ),
            number: values.number,
            items: items ? items : [],
            enterpriseId,
            supplierId: values.supplierId ? Number(values.supplierId.id) : null,
            paymentModeId: values.paymentModeId
              ? Number(values.paymentModeId.id)
              : null,
            paymentAccountId: values.paymentAccountId
              ? Number(values.paymentAccountId.id)
              : null,
            note: values.note,
            amount: Number(values.amount),
          },
        },
      })
        .then(async ({ data }) => {
          //form.resetFields();
          toast.success(`Paiement enregistré`, { ...TOAST_OPTIONS })

          props.refetch?.()
          //if (close) {
          modal?.hide()
          //}

          //receiptModal.show({id: data.operation.id, type: data.operation.operationType})
        })
        .catch((error) => {
          toast.error(
            `Impossible d'enregistrer le paiement: ${formatError(error)}`,
          )
        })
    })(event)
  }

  const itemValid = (item: any) => {
    const { id, amount, paidAmount } = item
    return (
      id &&
      parseFloat(amount) &&
      parseFloat(paidAmount) &&
      parseFloat(paidAmount) <= parseFloat(amount)
    )
  }

  /*const creditValid = (item: any) => {
        const {id, amount} = item;
        return id && parseFloat(amount);
    };*/

  const computeTotal = () => {
    const keys = getValues('items')
    if (keys && keys[0]) {
      const totals = keys
        .filter((item: any) => item !== undefined)
        .filter(({ paidAmount }: any) => parseFloat(paidAmount))
        .map(({ paidAmount }: any) => parseFloat(paidAmount))

      const total =
        totals.length !== 0 ? totals.reduce((a: number, b: number) => a + b) : 0

      setTotal(total)
    } else {
      setTotal(0)
    }
  }

  return (
    <Form onSubmit={onSubmit} className="flex flex-col gap-1">
      {/* Compact Header with Total */}
      <div className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg shadow-md p-2 flex justify-between items-center">
        <div className="flex items-center gap-1">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              {payment ? t('action.edit_payment') : t('action.add_payment')}
            </h2>
            <p className="text-emerald-100 text-xs">
              {t('text.fill_payment_details')}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs text-emerald-200 uppercase tracking-wider font-medium">
            {t('label-total_paid')}
          </span>
          <span className="text-2xl font-bold text-white">
            {toCurrency(total)}{' '}
            <span className="text-sm text-emerald-200">FCFA</span>
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
              data={dataSupplier}
              listVar="suppliers"
              subscribeToMore={subscribeToMoreSupplier}
              sortField="name"
              triggerUpdate={true}
              enterpriseId={enterpriseId}
            >
              {({ suppliers }) => (
                <ControlledSelect
                  name="supplierId"
                  control={control}
                  required
                  loading={loadingSupplier}
                  onChange={(val) => {
                    setValue('supplierId', val)
                    if (val) {
                      setSupplierId(val.id)
                    } else {
                      setSupplierId(null)
                    }
                  }}
                  options={suppliers || undefined}
                  getOptionLabel={(option) =>
                    option.lastName || option.displayName
                  }
                  getOptionValue={(option) => option.id}
                  components={{
                    Option: personOptions,
                    SingleValue: personSingleValue,
                  }}
                  filterOption={matchSentence}
                  form={<SupplierAdd />}
                  formId="supplier"
                  optionLabel="lastName"
                  formTitle={t('action.add_supplier')}
                />
              )}
            </LiveView>
          </FormSection>

          {/* Payment Mode Section */}
          <FormSection
            icon={<CreditCard />}
            title={t('label-paymentMode')}
            description={t('text.select_payment_method')}
            color="#10b981"
          >
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
                  loading={loadingMode}
                  onChange={(val) => {
                    setValue('paymentModeId', val)
                  }}
                  options={paymentModes || undefined}
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option.id}
                  form={<PaymentModeAdd />}
                  formId="paymentMode"
                  optionLabel="name"
                  formTitle={t('action.add_paymentMode')}
                  modalClassName="modal-md"
                />
              )}
            </LiveView>
          </FormSection>

          <Alert color="danger" isOpen={message != null && supplierId != null}>
            <div className="alert-body flex flex-col gap-6">
              <div className="flex flex-row items-center">
                <AlertCircle size={15} />
                <span className="pl-1 w-full">
                  Le paiement de ce client n'est associé à aucun encaissement en
                  cours.
                </span>
              </div>
              <div>{message}</div>
            </div>
          </Alert>

          {/* Payment Details Section */}
          <FormSection
            icon={<Hash />}
            title={t('label-payment_details')}
            description={t('text.fill_payment_info')}
            color="#f59e0b"
          >
            <div className="space-y-1">
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
                placeholder={t('label-reference')}
              />
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
                  />
                )}
              </LiveView>
              <NumericInput
                name="amount"
                nameF="amountF"
                label={t('label-amount')}
                control={control}
                setValue={setValue}
                required
                thousandSeparator=" "
              />
            </div>
          </FormSection>

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

        {/* Main Content - Bills Table */}
        <div className="xl:col-span-9">
          {true && (
            <FormSection
              icon={<FileText />}
              title={t('label-currentBills')}
              description={t('text.select_bills_to_pay')}
              color="#6366f1"
              className="h-full"
            >
              <div className="overflow-x-auto -mx-1 px-0">
                <Table className="table table-bordered table-condensed table-hover0 responsive tableur mb-0">
                  <thead className="bg-indigo-50/80 dark:bg-indigo-950/50 backdrop-blur-sm sticky top-0 z-10">
                    <tr className="border-b-2 border-indigo-200 dark:border-indigo-800">
                      <th className="w-10 text-center border-0 text-[11px] uppercase tracking-wider text-indigo-700 dark:text-indigo-300 font-bold py-1">
                        #
                      </th>
                      <th className="border-0 text-[11px] uppercase tracking-wider text-indigo-700 dark:text-indigo-300 font-bold py-1">
                        <div className="flex items-center gap-1.5">
                          <FileText
                            size={12}
                            className="text-indigo-600 dark:text-indigo-400"
                          />
                          {t('label-description')}
                        </div>
                      </th>
                      <th className="w-24 border-0 text-[11px] uppercase tracking-wider text-indigo-700 dark:text-indigo-300 font-bold py-1">
                        <div className="flex items-center gap-1.5">
                          <Calendar
                            size={12}
                            className="text-indigo-600 dark:text-indigo-400"
                          />
                          {t('label-deadline')}
                        </div>
                      </th>
                      <th className="w-28 border-0 text-[11px] uppercase tracking-wider text-indigo-700 dark:text-indigo-300 font-bold text-right py-1">
                        <div className="flex items-center gap-1 justify-end">
                          <DollarSign
                            size={12}
                            className="text-indigo-600 dark:text-indigo-400"
                          />
                          {t('label-originalAmount')}
                        </div>
                      </th>
                      <th className="w-28 border-0 text-[11px] uppercase tracking-wider text-indigo-700 dark:text-indigo-300 font-bold text-right py-1">
                        <div className="flex items-center gap-1 justify-end">
                          <DollarSign
                            size={12}
                            className="text-indigo-600 dark:text-indigo-400"
                          />
                          {t('label-currentBalance')}
                        </div>
                      </th>
                      <th className="w-28 border-0 text-[11px] uppercase tracking-wider text-indigo-700 dark:text-indigo-300 font-bold text-right py-1">
                        <div className="flex items-center gap-1 justify-end">
                          <DollarSign
                            size={12}
                            className="text-indigo-600 dark:text-indigo-400"
                          />
                          {t('label-payment')}
                        </div>
                      </th>
                      <th className="w-12 text-center border-0 text-[11px] uppercase tracking-wider text-indigo-700 dark:text-indigo-300 font-bold py-1">
                        <Settings size={12} className="mx-auto" />
                      </th>
                    </tr>
                  </thead>
                  <tbody className="before:block before:h-0">
                    {fields.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-1">
                          <div className="text-indigo-600 dark:text-indigo-400 text-sm bg-indigo-50 dark:bg-indigo-950/30 rounded-lg border-2 border-dashed border-indigo-200 dark:border-indigo-800 py-2 px-10 inline-block">
                            <div className="flex flex-col items-center gap-2">
                              <Receipt size={32} />
                              <span>{t('text.no_bills_to_pay')}</span>
                              <small className="text-xs opacity-70">
                                {supplierId
                                  ? t('text.no_pending_bills_for_supplier')
                                  : t('text.select_supplier_to_see_bills')}
                              </small>
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
                          <td className="border p-0 !px-[4px]">
                            <span className="font-semibold text-sm text-gray-800 dark:text-gray-200">
                              {watch(`items.${index}.description`)}
                            </span>
                            <input
                              type="hidden"
                              {...register(`items.${index}.id`)}
                            />
                          </td>
                          <td className="border p-0">
                            <SimpleInput
                              {...register(`items.${index}.deadline`)}
                              readOnly
                              className="
                                w-full text-sm
                                bg-transparent dark:!bg-transparent
                                border-0
                                text-gray-900 dark:text-gray-100
                              "
                            />
                          </td>
                          <td className="border p-0 !text-right">
                            <InputNumber
                              {...register(`items.${index}.amount`)}
                              value={watch(`items.${index}.amount`)}
                              readOnly
                              className="
                                w-full text-right text-sm
                                bg-transparent dark:!bg-transparent
                                border-0
                                text-gray-900 dark:text-gray-100
                              "
                            />
                          </td>
                          <td className="border p-0 !text-right">
                            <InputNumber
                              {...register(`items.${index}.balance`)}
                              value={watch(`items.${index}.balance`)}
                              readOnly
                              className="
                                w-full text-right text-sm font-semibold
                                bg-transparent dark:!bg-transparent
                                border-0
                                text-gray-900 dark:text-gray-100
                              "
                            />
                          </td>
                          <td className="border p-0 !text-right">
                            <InputNumber
                              {...register(`items.${index}.paidAmountF`)}
                              value={watch(`items.${index}.paidAmountF`)}
                              onKeyPress={preventSubmitting}
                              onKeyUp={(e) => handleFocusAndScroll(e, focus$)}
                              onValueChange={(val) => {
                                setValue(
                                  `items.${index}.paidAmountF`,
                                  val.formattedValue,
                                )
                                setValue(`items.${index}.paidAmount`, val.value)
                                computeTotal()
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
                </Table>
                <span ref={bottomTableRef} />
              </div>
            </FormSection>
          )}
        </div>
      </div>

      <ActionButtons
        cancelAction={modal?.hide}
        isSubmitting={props.loading}
        popover={props.popover}
        dirty={isDirty}
        onSubmit={onSubmit}
        fixed={true}
        saveCloseLabel={t('label-savePrint')}
      />
    </Form>
  )
}

export default BillPaymentForm
