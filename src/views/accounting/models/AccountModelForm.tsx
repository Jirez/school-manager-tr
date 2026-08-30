import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { toast } from 'react-toastify'
import type { AccountModelType } from '@/views/accounting/models/AccountModel.type'
import { useAuthentication } from '@/hooks/useAuthentication'
import { useForm } from 'react-hook-form'
import Input from '@/@core/components/ui/forms/input'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import Switch from '@/@core/components/ui/forms/swith'
import ControlledSelect from '@/@core/components/ui/forms/controlled-select'
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import { yupResolver } from '@hookform/resolvers/yup'
import { accountModelValidationSchema } from '@/views/accounting/models/model.validation'
import { TOAST_OPTIONS } from '@/utils/constants'
import FormSection from '@/@core/components/ui/forms/form-section'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'
import ToggleOption from '@/@core/components/ui/forms/toggle-option'
import {
  Globe,
  Tag,
  Hash,
  Languages,
  CheckCircle,
  FileText,
  Star,
} from 'lucide-react'

interface AccountModelFormProps extends BaseFormProps {
  accountModel?: AccountModelType
  modal?: NiceModalHandler
}

const initialValues: Partial<AccountModelType> = {
  country: '',
  code: '',
  name: '',
  languageType: undefined,
  note: '',
  active: true,
  current: false,
}

const AccountModelForm: FC<AccountModelFormProps> = ({
  accountModel,
  action,
  modal,
  ...props
}) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const options = [
    { label: t('label-french'), value: 'FR' },
    { label: t('label-english'), value: 'EN' },
  ]

  const {
    control,
    handleSubmit,
    formState: { isDirty },
    getValues,
    reset,
    setValue,
    watch,
  } = useForm<AccountModelType>({
    defaultValues: {
      code: accountModel?.code || '',
      name: accountModel?.name || '',
      languageType: accountModel
        ? options.filter(({ value }) => value === accountModel.languageType)[0]
        : undefined,
      active: accountModel ? accountModel.active : true,
      current: accountModel ? accountModel.current : false,
      note: accountModel?.note || '',
      country: accountModel?.country || '',
    },
    resolver: yupResolver(accountModelValidationSchema),
  })

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    close?: boolean,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      const id = accountModel ? Number(accountModel.id) : undefined

      action({
        variables: {
          model: {
            ...values,
            id,
            languageType: values.languageType.value,
          },
          id: enterpriseId,
        },
      })
        .then(async ({ data }) => {
          reset(initialValues)
          toast.success(
            t('message-accountModelSaved', { name: data.accountModel.name }),
            {
              ...TOAST_OPTIONS,
            },
          )

          if (props.popover) {
            messageService.sendMessage('accountModel', data.accountModel)
            props.onModalClose?.()
          }
          if (close) {
            modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(
            t('message-accountModelSaveError', { error: formatError(error) }),
          )
        })
    })(event)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-1">
      <FormSection
        icon={<Globe size={20} />}
        title={t('label-accountModelInfo') || 'Modèle de compte'}
        description={
          t('label-accountModelInfoDesc') || 'Paramètres généraux du modèle'
        }
        color="#7367f0"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          <div className="md:col-span-2">
            <ToggleOption
              icon={<CheckCircle size={16} />}
              title={t('label-active')}
              description={t('label-activeDesc') || 'Modèle de compte activé'}
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
            <ToggleOption
              icon={<Star size={16} />}
              title={t('label-default')}
              description={
                t('label-defaultDesc') || 'Définir comme modèle par défaut'
              }
              isActive={watch('current')}
            >
              <Switch
                name="current"
                control={control}
                label=""
                defaultChecked={getValues('current')}
                onChange={(e: any) =>
                  setValue('current', e.target.checked, { shouldDirty: true })
                }
              />
            </ToggleOption>
          </div>

          <Input
            name="code"
            label={t('label-code')}
            control={control}
            required={true}
            prepend={<Hash size={16} />}
            placeholder="e.g. MODELE_001"
          />

          <Input
            name="name"
            label={t('label-name')}
            control={control}
            required={true}
            prepend={<Tag size={16} />}
            placeholder={t('placeholder-name')}
          />

          <div className="md:col-span-2">
            <ControlledSelect
              name="languageType"
              control={control}
              label={t('label-language')}
              prepend={<Languages size={16} />}
              onChange={(value) => setValue('languageType', value)}
              options={options}
              required
            />
          </div>

          <div className="md:col-span-2">
            <Input
              name="country"
              label={t('label-country')}
              control={control}
              prepend={<Globe size={16} />}
              placeholder={t('placeholder-country')}
            />
          </div>

          <div className="md:col-span-2">
            <Input
              name="note"
              label={t('label-note')}
              control={control}
              type="textarea"
              rows={3}
              prepend={<FileText size={16} />}
              placeholder={t('placeholder-description')}
            />
          </div>
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
    </form>
  )
}

export default AccountModelForm
