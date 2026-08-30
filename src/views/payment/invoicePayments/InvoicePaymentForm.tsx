import type { FC } from 'react'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Form, Table } from 'reactstrap'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useTranslation } from 'react-i18next'
import { useFieldArray, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import dayjs from 'dayjs'
import { useDebounceEffect } from 'ahooks'

import LiveView from '@/utils/LiveView'
import type { StudentPaymentType } from '@/views/payment/studentPayments/StudentPayment.type'
import { useAuthentication } from '@/hooks/useAuthentication'
import { studentPaymentValidationSchema } from '@/views/payment/studentPayments/studentPayment.validation'
import ControlledSelect from '@/@core/components/ui/forms/controlled-select'
import PaymentModeAdd from '@/views/payment/modes/PaymentModeAdd'
import Input from '@/@core/components/ui/forms/input'
import DatePicker from '@/@core/components/ui/forms/date-picker'
import { messageService } from '@/utils/message.service'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import SimpleInput from '@/@core/components/ui/simple-input'
import { formatError } from '@/utils/ErrorHelper'
import { INPUT_DATE_FORMAT, TOAST_OPTIONS } from '@/utils/constants'
import { concat, setOffcanvasSize, toCurrency } from '@/utils/helpers'
import { useInvoiceSchoolFee } from './useInvoiceSchoolFees'
import InputNumber from '@/@core/components/ui/forms/input-number'
import {
  PaymentModeCreatedDocument,
  SpecialAccountCreatedDocument,
  usePaymentModesQuery,
  useSpecialAccountsQuery,
} from '@/gql/graphql'

interface StudentPaymentFormProps extends BaseFormProps {
  studentPayment?: StudentPaymentType
  modal?: NiceModalHandler
}

const InvoicePaymentForm: FC<StudentPaymentFormProps> = ({
  studentPayment,
  action,
  modal,
  ...props
}) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()
  const [reference, setReference] = useState<string>()
  const [total, setTotal] = useState(0)
  const [givenAmount, setGivenAmount] = useState<number | null>(null)
  const [reminder, setReminder] = useState<number | null>(null)

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

  const { schoolFeeLevels } = useInvoiceSchoolFee(reference, enterpriseId)

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isDirty },
    register,
    watch,
    getValues,
  } = useForm<StudentPaymentType>({
    defaultValues: {
      items: [],
      student: '',
      studentId: '',
      classId: null,
      paymentDate: null,
      paymentAccountId: null,
      note: '',
      reference: '',
      invoiceReference: '',
      paymentModeId: '',
    },
    resolver: yupResolver(studentPaymentValidationSchema),
  })

  const { fields, append } = useFieldArray({ control, name: 'items' })
  const invoiceRef = watch('invoiceReference')

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
          studentPaymentItemPK: {
            paymentSliceId: Number(item.paymentSliceId),
            schoolFeeId: Number(item.schoolFeeId),
          },
        }))

      if (items.length === 0) {
        toast.error('Veuillez spécifier les rubriques à enregistrer')
        return
      }

      //console.log(items)

      action({
        variables: {
          payment: {
            studentId: Number(values.studentId),
            studentInvoiceId: Number(values.studentInvoiceId),
            schoolId: enterpriseId,
            reference: values.reference !== '' ? values.reference : null,
            note: values.note,
            paymentDate: dayjs(values.paymentDate).format(INPUT_DATE_FORMAT),
            studentPaymentItemCollection: items.length !== 0 ? items : null,
            paymentModeId: values.paymentModeId
              ? Number(values.paymentModeId.id)
              : null,
            paymentAccountId: values.paymentAccountId
              ? Number(values.paymentAccountId.id)
              : null,
          },
        },
      })
        .then(async ({}) => {
          //form.resetFields();
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
    const { paymentSliceId, schoolFeeId, paidAmount } = item
    return paymentSliceId && schoolFeeId && parseFloat(paidAmount)
  }

  useEffect(() => {
    setValue('items', [])
    if (schoolFeeLevels) {
      const defaultValues = schoolFeeLevels.map((item) => ({
        paymentSliceId: item.paymentSlice?.id,
        schoolFeeId: item.schoolFee?.id,
        //@ts-ignore
        paymentSlice: `${item.paymentSlice.name} -- (${item.paymentSlice.deadline})`,
        schoolFee: item.schoolFee?.name,
        requiredAmount: item.amount,
        paidAmount: item.amount || null,
        inKindPayment: false,
      }))

      for (let i = 0; i < defaultValues.length; i++) {
        append(defaultValues[i])
      }

      //set student
      if (schoolFeeLevels.length > 0) {
        setValue(
          'student',
          concat(
            schoolFeeLevels[0].studentInvoice?.student?.lastName || '',
            schoolFeeLevels[0].studentInvoice?.student?.firstName || '',
          ),
        )
        setValue('studentId', schoolFeeLevels[0].studentInvoice?.student?.id)
        setValue('studentInvoiceId', schoolFeeLevels[0].studentInvoice?.id)
      }

      computeTotal()
    }
  }, [schoolFeeLevels, append, setValue])

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

  useDebounceEffect(
    () => {
      if (invoiceRef != null) {
        setReference(invoiceRef)
      } else {
        setValue('items', [])
      }
    },
    [invoiceRef],
    { wait: 200 },
  )

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

  useEffect(() => {
    setReminder(givenAmount && total ? givenAmount - total : null)
  }, [givenAmount, total])

  return (
    <Form onSubmit={onSubmit}>
      <div className="flex flex-col md:flex-row w-full gap-x-6">
        <div className="w-full md:w-3/12 md:order-4">
          <label />
          <span className="font-medium text-3xl flex justify-end">
            {toCurrency(total)} FCFA
          </span>
        </div>

        <div className="w-full md:w-3/12">
          <Input
            name="invoiceReference"
            label={t('label-invoiceReference')}
            control={control}
            required
            placeholder={t('label-invoiceReference')}
          />
        </div>

        <div className="w-full md:w-3/12">
          <Input
            name="studentId"
            label={t('label-note')}
            control={control}
            className="hidden"
          />

          <Input
            name="student"
            label={t('label-student')}
            control={control}
            readOnly={false}
            required={true}
            placeholder={t('label-selectStudent')}
          />
        </div>

        <div className="w-full md:w-3/12">
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
      </div>

      <div className="flex flex-col md:flex-row w-full gap-x-6">
        <div className="w-full md:w-3/12">
          <DatePicker
            name="paymentDate"
            label={t('label-paymentDate')}
            control={control}
            required={true}
          />
        </div>

        <div className="w-full md:w-3/12">
          <Input
            name="reference"
            label={t('label-reference')}
            control={control}
          />
        </div>

        <div className="w-full md:w-3/12">
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
                onChange={(val) => setValue('paymentAccountId', val)}
                options={
                  specialAccounts
                    ? specialAccounts.filter(
                        ({ specialAccountType }: any) =>
                          specialAccountType === 'SALE',
                      )
                    : undefined
                }
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.id}
                formId="specialAccount"
                optionLabel="name"
                defaultValue={
                  studentPayment
                    ? studentPayment.paymentAccount
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
        </div>

        <div className="w-full md:w-3/12">
          <Input name="note" label={t('label-note')} control={control} />
        </div>
      </div>

      <div className="w-full">
        <Table className="table table-bordered table-condensed table-hover responsive spreadsheet">
          <thead>
            <tr>
              <th style={{ width: '10px' }}>#</th>
              <th style={{ width: '25%' }}>{t('label-slice')}</th>
              <th>{t('label-schoolFee')}</th>
              <th style={{ width: '20%' }}>{t('label-requiredAmount')}</th>
              <th style={{ width: '20%' }}>{t('label-amountPaid')}</th>
              <th>{t('label-inKindPayment')}</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((field, index) => (
              <tr key={field.id}>
                <td style={{ textAlign: 'center' }}>{index + 1}</td>
                <td style={{ display: 'none' }}>
                  <SimpleInput
                    {...register(`items.${index}.paymentSliceId`)}
                    readOnly={true}
                  />
                </td>

                <td style={{ display: 'none' }}>
                  <SimpleInput
                    {...register(`items.${index}.schoolFeeId`)}
                    readOnly={true}
                  />
                </td>

                <td>
                  <SimpleInput
                    {...register(`items.${index}.paymentSlice`)}
                    readOnly={true}
                  />
                </td>

                <td>
                  <SimpleInput
                    {...register(`items.${index}.schoolFee`)}
                    readOnly={true}
                  />
                </td>

                <td>
                  <InputNumber
                    {...register(`items.${index}.requiredAmount`)}
                    readOnly
                    value={watch(`items.${index}.requiredAmount`)}
                  />
                </td>

                <td>
                  <InputNumber
                    value={watch(`items.${index}.paidAmount`) || ''}
                    {...register(`items.${index}.paidAmount`)}
                    readOnly
                  />
                </td>
                <td className="text-center">
                  <Input
                    name={`items.${index}.inKindPayment`}
                    control={control}
                    type="checkbox"
                    className="inline-block mb-0"
                    checked={watch(`items.${index}.inKindPayment`) || false}
                  />
                </td>
              </tr>
            ))}
            {total !== 0 && (
              <tr>
                <td></td>
                <td className="px-1 font-medium text-lg">Montant donné</td>
                <td>
                  <InputNumber
                    value={givenAmount}
                    onChange={(e) => {
                      const val = e.target.value
                      setGivenAmount(val ? Number(val) : null)
                    }}
                    className="w-full md:w-4/12"
                  />
                </td>
                <td className="px-1 font-medium text-lg">Somme à rembourser</td>
                <td className="px-1">
                  {reminder !== null && (
                    <div className="font-medium text-xl text-red-600">
                      {toCurrency(reminder)} FCFA
                    </div>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/*Buttons*/}
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

export default InvoicePaymentForm
