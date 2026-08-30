import type { BankAccountType } from './bank.account.type'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import {
  Building,
  Hash,
  CreditCard,
  DollarSign,
  Percent,
  Calendar,
  CheckCircle,
  FileText,
  TrendingUp,
  Settings,
} from 'lucide-react'
import Input from '@/@core/components/ui/forms/input'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import { toast } from 'react-toastify'
import { Form } from 'reactstrap'
import { useTranslation } from 'react-i18next'
import { useAuthentication } from '@/hooks/useAuthentication'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { bankAccountValidation } from './bank.account.validation'
import DatePicker from '@/@core/components/ui/forms/date-picker'
import {
  SpecialAccountCreatedDocument,
  useSpecialAccountsQuery,
} from '@/gql/graphql'
import { useEffect } from 'react'
import LiveView from '@/utils/LiveView'
import ControlledSelect from '@/@core/components/ui/forms/controlled-select'
import { INPUT_DATE_FORMAT, TOAST_OPTIONS } from '@/utils/constants'
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import dayjs from 'dayjs'
import FormSection from '@/@core/components/ui/forms/form-section'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'
import NumericInput from '@/@core/components/ui/forms/numeric-input'

interface BankAccountFormProps extends BaseFormProps {
  bankAccount?: BankAccountType
  modal?: NiceModalHandler
}

const BankAccountForm = ({
  bankAccount,
  modal,
  action,
  ...props
}: BankAccountFormProps) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const {
    control,
    handleSubmit,
    formState: { isDirty },
    // reset,
    setValue,
  } = useForm<any>({
    defaultValues: {
      name: bankAccount?.name || '',
      type: bankAccount ? bankAccount.type : 'SAVINGS',
      status: bankAccount ? bankAccount.status : 'ACTIVE',
      interestRate: bankAccount ? bankAccount.interestRate : '',
      overdraftLimit: bankAccount ? bankAccount.overdraftLimit : '',
      overdraftLimitF: bankAccount ? bankAccount.overdraftLimit : '',
      accountId: bankAccount ? bankAccount.account : undefined,
      number: bankAccount ? bankAccount.number : '',
      openingBalance: bankAccount ? bankAccount.openingBalance : '',
      openingBalanceF: bankAccount ? bankAccount.openingBalance : '',
      openedDate: bankAccount
        ? bankAccount.openedDate
          ? dayjs(bankAccount.openedDate).toDate()
          : null
        : null,
      closedDate: bankAccount
        ? bankAccount.closedDate
          ? dayjs(bankAccount.closedDate).toDate()
          : null
        : null,
    },
    resolver: yupResolver(bankAccountValidation),
  })

  const {
    data: dataAccount,
    loading: loadingAccount,
    subscribeToMore: subscribeToMoreAccount,
  } = useSpecialAccountsQuery({
    variables: { id: enterpriseId },
  })

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    close?: boolean,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      const id = bankAccount ? Number(bankAccount.id) : undefined

      action({
        variables: {
          account: {
            ...values,
            id,
            enterpriseId,
            openedDate: dayjs(values.openedDate).isValid()
              ? dayjs(values.openedDate).format(INPUT_DATE_FORMAT)
              : null,
            closedDate: dayjs(values.closedDate).isValid()
              ? dayjs(values.closedDate).format(INPUT_DATE_FORMAT)
              : null,
            accountId: values.accountId ? Number(values.accountId.id) : null,
            openingBalance: values.openingBalance
              ? Number(values.openingBalance)
              : null,
            overdraftLimit: values.overdraftLimit
              ? Number(values.overdraftLimit)
              : null,
            interestRate: values.interestRate
              ? Number(values.interestRate)
              : null,
          },
        },
      })
        .then(async ({ data }) => {
          //reset(initialValues);
          toast.success(`Compte bancaire ${data.bankAccount.name} enregistré`, {
            ...TOAST_OPTIONS,
          })

          if (props.popover) {
            messageService.sendMessage('bankAccount', data.bankAccount)
            props.onModalClose?.()
          }
          if (close) {
            modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(
            `Impossible d'ajouter le compte bancaire: ${formatError(error)}`,
          )
        })
    })(event)
  }

  useEffect(() => {
    if (!bankAccount && dataAccount) {
      setValue(
        'accountId',
        dataAccount?.specialAccounts
          ? dataAccount?.specialAccounts.filter(
              ({ specialAccountType, selected }: any) =>
                specialAccountType === 'PAYMENT' && selected,
            )[0]
          : null,
      )
    }
  }, [loadingAccount])

  return (
    <Form onSubmit={onSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-1 gap-y-1">
        {/* Account Information */}
        <FormSection
          title={t('label-bankAccountInfo') || 'Informations du compte'}
          description={
            t('label-bankAccountInfoDesc') ||
            'Détails de base du compte bancaire'
          }
          icon={<Settings size={18} />}
          color="#7367f0"
        >
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
              <Input
                name="number"
                label={t('label-accountNumber')}
                control={control}
                required={true}
                prepend={<Hash size={16} />}
              />

              <Input
                name="name"
                label={t('label-bankName')}
                control={control}
                required={true}
                prepend={<Building size={16} />}
              />
            </div>

            <LiveView
              document={SpecialAccountCreatedDocument}
              subscribeToMore={subscribeToMoreAccount}
              data={dataAccount}
              listVar="specialAccounts"
              singleVar="specialAccount"
              loading={loadingAccount}
              enterpriseId={enterpriseId}
            >
              {({ specialAccounts }) => (
                <ControlledSelect
                  control={control}
                  name="accountId"
                  label={t('label-internalAccount')}
                  required
                  prepend={<CreditCard size={16} />}
                  options={
                    specialAccounts
                      ? specialAccounts.filter(
                          ({ specialAccountType }: any) =>
                            specialAccountType === 'PAYMENT',
                        )
                      : []
                  }
                  onChange={(val) => setValue('accountId', val)}
                  getOptionLabel={(o) => o.name}
                  getOptionValue={(o) => o.id}
                  className="w-full"
                />
              )}
            </LiveView>

            <Input
              name="type"
              label={t('label-type')}
              control={control}
              type="select"
              prepend={<FileText size={16} />}
            >
              <option value="SAVINGS">{t('SAVINGS')}</option>
              <option value="CURRENT">{t('CURRENT')}</option>
            </Input>
          </div>
        </FormSection>

        {/* Financial Details */}
        <FormSection
          title={t('label-financialInfo') || 'Informations financières'}
          description={
            t('label-financialInfoDesc') || 'Paramètres financiers du compte'
          }
          icon={<DollarSign size={18} />}
          color="#ea5455"
        >
          <div className="space-y-3">
            {!bankAccount && (
              <NumericInput
                name="openingBalance"
                nameF="openingBalanceF"
                label={t('label-openingBalance')}
                control={control}
                setValue={setValue}
                prepend={<DollarSign size={16} />}
              />
            )}

            <NumericInput
              name="overdraftLimit"
              nameF="overdraftLimitF"
              label={t('label-overdraftLimit')}
              control={control}
              setValue={setValue}
              prepend={<TrendingUp size={16} />}
            />

            <Input
              name="interestRate"
              label={t('label-interestRate')}
              control={control}
              prepend={<Percent size={16} />}
              placeholder="0.00"
            />
          </div>
        </FormSection>

        {/* Status and Dates */}
        <FormSection
          title={t('label-bankAccountDates') || 'Statut et dates'}
          description={
            t('label-bankAccountDatesDesc') || 'État du compte et calendrier'
          }
          icon={<Calendar size={18} />}
          color="#28c76f"
          className="col-span-full"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
            <Input
              name="status"
              label={t('label-status')}
              control={control}
              type="select"
              prepend={<CheckCircle size={16} />}
            >
              <option value="ACTIVE">{t('label-active')}</option>
              <option value="INACTIVE">{t('label-inactive')}</option>
              <option value="FROZEN">{t('label-frozen')}</option>
              <option value="CLOSED">{t('label-closed')}</option>
            </Input>

            <DatePicker
              name="openedDate"
              label={t('label-openedDate')}
              control={control}
              required={false}
            />

            <DatePicker
              name="closedDate"
              label={t('label-closedDate')}
              control={control}
              required={false}
            />
          </div>
        </FormSection>
      </div>

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

export default BankAccountForm
