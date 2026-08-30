import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { toast } from 'react-toastify'
import type { AccountGroupType } from '@/views/accounting/groups/AccountGroup.type'
import { Form } from 'reactstrap'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { accountGroupValidationSchema } from '@/views/accounting/groups/accountGroup.validation'
import Input from '@/@core/components/ui/forms/input'
import ControlledSelect from '@/@core/components/ui/forms/controlled-select'
import Switch from '@/@core/components/ui/forms/swith'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import { useAuthentication } from '@/hooks/useAuthentication'
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import LiveView from '@/utils/LiveView'
import {
  AccountGroupCreatedDocument,
  useAccountGroupsQuery,
} from '@/gql/graphql'
import { TOAST_OPTIONS } from '@/utils/constants'
import {
  Layers,
  Type,
  CheckCircle,
  GitBranch,
  AlignLeft,
  Settings,
  FileText,
} from 'lucide-react'
import FormSection from '@/@core/components/ui/forms/form-section'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'
import ToggleOption from '@/@core/components/ui/forms/toggle-option'

interface AccountGroupFormProps extends BaseFormProps {
  accountGroup?: AccountGroupType
  modal?: NiceModalHandler
}

const initialValues: Partial<AccountGroupType> = {
  name: '',
  description: '',
  parentId: null,
  sectionType: undefined,
  active: true,
}

const AccountGroupForm: FC<AccountGroupFormProps> = ({
  accountGroup,
  action,
  modal,
  ...props
}) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const { data, loading, subscribeToMore } = useAccountGroupsQuery({
    variables: { id: enterpriseId },
  })

  const options = [
    { label: t('label-asset'), value: 'ASSET' },
    { label: t('label-liability'), value: 'LIABILITY' },
    { label: t('label-charge'), value: 'CHARGE' },
    { label: t('label-product'), value: 'PRODUCT' },
  ]

  const {
    control,
    handleSubmit,
    formState: { isDirty },
    getValues,
    setValue,
    reset,
    watch,
  } = useForm<AccountGroupType>({
    defaultValues: {
      name: accountGroup?.name || '',
      active: accountGroup ? accountGroup.active : true,
      parentId: accountGroup ? accountGroup.parent : null,
      sectionType: accountGroup
        ? options.filter(({ value }) => value === accountGroup?.sectionType)[0]
        : undefined,
      description: accountGroup?.description || '',
    },
    resolver: yupResolver(accountGroupValidationSchema),
  })

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    close?: boolean,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      const id = accountGroup ? Number(accountGroup.id) : undefined

      action({
        variables: {
          group: {
            ...values,
            id,
            parentId: values.parentId ? Number(values.parentId.id) : null,
            sectionType: values.sectionType.value,
            enterpriseId: enterpriseId,
          },
        },
      })
        .then(async ({ data }) => {
          reset(initialValues)
          toast.success(
            t('message-accountGroupSaved', {
              name: data.accountGroup.name,
            }),
            {
              ...TOAST_OPTIONS,
            },
          )

          if (props.popover) {
            messageService.sendMessage('accountGroup', data.accountGroup)
            props.onModalClose?.()
          }
          if (close) {
            modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(
            t('message-accountGroupSaveError', {
              error: formatError(error),
            }),
          )
        })
    })(event)
  }

  return (
    <Form onSubmit={onSubmit} className="space-y-1">
      <FormSection
        icon={<Layers size={20} />}
        title={t('label-groupInformation') || 'Informations du groupe'}
        description={
          t('label-groupInformationDesc') || 'Détails généraux du groupe'
        }
        color="#7367f0"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          <div className="md:col-span-2">
            <ControlledSelect
              name="sectionType"
              control={control}
              label={t('label-section')}
              prepend={<Layers size={16} />}
              onChange={(value) => setValue('sectionType', value)}
              options={options}
            />
          </div>

          <div className="md:col-span-2">
            <Input
              name="name"
              label={t('label-name')}
              control={control}
              required={true}
              prepend={<Type size={16} />}
              placeholder={t('placeholder-name')}
            />
          </div>

          <div className="md:col-span-1">
            <LiveView
              document={AccountGroupCreatedDocument}
              singleVar="accountGroup"
              data={data}
              loading={loading}
              listVar="accountGroups"
              subscribeToMore={subscribeToMore}
              sortField="name"
              triggerUpdate={true}
              enterpriseId={enterpriseId}
            >
              {({ accountGroups }) => (
                <ControlledSelect
                  name="parentId"
                  label={t('label-parent')}
                  control={control}
                  loading={loading}
                  prepend={<GitBranch size={16} />}
                  onChange={(val: any) => setValue('parentId', val)}
                  options={
                    accountGroups
                      ? accountGroups.filter(
                          (g: any) => g.id !== accountGroup?.id,
                        )
                      : []
                  }
                  getOptionLabel={(option: any) => option.name}
                  getOptionValue={(option: any) => option.id}
                />
              )}
            </LiveView>
          </div>
        </div>
      </FormSection>

      <FormSection
        icon={<Settings size={20} />}
        title={t('label-status') || 'Statut'}
        description={
          t('label-statusDesc') || "Configuration de l'état du groupe"
        }
        color="#28c76f"
      >
        <ToggleOption
          icon={<CheckCircle size={16} />}
          title={t('label-active')}
          description={t('label-activeDesc') || 'Groupe activé'}
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
          label={t('label-description')}
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

export default AccountGroupForm
