import { lazy, useEffect, useState } from 'react'
import { useApolloClient } from '@apollo/client'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { Input as BaseInput } from 'reactstrap'
import { Form } from 'reactstrap'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'

import { useAuthentication } from '@/hooks/useAuthentication'
import { TOAST_OPTIONS } from '@/utils/constants'
import { formatError } from '@/utils/ErrorHelper'
import { messageService } from '@/utils/message.service'
import LiveView from '@/utils/LiveView'
import ControlledSelect from '@/@core/components/ui/forms/controlled-select'

import Input from '@/@core/components/ui/forms/input'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import Switch from '@/@core/components/ui/forms/swith'
import RestDataSource from '@/utils/RestDataSource'
import FileUpload from '@/@core/components/ui/forms/file-upload'
import WebcamImage from '@/@core/components/image/webcam-image'
import ImagePreview from '@/@core/components/image/image-preview'
import {
  ProductCategoryCreatedDocument,
  ProductReferenceDocument,
  SpecialAccountCreatedDocument,
  useProductCategoriesQuery,
  useSpecialAccountsQuery,
} from '@/gql/graphql'
import type { TuitionType } from './tuition.type'
import { tuitionValidation } from './tuition.validation'
import {
  FileText,
  Settings,
  DollarSign,
  Tag,
  Hash,
  ShoppingBag,
  Eye,
  Power,
  CheckCircle,
  Package,
  ArrowUpRight,
  ArrowDownLeft,
  Camera,
} from 'lucide-react'
import FormSection from '@/@core/components/ui/forms/form-section'
import ToggleOption from '@/@core/components/ui/forms/toggle-option'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'

const ProductCategoryAdd = lazy(
  () => import('@/views/sale/product/category/ProductCategoryAdd'),
)

interface TuitionFormProps extends BaseFormProps {
  product?: TuitionType
}

const config = await fetch('/configuration.json').then((res) => res.json())

const TuitionForm: React.FC<TuitionFormProps> = ({
  product,
  modal,
  action,
  ...props
}) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()
  const client = useApolloClient()
  const [values, setValues] = useState<{ file: any; picture: string | null }>({
    file: null,
    picture: product ? product.picture : null,
  })
  const [webcamPicture, setWebcamPicture] = useState(false)

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
  } = useForm<TuitionType>({
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
      name2: product?.name2 || '',
      isMandatory: product ? product.isMandatory : true,
      isCollected: product ? product.isCollected : false,
      allowPaymentInKind: product ? product.allowPaymentInKind : false,
      isDeliverable: product ? product.isDeliverable : false,
      numberOrder: product ? product.numberOrder : '',
    },
    //@ts-ignore
    resolver: yupResolver(tuitionValidation),
  })

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    close?: boolean,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      const id = product ? Number(product.tuitionId) : undefined

      action({
        variables: {
          tuition: {
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

            enterpriseId,
            active: values.active,
            purchasePrice: values.purchasePrice
              ? Number(values.purchasePrice)
              : null,
            cost: values.cost ? Number(values.cost) : null,
            salePrice: values.salePrice ? Number(values.salePrice) : null,
            minSalePrice: values.minSalePrice
              ? Number(values.minSalePrice)
              : null,
            picture: values.picture ? values.picture : null,
            name2: values.name2 || null,
            isMandatory: values.isMandatory,
            isCollected: values.isCollected,
            allowPaymentInKind: values.allowPaymentInKind,
            numberOrder: values.numberOrder,
            isDeliverable: values.isDeliverable,
          },
        },
      })
        .then(async ({ data }) => {
          reset()
          toast.success(`Stock ${data.product.name} enregistré`, {
            ...TOAST_OPTIONS,
          })
          //console.log(data.product)
          props.refetch?.()

          if (props.popover) {
            messageService.sendMessage('product', data.product)
            props.onModalClose?.()
          }
          if (close) {
            modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(`Impossible d'ajouter le stock: ${formatError(error)}`)
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
                specialAccountType === 'SALE' && selected,
            )[0]
          : null,
      )
      setValue(
        'purchaseAccountId',
        dataAccount?.specialAccounts
          ? dataAccount?.specialAccounts.filter(
              ({ specialAccountType, selected }: any) =>
                specialAccountType === 'PURCHASE' && selected,
            )[0]
          : null,
      )
    }
  }, [loadingAccount])

  /* useEffect(() => {
        setValues({ ...values, picture: picture });
        setValue("picture", picture)
    }, [picture, setValue, setValues]); */

  const handleUpload = (file: any) => {
    const dataSource = new RestDataSource()
    const formData = new FormData()
    formData.append('file', file)
    formData.append('picturePath', config?.uploadDir || 'C:/Temp/')

    const callback = async (datum: any) => {
      toast.success('Importation terminée avec succès', { ...TOAST_OPTIONS })
      if (datum) {
        setValue('picture', datum)
        setValues((val) => ({ ...val, picture: datum }))
      }
    }

    dataSource.upload(`upload/image`, formData, callback).catch((error) => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        toast.error(error.response.data.message)
        // console.log(error.response.status);
        // console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the
        // browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request)
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message)
      }
    })
  }

  const handleWebcamUpload = (file: any) => {
    const dataSource = new RestDataSource()
    const formData = new FormData()
    const data = file.toString().replace(/^data:image\/jpeg;base64,/, '')
    formData.append('imageValue', data)
    formData.append('picturePath', config?.uploadDir || 'C:/Temp/')
    //formData.append('title', "Un test en béton");
    //formData.append('details', "details");

    const callback = async (datum: any) => {
      toast.info('Image sauvegardée avec succès')
      if (datum) {
        setValue('picture', datum)
        setValues({ ...values, picture: datum })
      }
    }

    dataSource.upload(`upload/webcam`, formData, callback).catch((error) => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        toast.error(error.response.data.message)
        // console.log(error.response.status);
        // console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the
        // browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request)
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message)
      }
    })
  }

  return (
    <Form onSubmit={onSubmit}>
      <div className="pb-3">
        <div className="grid grid-cols-1 gap-1">
          {/* Basic Information Section */}
          <FormSection
            title={t('label-basicInformation') || 'Informations de base'}
            description={
              t('label-tuitionInfoDesc') || 'Détails et identification'
            }
            icon={<FileText size={18} />}
            color="#7367f0"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-1.5 align-items-start">
              <div className="md:col-span-3">
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
                        prepend={<Tag size={14} />}
                      />
                    )}
                  </LiveView>

                  <Input
                    name="numberOrder"
                    control={control}
                    label={t('label-numberOrder')}
                    required
                    prepend={<Hash size={14} />}
                    placeholder={t('label-numberOrderPlaceholder') || 'Ex: 1'}
                  />

                  <Input
                    name="name"
                    control={control}
                    label={t('label-name')}
                    required
                    onBlur={populateReference}
                    prepend={<ShoppingBag size={14} />}
                  />

                  <Input
                    name="name2"
                    control={control}
                    label={t('label-name2')}
                    prepend={<Eye size={14} />}
                  />

                  <div className="md:col-span-2">
                    <Input
                      name="sku"
                      control={control}
                      label={t('label-reference')}
                      prepend={<Hash size={14} />}
                      placeholder={t('label-skuPlaceholder')}
                    />
                  </div>
                </div>
              </div>

              <div className="md:col-span-1">
                <div className="flex flex-col gap-1">
                  <div className="">
                    {!values.picture && !webcamPicture && (
                      <FileUpload
                        accept="image/*"
                        onChange={(data: any) => {
                          handleUpload(data[0])
                        }}
                      />
                    )}

                    {!values.picture && webcamPicture && (
                      <WebcamImage
                        onShot={(data) => handleWebcamUpload(data)}
                      />
                    )}

                    {values.picture && (
                      <ImagePreview
                        url={values.picture}
                        deleteAction={() => {
                          setValues({ ...values, file: null, picture: null })
                          setValue('picture', '')
                        }}
                      />
                    )}
                  </div>

                  {!values.picture && (
                    <div className="form-switch mt-0.5 flex flex-row items-center justify-center p-0.5 border rounded-lg bg-light dark:bg-transparent">
                      <BaseInput
                        type="switch"
                        id="webcam-switch"
                        checked={webcamPicture}
                        onChange={(e) => setWebcamPicture(e.target.checked)}
                      />
                      <label
                        htmlFor="webcam-switch"
                        className="ml-1 cursor-pointer text-xs font-semibold uppercase mb-0"
                      >
                        <Camera size={12} className="mr-0.5" />
                        {t('label-useWebcam')}
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </FormSection>

          {/* Pricing & Visibility Section */}
          <FormSection
            title={t('label-options') || 'Options'}
            description={
              t('label-groupOptionsDesc') || 'Paramètres de comportement'
            }
            icon={<Settings size={18} />}
            color="#28c76f"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
              <ToggleOption
                icon={<Power />}
                title={t('label-active')}
                description={
                  t('label-activeDesc') || 'Activer ce droit exigible'
                }
                isActive={getValues('active')}
              >
                <Switch
                  name="active"
                  control={control}
                  defaultChecked={getValues('active')}
                  label=""
                />
              </ToggleOption>

              <ToggleOption
                icon={<CheckCircle />}
                title={t('label-isMandatory')}
                description={t('label-isMandatoryDesc')}
                isActive={getValues('isMandatory')}
              >
                <Switch
                  name="isMandatory"
                  control={control}
                  defaultChecked={getValues('isMandatory')}
                  label=""
                />
              </ToggleOption>

              <ToggleOption
                icon={<DollarSign />}
                title={t('label-isCollected')}
                description={t('label-isCollectedDesc')}
                isActive={getValues('isCollected')}
              >
                <Switch
                  name="isCollected"
                  control={control}
                  defaultChecked={getValues('isCollected')}
                  label=""
                />
              </ToggleOption>

              <ToggleOption
                icon={<ShoppingBag />}
                title={t('label-allowPaymentInKind')}
                description={t('label-allowPaymentInKindDesc')}
                isActive={getValues('allowPaymentInKind')}
              >
                <Switch
                  name="allowPaymentInKind"
                  control={control}
                  defaultChecked={getValues('allowPaymentInKind')}
                  label=""
                />
              </ToggleOption>

              <ToggleOption
                icon={<Package />}
                title={t('label-isDeliverable')}
                description={t('label-isDeliverableDesc')}
                isActive={getValues('isDeliverable')}
              >
                <Switch
                  name="isDeliverable"
                  control={control}
                  defaultChecked={getValues('isDeliverable')}
                  label=""
                />
              </ToggleOption>
            </div>
          </FormSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            {/* Description Section */}
            <FormSection
              title={t('label-description') || 'Description'}
              description={t('label-notesDesc') || 'Notes internes et détails'}
              icon={<FileText size={18} />}
              color="#ff9f43"
            >
              <Input
                name="saleDescription"
                control={control}
                label={''}
                type="textarea"
                rows={5}
                placeholder={t('label-saleDescriptionPlaceholder')}
              />
            </FormSection>

            {/* Accounts Section */}
            <FormSection
              title={t('label-accounts') || 'Comptes'}
              description={
                t('label-paymentTermsDesc') || 'Configuration comptable'
              }
              icon={<DollarSign size={18} />}
              color="#ea5455"
            >
              <div className="grid grid-cols-1 gap-1">
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
                      name="saleAccountId"
                      label={t('label-saleAccount')}
                      required
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
                      prepend={
                        <ArrowUpRight size={14} className="text-success" />
                      }
                      //description={t("label-saleAccountDesc")}
                    />
                  )}
                </LiveView>

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
                      name="purchaseAccountId"
                      label={t('label-purchaseAccount')}
                      required
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
                      prepend={
                        <ArrowDownLeft size={14} className="text-danger" />
                      }
                      //description={t("label-purchaseAccountDesc")}
                    />
                  )}
                </LiveView>
              </div>
            </FormSection>
          </div>
        </div>
      </div>

      <StickyActions>
        <ActionButtons
          cancelAction={modal?.hide}
          isSubmitting={props.loading}
          popover={props.popover}
          dirty={isDirty}
          onSubmit={onSubmit}
          fixed={false}
        />
      </StickyActions>
    </Form>
  )
}

export default TuitionForm
