import { useTranslation } from 'react-i18next'
import { Form } from 'reactstrap'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useEffect } from 'react'
import type { FC } from 'react'
import { useAuthentication } from '@/hooks/useAuthentication'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { toast } from 'react-toastify'
import { TOAST_OPTIONS } from '@/utils/constants'
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import ControlledSelect from '@/@core/components/ui/forms/controlled-select'
import LiveView from '@/utils/LiveView'
import Input from '@/@core/components/ui/forms/input'
import Switch from '@/@core/components/ui/forms/swith'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import {
  accountOptions,
  accountSingleValue,
} from '@/utils/select/selectComponents'
import { AccountCreatedDocument, useAccountsQuery } from '@/gql/graphql'
import type { ExpenseCategoryType } from './expense.category.type'
import { expenseCategoryValidation } from './expense.category.validation'
import {
  Tag,
  Type,
  DollarSign,
  Wallet,
  CheckCircle,
  AlignLeft,
  Settings,
  FileText,
} from 'lucide-react'
import FormSection from '@/@core/components/ui/forms/form-section'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'
import ToggleOption from '@/@core/components/ui/forms/toggle-option'
import NumericInput from '@/@core/components/ui/forms/numeric-input'

interface FormProps extends BaseFormProps {
  expenseCategory?: ExpenseCategoryType
  modal?: NiceModalHandler
}

const ExpenseCategoryForm: FC<FormProps> = ({
  expenseCategory,
  action,
  modal,
  ...props
}) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const { data, loading, subscribeToMore } = useAccountsQuery({
    variables: { id: enterpriseId },
  })

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    watch,
    formState: { isDirty },
    // reset,
  } = useForm<ExpenseCategoryType & { maxAllowedAmountF: string | number }>({
    defaultValues: {
      name: expenseCategory?.name || '',
      description: expenseCategory?.description || '',
      active: expenseCategory ? expenseCategory.active : true,
      accountId: expenseCategory ? expenseCategory.account : null,
      maxAllowedAmount: expenseCategory ? expenseCategory.maxAllowedAmount : '',
      maxAllowedAmountF: expenseCategory
        ? expenseCategory.maxAllowedAmount
        : '',
    },
    // @ts-ignore
    resolver: yupResolver(expenseCategoryValidation),
  })

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    close?: boolean,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      const id = expenseCategory ? Number(expenseCategory.id) : undefined
      const { maxAllowedAmountF, ...rest } = values

      action({
        variables: {
          category: {
            ...rest,
            id,
            accountId: !values.accountId ? null : Number(values.accountId.id),
            enterpriseId,
            maxAllowedAmount: values.maxAllowedAmount
              ? Number(values.maxAllowedAmount)
              : null,
            description: values.description || null,
          },
        },
      })
        .then(async ({ data }) => {
          toast.success(
            t('message-expenseCategorySaved', {
              name: data.expenseCategory.name,
            }),
            {
              ...TOAST_OPTIONS,
            },
          )

          if (props.popover) {
            messageService.sendMessage('expenseCategory', data.expenseCategory)
            props.onModalClose?.()
          }
          if (close) {
            modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(
            t('message-expenseCategorySaveError', {
              error: formatError(error),
            }),
          )
        })
    })(event)
  }

  useEffect(() => {
    const subscription = messageService.getMessage().subscribe((message) => {
      if (message) {
        if (message.name === 'account') {
          setValue('accountId', message.value, { shouldDirty: true })
        }
      }
    })
    return () => subscription.unsubscribe()
  }, [setValue])

  return (
    <Form onSubmit={onSubmit} className="space-y-1">
      <FormSection
        icon={<Tag size={20} />}
        title={
          t('label-expenseCategoryInformation') ||
          'Informations de la catégorie'
        }
        description={
          t('label-expenseCategoryInformationDesc') ||
          'Détails généraux et limites'
        }
        color="#7367f0"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          <div className="md:col-span-2">
            <LiveView
              document={AccountCreatedDocument}
              subscribeToMore={subscribeToMore}
              data={data}
              listVar="accounts"
              singleVar="account"
              loading={loading}
              enterpriseId={enterpriseId}
            >
              {({ accounts }) => (
                <ControlledSelect
                  control={control}
                  name="accountId"
                  label={t('label-account')}
                  prepend={<Wallet size={16} />}
                  options={
                    accounts
                      ? accounts.filter((i: any) => {
                          return (
                            i.chartOfAccount?.accountCategory?.accountType ===
                            'EXPENSES'
                          )
                        })
                      : []
                  }
                  onChange={(val) =>
                    setValue('accountId', val, { shouldDirty: true })
                  }
                  getOptionLabel={(o) => o.name}
                  getOptionValue={(o) => o.id}
                  components={{
                    Option: accountOptions,
                    SingleValue: accountSingleValue,
                  }}
                  formId="account"
                  optionLabel="name"
                  formTitle={t('action.add_account')}
                  required
                />
              )}
            </LiveView>
          </div>

          <Input
            name="name"
            control={control}
            label={t('label-name')}
            required
            prepend={<Type size={16} />}
            placeholder={t('placeholder-name')}
          />

          <NumericInput
            name="maxAllowedAmount"
            nameF="maxAllowedAmountF"
            control={control}
            label={t('label-maxAllowedAmount')}
            setValue={setValue}
            prepend={<DollarSign size={16} />}
            placeholder="0.00"
          />
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
          description={t('label-activeDesc') || 'Catégorie activée'}
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

export default ExpenseCategoryForm
