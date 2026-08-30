import { lazy, useEffect, useState } from 'react'
import { useApolloClient } from '@apollo/client'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { Input as BaseInput, Form, Label } from 'reactstrap'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import {
  FileText,
  DollarSign,
  Tag,
  Hash,
  Type,
  CheckCircle,
  TrendingDown,
  ArrowDownCircle,
  ArrowUpCircle,
  ShoppingCart,
  Package,
  Camera,
} from 'lucide-react'

import { useAuthentication } from '@/hooks/useAuthentication'
import { TOAST_OPTIONS } from '@/utils/constants'
import { formatError } from '@/utils/ErrorHelper'
import { messageService } from '@/utils/message.service'
import type { ArticleType } from './article.type'
import { articleValidation } from './article.validation'
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
import FormSection from '@/@core/components/ui/forms/form-section'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'
import ToggleOption from '@/@core/components/ui/forms/toggle-option'
import NumericInput from '@/@core/components/ui/forms/numeric-input'

const ProductCategoryAdd = lazy(
  () => import('@/views/sale/product/category/ProductCategoryAdd'),
)

interface ArticleFormProps extends BaseFormProps {
  product?: ArticleType
}

const config = await fetch('/configuration.json').then((res) => res.json())

const ArticleForm: React.FC<ArticleFormProps> = ({
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
    register,
    watch,
  } = useForm<ArticleType>({
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
    },
    //@ts-ignore
    resolver: yupResolver(articleValidation),
  })

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    close?: boolean,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      const id = product ? Number(product.articleId) : undefined

      action({
        variables: {
          article: {
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
          },
        },
      })
        .then(async ({ data }) => {
          reset()
          toast.success(`Stock ${data.product.name} enregistré`, {
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-1 gap-y-1">
        {/* Identification Section */}
        <FormSection
          title={
            t('label-stockIdentification') || "Identification de l'article"
          }
          description={
            t('label-stockIdentificationDesc') ||
            "Catégorie, nom et référence de l'article"
          }
          icon={<Package size={18} />}
          color="#7367f0"
          className="col-span-full"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-1">
            <div className="col-span-1 md:col-span-3 space-y-1">
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
                  description={t('label-activeDesc') || 'Article activé'}
                  isActive={watch('active')}
                  //className="mt-1"
                >
                  <Switch
                    name="active"
                    label=""
                    control={control}
                    defaultChecked={getValues('active')}
                    onChange={(e: any) =>
                      setValue('active', e.target.checked, {
                        shouldDirty: true,
                      })
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

            <div className="col-span-1 flex flex-col items-center justify-center p-0  rounded-xl ">
              {!values.picture && !webcamPicture && (
                <div className="w-full text-center">
                  <FileUpload
                    accept="image/*"
                    onChange={(data: any) => {
                      handleUpload(data[0])
                    }}
                  />
                </div>
              )}

              {!values.picture && webcamPicture && (
                <div className="w-full">
                  <WebcamImage onShot={(data) => handleWebcamUpload(data)} />
                </div>
              )}

              {values.picture && (
                <div className="w-full">
                  <ImagePreview
                    url={values.picture}
                    deleteAction={() => {
                      setValues({ ...values, file: null, picture: null })
                      setValue('picture', '')
                    }}
                  />
                </div>
              )}

              {!values.picture && (
                <div className="mt-0 flex items-center gap-1">
                  <BaseInput
                    type="switch"
                    id="webcam-switch"
                    defaultChecked={webcamPicture}
                    onChange={(e) => {
                      e.preventDefault()
                      setWebcamPicture(e.target.checked)
                    }}
                  />
                  <Label
                    for="webcam-switch"
                    className="mb-0 text-xs cursor-pointer"
                  >
                    <Camera size={14} className="mr-1 inline" />
                    {t('label-useWebcam')}
                  </Label>
                </div>
              )}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
              <NumericInput
                name="minSalePrice"
                nameF="minSalePriceF"
                label={t('label-minSalePrice') || 'Prix de vente min.'}
                control={control}
                setValue={setValue}
                prepend={<TrendingDown size={16} />}
              />

              <NumericInput
                name="cost"
                nameF="costF"
                label={t('label-cost')}
                control={control}
                setValue={setValue}
                prepend={<DollarSign size={16} />}
              />
            </div>
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

export default ArticleForm
