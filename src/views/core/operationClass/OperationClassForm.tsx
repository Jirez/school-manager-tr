import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import type { OperationClassType } from '@/views/core/operationClass/operation.class.type'
import { Form } from 'reactstrap'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import type { FC } from 'react'
import Input from '@/@core/components/ui/forms/input'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import Switch from '@/@core/components/ui/forms/swith'
import {
  Tag,
  Type,
  CheckCircle,
  FileText,
  AlignLeft,
  Settings,
} from 'lucide-react'
import FormSection from '@/@core/components/ui/forms/form-section'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'
import ToggleOption from '@/@core/components/ui/forms/toggle-option'
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import { useAuthentication } from '@/hooks/useAuthentication'
import { yupResolver } from '@hookform/resolvers/yup'
import { TOAST_OPTIONS } from '@/utils/constants'
import { operationClassValidation } from './operation.class.validation'

interface OperationClassFormProps extends BaseFormProps {
  operationClass?: OperationClassType
  modal?: NiceModalHandler
}

const initialValues: Partial<OperationClassType> = {
  name: '',
  active: true,
  description: '',
}

const OperationClassForm: FC<OperationClassFormProps> = ({
  operationClass,
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
    setValue,
  } = useForm<OperationClassType>({
    defaultValues: {
      name: operationClass?.name || '',
      active: operationClass ? operationClass.active : true,
      description: operationClass?.description || '',
    },
    resolver: yupResolver(operationClassValidation),
  })

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    close?: boolean,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      const id = operationClass ? Number(operationClass.id) : undefined

      action({ variables: { operationClass: { ...values, id, enterpriseId } } })
        .then(async ({ data }) => {
          reset(initialValues)
          toast.success(
            `Classe d'opération ${data.operationClass.name} enregistrée`,
            {
              ...TOAST_OPTIONS,
            },
          )

          if (props.popover) {
            messageService.sendMessage('operationClass', data.operationClass)
            props.onModalClose?.()
          }
          if (close) {
            modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(
            `Impossible d'ajouter la classe d'opération: ${formatError(error)}`,
          )
        })
    })(event)
  }

  return (
    <Form onSubmit={onSubmit} className="space-y-1">
      <FormSection
        icon={<Tag size={20} />}
        title={
          t('label-operationClassInformation') ||
          "Informations de la classe d'opération"
        }
        description={
          t('label-operationClassInformationDesc') ||
          "Détails généraux de la classe d'opération"
        }
        color="#7367f0"
      >
        <div className="grid grid-cols-1 gap-1">
          <Input
            name="name"
            label={t('label-name')}
            control={control}
            required={true}
            prepend={<Type size={16} />}
            placeholder={t('placeholder-name')}
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
          description={t('label-activeDesc') || "Classe d'opération activée"}
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
          label=""
          control={control}
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

export default OperationClassForm
