import { useTranslation } from 'react-i18next'
import { useAuthentication } from '@/hooks/useAuthentication'
import { Form } from 'reactstrap'
import type { ServiceType } from './service.type'
import { useApolloClient } from '@apollo/client'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { serviceValidation } from './service.validation'
import { toast } from 'react-toastify'
import { TOAST_OPTIONS } from '@/utils/constants'
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import { lazy, useEffect } from 'react'
import {
  Tag,
  Hash,
  Type,
  CheckCircle,
  DollarSign,
  ArrowDownCircle,
  ArrowUpCircle,
  ShoppingCart,
  Package,
  FileText,
  Briefcase,
  Clock,
} from 'lucide-react'
import LiveView from '@/utils/LiveView'
import ControlledSelect from '@/@core/components/ui/forms/controlled-select'

import Input from '@/@core/components/ui/forms/input'
import Switch from '@/@core/components/ui/forms/swith'

import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import {
  ProductCategoryCreatedDocument,
  ProductReferenceDocument,
  SpecialAccountCreatedDocument,
  useProductCategoriesQuery,
  useSpecialAccountsQuery,
} from '@/gql/graphql'
import FormSection from '@/@core/components/ui/forms/form-section'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'
import ToggleOption from '@/@core/components/ui/forms/toggle-option'
import NumericInput from '@/@core/components/ui/forms/numeric-input'

const ProductCategoryAdd = lazy(
  () => import('@/views/sale/product/category/ProductCategoryAdd'),
)

interface ServiceFormProps extends BaseFormProps {
  product?: ServiceType
}

const ServiceForm: React.FC<ServiceFormProps> = ({
  product,
  action,
  modal,
  ...props
}) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()
  const client = useApolloClient()

  const { data, loading, subscribeToMore } = useProductCategoriesQuery({
    variables: { id: enterpriseId },
  })

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
    getValues,
    setValue,
    formState: { isDirty },
    reset,
    register,
    watch,
  } = useForm<ServiceType>({
    defaultValues: {
      name: product?.name || '',
      sku: product?.sku || '',
      active: product ? product.active : true,
      saleDescription: product?.saleDescription || '',
      cost: product?.cost || '',
      costF: product?.cost || '',
      purchasePrice: product?.purchasePrice || '',
      purchasePriceF: product?.purchasePrice || '',
      salePrice: product?.salePrice || '',
      salePriceF: product?.salePrice || '',
      picture: product?.picture || '',
      productCategoryId: product ? product.productCategory : null,
      saleAccountId: product ? product.saleAccount : null,
      purchaseAccountId: product ? product.purchaseAccount : null,
      hourCount: product ? product.hourCount : '',
    },
    // @ts-ignore
    resolver: yupResolver(serviceValidation),
  })

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    close?: boolean,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      const id = product ? Number(product?.serviceId) : undefined

      action({
        variables: {
          service: {
            id,
            name: values.name,
            sku: values.sku,
            saleDescription: values.saleDescription,
            productCategoryId: values.productCategoryId
              ? Number(values.productCategoryId.id)
              : null,
            saleAccountId: values.saleAccountId
              ? Number(values.saleAccountId.id)
              : null,
            purchaseAccountId: values.purchaseAccountId
              ? Number(values.purchaseAccountId.id)
              : null,
            enterpriseId: Number(enterpriseId),
            active: values.active,
            purchasePrice: values.purchasePrice,
            cost: values.cost,
            salePrice: values.salePrice,
            hourCount: values.hourCount,
          },
        },
      })
        .then(async ({ data }) => {
          reset()
          toast.success(`Service ${data.product.name} enregistré`, {
            ...TOAST_OPTIONS,
          })
          //console.log(data.product)

          if (props.popover) {
            messageService.sendMessage('product', data.product)
            props.onModalClose?.()
          }
          if (close) {
            modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(`Impossible d'ajouter le service: ${formatError(error)}`)
        })
    })(event)
  }

  const populateReference = async () => {
    const sku = getValues('sku')
    const name = getValues('name')

    if (sku !== undefined && sku !== '' && name?.length < 3) {
      return false
    }

    const id = enterpriseId

    const { data } = await client.query({
      query: ProductReferenceDocument,
      variables: { name, id },
      fetchPolicy: 'no-cache',
    })

    if (data) {
      setValue('sku', data.reference)
    }
  }

  useEffect(() => {
    messageService.getMessage().subscribe((message) => {
      if (message) {
        if (message.name === 'productCategory') {
          setValue('productCategoryId', message.value)
        }
      }
    })
  }, [messageService])

  useEffect(() => {
    if (!product && dataAccount) {
      setValue(
        'saleAccountId',
        dataAccount?.specialAccounts
          ? dataAccount?.specialAccounts.filter(
              ({ specialAccountType, selected }: any) =>
                specialAccountType === 'SERVICE_SALE' && selected,
            )[0]
          : null,
      )
      setValue(
        'purchaseAccountId',
        dataAccount?.specialAccounts
          ? dataAccount?.specialAccounts.filter(
              ({ specialAccountType, selected }: any) =>
                specialAccountType === 'SERVICE_PURCHASE' && selected,
            )[0]
          : null,
      )
    }
  }, [loadingAccount])

  return (
    <Form onSubmit={onSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-1 gap-y-1">
        {/* Identification Section */}
        <FormSection
          title={
            t('label-serviceIdentification') || 'Identification du service'
          }
          description={
            t('label-serviceIdentificationDesc') ||
            'Catégorie, nom et référence du service'
          }
          icon={<Briefcase size={18} />}
          color="#7367f0"
          className="col-span-full"
        >
          <div className="space-y-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
              <LiveView
                document={ProductCategoryCreatedDocument}
                subscribeToMore={subscribeToMore}
                data={data}
                listVar="productCategories"
                singleVar="productCategory"
                loading={loading}
                enterpriseId={enterpriseId}
              >
                {({ productCategories }) => (
                  <ControlledSelect
                    control={control}
                    name="productCategoryId"
                    label={t('label-category')}
                    required
                    prepend={<Tag size={16} />}
                    options={
                      productCategories
                        ? productCategories.filter((u: any) => u.active)
                        : []
                    }
                    onChange={(val) => setValue('productCategoryId', val)}
                    getOptionLabel={(o) => o.name}
                    getOptionValue={(o) => o.id}
                    formId="productCategory"
                    form={<ProductCategoryAdd />}
                    optionLabel="name"
                    formTitle={t('action.add_productCategory')}
                    modalClassName="modal-md"
                    autoFocus
                  />
                )}
              </LiveView>

              <ToggleOption
                icon={<CheckCircle size={16} />}
                title={t('label-active')}
                description={t('label-activeDesc') || 'Service activé'}
                isActive={watch('active')}
              >
                <Switch
                  name="active"
                  label=""
                  control={control}
                  defaultChecked={getValues('active')}
                  onChange={(e: any) =>
                    setValue('active', e.target.checked, { shouldDirty: true })
                  }
                />
              </ToggleOption>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
              <Input
                name="name"
                control={control}
                label={t('label-name')}
                required
                prepend={<Type size={16} />}
                onBlur={populateReference}
              />

              <Input
                name="sku"
                control={control}
                label={t('label-reference')}
                prepend={<Hash size={16} />}
              />
            </div>
          </div>
        </FormSection>

        {/* Pricing Section */}
        <FormSection
          title={t('label-pricingInfo') || 'Informations tarifaires'}
          description={
            t('label-pricingInfoDesc') || "Prix d'achat, de vente et coût"
          }
          icon={<DollarSign size={18} />}
          color="#ea5455"
        >
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
              <NumericInput
                name="purchasePrice"
                nameF="purchasePriceF"
                label={t('label-purchasePrice')}
                control={control}
                setValue={setValue}
                prepend={<ArrowDownCircle size={16} />}
              />

              <NumericInput
                name="salePrice"
                nameF="salePriceF"
                label={t('label-salePrice')}
                control={control}
                setValue={setValue}
                prepend={<ArrowUpCircle size={16} />}
              />
            </div>

            <NumericInput
              name="cost"
              nameF="costF"
              label={t('label-cost')}
              control={control}
              setValue={setValue}
              prepend={<DollarSign size={16} />}
            />

            <Input
              name="hourCount"
              control={control}
              label={t('label-hourCount') || "Nombre d'heures"}
              type="number"
              prepend={<Clock size={16} />}
            />
          </div>
        </FormSection>

        {/* Accounting Section */}
        <FormSection
          title={t('label-accountingInfo') || 'Informations comptables'}
          description={
            t('label-accountingInfoDesc') || "Comptes de vente et d'achat"
          }
          icon={<ShoppingCart size={18} />}
          color="#28c76f"
        >
          <div className="space-y-1">
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
                  name="saleAccountId"
                  label={t('label-saleAccount')}
                  required
                  prepend={<ShoppingCart size={16} />}
                  options={
                    specialAccounts
                      ? specialAccounts.filter(
                          ({ specialAccountType }: any) =>
                            specialAccountType === 'SALE',
                        )
                      : []
                  }
                  onChange={(val) => setValue('saleAccountId', val)}
                  getOptionLabel={(o) => o.name}
                  getOptionValue={(o) => o.id}
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
                  name="purchaseAccountId"
                  label={t('label-purchaseAccount')}
                  required
                  prepend={<Package size={16} />}
                  options={
                    specialAccounts
                      ? specialAccounts.filter(
                          ({ specialAccountType }: any) =>
                            specialAccountType === 'PURCHASE',
                        )
                      : []
                  }
                  onChange={(val) => setValue('purchaseAccountId', val)}
                  getOptionLabel={(o) => o.name}
                  getOptionValue={(o) => o.id}
                />
              )}
            </LiveView>
          </div>
        </FormSection>

        {/* Description Section */}
        <FormSection
          title={t('label-description') || 'Description'}
          description={
            t('label-additionalInfoDesc') || 'Détails supplémentaires'
          }
          icon={<FileText size={18} />}
          color="#ff9f43"
          className="col-span-full"
        >
          <Input
            name="saleDescription"
            control={control}
            label={''}
            type="textarea"
            rows={3}
            prepend={<FileText size={16} />}
          />
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

export default ServiceForm
