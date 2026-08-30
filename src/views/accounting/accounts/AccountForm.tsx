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
  accountFilterOptions,
  accountOptions,
} from '@/utils/select/selectComponents'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { components } from 'react-select'
import { toast } from 'react-toastify'
import { Form } from 'reactstrap'
import {
  Wallet,
  Settings,
  FileText,
  CheckCircle,
  Hash,
  Tag,
  Type,
  GitBranch,
  AlignLeft,
} from 'lucide-react'
import type { AccountType } from './Account.type'
import { accountValidation } from './account.validation'
import {
  AccountCreatedDocument,
  ChartOfAccountCreatedDocument,
  NextAccountNumberDocument,
  useAccountsQuery,
  useChartOfAccountsQuery,
} from '@/gql/graphql'
import { TOAST_OPTIONS } from '@/utils/constants'
import FormSection from '@/@core/components/ui/forms/form-section'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'
import ToggleOption from '@/@core/components/ui/forms/toggle-option'

interface AccountFormProps extends BaseFormProps {
  account?: AccountType
  modal?: NiceModalHandler
}

const initialValues: Partial<AccountType> = {
  name: '',
  number: '',
  displayName: '',
  description: '',
  active: true,
  chartOfAccountId: null,
  parentId: null,
}

const AccountForm: React.FC<AccountFormProps> = ({
  action,
  account,
  modal,
  ...props
}) => {
  const { t } = useTranslation()
  const client = useApolloClient()
  const { enterpriseId } = useAuthentication()

  const { data, loading, subscribeToMore } = useAccountsQuery({
    variables: { id: enterpriseId },
  })

  const {
    data: dataChart,
    loading: loadingChart,
    subscribeToMore: subscribeToMoreChart,
  } = useChartOfAccountsQuery({
    variables: { id: enterpriseId },
  })

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { isDirty },
    reset,
    watch,
  } = useForm<AccountType>({
    defaultValues: {
      number: account?.number || '',
      name: account?.name || '',
      chartOfAccountId: account ? account.chartOfAccount : null,
      active: account ? account.active : true,
      parentId: account ? account.parent : null,
      displayName: account ? account.displayName : '',
      description: account ? account.description : '',
    },
    resolver: yupResolver(accountValidation),
  })

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    close?: boolean,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      const id = account ? Number(account.id) : undefined

      action({
        variables: {
          account: {
            ...values,
            id,
            chartOfAccountId: Number(values.chartOfAccountId.id),
            parentId: values.parentId ? Number(values.parentId.id) : null,
            enterpriseId: enterpriseId,
          },
        },
      })
        .then(async ({ data }) => {
          reset(initialValues)
          toast.success(
            t('message-accountSaved', {
              name: data.account.name,
            }),
            {
              ...TOAST_OPTIONS,
            },
          )

          if (props.popover) {
            messageService.sendMessage('account', data.account)
            props.onModalClose?.()
          }
          if (close) {
            modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(
            t('message-accountSaveError', {
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

  const onAccountChange = (value: any) => {
    setValue('chartOfAccountId', value)
    //setValue({number: value.number});
    newAccountNumber(value.number)
    setValue('name', value.name)
    setValue('displayName', value.name)
  }

  const newAccountNumber = async (number: string) => {
    const id = enterpriseId

    const { data } = await client.query({
      query: NextAccountNumberDocument,
      variables: { number, id },
    })

    if (data) {
      setValue('number', data.generateAccountNumber)
    }
  }

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
          <div className="md:col-span-2">
            <LiveView
              document={ChartOfAccountCreatedDocument}
              singleVar="chartOfAccount"
              data={dataChart}
              listVar="chartOfAccounts"
              subscribeToMore={subscribeToMoreChart}
              sortField="name"
              triggerUpdate={true}
              enterpriseId={enterpriseId}
            >
              {({ chartOfAccounts }) => (
                <ControlledSelect
                  name="chartOfAccountId"
                  control={control}
                  label={t('label-subAccount')}
                  required
                  loading={loadingChart}
                  prepend={<Wallet size={16} />}
                  onChange={onAccountChange}
                  options={chartOfAccounts || undefined}
                  getOptionLabel={(option: any) => option.name}
                  getOptionValue={(option: any) => option.id}
                  components={{ Option: accountOptions, SingleValue }}
                  filterOption={accountFilterOptions}
                />
              )}
            </LiveView>
          </div>

          <Input
            name="number"
            control={control}
            label={t('label-number')}
            required
            prepend={<Hash size={16} />}
            placeholder="e.g. 101"
          />

          <Input
            name="name"
            control={control}
            label={t('label-name')}
            required
            prepend={<Tag size={16} />}
            placeholder={t('placeholder-name')}
          />

          <div className="md:col-span-2">
            <Input
              name="displayName"
              control={control}
              label={t('label-displayNameAccount')}
              prepend={<Type size={16} />}
              placeholder={t('placeholder-displayName')}
            />
          </div>
        </div>
      </FormSection>

      <FormSection
        icon={<Settings size={20} />}
        title={t('label-accountSettings') || 'Paramètres du compte'}
        description={
          t('label-accountSettingsDesc') || 'Configuration et parenté'
        }
        color="#28c76f"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          <div className="md:col-span-2">
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
          </div>

          <div className="md:col-span-2">
            <LiveView
              document={AccountCreatedDocument}
              singleVar="account"
              data={data}
              listVar="accounts"
              subscribeToMore={subscribeToMore}
              sortField="name"
              triggerUpdate={true}
              enterpriseId={enterpriseId}
            >
              {({ accounts }) => (
                <ControlledSelect
                  name="parentId"
                  control={control}
                  label={t('label-parent')}
                  loading={loading}
                  prepend={<GitBranch size={16} />}
                  onChange={(val: any) => setValue('parentId', val)}
                  options={
                    accounts
                      ? accounts.filter((a: any) => a.id !== account?.id)
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
        icon={<FileText size={20} />}
        title={
          t('label-additionalInformation') || 'Informations supplémentaires'
        }
        description={t('label-additionalInfoDesc') || 'Notes et descriptions'}
        color="#ff9f43"
      >
        <Input
          name="description"
          control={control}
          label={t('label-description')}
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

export default AccountForm
