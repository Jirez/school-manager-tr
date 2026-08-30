import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { TabPane } from 'reactstrap'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useEffect } from 'react'
import type { FC } from 'react'
import Input from '@/@core/components/ui/forms/input'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import Switch from '@/@core/components/ui/forms/swith'
import FormSection from '@/@core/components/ui/forms/form-section'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import { useAuthentication } from '@/hooks/useAuthentication'
import { yupResolver } from '@hookform/resolvers/yup'
import { supplierValidation } from './supplier.validation'
import { INPUT_DATE_FORMAT, TOAST_OPTIONS } from '@/utils/constants'
import {
  PaymentConditionCreatedDocument,
  SpecialAccountCreatedDocument,
  SupplierCategoryCreatedDocument,
  useSpecialAccountsQuery,
  useSupplierCategoriesQuery,
  usePaymentConditionsQuery,
} from '@/gql/graphql'
import type { SupplierType } from './supplier.type'
import { TabNav } from '@/@core/components/tabs'
import LiveView from '@/utils/LiveView'
import ControlledSelect from '@/@core/components/ui/forms/controlled-select'
import SupplierCategoryAdd from './category/SupplierCategoryAdd'
import DatePicker from '@/@core/components/ui/forms/date-picker'
import PhoneInput from '@/@core/components/ui/forms/phone-input'
import PaymentConditionAdd from '../condition/PaymentConditionAdd'
import dayjs from 'dayjs'
import {
  Building2,
  User,
  Phone,
  MapPin,
  CreditCard,
  FileText,
  Mail,
  Globe,
  Info,
  Hash,
  CheckCircle,
} from 'lucide-react'
import ToggleOption from '@/@core/components/ui/forms/toggle-option'

interface SupplierFormProps extends BaseFormProps {
  supplier?: SupplierType
  modal?: NiceModalHandler
}

const initialValues: Partial<SupplierType> = {
  displayName: '',
  active: true,
  note: '',
  categoryId: null,
}

const SupplierForm: FC<SupplierFormProps> = ({
  supplier,
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
  } = useForm<SupplierType>({
    defaultValues: {
      displayName: supplier?.displayName || '',
      lastName: supplier?.lastName || '',
      firstName: supplier?.firstName || '',
      active: supplier ? supplier.active : true,
      note: supplier?.note || '',
      categoryId: supplier ? supplier.category : null,
      //openingBalance: supplier ? supplier.openingBalance : "",
      taxNumber: supplier?.taxNumber || '',
      webSite: supplier?.webSite || '',
      //note: supplier?.note || "",
      birthDate: supplier
        ? supplier.birthDate
          ? dayjs(supplier.birthDate).toDate()
          : null
        : null,
      address: {
        zipCode: supplier?.address?.zipCode || '',
        country: supplier?.address?.country || '',
        town: supplier?.address?.town || '',
        state: supplier?.address?.state || '',
        street: supplier?.address?.street || '',
      },
      contactInfo: {
        fax: supplier?.contactInfo?.fax || '',
        email: supplier?.contactInfo?.email || '',
        mobile: supplier?.contactInfo?.mobile || '',
        telephone: supplier?.contactInfo?.telephone || '',
        postOfficeBox: supplier?.contactInfo?.postOfficeBox || '',
        //skype: supplier?.contactInfo?.skype || '',
      },
      purchaseConditionId: supplier ? supplier.purchaseCondition : null,
      tradeRegister: supplier?.tradeRegister || '',
      supplierAccountId: supplier
        ? supplier.supplierAccount
        : dataAccount?.specialAccounts
          ? dataAccount?.specialAccounts.filter(
              ({ specialAccountType, selected }: any) =>
                specialAccountType === 'VENDOR' && selected,
            )[0]
          : null,
    },
    resolver: yupResolver(supplierValidation),
  })

  const { data, loading, subscribeToMore } = useSupplierCategoriesQuery({
    variables: { id: enterpriseId },
  })

  const {
    data: dataCondition,
    loading: loadingCondition,
    subscribeToMore: subscribeToMoreCondition,
  } = usePaymentConditionsQuery({
    variables: { id: enterpriseId },
  })

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    close?: boolean,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      const id = supplier ? Number(supplier.id) : undefined

      action({
        variables: {
          supplier: {
            ...values,
            id,
            enterpriseId,
            displayName: `${values.lastName} ${values.firstName || ''}`.trim(),
            categoryId: !values.categoryId
              ? null
              : Number(values.categoryId.id),
            supplierAccountId: values.supplierAccountId
              ? Number(values.supplierAccountId.id)
              : null,
            purchaseConditionId: values.purchaseConditionId
              ? Number(values.purchaseConditionId.id)
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
          toast.success(
            t('message-supplierSaved', { name: data.supplier.displayName }),
            {
              ...TOAST_OPTIONS,
            },
          )

          if (props.popover) {
            messageService.sendMessage('supplier', data.supplier)
            props.onModalClose?.()
          }
          if (close) {
            modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(
            t('message-supplierSaveError', { error: formatError(error) }),
          )
        })
    })(event)
  }

  useEffect(() => {
    messageService.getMessage().subscribe((message) => {
      if (message) {
        if (message.name === 'supplierCategory') {
          setValue('categoryId', message.value)
        }

        if (message.name === 'paymentCondition') {
          setValue('purchaseConditionId', message.value)
        }
      }
    })
  }, [messageService])

  useEffect(() => {
    if (!supplier && dataAccount) {
      setValue(
        'supplierAccountId',
        dataAccount?.specialAccounts
          ? dataAccount?.specialAccounts.filter(
              ({ specialAccountType, selected }: any) =>
                specialAccountType === 'VENDOR' && selected,
            )[0]
          : null,
      )
    }
  }, [loadingAccount])

  return (
    <form onSubmit={onSubmit} className="space-y-1">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-1">
        {/* Left Column - Main Info */}
        <div className="xl:col-span-7 space-y-1">
          {/* Basic & Personal Information */}
          <FormSection
            icon={<User size={20} />}
            title={t('label-identification')}
            description={t('label-supplierIdentificationInfo')}
            color="#7367f0"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
              <div className="md:col-span-2">
                <ToggleOption
                  icon={<CheckCircle size={16} />}
                  title={t('label-active')}
                  description={t('label-activeDesc') || 'Fournisseur activé'}
                  isActive={watch('active')}
                >
                  <Switch
                    name="active"
                    control={control}
                    label=""
                    defaultChecked={getValues('active')}
                    onChange={(e: any) =>
                      setValue('active', e.target.checked, {
                        shouldDirty: true,
                      })
                    }
                  />
                </ToggleOption>
              </div>

              <div className="md:col-span-2">
                <LiveView
                  document={SupplierCategoryCreatedDocument}
                  subscribeToMore={subscribeToMore}
                  data={data}
                  listVar="supplierCategories"
                  singleVar="supplierCategory"
                  loading={loading}
                  enterpriseId={enterpriseId}
                >
                  {({ supplierCategories }) => (
                    <ControlledSelect
                      control={control}
                      name="categoryId"
                      label={t('label-category')}
                      required
                      prepend={<Building2 size={16} />}
                      options={
                        supplierCategories
                          ? supplierCategories.filter((u: any) => u.active)
                          : []
                      }
                      onChange={(val) => setValue('categoryId', val)}
                      getOptionLabel={(o) => o.name}
                      getOptionValue={(o) => o.id}
                      formId="supplierCategory"
                      form={<SupplierCategoryAdd />}
                      optionLabel="name"
                      formTitle={t('action.add_supplierCategory')}
                      modalClassName="modal-md"
                    />
                  )}
                </LiveView>
              </div>

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
            </div>
          </FormSection>

          {/* Additional Info with Tabs */}
          <FormSection
            icon={<Info size={20} />}
            title={t('label-details')}
            description={t('label-supplierDetailedInfo')}
            color="#6f42c1"
          >
            <TabNav
              items={[
                { id: '1', label: 'label-contact', icon: <Phone size={14} /> },
                { id: '2', label: 'label-address', icon: <MapPin size={14} /> },
                {
                  id: '3',
                  label: 'label-payments',
                  icon: <CreditCard size={14} />,
                },
              ]}
            >
              <TabPane tabId="1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-1 gap-y-1 pt-0">
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

                  <div className="md:col-span-2 h-px bg-gray-100 dark:bg-gray-800" />

                  <Input
                    name="contactInfo.email"
                    label={t('label-email')}
                    control={control}
                    type="email"
                    prepend={<Mail size={16} />}
                    placeholder="example@email.com"
                  />

                  <Input
                    name="contactInfo.fax"
                    label={t('label-fax')}
                    control={control}
                    prepend={<Phone size={16} />}
                  />

                  <Input
                    name="contactInfo.postOfficeBox"
                    label={t('label-postOfficeBox')}
                    control={control}
                    prepend={<Hash size={16} />}
                  />
                </div>
              </TabPane>

              <TabPane tabId="2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-1 pt-">
                  <Input
                    name="address.country"
                    label={t('label-country')}
                    control={control}
                    prepend={<Globe size={16} />}
                  />

                  <Input
                    name="address.town"
                    label={t('label-town')}
                    control={control}
                    prepend={<MapPin size={16} />}
                  />

                  <Input
                    name="address.state"
                    label={t('label-state')}
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
                    className="md:col-span-2"
                    prepend={<MapPin size={16} />}
                  />
                </div>
              </TabPane>

              <TabPane tabId="3">
                <div className="pt-">
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
                        name="purchaseConditionId"
                        label={t('label-paymentCondition')}
                        loading={loadingCondition}
                        prepend={<CreditCard size={16} />}
                        onChange={(val) => setValue('purchaseConditionId', val)}
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
                </div>
              </TabPane>
            </TabNav>
          </FormSection>
        </div>

        {/* Right Column - Secondary Info */}
        <div className="xl:col-span-5 space-y-1">
          {/* Financial Information */}
          <FormSection
            icon={<CreditCard size={20} />}
            title={t('label-financial')}
            description={t('label-supplierFinancialInfoShort')}
            color="#28a745"
          >
            <div className="space-y-1">
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
                    name="supplierAccountId"
                    label={t('label-supplierAccount')}
                    required
                    prepend={<Building2 size={16} />}
                    options={
                      specialAccounts
                        ? specialAccounts.filter(
                            ({ specialAccountType }: any) =>
                              specialAccountType === 'VENDOR',
                          )
                        : []
                    }
                    onChange={(val) => setValue('supplierAccountId', val)}
                    getOptionLabel={(o) => o.name}
                    getOptionValue={(o) => o.id}
                  />
                )}
              </LiveView>

              <Input
                name="tradeRegister"
                control={control}
                label={t('label-tradeRegister')}
                prepend={<Hash size={16} />}
              />

              <Input
                name="taxNumber"
                control={control}
                label={t('label-taxIdentificationNumber')}
                prepend={<Hash size={16} />}
              />

              <Input
                name="webSite"
                control={control}
                label={t('label-webSite')}
                type="url"
                prepend={<Globe size={16} />}
                placeholder="https://www.example.com"
              />
            </div>
          </FormSection>

          {/* Notes Section */}
          <FormSection
            icon={<FileText size={20} />}
            title={t('label-notes')}
            description={t('label-additionalNotes')}
            color="#ffc107"
          >
            <Input
              name="note"
              control={control}
              label={''}
              type="textarea"
              rows={5}
            />
          </FormSection>
        </div>
      </div>

      {/* Sticky Action Buttons */}
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

export default SupplierForm
