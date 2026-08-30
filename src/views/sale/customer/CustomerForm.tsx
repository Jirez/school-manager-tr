import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Form } from 'reactstrap'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import type { FC } from 'react'
import { useEffect } from 'react'
import {
  User,
  Tag,
  Shield,
  FileText,
  Globe,
  Settings,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  StickyNote,
  Briefcase,
  AlignLeft,
  Hash,
  Clock,
} from 'lucide-react'
import Input from '@/@core/components/ui/forms/input'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import Switch from '@/@core/components/ui/forms/swith'
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import { useAuthentication } from '@/hooks/useAuthentication'
import { yupResolver } from '@hookform/resolvers/yup'
import { INPUT_DATE_FORMAT, TOAST_OPTIONS } from '@/utils/constants'
import {
  PaymentConditionCreatedDocument,
  SpecialAccountCreatedDocument,
  CustomerCategoryCreatedDocument,
  useSpecialAccountsQuery,
  useCustomerCategoriesQuery,
  usePaymentConditionsQuery,
  usePaymentModesQuery,
  PaymentModeCreatedDocument,
} from '@/gql/graphql'
import LiveView from '@/utils/LiveView'
import ControlledSelect from '@/@core/components/ui/forms/controlled-select'
import DatePicker from '@/@core/components/ui/forms/date-picker'
import PhoneInput from '@/@core/components/ui/forms/phone-input'
import PaymentConditionAdd from '../condition/PaymentConditionAdd'
import dayjs from 'dayjs'
import type { CustomerType } from './customer.type'
import { customerValidation } from './customer.validation'
import CustomerCategoryAdd from './category/CustomerCategoryAdd'
import PaymentModeAdd from '@/views/payment/modes/PaymentModeAdd'
import FormSection from '@/@core/components/ui/forms/form-section'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'
import ToggleOption from '@/@core/components/ui/forms/toggle-option'

interface CustomerFormProps extends BaseFormProps {
  customer?: CustomerType
  modal?: NiceModalHandler
}

const initialValues: Partial<CustomerType> = {
  displayName: '',
  active: true,
  note: '',
  categoryId: null,
}

const CustomerForm: FC<CustomerFormProps> = ({
  customer,
  action,
  modal,
  ...props
}) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const {
    data: dataAccount,
    loading: loadingAccount,
    subscribeToMore: subscribeToMoreAccount,
  } = useSpecialAccountsQuery({
    variables: { id: enterpriseId },
  })

  const {
    control,
    handleSubmit,
    formState: { isDirty },
    reset,
    getValues,
    setValue,
    watch,
  } = useForm<CustomerType>({
    defaultValues: {
      displayName: customer?.displayName || '',
      lastName: customer?.lastName || '',
      firstName: customer?.firstName || '',
      active: customer ? customer.active : true,
      note: customer?.note || '',
      categoryId: customer ? customer.category : null,
      //openingBalance: supplier ? supplier.openingBalance : "",
      taxNumber: customer?.taxNumber || '',
      webSite: customer?.webSite || '',
      //note: supplier?.note || "",
      birthDate: customer
        ? customer.birthDate
          ? dayjs(customer.birthDate).toDate()
          : null
        : null,
      address: {
        zipCode: customer?.address?.zipCode || '',
        country: customer?.address?.country || '',
        town: customer?.address?.town || '',
        state: customer?.address?.state || '',
        street: customer?.address?.street || '',
      },
      contactInfo: {
        fax: customer?.contactInfo?.fax || '',
        email: customer?.contactInfo?.email || '',
        mobile: customer?.contactInfo?.mobile || '',
        telephone: customer?.contactInfo?.telephone || '',
        postOfficeBox: customer?.contactInfo?.postOfficeBox || '',
        //skype: supplier?.contactInfo?.skype || '',
      },
      paymentConditionId: customer ? customer.paymentCondition : null,
      paymentModeId: customer ? customer.paymentMode : null,
      tradeRegister: customer?.tradeRegister || '',
      customerAccountId: customer
        ? customer.customerAccount
        : dataAccount?.specialAccounts
          ? dataAccount?.specialAccounts.filter(
              ({ specialAccountType, selected }: any) =>
                specialAccountType === 'CUSTOMER' && selected,
            )[0]
          : null,
    },
    resolver: yupResolver(customerValidation),
  })

  const { data, loading, subscribeToMore } = useCustomerCategoriesQuery({
    variables: { id: enterpriseId },
  })

  const {
    data: dataCondition,
    loading: loadingCondition,
    subscribeToMore: subscribeToMoreCondition,
  } = usePaymentConditionsQuery({
    variables: { id: enterpriseId },
  })

  const {
    data: dataMode,
    loading: loadingMode,
    subscribeToMore: subscribeToMoreMode,
  } = usePaymentModesQuery({
    variables: { id: enterpriseId },
  })

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    close?: boolean,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      const id = customer ? Number(customer.id) : undefined

      action({
        variables: {
          customer: {
            ...values,
            id,
            enterpriseId,
            displayName: `${values.lastName} ${values.firstName || ''}`.trim(),
            categoryId: !values.categoryId
              ? null
              : Number(values.categoryId.id),
            customerAccountId: values.customerAccountId
              ? Number(values.customerAccountId.id)
              : null,
            paymentConditionId: values.paymentConditionId
              ? Number(values.paymentConditionId.id)
              : null,
            paymentModeId: values.paymentModeId
              ? Number(values.paymentModeId.id)
              : null,
            birthDate: dayjs(values.birthDate).isValid()
              ? dayjs(values.birthDate).format(INPUT_DATE_FORMAT)
              : null,
            firstName: values.firstName || null,
          },
        },
      })
        .then(async ({ data }) => {
          reset(initialValues)
          toast.success(`Client ${data.customer.displayName} enregistré`, {
            ...TOAST_OPTIONS,
          })

          if (props.popover) {
            messageService.sendMessage('customer', data.customer)
            props.onModalClose?.()
          }
          if (close) {
            modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(`Impossible d'ajouter le client: ${formatError(error)}`)
        })
    })(event)
  }

  useEffect(() => {
    messageService.getMessage().subscribe((message) => {
      if (message) {
        if (message.name === 'customerCategory') {
          setValue('categoryId', message.value)
        }

        if (message.name === 'paymentCondition') {
          setValue('paymentConditionId', message.value)
        }

        if (message.name === 'paymentMode') {
          setValue('paymentModeId', message.value)
        }
      }
    })
  }, [messageService])

  useEffect(() => {
    if (!customer && dataAccount) {
      setValue(
        'customerAccountId',
        dataAccount?.specialAccounts
          ? dataAccount?.specialAccounts.filter(
              ({ specialAccountType, selected }: any) =>
                specialAccountType === 'CUSTOMER' && selected,
            )[0]
          : null,
      )
    }
  }, [loadingAccount])

  return (
    <Form onSubmit={onSubmit} className="space-y-1">
      {/* Identification Section */}
      <FormSection
        icon={<User size={20} />}
        title={t('label-identificationInformation') || 'Identification'}
        description={
          t('label-identificationDesc') || 'Détails personnels et catégorie'
        }
        color="#7367f0"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          <Input
            name="lastName"
            control={control}
            label={t('label-lastName')}
            required
            prepend={<User size={16} />}
            placeholder={t('placeholder-lastName')}
          />

          <Input
            name="firstName"
            control={control}
            label={t('label-firstName')}
            prepend={<User size={16} />}
            placeholder={t('placeholder-firstName')}
          />

          <DatePicker
            name="birthDate"
            control={control}
            label={t('label-birthDate')}
          />

          <LiveView
            document={CustomerCategoryCreatedDocument}
            subscribeToMore={subscribeToMore}
            data={data}
            listVar="customerCategories"
            singleVar="customerCategory"
            loading={loading}
            enterpriseId={enterpriseId}
          >
            {({ customerCategories }) => (
              <ControlledSelect
                control={control}
                name="categoryId"
                label={t('label-category')}
                required
                prepend={<Tag size={16} />}
                options={
                  customerCategories
                    ? customerCategories.filter((u: any) => u.active)
                    : []
                }
                onChange={(val) =>
                  setValue('categoryId', val, { shouldDirty: true })
                }
                getOptionLabel={(o) => o.name}
                getOptionValue={(o) => o.id}
                formId="customerCategory"
                form={<CustomerCategoryAdd />}
                optionLabel="name"
                formTitle={t('action.add_customerCategory')}
                modalClassName="modal-md"
              />
            )}
          </LiveView>
        </div>
      </FormSection>

      {/* Legal & Accounting Section */}
      <FormSection
        icon={<Shield size={20} />}
        title={t('label-legalAndAccounting') || 'Comptabilité & Légal'}
        description={
          t('label-legalAndAccountingDesc') ||
          'Identification fiscale et compte rattaché'
        }
        color="#ea5455"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          <LiveView
            document={SpecialAccountCreatedDocument}
            subscribeToMore={subscribeToMoreAccount}
            data={dataAccount}
            listVar="specialAccounts"
            singleVar="specialAccount"
            loading={loading}
            enterpriseId={enterpriseId}
          >
            {({ specialAccounts }) => (
              <ControlledSelect
                control={control}
                name="customerAccountId"
                label={t('label-customerAccount')}
                required
                prepend={<Briefcase size={16} />}
                options={
                  specialAccounts
                    ? specialAccounts.filter(
                        ({ specialAccountType }: any) =>
                          specialAccountType === 'CUSTOMER',
                      )
                    : []
                }
                onChange={(val) =>
                  setValue('customerAccountId', val, { shouldDirty: true })
                }
                getOptionLabel={(o) => o.name}
                getOptionValue={(o) => o.id}
              />
            )}
          </LiveView>

          <Input
            name="tradeRegister"
            control={control}
            label={t('label-tradeRegister')}
            prepend={<FileText size={16} />}
            placeholder={
              t('placeholder-tradeRegister') || 'Registre du commerce'
            }
          />

          <Input
            name="taxNumber"
            control={control}
            label={t('label-taxIdentificationNumber')}
            prepend={<Hash size={16} />}
            placeholder={t('placeholder-taxNumber') || 'NIF'}
          />

          <Input
            name="webSite"
            control={control}
            label={t('label-webSite')}
            prepend={<Globe size={16} />}
            placeholder="https://www.example.com"
          />
        </div>
      </FormSection>

      {/* Contact Information Section */}
      <FormSection
        icon={<Phone size={20} />}
        title={t('label-contactInformation') || 'Coordonnées'}
        description={
          t('label-contactInformationDesc') || 'Moyens de communication'
        }
        color="#00cfe8"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
          <PhoneInput
            name="contactInfo.mobile"
            label={t('label-mobileTelephone')}
            control={control}
          />

          <PhoneInput
            name="contactInfo.telephone"
            label={t('label-telephone')}
            control={control}
          />

          <PhoneInput
            name="contactInfo.telephone2"
            label={t('label-telephone2')}
            control={control}
          />

          <Input
            name="contactInfo.email"
            label={t('label-email')}
            control={control}
            prepend={<Mail size={16} />}
            placeholder="email@example.com"
          />

          <Input
            name="contactInfo.fax"
            label={t('label-fax')}
            control={control}
            prepend={<FileText size={16} />}
          />

          <Input
            name="contactInfo.postOfficeBox"
            label={t('label-postOfficeBox')}
            control={control}
            prepend={<Mail size={16} />}
          />
        </div>
      </FormSection>

      {/* Address Information Section */}
      <FormSection
        icon={<MapPin size={20} />}
        title={t('label-addressInformation') || 'Adresse'}
        description={
          t('label-addressInformationDesc') || 'Localisation physique'
        }
        color="#1bc5bd"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          <Input
            name="address.country"
            label={t('label-country')}
            control={control}
            prepend={<Globe size={16} />}
            placeholder={t('placeholder-country')}
          />

          <Input
            name="address.state"
            label={t('label-state')}
            control={control}
            prepend={<MapPin size={16} />}
          />

          <Input
            name="address.town"
            label={t('label-town')}
            control={control}
            prepend={<MapPin size={16} />}
          />

          <Input
            name="address.zipCode"
            label={t('label-zipCode')}
            control={control}
            prepend={<Hash size={16} />}
          />

          <Input
            name="address.street"
            label={t('label-street')}
            control={control}
            prepend={<MapPin size={16} />}
            className="md:col-span-2"
          />
        </div>
      </FormSection>

      {/* Payment Settings Section */}
      <FormSection
        icon={<DollarSign size={20} />}
        title={t('label-paymentInformation') || 'Paramètres de paiement'}
        description={
          t('label-paymentInformationDesc') ||
          'Conditions et modes de règlement'
        }
        color="#28c76f"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          <LiveView
            document={PaymentConditionCreatedDocument}
            subscribeToMore={subscribeToMoreCondition}
            listVar="paymentConditions"
            singleVar="paymentCondition"
            data={dataCondition}
            enterpriseId={enterpriseId}
          >
            {({ paymentConditions }) => (
              <ControlledSelect
                control={control}
                name="paymentConditionId"
                label={t('label-paymentCondition')}
                loading={loadingCondition}
                prepend={<Clock size={16} />}
                onChange={(val) =>
                  setValue('paymentConditionId', val, { shouldDirty: true })
                }
                options={paymentConditions || undefined}
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.id}
                form={<PaymentConditionAdd />}
                formId="paymentCondition"
                optionLabel="name"
                formTitle={t('action.add_paymentCondition')}
                modalClassName="modal-md"
              />
            )}
          </LiveView>

          <LiveView
            document={PaymentModeCreatedDocument}
            subscribeToMore={subscribeToMoreMode}
            listVar="paymentModes"
            singleVar="paymentMode"
            data={dataMode}
            enterpriseId={enterpriseId}
          >
            {({ paymentModes }) => (
              <ControlledSelect
                control={control}
                name="paymentModeId"
                label={t('label-paymentMode')}
                loading={loadingMode}
                prepend={<DollarSign size={16} />}
                onChange={(val) =>
                  setValue('paymentModeId', val, { shouldDirty: true })
                }
                options={paymentModes || undefined}
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.id}
                form={<PaymentModeAdd />}
                formId="paymentMode"
                optionLabel="name"
                formTitle={t('action.add_paymentMode')}
                modalClassName="modal-md"
              />
            )}
          </LiveView>
        </div>
      </FormSection>

      {/* Status Section */}
      <FormSection
        icon={<Settings size={20} />}
        title={t('label-status') || 'Statut'}
        description={t('label-statusDesc') || 'Disponibilité du client'}
        color="#82868b"
      >
        <ToggleOption
          icon={<CheckCircle size={16} />}
          title={t('label-active')}
          description={t('label-activeDesc') || 'Client activé'}
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

      {/* Additional Notes Section */}
      <FormSection
        icon={<StickyNote size={20} />}
        title={t('label-additionalNotes') || 'Notes complémentaires'}
        description={t('label-notesDesc') || 'Observations internes'}
        color="#ff9f43"
      >
        <Input
          name="note"
          control={control}
          label=""
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

export default CustomerForm
