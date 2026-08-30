import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Form } from 'reactstrap'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import type { FC } from 'react'
import { ClipboardList, FileText, CheckCircle } from 'lucide-react'

import Input from '@/@core/components/ui/forms/input'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import Switch from '@/@core/components/ui/forms/swith'
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import { useAuthentication } from '@/hooks/useAuthentication'
import { yupResolver } from '@hookform/resolvers/yup'
import { TOAST_OPTIONS } from '@/utils/constants'
import type { EvalTypeType } from './evaltype.type'
import { evalTypeValidation } from './eval.type.validation'
import FormSection from '@/@core/components/ui/forms/form-section'
import ToggleOption from '@/@core/components/ui/forms/toggle-option'

interface PaymentModeFormProps extends BaseFormProps {
  evalType?: EvalTypeType
  modal?: NiceModalHandler
}

const initialValues: Partial<EvalTypeType> = {
  name: '',
  active: true,
  description: '',
}

const EvalTypeForm: FC<PaymentModeFormProps> = ({
  evalType,
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
    watch,
  } = useForm<EvalTypeType>({
    defaultValues: {
      name: evalType?.name || '',
      active: evalType ? evalType.active : true,
      description: evalType?.description || '',
    },
    resolver: yupResolver(evalTypeValidation),
  })

  const isActive = watch('active')

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    close?: boolean,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      const id = evalType ? Number(evalType.id) : undefined

      action({ variables: { type: { ...values, id, schoolId: enterpriseId } } })
        .then(async ({ data }) => {
          reset(initialValues)
          toast.success(
            t('toast-evalTypeSaved', { name: data.evalType.name }) ||
              `Type d'évaluation ${data.evalType.name} enregistré`,
            {
              ...TOAST_OPTIONS,
            },
          )

          if (props.popover) {
            messageService.sendMessage('evalType', data.evalType)
            props.onModalClose?.()
          }
          if (close) {
            modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(
            `Impossible d'ajouter le type d'évaluation: ${formatError(error)}`,
          )
        })
    })(event)
  }

  return (
    <Form onSubmit={onSubmit} className="space-y-1">
      <FormSection
        title={t('label-generalInfo')}
        description={
          t('label-evalTypeInfoDesc') ||
          "Définissez le nom et la description du type d'évaluation"
        }
        icon={<ClipboardList size={20} />}
        color="#7367f0"
      >
        <div className="grid grid-cols-1 gap-1">
          <Input
            name="name"
            label={t('label-name')}
            control={control}
            required={true}
            prepend={<FileText size={14} />}
          />
          <Input
            name="description"
            label={t('label-description')}
            control={control}
            type="textarea"
            placeholder={t('label-enterDescription')}
          />
        </div>
      </FormSection>

      <FormSection
        title={t('label-status')}
        description={
          t('label-evalTypeStatusDesc') ||
          "Activer ou désactiver ce type d'évaluation"
        }
        icon={<CheckCircle size={20} />}
        color="#28c76f"
      >
        <ToggleOption
          icon={<CheckCircle size={20} />}
          title={t('label-active')}
          description={
            t('label-evalTypeActiveDesc') ||
            "Permettre l'utilisation de ce type d'évaluation"
          }
          isActive={isActive}
        >
          <Switch
            name="active"
            control={control}
            label=""
            defaultChecked={getValues('active')}
          />
        </ToggleOption>
      </FormSection>

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

export default EvalTypeForm
