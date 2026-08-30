import { useApolloClient } from '@apollo/client'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import ControlledSelect from '@/@core/components/ui/forms/controlled-select'
import Input from '@/@core/components/ui/forms/input'
import Switch from '@/@core/components/ui/forms/swith'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useAuthentication } from '@/hooks/useAuthentication'
import { formatError } from '@/utils/ErrorHelper'
import LiveView from '@/utils/LiveView'
import { messageService } from '@/utils/message.service'
import {
  accountCategoryOptions,
  accountFilterOptions,
  accountGroupOptions,
  accountOptions,
} from '@/utils/select/selectComponents'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { components } from 'react-select'
import { toast } from 'react-toastify'
import { Form } from 'reactstrap'
import AccountCategoryAdd from '../categories/AccountCategoryAdd'
import AccountGroupAdd from '../groups/AccountGroupAdd'
import type { ChartOfAccountType } from './ChartOfAccount.type'
import { chartOfAccountValidation } from './chartOfAccount.validation'
import {
  AccountCategoryCreatedDocument,
  AccountGroupCreatedDocument,
  ChartOfAccountCreatedDocument,
  ChartOfAccountNextIdDocument,
  useAccountCategoriesQuery,
  useAccountGroupsQuery,
  useChartOfAccountsQuery,
} from '@/gql/graphql'
import { TOAST_OPTIONS } from '@/utils/constants'
import {
  Wallet,
  Layers,
  Hash,
  Tag,
  CheckCircle,
  GitBranch,
  FileText,
  Settings,
  AlignLeft,
} from 'lucide-react'
import FormSection from '@/@core/components/ui/forms/form-section'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'
import ToggleOption from '@/@core/components/ui/forms/toggle-option'

interface ChartOfAccountFormProps extends BaseFormProps {
  account?: ChartOfAccountType
  modal?: NiceModalHandler
}

const ChartOfAccountForm: React.FC<ChartOfAccountFormProps> = ({
  account,
  modal,
  action,
  ...props
}) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()
  const client = useApolloClient()

  const { data, loading, subscribeToMore } = useAccountGroupsQuery({
    variables: { id: enterpriseId },
  })

  const {
    data: dataCategory,
    loading: loadingCategory,
    subscribeToMore: subscribeToMoreCategory,
  } = useAccountCategoriesQuery()

  const {
    data: dataAccount,
    loading: loadingAccount,
    subscribeToMore: subscribeToMoreAccount,
  } = useChartOfAccountsQuery({
    client: client,
    variables: { id: enterpriseId },
  })

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    reset,
    watch,
    formState: { isDirty },
  } = useForm<ChartOfAccountType>({
    defaultValues: {
      id: account?.id || '',
      name: account?.name || '',
      accountGroupId: account ? account.accountGroup : null,
      accountCategoryId: account ? account.accountCategory : null,
      parentId: account ? account.parent : null,
      active: account ? account.active : true,
      note: account ? account.note : '',
      number: account ? account.number : '',
    },
    resolver: yupResolver(chartOfAccountValidation),
  })

  const populateId = async () => {
    const number = getValues('id')

    if (number !== null && number !== '') {
      return false
    }

    const { data } = await client.query({
      query: ChartOfAccountNextIdDocument,
      fetchPolicy: 'network-only',
    })

    if (data) {
      setValue('id', data.id)
    }
    //return data ? data.number : null;
  }

  useEffect(() => {
    populateId()
  }, [])

  useEffect(() => {
    const subscription = messageService.getMessage().subscribe((message) => {
      if (message) {
        if (message.name === 'accountGroup') {
          setValue('accountGroupId', message.value, { shouldDirty: true })
        }

        if (message.name === 'accountCategory') {
          setValue('accountCategoryId', message.value, { shouldDirty: true })
        }
      }
    })
    return () => subscription.unsubscribe()
  }, [setValue])

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    close?: boolean,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      action({
        variables: {
          account: {
            ...values,
            accountGroupId: values.accountGroupId
              ? Number(values.accountGroupId.id)
              : null,
            accountCategoryId: values.accountCategoryId
              ? Number(values.accountCategoryId.id)
              : null,
            parentId: values.parentId ? Number(values.parentId.id) : null,
          },
        },
      })
        .then(async ({ data }) => {
          toast.success(
            t('message-chartOfAccountSaved', {
              name: data.chartOfAccount.name,
            }),
            {
              ...TOAST_OPTIONS,
            },
          )

          if (props.popover) {
            messageService.sendMessage('chartOfAccount', data.chartOfAccount)
            props.onModalClose?.()
          }
          if (close) {
            modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(
            t('message-chartOfAccountSaveError', {
              error: formatError(error),
            }),
          )
        })
    })(event)
  }

  const SingleValue = (props: any) => (
    <components.SingleValue {...props}>
      {props.data.number + ' ' + props.data.name}
    </components.SingleValue>
  )

  return (
    <Form onSubmit={onSubmit} className="space-y-1">
      <FormSection
        icon={<Wallet size={20} />}
        title={t('label-accountInformation') || 'Informations du compte'}
        description={
          t('label-accountInformationDesc') || 'Détails généraux du compte'
        }
        color="#7367f0"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          <Input
            name="id"
            control={control}
            label="ID"
            required
            prepend={<Hash size={16} />}
            placeholder="ID"
          />

          <Input
            name="number"
            control={control}
            label={t('label-number')}
            required
            prepend={<Hash size={16} />}
            placeholder="e.g. 101"
          />

          <div className="md:col-span-2">
            <Input
              name="name"
              control={control}
              label={t('label-name')}
              required
              prepend={<Tag size={16} />}
              placeholder={t('placeholder-name')}
            />
          </div>
        </div>
      </FormSection>

      <FormSection
        icon={<Layers size={20} />}
        title={t('label-classification') || 'Classification'}
        description={
          t('label-classificationDesc') || 'Groupe, catégorie et parenté'
        }
        color="#00cfe8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
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
                  name="accountGroupId"
                  control={control}
                  label={t('label-group')}
                  required
                  loading={loading}
                  prepend={<Wallet size={16} />}
                  onChange={(val) =>
                    setValue('accountGroupId', val, { shouldDirty: true })
                  }
                  options={accountGroups || undefined}
                  getOptionLabel={(option) => option.name}
                  components={{ Option: accountGroupOptions }}
                  form={<AccountGroupAdd />}
                  formId="accountGroup"
                  optionLabel="name"
                />
              )}
            </LiveView>
          </div>

          <div className="md:col-span-1">
            <LiveView
              document={AccountCategoryCreatedDocument}
              singleVar="accountCategory"
              data={dataCategory}
              listVar="accountCategories"
              subscribeToMore={subscribeToMoreCategory}
              sortField="name"
              triggerUpdate={true}
              enterpriseId={enterpriseId}
            >
              {({ accountCategories }) => (
                <ControlledSelect
                  name="accountCategoryId"
                  control={control}
                  label={t('label-category')}
                  loading={loadingCategory}
                  required
                  prepend={<Layers size={16} />}
                  onChange={(val) =>
                    setValue('accountCategoryId', val, { shouldDirty: true })
                  }
                  options={accountCategories || undefined}
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option.id}
                  components={{ Option: accountCategoryOptions }}
                  form={<AccountCategoryAdd />}
                  formId="accountCategory"
                  optionLabel="name"
                />
              )}
            </LiveView>
          </div>

          <div className="md:col-span-2">
            <LiveView
              document={ChartOfAccountCreatedDocument}
              singleVar="chartOfAccount"
              data={dataAccount}
              listVar="chartOfAccounts"
              subscribeToMore={subscribeToMoreAccount}
              sortField="name"
              triggerUpdate={true}
              enterpriseId={enterpriseId}
            >
              {({ chartOfAccounts }) => (
                <ControlledSelect
                  name="parentId"
                  control={control}
                  label={t('label-parent')}
                  loading={loadingAccount}
                  prepend={<GitBranch size={16} />}
                  onChange={(val: any) =>
                    setValue('parentId', val, { shouldDirty: true })
                  }
                  options={
                    chartOfAccounts
                      ? chartOfAccounts.filter((a: any) => a.id !== account?.id)
                      : []
                  }
                  getOptionLabel={(option: any) => option.name}
                  getOptionValue={(option: any) => option.id}
                  components={{ Option: accountOptions, SingleValue }}
                  filterOption={accountFilterOptions}
                />
              )}
            </LiveView>
          </div>
        </div>
      </FormSection>

      <FormSection
        icon={<Settings size={20} />}
        title={t('label-accountSettings') || 'Paramètres du compte'}
        description={
          t('label-accountSettingsDesc') || 'Configuration et statut'
        }
        color="#28c76f"
      >
        <ToggleOption
          icon={<CheckCircle size={16} />}
          title={t('label-active')}
          description={t('label-activeDesc') || 'Compte activé'}
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
        title={
          t('label-additionalInformation') || 'Informations supplémentaires'
        }
        description={t('label-additionalInfoDesc') || 'Notes et descriptions'}
        color="#ff9f43"
      >
        <Input
          name="note"
          control={control}
          label={''}
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

export default ChartOfAccountForm
