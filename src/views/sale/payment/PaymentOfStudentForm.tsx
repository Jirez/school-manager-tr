import { useEffect, useState } from 'react'
import type { FC } from 'react'
import { toast } from 'react-toastify'
import { Form, Table } from 'reactstrap'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useTranslation } from 'react-i18next'
import { useFieldArray, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import dayjs from 'dayjs'
import {
  GraduationCap,
  CreditCard,
  Wallet,
  Calendar,
  Layers,
  Building,
  MessageSquare,
  Hash,
  User,
  List,
  DollarSign,
  BookOpen,
  Gift,
} from 'lucide-react'
import { styled } from 'styled-components'

import LiveView from '@/utils/LiveView'
import { useAuthentication } from '@/hooks/useAuthentication'
import ControlledSelect from '@/@core/components/ui/forms/controlled-select'
import PaymentModeAdd from '@/views/payment/modes/PaymentModeAdd'
import Input from '@/@core/components/ui/forms/input'
import DatePicker from '@/@core/components/ui/forms/date-picker'
import { messageService } from '@/utils/message.service'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import SimpleInput from '@/@core/components/ui/simple-input'
import { formatError } from '@/utils/ErrorHelper'
import { INPUT_DATE_FORMAT, TOAST_OPTIONS } from '@/utils/constants'
import {
  preventSubmitting,
  setOffcanvasSize,
  toCurrency,
} from '@/utils/helpers'
import InputNumber from '@/@core/components/ui/forms/input-number'
import {
  PaymentModeCreatedDocument,
  SpecialAccountCreatedDocument,
  usePaymentModesQuery,
  useSpecialAccountsQuery,
} from '@/gql/graphql'
import type { PaymentOfStudentType } from './payment.type'
import { paymentOfStudentValidation } from './payment.validation'
import { useApolloClient } from '@apollo/client'
import useActionOnBackNavigation from '@/hooks/useActionOnBackNavigation'
import FormSection from '@/@core/components/ui/forms/form-section'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'
import {
  StyledCheckboxWrapper,
  CheckIcon,
  StyledCheckbox,
} from '@/views/school/configuration/config-form-helper'

const TotalDisplay = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0.5rem 1rem;
  background: rgba(115, 103, 240, 0.1);
  border: 2px solid rgba(115, 103, 240, 0.3);
  border-radius: 8px;
  margin-bottom: 0.5rem;

  .dark-layout & {
    background: rgba(115, 103, 240, 0.15);
    border-color: rgba(115, 103, 240, 0.4);
  }

  span {
    font-size: 1.5rem;
    font-weight: 700;
    color: #7367f0;

    .dark-layout & {
      color: #a78bfa;
    }
  }
`

const StyledTable = styled(Table)`
  font-size: 0.875rem;
  margin-bottom: 0.5rem;

  thead {
    background: #f8f9fa;
    th {
      padding: 0.5rem;
      font-weight: 600;
      font-size: 0.8rem;
      border: 1px solid #e5e7eb;
    }

    .dark-layout & {
      background: #283046;
      th {
        border-color: rgba(115, 103, 240, 0.2);
        color: #e4e6eb;
      }
    }
  }

  tbody {
    td {
      padding: 0.275rem 0.3rem;
      border: 1px solid #e5e7eb;
      vertical-align: middle;
    }

    .dark-layout & {
      td {
        border-color: rgba(115, 103, 240, 0.2);
      }
    }
  }
`

const ReminderDisplay = styled.div`
  font-weight: 600;
  font-size: 1rem;
  color: #ea5455;
  padding: 0.25rem 0.5rem;
  background: rgba(234, 84, 85, 0.1);
  border-radius: 6px;
  display: inline-block;

  .dark-layout & {
    background: rgba(234, 84, 85, 0.15);
    color: #f87171;
  }
`

interface StudentPaymentFormProps extends BaseFormProps {
  payment?: PaymentOfStudentType
  invoiceId: number
  modal?: NiceModalHandler
}

const PaymentOfStudentForm: FC<StudentPaymentFormProps> = ({
  payment,
  action,
  modal,
  ...props
}) => {
  const { t } = useTranslation()
  const { enterpriseId, username } = useAuthentication()
  const [total, setTotal] = useState(0)
  const [givenAmount, setGivenAmount] = useState<number | null>(null)
  const [givenAmountF, setGivenAmountF] = useState<string>('')
  const [reminder, setReminder] = useState<number | null>(null)
  const client = useApolloClient()

  const { data, loading, subscribeToMore } = usePaymentModesQuery({
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
    setValue,
    formState: { isDirty },
    register,
    watch,
    getValues,
  } = useForm<PaymentOfStudentType>({
    defaultValues: {
      items: payment?.items || [],
      student: payment?.student || '',
      studentId: payment?.studentId || '',
      studentClass: payment?.studentClass || '',
      classId: payment?.classId || null,
      paymentDate: payment?.paymentDate || null,
      paymentAccountId: payment?.paymentAccountId || null,
      note: payment?.note || '',
      reference: payment?.reference || '',
      paymentModeId: payment?.paymentModeId || '',
      registrationNumber: payment?.registrationNumber || '',
    },
    resolver: yupResolver(paymentOfStudentValidation),
  })

  const { fields } = useFieldArray({ control, name: 'items' })

  const refetchFrequentQueries = async () => {
    await client.refetchQueries({
      updateCache(cache) {
        cache.evict({ fieldName: 'frequents' })
      },
    })
  }

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    close?: boolean,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      const items = values.items
        .filter((item: any) => itemValid(item))
        .map((item: any) => ({
          amountPaid: Number(item.paidAmount),
          inKindPayment: item.inKindPayment,
          invoiceItemId: Number(item.invoiceItemId),
          installmentId: Number(item.installmentId),
          tuitionId: Number(item.tuitionId),
          //paymentId: Number(item.paymentId),
          tuitionName: item.tuitionName,
          installmentName: item.installmentName,
          dueDate: item.dueDate,
          requiredAmount: Number(item.requiredAmount),
        }))

      if (items.length === 0) {
        toast.error('Veuillez spécifier les rubriques à enregistrer')
        return
      }

      action({
        variables: {
          payment: {
            invoiceId: props.invoiceId,
            enterpriseId,
            note: values.note,
            operationDate: dayjs(values.paymentDate).format(INPUT_DATE_FORMAT),
            items: items.length !== 0 ? items : null,
            paymentModeId: values.paymentModeId
              ? Number(values.paymentModeId.id)
              : null,
            paymentAccountId: values.paymentAccountId
              ? Number(values.paymentAccountId.id)
              : null,
            operator: username,
          },
        },
      })
        .then(async ({ data }) => {
          //form.resetFields();
          props.refetch?.()
          refetchFrequentQueries()
          setValue('items', [])
          toast.success(`Paiement enregistré`, { ...TOAST_OPTIONS })

          //if (close) {
          modal?.hide()
          //}
        })
        .catch((error) => {
          toast.error(
            `Impossible d'enregistrer le paiement: ${formatError(error)}`,
          )
        })
    })(event)
  }

  const itemValid = (item: any) => {
    const {
      installmentId,
      tuitionId,
      paidAmount,
      requiredAmount,
      invoiceItemId,
    } = item
    return (
      installmentId &&
      tuitionId &&
      invoiceItemId &&
      parseFloat(paidAmount) &&
      parseFloat(requiredAmount) >= parseFloat(paidAmount)
    )
  }

  useEffect(() => {
    messageService.getMessage().subscribe((message) => {
      if (message) {
        if (message.name === 'paymentMode') {
          setValue('paymentModeId', message.value)
        }
      }
    })
  }, [messageService])

  useEffect(() => {
    setOffcanvasSize('100%')
  }, [])

  const computeTotal = () => {
    const items = getValues('items')
    const amounts = items
      .map((item) => item.paidAmount)
      .filter((value) => value !== null)
      .filter((value) => parseFloat(String(value)))

    if (amounts.length > 0) {
      setTotal(
        amounts.reduce(
          (a, b) => parseFloat(String(a)) + parseFloat(String(b)),
        ) || 0,
      )
    } else {
      setTotal(0)
    }
  }

  const focusNextField = (index: number) => {
    return (e: any) => {
      if (e.which === 13) {
        const input = document.getElementById(`items.${index + 1}.paidAmountF`)
        input?.focus()
      }

      if (e.key === 'ArrowDown') {
        const input = document.getElementById(`items.${index + 1}.paidAmountF`)
        input?.focus()
      }

      if (e.key === 'ArrowUp') {
        const input = document.getElementById(`items.${index - 1}.paidAmountF`)
        input?.focus()
      }
    }
  }

  const displayName = (index: number) => {
    document.getElementById('displayStudentName')!.innerText =
      payment?.items[index].tuitionName ?? ''
  }

  useEffect(() => {
    setReminder(givenAmount && total ? givenAmount - total : null)
  }, [givenAmount, total])

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

  const isBackNavigation = useActionOnBackNavigation('/operations')

  useEffect(() => {
    if (isBackNavigation) {
      modal?.hide()
    }
  }, [isBackNavigation])

  return (
    <Form onSubmit={onSubmit} className="p-0">
      <div id="displayStudentName" className="top-0 !right-16 absolute" />
      <div className="px-0">
        {/* Total Display */}
        {/*total > 0 && (
          <TotalDisplay className="mt-0">
            <Coins size={20} className="mr-2 opacity-50" />
            <span>{toCurrency(total)} FCFA</span>
          </TotalDisplay>
        )*/}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          {/* Student Information Section */}
          <FormSection
            title={t('label-studentInformation') || "Informations de l'élève"}
            description={t('label-studentInfoDesc') || "Détails de l'élève"}
            icon={<GraduationCap size={18} />}
            color="#7367f0"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2">
              <Input
                name="studentId"
                label=""
                control={control}
                className="hidden"
              />
              <Input
                name="registrationNumber"
                label={t('label-registrationNumber')}
                control={control}
                prepend={<Hash size={14} />}
                placeholder="Matricule"
              />
              <Input
                name="studentClass"
                label={t('label-class')}
                control={control}
                prepend={<Layers size={14} />}
              />
              <div className="col-span-full">
                <Input
                  name="student"
                  label={t('label-student')}
                  control={control}
                  required={true}
                  prepend={<User size={14} />}
                />
              </div>
            </div>
          </FormSection>

          {/* Payment Information Section */}
          <FormSection
            title={t('label-paymentInformation') || 'Paiement'}
            description={t('label-paymentInfoDesc') || 'Modes et comptes'}
            icon={<CreditCard size={18} />}
            color="#28c76f"
          >
            <div className="space-y-">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2">
                <DatePicker
                  name="paymentDate"
                  label={t('label-paymentDate')}
                  control={control}
                  required={true}
                />

                <LiveView
                  document={PaymentModeCreatedDocument}
                  singleVar="paymentMode"
                  data={data}
                  listVar="paymentModes"
                  subscribeToMore={subscribeToMore}
                  sortField="name"
                  triggerUpdate={true}
                  enterpriseId={enterpriseId}
                >
                  {({ paymentModes }) => (
                    <ControlledSelect
                      name="paymentModeId"
                      control={control}
                      label={t('label-paymentMode')}
                      loading={loading}
                      prepend={<Wallet size={14} />}
                      onChange={(val) => setValue('paymentModeId', val)}
                      options={paymentModes || undefined}
                      getOptionLabel={(option) => option.name}
                      getOptionValue={(option) => option.id}
                      form={<PaymentModeAdd />}
                      formId="paymentMode"
                      optionLabel="name"
                      formTitle={t('action.add_paymentMode')}
                    />
                  )}
                </LiveView>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                <LiveView
                  document={SpecialAccountCreatedDocument}
                  subscribeToMore={subscribeToMoreAccount}
                  listVar="specialAccounts"
                  singleVar="specialAccount"
                  data={dataAccount}
                  triggerUpdate={true}
                  enterpriseId={enterpriseId}
                >
                  {({ specialAccounts }) => (
                    <ControlledSelect
                      name="paymentAccountId"
                      control={control}
                      label={t('label-paymentAccount')}
                      loading={loadingAccount}
                      prepend={<Building size={14} />}
                      onChange={(val) => setValue('paymentAccountId', val)}
                      options={
                        specialAccounts
                          ? specialAccounts.filter(
                              ({ specialAccountType }: any) =>
                                specialAccountType === 'PAYMENT',
                            )
                          : undefined
                      }
                      getOptionLabel={(option) => option.name}
                      getOptionValue={(option) => option.id}
                      formId="specialAccount"
                      optionLabel="name"
                      defaultValue={
                        payment
                          ? payment.paymentAccount
                          : specialAccounts
                            ? specialAccounts.filter(
                                ({ specialAccountType, selected }: any) =>
                                  specialAccountType === 'PAYMENT' && selected,
                              )[0]
                            : null
                      }
                    />
                  )}
                </LiveView>

                <Input
                  name="note"
                  label={t('label-note')}
                  control={control}
                  prepend={<MessageSquare size={14} />}
                  placeholder="..."
                />
              </div>
            </div>
          </FormSection>
        </div>

        {/* Payment Items Table */}
        <FormSection
          title={t('label-paymentItems') || 'Rubriques'}
          description={
            t('label-paymentItemsDesc') || 'Détails des frais à régler'
          }
          icon={<List size={18} />}
          color="#6366f1"
          className="mt-1"
        >
          <div className="overflow-x-auto -mx-1 px-0">
            <Table className="table table-bordered table-condensed table-hover0 responsive tableur mb-0">
              <thead className="bg-indigo-50/80 dark:bg-indigo-950/10 backdrop-blur-sm sticky top-0 z-10">
                <tr className="border-b-2 border-indigo-200 dark:border-indigo-800">
                  <th className="w-10 text-center border-0 text-[11px] uppercase tracking-wider text-indigo-700 dark:text-indigo-300 font-bold py-1">
                    #
                  </th>
                  <th
                    style={{ width: '20%' }}
                    className="border-0 text-[11px] uppercase text-indigo-700 dark:text-indigo-300 font-bold py-1"
                  >
                    <div className="flex items-center gap-1.5">
                      <Calendar
                        size={12}
                        className="text-indigo-600 dark:text-indigo-400"
                      />
                      {t('label-slice')}
                    </div>
                  </th>
                  <th
                    style={{ width: '25%' }}
                    className="border-0 text-[11px] uppercase text-indigo-700 dark:text-indigo-300 font-bold py-1"
                  >
                    <div className="flex items-center gap-1.5">
                      <BookOpen
                        size={12}
                        className="text-indigo-600 dark:text-indigo-400"
                      />
                      {t('label-schoolFee')}
                    </div>
                  </th>
                  <th className="w-28 border-0 text-[11px] uppercase tracking-wider text-indigo-700 dark:text-indigo-300 font-bold text-right py-1">
                    <div className="flex items-center gap-1 justify-end">
                      <DollarSign
                        size={12}
                        className="text-indigo-600 dark:text-indigo-400"
                      />
                      {t('label-requiredAmount')}
                    </div>
                  </th>
                  <th className="w-28 border-0 text-[11px] uppercase tracking-wider text-indigo-700 dark:text-indigo-300 font-bold text-right py-1">
                    <div className="flex items-center gap-1 justify-end">
                      <DollarSign
                        size={12}
                        className="text-indigo-600 dark:text-indigo-400"
                      />
                      {t('label-amountPaid')}
                    </div>
                  </th>
                  <th className="w-24 text-center border-0 text-[11px] uppercase tracking-wider text-indigo-700 dark:text-indigo-300 font-bold py-1">
                    <div className="flex items-center gap-1 justify-center">
                      <Gift
                        size={12}
                        className="text-indigo-600 dark:text-indigo-400"
                      />
                      {t('label-inKindPayment')}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="before:block before:h-0">
                {fields.map((field, index) => (
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
                        {...register(`items.${index}.installmentId`)}
                        readOnly
                      />
                    </td>
                    <td className="border py-0" style={{ display: 'none' }}>
                      <SimpleInput
                        {...register(`items.${index}.tuitionId`)}
                        readOnly
                      />
                      <SimpleInput
                        {...register(`items.${index}.invoiceItemId`)}
                        readOnly
                      />
                    </td>
                    <td className="border p-0 !px-[4px]">
                      <span className="font-semibold text-sm text-gray-800 dark:text-gray-200">
                        {watch(`items.${index}.installmentName`)}
                      </span>
                    </td>
                    <td className="border p-0 !px-[4px]">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {watch(`items.${index}.tuitionName`)}
                      </span>
                    </td>
                    <td className="border p-0 !text-right">
                      <span className="pr-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                        {toCurrency(
                          watch(`items.${index}.requiredAmount`) as number,
                        )}
                      </span>
                    </td>
                    <td className="border p-0">
                      <InputNumber
                        {...register(`items.${index}.paidAmountF`)}
                        value={watch(`items.${index}.paidAmountF`)}
                        onKeyPress={preventSubmitting}
                        onKeyUp={focusNextField(index)}
                        className="
                          w-full text-right text-base !font-bold
                          bg-indigo-50/50 dark:bg-indigo-950/20
                          border-0
                          rounded-none
                          focus:ring-2 focus:ring-indigo-500 focus:ring-inset
                          focus:bg-white dark:focus:bg-slate-800
                          hover:bg-indigo-100/50 dark:hover:bg-indigo-900/30
                          text-indigo-700 dark:text-indigo-300
                          transition-all duration-200
                        "
                        onValueChange={(val: any) => {
                          setValue(
                            `items.${index}.paidAmountF`,
                            val.formattedValue,
                          )
                          setValue(`items.${index}.paidAmount`, val.value)
                          computeTotal()
                        }}
                        onFocus={() => displayName(index)}
                      />
                    </td>
                    <td className="border-0 py-0 text-center">
                      <div className="flex justify-center">
                        <StyledCheckboxWrapper>
                          <input
                            type="checkbox"
                            {...register(`items.${index}.inKindPayment`)}
                            checked={
                              watch(`items.${index}.inKindPayment`) || false
                            }
                            onChange={(e) =>
                              setValue(
                                `items.${index}.inKindPayment`,
                                e.target.checked,
                                { shouldDirty: true },
                              )
                            }
                            className="sr-only"
                          />
                          <StyledCheckbox
                            $checked={
                              watch(`items.${index}.inKindPayment`) || false
                            }
                          >
                            <CheckIcon
                              $checked={
                                watch(`items.${index}.inKindPayment`) || false
                              }
                            />
                          </StyledCheckbox>
                        </StyledCheckboxWrapper>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              {fields.length > 0 && (
                <tfoot className="bg-indigo-50/80 dark:bg-indigo-950/50 border-t-2 border-indigo-200 dark:border-indigo-800">
                  <tr>
                    <td colSpan={4} className="border-0 py-1 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <DollarSign
                          size={16}
                          className="text-indigo-600 dark:text-indigo-400"
                        />
                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                          {t('label-totalPaidAmount') || t('label-total_paid')}
                        </span>
                      </div>
                    </td>
                    <td className="border-0 py-1 text-right pr-3">
                      <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                        {toCurrency(total)}
                      </span>
                    </td>
                    <td className="border-0"></td>
                  </tr>
                  {total !== 0 && (
                    <tr className="border-t border-indigo-100 dark:border-indigo-900/50">
                      <td colSpan={4} className="border-0 py-1 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <DollarSign
                            size={16}
                            className="text-indigo-600 dark:text-indigo-400"
                          />
                          <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                            {t('label-givenAmount') || 'Montant encaissé'}
                          </span>
                        </div>
                      </td>
                      <td className="border-0 py-1">
                        <InputNumber
                          value={givenAmountF}
                          onValueChange={(val: any) => {
                            setGivenAmountF(val.formattedValue)
                            setGivenAmount(val.value)
                          }}
                          className="
                            w-full text-right text-base font-bold
                            bg-white dark:bg-slate-800
                            border-2 border-indigo-200 dark:border-indigo-800
                            rounded-lg
                            focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                            text-indigo-700 dark:text-indigo-300
                            transition-all duration-200
                            py-1.5 px-3
                          "
                          autoFocus={false}
                          placeholder="0"
                        />
                      </td>
                      <td className="border-0 py-2 text-center">
                        {reminder !== null && (
                          <div className="flex flex-col items-center">
                            <span className="text-[10px] uppercase text-indigo-600 dark:text-indigo-400 font-bold">
                              Rendu
                            </span>
                            <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                              {toCurrency(reminder)}
                            </span>
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </tfoot>
              )}
            </Table>
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

export default PaymentOfStudentForm
