import { Form } from 'reactstrap'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  Tag,
  Type,
  Clock,
  CheckCircle,
  FileText,
  AlignLeft,
  Settings,
} from 'lucide-react'

import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import Input from '@/@core/components/ui/forms/input'
import Switch from '@/@core/components/ui/forms/swith'
import FormSection from '@/@core/components/ui/forms/form-section'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'
import ToggleOption from '@/@core/components/ui/forms/toggle-option'
import NumericInput from '@/@core/components/ui/forms/numeric-input'
import { useAuthentication } from '@/hooks/useAuthentication'
import { TOAST_OPTIONS } from '@/utils/constants'
import { formatError } from '@/utils/ErrorHelper'
import { messageService } from '@/utils/message.service'
import type { PaymentConditionType } from './payment.condition.type'
import { paymentConditionValidation } from './payment.condition.validation'

interface FormProps extends BaseFormProps {
  paymentCondition?: PaymentConditionType
  modal?: NiceModalHandler
}

const PaymentConditionForm: React.FC<FormProps> = ({
  paymentCondition,
  modal,
  action,
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
    watch,
    setValue,
  } = useForm<PaymentConditionType & { daysF: string | number }>({
    defaultValues: {
      name: paymentCondition?.name || '',
      description: paymentCondition?.description || '',
      days: paymentCondition ? paymentCondition?.days : '',
      daysF: paymentCondition ? paymentCondition?.days : '',
      active: paymentCondition ? paymentCondition.active : true,
    },
    //@ts-ignore
    resolver: yupResolver(paymentConditionValidation),
  })

  const onSubmit = (
    event: React.FormEvent<HTMLFormElement>,
    close?: boolean,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      const id = paymentCondition ? Number(paymentCondition.id) : undefined

      action({
        variables: {
          condition: {
            id: id,
            name: values.name,
            days: Number(values.days),
            active: values.active,
            description: values.description,
            enterpriseId,
          },
        },
      })
        .then(async ({ data }) => {
          reset()
          toast.success(
            `Condition de paiement ${data.paymentCondition.name} ajoutée`,
            { ...TOAST_OPTIONS },
          )
          if (close) {
            modal?.hide()
          }

          if (props.popover) {
            messageService.sendMessage(
              'paymentCondition',
              data.paymentCondition,
            )
            props.onModalClose?.()
          }
        })
        .catch((error) => {
          toast.error(
            `Impossible d'ajouter la condition de paiement ${formatError(
              error,
            )}`,
          )
        })
    })(event)
  }

  return (
    <Form onSubmit={onSubmit} className="space-y-1">
      <FormSection
        icon={<Tag size={20} />}
        title={
          t('label-paymentConditionInformation') ||
          'Informations de la condition'
        }
        description={
          t('label-paymentConditionInformationDesc') ||
          'Détails généraux et délais'
        }
        color="#7367f0"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          <Input
            name="name"
            control={control}
            label={t('label-name')}
            required
            prepend={<Type size={16} />}
            placeholder={t('placeholder-name')}
          />

          <NumericInput
            name="days"
            nameF="daysF"
            control={control}
            label={t('label-delayDays')}
            required
            setValue={setValue}
            prepend={<Clock size={16} />}
            placeholder="0"
          />
        </div>
      </FormSection>

      <FormSection
        icon={<Settings size={20} />}
        title={t('label-status') || 'Statut'}
        description={t('label-statusDesc') || "Configuration de l'état"}
        color="#28c76f"
      >
        <ToggleOption
          icon={<CheckCircle size={16} />}
          title={t('label-active')}
          description={t('label-activeDesc') || 'Condition activée'}
          isActive={watch('active')}
        >
          <Switch
            name="active"
            control={control}
            label=""
            defaultChecked={getValues('active')}
            onChange={(e: any) =>
              setValue('active', e.target.checked, { shouldDirty: true })
            }
          />
        </ToggleOption>
      </FormSection>

      <FormSection
        icon={<FileText size={20} />}
        title={t('label-description') || 'Description'}
        description={t('label-descriptionDesc') || 'Notes supplémentaires'}
        color="#ff9f43"
      >
        <Input
          name="description"
          control={control}
          label=""
          type="textarea"
          rows={3}
          prepend={<AlignLeft size={16} />}
          placeholder={t('placeholder-description')}
        />
      </FormSection>

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

export default PaymentConditionForm
