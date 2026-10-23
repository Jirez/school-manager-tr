import type { ChangeEvent, FC } from 'react'
import { Form } from 'reactstrap'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { Activity, List, Shield } from 'lucide-react'
import { useSelector } from '@tanstack/react-form'

import { TOAST_OPTIONS } from '@/utils/constants'
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import { useAuthentication } from '@/hooks/useAuthentication'
import FormSection from '@/@core/components/ui/forms/form-section'
import ToggleOption from '@/@core/components/ui/forms/toggle-option'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'
import { StyledCheckbox } from '@/@core/components/ui/styled-checkbox'
import { defaultMeta, useAppForm } from '#/hooks/form/form'
import RoleItem from './RoleItem'
import type { PermissionItem, PermissionItemItem, RoleType } from './role.type'
import { roleSchema } from './role.validation'

interface FormProps extends BaseFormProps {
  role?: RoleType
  modal?: NiceModalHandler
  permissions?: Array<{
    groupName: string
    items: PermissionItemItem[]
  }>
}

const RoleForm: FC<FormProps> = ({ role, modal, action, ...props }) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const {
    AppField,
    AppForm,
    SubmitButton,
    handleSubmit,
    reset,
    setFieldValue,
    store,
  } = useAppForm({
    defaultValues: {
      name: role?.name || '',
      description: role?.description || '',
      active: role ? role.active : true,
      items: (props.permissions ?? []).map((group) => ({
        groupName: group.groupName,
        checked:
          group.items.length > 0 && group.items.every((item) => item.checked),
        items: group.items.map((item) => ({ ...item })),
      })),
    } as any,
    validators: {
      onChange: roleSchema,
    },
    onSubmitMeta: defaultMeta,
    onSubmit({ value, meta }) {
      const values = roleSchema.parse(value)
      const id = role ? Number(role.id) : undefined

      action({
        variables: {
          role: {
            id,
            enterpriseId,
            permissionItems: values.items.map((item) => ({
              groupName: item.groupName,
              items: item.items.map((permission) => ({
                id: permission.id,
                code: permission.code,
                checked: permission.checked,
              })),
            })),
            name: values.name,
            active: values.active,
            description: values.description,
          },
        },
      })
        .then(async ({ data }) => {
          reset()
          toast.success(`Role enregistré`, { ...TOAST_OPTIONS })

          if (props.popover) {
            messageService.sendMessage('role', data.role)
            props.onModalClose?.()
          }

          if (meta.close) {
            modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(`Impossible d'ajouter le role: ${formatError(error)}`)
        })
    },
  })

  const active = useSelector(store, (state) => state.values.active)
  const items = (useSelector(store, (state) => state.values.items) ??
    []) as PermissionItem[]

  const allPermissions = items.flatMap((group) => group.items)
  const checkedPermissions = allPermissions.filter(
    (permission) => permission.checked,
  )
  const totalPermissionsCount = allPermissions.length

  const isAllChecked =
    totalPermissionsCount > 0 &&
    checkedPermissions.length === totalPermissionsCount
  const isIndeterminate = checkedPermissions.length > 0 && !isAllChecked

  const handleToggleGlobal = (event: ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked

    setFieldValue('items', (previous: PermissionItem[]) =>
      previous.map((group) => ({
        ...group,
        checked,
        items: group.items.map((item) => ({
          ...item,
          checked,
        })),
      })),
    )
  }

  return (
    <Form
      onSubmit={(event) => {
        event.preventDefault()
        handleSubmit()
      }}
      className="flex flex-col max-w-5xl mx-auto gap-1"
    >
      <FormSection
        icon={<Shield size={18} />}
        title={t('label-roleDetails', 'Role Details')}
        description={t('role.detailsDesc', 'Basic information about the role')}
      >
        <div className="grid grid-cols-1 gap-1">
          <AppField
            name="name"
            children={(field) => (
              <field.Input label={t('label-name')} required />
            )}
          />

          <AppField
            name="description"
            children={(field) => (
              <field.Input
                label={t('label-description')}
                type="textarea"
                rows={3}
              />
            )}
          />
        </div>
      </FormSection>

      <FormSection
        icon={<Activity size={18} />}
        title={t('label-status', 'Status')}
        description={t('role.statusDesc', 'Manage role availability')}
      >
        <ToggleOption
          icon={<Activity size={20} />}
          title={t('label-active')}
          description={t(
            'role.activeDescription',
            'Enable or disable this role',
          )}
          isActive={active}
        >
          <AppField
            name="active"
            children={(field) => <field.Switch label="" />}
          />
        </ToggleOption>
      </FormSection>

      <FormSection
        icon={<List size={18} />}
        title={t('label-permissions', 'Permissions')}
        description={t(
          'role.permissionsDesc',
          'Configure access rights for this role',
        )}
      >
        <div className="mb-2 flex items-center justify-end gap-2 px-1">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('label-checkAll', 'Check All')}
          </span>
          <StyledCheckbox
            checked={isAllChecked}
            indeterminate={isIndeterminate}
            onChange={handleToggleGlobal}
          />
        </div>

        <AppField name="items" mode="array">
          {(field) => (
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {field.state.value.map((group: PermissionItem, index: number) => (
                <AppField
                  key={index}
                  name={`items[${index}].items`}
                  mode="array"
                  children={(itemsField) => (
                    <RoleItem
                      nestIndex={index}
                      groupName={group.groupName}
                      field={itemsField}
                    />
                  )}
                />
              ))}
            </div>
          )}
        </AppField>
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

export default RoleForm
