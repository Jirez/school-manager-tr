import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import type { PaymentModeType } from '@/views/payment/modes/PaymentMode.type'
import { Form } from 'reactstrap'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import type { FC } from 'react'
import { CreditCard, AlignLeft, Activity } from 'lucide-react'
import Input from '@/@core/components/ui/forms/input'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import Switch from '@/@core/components/ui/forms/swith'
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import { useAuthentication } from '@/hooks/useAuthentication'
import { yupResolver } from '@hookform/resolvers/yup'
import { paymentModeValidationSchema } from '@/views/payment/modes/paymentMode.validation'
import { TOAST_OPTIONS } from '@/utils/constants'
import FormSection from '@/@core/components/ui/forms/form-section'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'
import ToggleOption from '@/@core/components/ui/forms/toggle-option'

interface PaymentModeFormProps extends BaseFormProps {
  paymentMode?: PaymentModeType
  modal?: NiceModalHandler
}

const initialValues: Partial<PaymentModeType> = {
  name: '',
  active: true,
  description: '',
}

const PaymentModeForm: FC<PaymentModeFormProps> = ({
  paymentMode,
  action,
  modal,
  ...props
}) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const {
    control,
    handleSubmit,
    formState: { isDirty },
    reset,
    getValues,
  } = useForm<PaymentModeType>({
    defaultValues: {
      name: paymentMode?.name || '',
      active: paymentMode ? paymentMode.active : true,
      description: paymentMode?.description || '',
    },
    resolver: yupResolver(paymentModeValidationSchema),
  })

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    close?: boolean,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      const id = paymentMode ? Number(paymentMode.id) : undefined

      action({ variables: { mode: { ...values, id, schoolId: enterpriseId } } })
        .then(async ({ data }) => {
          reset(initialValues)
          toast.success(`Mode de payment ${data.paymentMode.name} enregistré`, {
            ...TOAST_OPTIONS,
          })

          if (props.popover) {
            messageService.sendMessage('paymentMode', data.paymentMode)
            props.onModalClose?.()
          }
          if (close) {
            modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(
            `Impossible d'ajouter le mode de paiement: ${formatError(error)}`,
          )
        })
    })(event)
  }

  return (
    <Form onSubmit={onSubmit} className="p-0">
      <div className="grid grid-cols-1 md:grid-cols-1 gap-1">
        {/* Basic Information Section */}
        <FormSection
          title={t('label-basicInformation') || 'Informations de base'}
          description={
            t('label-paymentModeDesc') ||
            'Définissez le nom du mode de paiement'
          }
          icon={<CreditCard size={18} />}
          color="#7367f0"
        >
          <div className="p-0">
            <Input
              name="name"
              label={t('label-name')}
              control={control}
              required={true}
              prepend={<CreditCard size={14} />}
              placeholder="Ex: Espèces, Virement..."
            />
          </div>
        </FormSection>

        {/* Settings Section */}
        <FormSection
          title={t('label-status') || 'Statut'}
          description={t('label-statusDesc') || 'État de disponibilité du mode'}
          icon={<Activity size={18} />}
          color="#28c76f"
        >
          <div className="p-0">
            <ToggleOption
              icon={<Activity size={16} />}
              title={t('label-active')}
              description={
                t('label-activeModeDesc') || 'Mode de paiement activé'
              }
              isActive={getValues('active')}
            >
              <Switch
                name="active"
                control={control}
                defaultChecked={getValues('active')}
                label=""
              />
            </ToggleOption>
          </div>
        </FormSection>

        {/* Additional Information Section */}
        <FormSection
          title={
            t('label-additionalInformation') || 'Informations supplémentaires'
          }
          description={
            t('label-additionalInfoDesc') || 'Détails ou notes complémentaires'
          }
          icon={<AlignLeft size={18} />}
          color="#ff9f43"
          className="col-span-full"
        >
          <div className="p-0">
            <Input
              name="description"
              label={t('label-description')}
              control={control}
              type="textarea"
              prepend={<AlignLeft size={14} />}
              placeholder="..."
              rows={2}
            />
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

export default PaymentModeForm
