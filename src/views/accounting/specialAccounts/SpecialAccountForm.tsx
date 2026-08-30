import * as yup from 'yup'
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
import type { SpecialAccountType } from './SpecialAccount.type'
import { emptyStringToNull } from '@/utils/helpers'
import { AccountCreatedDocument, useAccountsQuery } from '@/gql/graphql'
import { TOAST_OPTIONS } from '@/utils/constants'
import {
  Star,
  Wallet,
  Tag,
  CheckCircle,
  FileText,
  AlignLeft,
  Settings,
} from 'lucide-react'
import FormSection from '@/@core/components/ui/forms/form-section'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'
import ToggleOption from '@/@core/components/ui/forms/toggle-option'

interface SpecialAccountFormProps extends BaseFormProps {
  account?: SpecialAccountType
  modal?: NiceModalHandler
}

const SpecialAccountForm: React.FC<SpecialAccountFormProps> = ({
  account,
  modal,
  action,
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
  } = useForm<SpecialAccountType>({
    defaultValues: {
      accountId: account ? account.account : null,
      selected: account ? account.selected : false,
      note: account ? account.note : '',
      specialAccountType: account?.specialAccountType || '',
    },
    resolver: yupResolver(
      yup.object({
        specialAccountType: yup
          .string()
          .required(t('Field required') || 'Champ requis'),
        accountId: yup
          .object()
          .required()
          .typeError(t('Field required') || 'Champ requis'),
        note: yup
          .string()
          .optional()
          .min(5)
          .max(255)
          .transform(emptyStringToNull),
      }),
    ) as any,
  })

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
            specialAccountType: values.specialAccountType,
            specialAccountPK: {
              enterpriseId: enterpriseId,
              accountId: Number(values.accountId.id),
            },
            selected: values.selected,
          },
        },
      })
        .then(async ({ data }) => {
          toast.success(
            t('message-specialAccountSaved', {
              name: data.specialAccount.account.name,
            }),
            { ...TOAST_OPTIONS },
          )

          if (props.popover) {
            messageService.sendMessage('specialAccount', data.specialAccount)
            props.onModalClose?.()
          }
          if (close) {
            modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(
            t('message-specialAccountSaveError', {
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
        icon={<Star size={20} />}
        title={
          t('label-specialAccountInformation') ||
          'Informations du compte spécial'
        }
        description={
          t('label-specialAccountInformationDesc') || 'Type et compte rattaché'
        }
        color="#7367f0"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          <div className="md:col-span-2">
            <Input
              name="specialAccountType"
              control={control}
              label={t('label-type')}
              type="select"
              required
              prepend={<Tag size={16} />}
            >
              <option value="">{t('label-select')}</option>
              <option value="CUSTOMER">{t('CUSTOMER')}</option>
              <option value="VENDOR">{t('VENDOR')}</option>
              <option value="PAYMENT">{t('PAYMENT')}</option>
              <option value="PURCHASE">{t('PURCHASE')}</option>
              <option value="SALE">{t('SALE')}</option>
              <option value="SERVICE_SALE">{t('SERVICE_SALE')}</option>
              <option value="SERVICE_PURCHASE">{t('SERVICE_PURCHASE')}</option>
              <option value="STOCK">{t('STOCK')}</option>
              <option value="STOCK_VARIATION">{t('STOCK_VARIATION')}</option>
              <option value="STOCK_PROVISION">{t('STOCK_PROVISION')}</option>
            </Input>
          </div>

          <div className="md:col-span-2">
            <LiveView
              document={AccountCreatedDocument}
              singleVar="account"
              data={data}
              loading={loading}
              listVar="accounts"
              subscribeToMore={subscribeToMore}
              sortField="name"
              triggerUpdate={true}
              enterpriseId={enterpriseId}
            >
              {({ accounts }) => (
                <ControlledSelect
                  name="accountId"
                  control={control}
                  label={t('label-account')}
                  required
                  loading={loading}
                  prepend={<Wallet size={16} />}
                  onChange={(val: any) =>
                    setValue('accountId', val, { shouldDirty: true })
                  }
                  options={accounts || undefined}
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
        title={t('label-settings') || 'Paramètres'}
        description={t('label-settingsDesc') || 'Options par défaut'}
        color="#28c76f"
      >
        <ToggleOption
          icon={<CheckCircle size={16} />}
          title={t('label-default')}
          description={
            t('label-defaultDesc') || 'Définir comme compte par défaut'
          }
          isActive={watch('selected')}
        >
          <Switch
            name="selected"
            control={control}
            label=""
            defaultChecked={getValues('selected')}
            onChange={(e: any) =>
              setValue('selected', e.target.checked, { shouldDirty: true })
            }
          />
        </ToggleOption>
      </FormSection>

      <FormSection
        icon={<FileText size={20} />}
        title={t('label-note') || 'Note'}
        description={t('label-noteDesc') || 'Commentaires supplémentaires'}
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

export default SpecialAccountForm
