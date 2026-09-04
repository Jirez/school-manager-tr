import { Form } from 'reactstrap'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import type { PermissionType } from '@/views/users/permission/permission.type'
import type { FC } from 'react'
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
import FormSection from '@/@core/components/ui/forms/form-section'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'
import ToggleOption from '@/@core/components/ui/forms/toggle-option'
import { permissionSchema } from '@/views/users/permission/permission.validation'
import type { PermissionSchemaType } from '@/views/users/permission/permission.validation'
import { defaultMeta, useAppForm } from '#/hooks/form/form'
import { useSelector } from '@tanstack/react-form'
import { m } from '@/paraglide/messages'

interface FormProps extends BaseFormProps {
  permission?: PermissionType
  modal?: NiceModalHandler
}

const PermissionForm: FC<FormProps> = ({
  permission,
  action,
  modal,
  ...props
}) => {
  const { handleSubmit, reset, store, AppField, AppForm, SubmitButton } =
    useAppForm({
      defaultValues: {
        description: permission?.description || '',
        code: permission?.code || '',
        active: permission ? permission.active : true,
      } as any,
      validators: {
        onChange: permissionSchema,
      },
      onSubmitMeta: defaultMeta,
      onSubmit({ value, meta }) {
        const values = permissionSchema.parse(value)
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
            reset()
            toast.success(`Permission enregistrée`, { ...TOAST_OPTIONS })

            if (props.popover) {
              messageService.sendMessage('permission', data.permission)
              props.onModalClose?.()
            }
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            if (meta.close) {
              modal?.hide()
            }
          })
          .catch((error) => {
            toast.error(
              `Impossible d'ajouter la permission: ${formatError(error)}`,
            )
          })
      },
    })

  const active = useSelector(store, (state) => state.values.active)

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault()
        handleSubmit()
      }}
      className="space-y-1"
    >
      <FormSection
        icon={<Shield size={20} />}
        title={m.label_permissionInformation()}
        description={m.label_permissionInformationDesc()}
        color="#7367f0"
      >
        <div className="grid grid-cols-1 gap-1">
          <AppField
            name="code"
            children={(field) => (
              <field.Input
                label={m.code()}
                required
                prepend={<Key size={16} />}
                placeholder={m.placeholder_code()}
              />
            )}
          />
        </div>
      </FormSection>

      <FormSection
        icon={<Settings size={20} />}
        title={m.label_status()}
        description={m.label_statusDesc()}
        color="#28c76f"
      >
        <ToggleOption
          icon={<CheckCircle size={16} />}
          title={m.label_active()}
          description={m.label_activeDesc()}
          isActive={active}
        >
          <AppField
            name="active"
            children={(field) => <field.Switch label="" />}
          />
        </ToggleOption>
      </FormSection>

      <FormSection
        icon={<FileText size={20} />}
        title={m.label_description()}
        description={m.label_descriptionDesc()}
        color="#ff9f43"
      >
        <AppField
          name="description"
          children={(field) => (
            <field.Input
              label=""
              type="textarea"
              rows={3}
              prepend={<AlignLeft size={16} />}
              placeholder={m.placeholder_description()}
            />
          )}
        />
      </FormSection>

      <StickyActions>
        <AppForm>
          <SubmitButton
            cancelAction={modal?.hide}
            isSubmitting={props.loading}
            popover={props.popover}
            onSubmit={(_, meta) => handleSubmit(meta)}
          />
        </AppForm>
      </StickyActions>
    </Form>
  )
}

export default PermissionForm
