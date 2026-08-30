import { useTranslation } from 'react-i18next'
import { Form } from 'reactstrap'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import type { FC } from 'react'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { toast } from 'react-toastify'
import { TOAST_OPTIONS } from '@/utils/constants'
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import Input from '@/@core/components/ui/forms/input'
import Switch from '@/@core/components/ui/forms/swith'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import { useAuthentication } from '@/hooks/useAuthentication'
import RoleItem from './RoleItem'
import { Shield, Activity, List } from 'lucide-react'

import FormSection from '@/@core/components/ui/forms/form-section'
import ToggleOption from '@/@core/components/ui/forms/toggle-option'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'
import { StyledCheckbox } from '@/@core/components/ui/styled-checkbox'
import type { PermissionItem, RoleType } from './role.type'
import { roleValidation } from './role.validation'

interface FormProps extends BaseFormProps {
  role?: RoleType
  modal?: NiceModalHandler
  permissions?: PermissionItem[]
}

const initialValues: Partial<RoleType> = {
  name: '',
  active: true,
  description: '',
}

const RoleForm: FC<FormProps> = ({ role, modal, action, ...props }) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const {
    control,
    handleSubmit,
    // getValues,
    formState: { isDirty },
    reset,
    setValue,
    register,
  } = useForm<RoleType>({
    defaultValues: {
      description: role?.description || '',
      name: role?.name || '',
      active: role ? role.active : true,
      items: props.permissions ? props.permissions : [],
    },
    resolver: yupResolver(roleValidation),
  })

  const { fields } = useFieldArray({ control, name: 'items' })
  const active = useWatch({ control, name: 'active' })

  // Watch all items to determine global checked state
  const items = useWatch({ control, name: 'items' })

  const allPermissions = items?.flatMap((group: any) => group.items || []) || []
  const checkingPermissions = allPermissions.filter((p: any) => p?.checked)
  const totalPermissionsCount = allPermissions.length

  const isAllChecked =
    totalPermissionsCount > 0 &&
    checkingPermissions.length === totalPermissionsCount
  const isIndeterminate = checkingPermissions.length > 0 && !isAllChecked

  const handleToggleGlobal = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked

    fields.forEach((group, groupIndex) => {
      group.items.forEach((_, itemIndex) => {
        setValue(`items.${groupIndex}.items.${itemIndex}.checked`, isChecked, {
          shouldDirty: true,
          shouldValidate: true,
        })
      })
    })
  }

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    close?: boolean,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      const id = role ? Number(role.id) : undefined

      action({
        variables: {
          role: {
            id,
            enterpriseId,
            permissionItems: values.items.map((item: any) => ({
              groupName: item.groupName,
              items: item.items.map((item: any) => ({
                id: item.id,
                code: item.code,
                checked: item.checked,
              })),
            })),
            name: values.name,
            active: values.active,
            description: values.description,
          },
        },
      })
        .then(async ({ data }) => {
          reset(initialValues)
          toast.success(`Role enregistré`, { ...TOAST_OPTIONS })

          if (props.popover) {
            messageService.sendMessage('role', data.role)
            props.onModalClose?.()
          }
          if (close) {
            modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(`Impossible d'ajouter le role: ${formatError(error)}`)
        })
    })(event)
  }

  return (
    <Form onSubmit={onSubmit} className="flex flex-col max-w-5xl mx-auto gap-1">
      <FormSection
        icon={<Shield size={18} />}
        title={t('label-roleDetails', 'Role Details')}
        description={t('role.detailsDesc', 'Basic information about the role')}
      >
        <div className="grid grid-cols-1 gap-1">
          <Input
            name="name"
            control={control}
            label={t('label-name')}
            required
          />

          <Input
            name="description"
            control={control}
            label={t('label-description')}
            type="textarea"
            rows={3}
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
          <Switch name="active" control={control} label="" />
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

        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {fields.map((field, index) => (
            <RoleItem
              key={field.id}
              nestIndex={index}
              control={control}
              register={register}
              setValue={setValue}
              groupName={field.groupName}
            />
          ))}
        </div>
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

export default RoleForm
