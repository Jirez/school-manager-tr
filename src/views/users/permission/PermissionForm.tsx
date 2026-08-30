import { useTranslation } from 'react-i18next'
import { Form } from 'reactstrap'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import type { PermissionType } from '@/views/users/permission/permission.type'
import type { FC } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { toast } from 'react-toastify'
import {
  Shield,
  Settings,
  CheckCircle,
  FileText,
  AlignLeft,
  Key,
} from 'lucide-react'
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import { TOAST_OPTIONS } from '@/utils/constants'
import Input from '@/@core/components/ui/forms/input'
import Switch from '@/@core/components/ui/forms/swith'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import FormSection from '@/@core/components/ui/forms/form-section'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'
import ToggleOption from '@/@core/components/ui/forms/toggle-option'
import { permissionValidation } from '@/views/users/permission/permission.validation'

interface FormProps extends BaseFormProps {
  permission?: PermissionType
  modal?: NiceModalHandler
}

const initialValues: Partial<PermissionType> = {
  code: '',
  active: true,
  description: '',
}

const PermissionForm: FC<FormProps> = ({
  permission,
  action,
  modal,
  ...props
}) => {
  const { t } = useTranslation()

  const {
    control,
    handleSubmit,
    getValues,
    formState: { isDirty },
    reset,
    watch,
    setValue,
  } = useForm<PermissionType>({
    defaultValues: {
      description: permission?.description || '',
      code: permission?.code || '',
      active: permission ? permission.active : true,
    },
    resolver: yupResolver(permissionValidation),
  })

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    close?: boolean,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      const id = permission ? Number(permission.id) : undefined

      action({
        variables: {
          permission: {
            ...values,
            id,
          },
        },
      })
        .then(async ({ data }) => {
          reset(initialValues)
          toast.success(`Permission enregistrée`, { ...TOAST_OPTIONS })

          if (props.popover) {
            messageService.sendMessage('permission', data.permission)
            props.onModalClose?.()
          }
          if (close) {
            modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(
            `Impossible d'ajouter la permission: ${formatError(error)}`,
          )
        })
    })(event)
  }

  return (
    <Form onSubmit={onSubmit} className="space-y-1">
      <FormSection
        icon={<Shield size={20} />}
        title={
          t('label-permissionInformation') || 'Informations de la permission'
        }
        description={
          t('label-permissionInformationDesc') || 'Détails généraux et code'
        }
        color="#7367f0"
      >
        <div className="grid grid-cols-1 gap-1">
          <Input
            name="code"
            control={control}
            label={t('label-code')}
            required
            prepend={<Key size={16} />}
            placeholder={t('placeholder-code') || 'Entrer le code'}
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
          description={t('label-activeDesc') || 'Permission activée'}
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

export default PermissionForm
