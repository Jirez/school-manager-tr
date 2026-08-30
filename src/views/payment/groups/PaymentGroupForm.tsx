import type { FC } from 'react'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { useAuthentication } from '@/hooks/useAuthentication'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Form } from 'reactstrap'

import type { PaymentGroupType } from '@/views/payment/groups/PaymentGroup.type'
import { paymentGroupValidationSchema } from '@/views/payment/groups/PaymentGroup.validation'
import LiveView from '@/utils/LiveView'
import ControlledSelect from '@/@core/components/ui/forms/controlled-select'
import { schoolYearOptions } from '@/utils/select/selectComponents'
import SchoolYearAdd from '@/views/school/schoolYears/SchoolYearAdd'
import Input from '@/@core/components/ui/forms/input'
import Switch from '@/@core/components/ui/forms/swith'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import { setOffcanvasSize } from '@/utils/helpers'
import { TOAST_OPTIONS } from '@/utils/constants'
import { SchoolYearCreatedDocument, useSchoolYearsQuery } from '@/gql/graphql'

interface PaymentGroupFormProps extends BaseFormProps {
  paymentGroup?: PaymentGroupType
  modal?: NiceModalHandler
}

const initialValues: Partial<PaymentGroupType> = {
  name: '',
  name2: '',
  autoInclusion: true,
  fallback: false,
  schoolYearId: null,
  external: false,
  note: '',
  formerStudent: false,
}

const PaymentGroupForm: FC<PaymentGroupFormProps> = ({
  paymentGroup,
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
    handleSubmit,
    formState: { isDirty },
    reset,
    getValues,
    setValue,
  } = useForm<PaymentGroupType>({
    defaultValues: {
      name: paymentGroup?.name || '',
      name2: paymentGroup?.name2 || '',
      schoolYearId: paymentGroup ? paymentGroup.schoolYear : null,
      autoInclusion: paymentGroup ? paymentGroup.autoInclusion : true,
      formerStudent: paymentGroup ? paymentGroup.formerStudent : false,
      external: paymentGroup ? paymentGroup.external : false,
      fallback: paymentGroup ? paymentGroup.fallback : false,
      note: paymentGroup?.note || '',
    },
    resolver: yupResolver(paymentGroupValidationSchema),
  })

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    close?: boolean,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      const id = paymentGroup ? Number(paymentGroup.id) : undefined

      action({
        variables: {
          group: {
            ...values,
            id,
            schoolYearId: values.schoolYearId
              ? Number(values.schoolYearId.id)
              : null,
          },
        },
      })
        .then(async ({ data }) => {
          reset(initialValues)
          toast.success(
            `Groupe de paiement ${data.paymentGroup.name} enregistré`,
            { ...TOAST_OPTIONS },
          )

          if (props.popover) {
            messageService.sendMessage('paymentGroup', data.paymentGroup)
            props.onModalClose?.()
          }
          if (close) {
            modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(
            `Impossible d'ajouter le groupe de paiement: ${formatError(error)}`,
          )
        })
    })(event)
  }

  useEffect(() => {
    setOffcanvasSize('35%')
  }, [])

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
            formTitle={t('action.add_schoolYear')}
          />
        )}
      </LiveView>

      <Input
        name="name"
        label={t('label-name')}
        control={control}
        required={true}
      />

      <Input name="name2" label={t('label-name2')} control={control} />

      <Switch
        name="autoInclusion"
        label={t('label-autoInclusion')}
        control={control}
        defaultChecked={getValues('autoInclusion')}
      />

      <Switch
        name="formerStudent"
        label={t('label-includeFormerStudent')}
        control={control}
        defaultChecked={getValues('formerStudent')}
      />

      <Switch
        name="external"
        label={t('label-includeExternal')}
        control={control}
        defaultChecked={getValues('external')}
      />

      <Switch
        name="fallback"
        label={t('label-fallback')}
        control={control}
        defaultChecked={getValues('fallback')}
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
        fixed={!props.popover}
      />
    </Form>
  )
}

export default PaymentGroupForm
