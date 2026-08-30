import { useTranslation } from 'react-i18next'
import type { PaymentSliceType } from '@/views/payment/slices/PaymentSlice.type'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { toast } from 'react-toastify'
import type { FC } from 'react'
import { useForm } from 'react-hook-form'
import { Form } from 'reactstrap'
import { useAuthentication } from '@/hooks/useAuthentication'
import dayjs from 'dayjs'
import LiveView from '@/utils/LiveView'
import ControlledSelect from '@/@core/components/ui/forms/controlled-select'
import { schoolYearOptions } from '@/utils/select/selectComponents'
import SchoolYearAdd from '@/views/school/schoolYears/SchoolYearAdd'
import Input from '@/@core/components/ui/forms/input'
import Switch from '@/@core/components/ui/forms/swith'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import DatePicker from '@/@core/components/ui/forms/date-picker'
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import { yupResolver } from '@hookform/resolvers/yup'
import { paymentSliceValidationSchema } from '@/views/payment/slices/paymentSlice.validation'
import { INPUT_DATE_FORMAT, TOAST_OPTIONS } from '@/utils/constants'
import { SchoolYearCreatedDocument, useSchoolYearsQuery } from '@/gql/graphql'

interface PaymentSliceFormProps extends BaseFormProps {
  paymentSlice?: PaymentSliceType
  modal?: NiceModalHandler
}

const initialValues: Partial<PaymentSliceType> = {
  name: '',
  name2: '',
  numberOrder: undefined,
  deadline: null,
  refundable: false,
  note: '',
  schoolYearId: null,
}

const PaymentSliceForm: FC<PaymentSliceFormProps> = ({
  paymentSlice,
  modal,
  action,
  ...props
}) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const { data, loading, subscribeToMore } = useSchoolYearsQuery({
    variables: { id: enterpriseId },
  })

  const {
    control,
    formState: { isDirty },
    reset,
    getValues,
    handleSubmit,
    setValue,
  } = useForm<PaymentSliceType>({
    defaultValues: {
      schoolYearId: paymentSlice ? paymentSlice.schoolYear : null,
      refundable: paymentSlice ? paymentSlice.refundable : false,
      deadline: paymentSlice ? dayjs(paymentSlice.deadline).toDate() : null,
      numberOrder: paymentSlice?.numberOrder || undefined,
      name: paymentSlice?.name || '',
      name2: paymentSlice?.name2 || '',
      note: paymentSlice?.note || '',
    },
    resolver: yupResolver(paymentSliceValidationSchema),
  })

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    close?: boolean,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      const id = paymentSlice ? Number(paymentSlice.id) : undefined

      action({
        variables: {
          slice: {
            ...values,
            id,
            deadline: dayjs(values.deadline).format(INPUT_DATE_FORMAT),
            schoolYearId: values.schoolYearId
              ? Number(values.schoolYearId.id)
              : null,
          },
        },
      })
        .then(async ({ data }) => {
          reset(initialValues)
          toast.success(
            `Tranche de paiement ${data.paymentSlice.name} enregistrée`,
            { ...TOAST_OPTIONS },
          )

          if (props.popover) {
            messageService.sendMessage('paymentSlice', data.paymentSlice)
            props.onModalClose?.()
          }
          if (close) {
            modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(
            `Impossible d'ajouter la tranche de paiement: ${formatError(error)}`,
          )
        })
    })(event)
  }

  return (
    <Form onSubmit={onSubmit}>
      <LiveView
        document={SchoolYearCreatedDocument}
        singleVar="schoolYear"
        data={data}
        loading={loading}
        listVar="schoolYears"
        subscribeToMore={subscribeToMore}
        sortField="label"
        triggerUpdate={true}
        enterpriseId={enterpriseId}
      >
        {({ schoolYears }) => (
          <ControlledSelect
            name="schoolYearId"
            label={t('label-schoolYear')}
            control={control}
            required={true}
            loading={loading}
            onChange={(val) => setValue('schoolYearId', val)}
            options={schoolYears || undefined}
            getOptionLabel={(option) => option.label}
            getOptionValue={(option) => option.id}
            components={{ Option: schoolYearOptions }}
            form={<SchoolYearAdd />}
            formId="schoolYear"
            optionLabel="label"
          />
        )}
      </LiveView>

      <Input
        name="numberOrder"
        label={t('label-numberOrder')}
        control={control}
        required={true}
        type="number"
      />

      <Input
        name="name"
        label={t('label-name')}
        control={control}
        required={true}
      />

      <Input name="name2" label={t('label-name2')} control={control} />

      <Switch
        name="refundable"
        label={t('label-refundable')}
        control={control}
        defaultChecked={getValues('refundable')}
      />

      <DatePicker
        name="deadline"
        label={t('label-deadline')}
        control={control}
        required={true}
      />

      <Input
        name="note"
        label={t('label-note')}
        control={control}
        type="textarea"
      />

      <ActionButtons
        cancelAction={modal?.hide}
        isSubmitting={props.loading}
        popover={props.popover}
        dirty={isDirty}
        onSubmit={onSubmit}
      />
    </Form>
  )
}

export default PaymentSliceForm
