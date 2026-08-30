import type { BankTransactionType } from './bank.transaction.type'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import {
  Hash,
  CreditCard,
  DollarSign,
  FileText,
  CheckCircle,
  Building,
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
import DatePicker from '@/@core/components/ui/forms/date-picker'
import {
  BankAccountCreatedDocument,
  SpecialAccountCreatedDocument,
  useBankAccountsQuery,
  useSpecialAccountsQuery,
} from '@/gql/graphql'
import { useEffect } from 'react'
import LiveView from '@/utils/LiveView'
import ControlledSelect from '@/@core/components/ui/forms/controlled-select'
import { INPUT_DATE_FORMAT, TOAST_OPTIONS } from '@/utils/constants'
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import dayjs from 'dayjs'
import { bankTransactionValidation } from './bank.transaction.validation'
import FormSection from '@/@core/components/ui/forms/form-section'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'
import NumericInput from '@/@core/components/ui/forms/numeric-input'

interface BankTransactionFormProps extends BaseFormProps {
  bankTransaction?: BankTransactionType
  modal?: NiceModalHandler
}

const BankTransactionForm = ({
  bankTransaction,
  modal,
  action,
  ...props
}: BankTransactionFormProps) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const {
    control,
    handleSubmit,
    formState: { isDirty },
    reset,
    setValue,
    watch,
    register,
  } = useForm<BankTransactionType>({
    defaultValues: {
      type: bankTransaction ? bankTransaction.type : 'DEPOSIT',
      status: bankTransaction ? bankTransaction.status : 'PENDING',
      accountId: bankTransaction ? bankTransaction.account : undefined,
      referenceNumber: bankTransaction ? bankTransaction.referenceNumber : '',
      transactionDate: bankTransaction
        ? bankTransaction.transactionDate
          ? dayjs(bankTransaction.transactionDate).toDate()
          : null
        : null,
      amount: bankTransaction ? bankTransaction.amount : '',
      amountF: bankTransaction ? bankTransaction.amount : '',
      description: bankTransaction ? bankTransaction.description : '',
      bankAccountId: bankTransaction ? bankTransaction.bankAccount : undefined,
    },
    resolver: yupResolver(bankTransactionValidation),
  })

  const {
    data: dataAccount,
    loading: loadingAccount,
    subscribeToMore: subscribeToMoreAccount,
  } = useSpecialAccountsQuery({
    variables: { id: enterpriseId },
  })

  const {
    data: dataBankAccount,
    loading: loadingBankAccount,
    subscribeToMore: subscribeToMoreBankAccount,
  } = useBankAccountsQuery({
    variables: { id: enterpriseId },
  })

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    close?: boolean,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      const id = bankTransaction ? Number(bankTransaction.id) : undefined

      action({
        variables: {
          transaction: {
            ...values,
            id,
            enterpriseId,
            transactionDate: dayjs(values.transactionDate).isValid()
              ? dayjs(values.transactionDate).format(INPUT_DATE_FORMAT)
              : null,
            bankAccountId: values.bankAccountId
              ? Number(values.bankAccountId.id)
              : null,
            accountId: values.accountId ? Number(values.accountId.id) : null,
            description: values.description || null,
            referenceNumber: values.referenceNumber || null,
            amount: values.amount ? Number(values.amount) : null,
          },
        },
      })
        .then(async ({ data }) => {
          //reset(initialValues);
          toast.success(
            `Transaction ${data.bankTransaction.referenceNumber} enregistrée`,
            {
              ...TOAST_OPTIONS,
            },
          )

          if (props.popover) {
            messageService.sendMessage('bankTransaction', data.transaction)
            props.onModalClose?.()
          }
          if (close) {
            modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(
            `Impossible d'enregistrer la transaction: ${formatError(error)}`,
          )
        })
    })(event)
  }

  useEffect(() => {
    if (!bankTransaction && dataAccount) {
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
        {/* Transaction Information */}
        <FormSection
          title={t('label-bankTransactionInfo') || 'Détails de la transaction'}
          description={
            t('label-bankTransactionInfoDesc') || 'Date, référence et statut'
          }
          icon={<Settings size={18} />}
          color="#7367f0"
        >
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
              <DatePicker
                name="transactionDate"
                label={t('label-operationDate')}
                control={control}
                required={true}
              />

              <Input
                name="referenceNumber"
                label={t('label-transactionNumber')}
                control={control}
                prepend={<Hash size={16} />}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
              <Input
                name="type"
                label={t('label-type')}
                control={control}
                type="select"
                required
                prepend={<FileText size={16} />}
              >
                <option value="DEPOSIT">{t('DEPOSIT')}</option>
                <option value="WITHDRAWAL">{t('WITHDRAWAL')}</option>
              </Input>

              <Input
                name="status"
                label={t('label-status')}
                control={control}
                type="select"
                required
                prepend={<CheckCircle size={16} />}
              >
                <option value="PENDING">{t('PENDING')}</option>
                <option value="COMPLETED">{t('COMPLETED')}</option>
                <option value="FAILED">{t('FAILED')}</option>
                <option value="CANCELLED">{t('CANCELLED')}</option>
              </Input>
            </div>
          </div>
        </FormSection>

        {/* Accounts Information */}
        <FormSection
          title={t('label-transactionAccounts') || 'Comptes'}
          description={
            t('label-transactionAccountsDesc') || 'Banque et compte interne'
          }
          icon={<CreditCard size={18} />}
          color="#28c76f"
        >
          <div className="space-y-3">
            <LiveView
              document={BankAccountCreatedDocument}
              subscribeToMore={subscribeToMoreBankAccount}
              data={dataBankAccount}
              listVar="bankAccounts"
              singleVar="bankAccount"
              loading={loadingBankAccount}
              enterpriseId={enterpriseId}
            >
              {({ bankAccounts }) => (
                <ControlledSelect
                  control={control}
                  name="bankAccountId"
                  label={t('label-bankAccount')}
                  required
                  prepend={<Building size={16} />}
                  options={
                    bankAccounts
                      ? bankAccounts.filter(
                          ({ status }: any) => status === 'ACTIVE',
                        )
                      : []
                  }
                  onChange={(val) => setValue('bankAccountId', val)}
                  getOptionLabel={(o) => o.name}
                  getOptionValue={(o) => o.id}
                  className="w-full"
                />
              )}
            </LiveView>

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
          </div>
        </FormSection>

        {/* Amount & Description */}
        <FormSection
          title={t('label-amountAndNote') || 'Montant et note'}
          description={t('label-amountAndNoteDesc') || "Valeur de l'opération"}
          icon={<DollarSign size={18} />}
          color="#ea5455"
          className="col-span-full"
        >
          <div className="space-y-3">
            <NumericInput
              name="amount"
              nameF="amountF"
              label={t('label-amount')}
              control={control}
              setValue={setValue}
              prepend={<DollarSign size={16} />}
            />

            <Input
              name="description"
              label={t('label-description')}
              control={control}
              type="textarea"
              rows={3}
              prepend={<FileText size={16} />}
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

export default BankTransactionForm
