import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import type { AccountCategoryType } from '@/views/accounting/categories/AccountCategory.type'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useForm } from 'react-hook-form'
import { Form } from 'reactstrap'
import Input from '@/@core/components/ui/forms/input'
import ControlledSelect from '@/@core/components/ui/forms/controlled-select'
import Switch from '@/@core/components/ui/forms/swith'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import { yupResolver } from '@hookform/resolvers/yup'
import { accountCategoryValidationSchema } from '@/views/accounting/categories/accountCategory.validation'
import { TOAST_OPTIONS } from '@/utils/constants'
import {
  Tag,
  Type,
  CheckCircle,
  AlignLeft,
  Settings,
  FileText,
} from 'lucide-react'
import FormSection from '@/@core/components/ui/forms/form-section'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'
import ToggleOption from '@/@core/components/ui/forms/toggle-option'

interface AccountCategoryFormProps extends BaseFormProps {
  category?: AccountCategoryType
  modal?: NiceModalHandler
}

const initialValues: Partial<AccountCategoryType> = {
  accountType: '',
  name: '',
  active: true,
  description: '',
}

const AccountCategoryForm: FC<AccountCategoryFormProps> = ({
  category,
  action,
  modal,
  ...props
}) => {
  const { t } = useTranslation()

  const options = [
    { label: t('TREASURY'), value: 'TREASURY' },
    { label: t('ACCOUNTS_RECEIVABLE'), value: 'ACCOUNTS_RECEIVABLE' },
    { label: t('SHORT_TERM_ASSETS'), value: 'SHORT_TERM_ASSETS' },
    { label: t('FIXED_ASSETS'), value: 'FIXED_ASSETS' },
    { label: t('LONG_TERM_ASSETS'), value: 'LONG_TERM_ASSETS' },
    { label: t('ACCOUNTS_PAYABLE'), value: 'ACCOUNTS_PAYABLE' },
    { label: t('CREDIT_CARD'), value: 'CREDIT_CARD' },
    {
      label: t('SHORT_TERM_LIABILITIES'),
      value: 'SHORT_TERM_LIABILITIES',
    },
    { label: t('LONG_TERM_LIABILITIES'), value: 'LONG_TERM_LIABILITIES' },
    { label: t('EQUITY_CAPITAL'), value: 'EQUITY_CAPITAL' },
    { label: t('INCOMES'), value: 'INCOMES' },
    { label: t('COST_OF_GOODS_SOLD'), value: 'COST_OF_GOODS_SOLD' },
    { label: t('EXPENSES'), value: 'EXPENSES' },
    { label: t('OTHER_INCOMES'), value: 'OTHER_INCOMES' },
    { label: t('OTHER_EXPENSES'), value: 'OTHER_EXPENSES' },
  ]

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { isDirty },
    reset,
    watch,
  } = useForm<AccountCategoryType>({
    defaultValues: {
      name: category?.name || '',
      description: category?.description || '',
      active: category ? category.active : true,
      accountType: category
        ? options.filter(({ value }) => value === category.accountType)[0]
        : undefined,
    },
    resolver: yupResolver(accountCategoryValidationSchema),
  })

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    close?: boolean,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      const id = category ? Number(category.id) : undefined

      action({
        variables: {
          category: {
            ...values,
            id,
            accountType: values.accountType.value,
          },
        },
      })
        .then(async ({ data }) => {
          reset(initialValues)
          toast.success(
            t('message-accountCategorySaved', {
              name: data.accountCategory.name,
            }),
            {
              ...TOAST_OPTIONS,
            },
          )

          if (props.popover) {
            messageService.sendMessage('accountCategory', data.accountCategory)
            props.onModalClose?.()
          }
          if (close) {
            modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(
            t('message-accountCategorySaveError', {
              error: formatError(error),
            }),
          )
        })
    })(event)
  }

  return (
    <Form onSubmit={onSubmit} className="space-y-1">
      <FormSection
        icon={<Tag size={20} />}
        title={t('label-categoryInformation') || 'Informations de la catégorie'}
        description={
          t('label-categoryInformationDesc') ||
          'Détails généraux de la catégorie'
        }
        color="#7367f0"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          <div className="md:col-span-2">
            <ControlledSelect
              name="accountType"
              control={control}
              label={t('label-accountType')}
              prepend={<Tag size={16} />}
              onChange={(value) => setValue('accountType', value)}
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
        </div>
      </FormSection>

      <FormSection
        icon={<Settings size={20} />}
        title={t('label-status') || 'Statut'}
        description={
          t('label-statusDesc') || "Configuration de l'état de la catégorie"
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

export default AccountCategoryForm
