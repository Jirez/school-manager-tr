import { useTranslation } from 'react-i18next'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import { Form } from 'reactstrap'
import { yupResolver } from '@hookform/resolvers/yup'

import { useAuthentication } from '@/hooks/useAuthentication'
import type { DiscountType } from './discount.type'
import Input from '@/@core/components/ui/forms/input'
import Switch from '@/@core/components/ui/forms/swith'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import { TOAST_OPTIONS } from '@/utils/constants'
import { DiscountValidationSchema } from './discount.validation'

interface FormProps extends BaseFormProps {
  discount?: DiscountType
  modal?: NiceModalHandler
}

const initialValues: Partial<DiscountType> = {
  name: '',
  value: '',
  discountType: '',
  active: true,
  note: '',
}

const DiscountForm: React.FC<FormProps> = ({
  discount,
  action,
  modal,
  ...props
}) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const {
    control,
    handleSubmit,
    getValues,
    formState: { isDirty },
    reset,
  } = useForm<DiscountType>({
    defaultValues: {
      name: discount?.name || '',
      note: discount?.note || '',
      discountType: discount?.discountType || '',
      value: discount?.value || '',
      active: discount ? discount.active : true,
    },
    //@ts-ignore
    resolver: yupResolver(DiscountValidationSchema),
  })

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    close?: boolean,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      const id = discount ? Number(discount.id) : undefined

      action({
        variables: {
          discount: {
            ...values,
            id,
            enterpriseId,
          },
        },
      })
        .then(async ({ data }) => {
          reset(initialValues)
          toast.success(`Remise ${data.discount.name} enregistrée`, {
            ...TOAST_OPTIONS,
          })

          if (props.popover) {
            messageService.sendMessage('discount', data.discount)
            props.onModalClose?.()
          }
          if (close) {
            modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(`Impossible d'ajouter la remise: ${formatError(error)}`)
        })
    })(event)
  }

  return (
    <Form onSubmit={onSubmit}>
      <Input
        name="discountType"
        control={control}
        label={t('label-discountType')}
        required
        type="select"
      >
        <option value="">{t('label-select')}</option>
        <option value="AMOUNT">{t('AMOUNT')}</option>
        <option value="PERCENT">{t('PERCENTAGE')}</option>
      </Input>

      <Input name="name" control={control} label={t('label-name')} required />

      <Input
        name="value"
        control={control}
        label={t('label-discountValue')}
        required
      />

      <Switch
        name="active"
        control={control}
        label={t('label-active')}
        defaultChecked={getValues('active')}
      />

      <Input
        name="note"
        control={control}
        label={t('label-note')}
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

export default DiscountForm
