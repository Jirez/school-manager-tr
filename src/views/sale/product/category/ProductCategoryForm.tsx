import { useTranslation } from 'react-i18next'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { toast } from 'react-toastify'
import { Form } from 'reactstrap'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Tag, Layers, FileText, Info } from 'lucide-react'

import { useAuthentication } from '@/hooks/useAuthentication'
import type { ProductCategoryType } from './product.category.type'
import Input from '@/@core/components/ui/forms/input'
import Switch from '@/@core/components/ui/forms/swith'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import LiveView from '@/utils/LiveView'
import ControlledSelect from '@/@core/components/ui/forms/controlled-select'
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import { TOAST_OPTIONS } from '@/utils/constants'
import {
  ProductCategoryCreatedDocument,
  useProductCategoriesQuery,
} from '@/gql/graphql'
import { productCategoryValidation } from './product.category.validation'
import FormSection from '@/@core/components/ui/forms/form-section'
import ToggleOption from '@/@core/components/ui/forms/toggle-option'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'

interface FormProps extends BaseFormProps {
  productCategory?: ProductCategoryType
  modal?: NiceModalHandler
}

const ProductCategoryForm: React.FC<FormProps> = ({
  modal,
  productCategory,
  action,
  ...props
}) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const { data, loading, subscribeToMore } = useProductCategoriesQuery({
    variables: { id: enterpriseId },
  })

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { isDirty },
    reset,
  } = useForm<ProductCategoryType>({
    defaultValues: {
      name: productCategory?.name || '',
      description: productCategory?.description || '',
      active: productCategory ? productCategory.active : true,
      parentId: productCategory ? productCategory.parent : null,
    },
    resolver: yupResolver(productCategoryValidation),
  })

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    close?: boolean,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      const id = productCategory ? Number(productCategory.id) : undefined

      action({
        variables: {
          category: {
            ...values,
            id,
            parentId: !values.parentId ? null : Number(values.parentId.id),
            enterpriseId,
          },
        },
      })
        .then(async ({ data }) => {
          reset()
          toast.success(`Catégorie ${data.productCategory.name} ajoutée`, {
            ...TOAST_OPTIONS,
          })

          if (props.popover) {
            messageService.sendMessage('productCategory', data.productCategory)
            props.onModalClose?.()
          }
          if (close) {
            modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(
            `Impossible d'ajouter la catégorie: ${formatError(error)}`,
          )
        })
    })(event)
  }

  return (
    <Form onSubmit={onSubmit}>
      <div className="grid grid-cols-1 gap-1">
        {/* General Info Section */}
        <FormSection
          title={t('label-generalInfo') || 'Informations générales'}
          description={
            t('label-productCategoryDetails') || 'Détails de la catégorie'
          }
          icon={<Tag size={18} />}
          color="#7367f0"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            <Input
              name="name"
              control={control}
              label={t('label-name')}
              required
              prepend={<Tag size={16} />}
              placeholder={t(
                'label-productCategoryName',
                'Nom de la catégorie',
              )}
            />

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
                  name="parentId"
                  label={t('label-parent')}
                  prepend={<Layers size={16} />}
                  options={
                    productCategories
                      ? productCategories.filter(
                          (u: any) => u.id !== productCategory?.id,
                        )
                      : []
                  }
                  onChange={(val) => setValue('parentId', val)}
                  getOptionLabel={(o) => o.name}
                  getOptionValue={(o) => o.id}
                  placeholder={
                    t('label-selectParent') ||
                    'Sélectionner une catégorie parente'
                  }
                />
              )}
            </LiveView>
          </div>
        </FormSection>

        {/* Additional Details Section */}
        <FormSection
          title={t('label-additionalDetails') || 'Détails additionnels'}
          icon={<FileText size={18} />}
          color="#ff9f43"
        >
          <div className="space-y-1">
            <Input
              name="description"
              control={control}
              label={t('label-description')}
              type="textarea"
              rows={4}
              prepend={<FileText size={16} />}
              placeholder={
                t('label-enterDescription') || 'Ajouter une description...'
              }
            />

            <div className="pt-0">
              <ToggleOption
                icon={<Info size={16} />}
                title={t('label-active')}
                description={
                  t('label-activeCategoryDesc') ||
                  'La catégorie sera visible et utilisable'
                }
                isActive={getValues('active')}
              >
                <Switch
                  name="active"
                  control={control}
                  defaultChecked={getValues('active')}
                  label=""
                  onChange={(e: any) =>
                    setValue('active', e.target.checked, { shouldDirty: true })
                  }
                />
              </ToggleOption>
            </div>
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

export default ProductCategoryForm
