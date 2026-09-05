import type { FC } from 'react'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { toast } from 'react-toastify'
import { Form } from 'reactstrap'
import { Tag, Layers, FileText, Info } from 'lucide-react'

import { useAuthentication } from '@/hooks/useAuthentication'
import type { ProductCategoryType } from './product.category.type'
import LiveView from '@/utils/LiveView'
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import { TOAST_OPTIONS } from '@/utils/constants'
import {
  ProductCategoryCreatedDocument,
  useProductCategoriesQuery,
} from '@/gql/graphql'
import { productCategoryZodSchema } from './product.category.validation'
// import type { ProductCategoryZodSchemaType } from './product.category.validation'
import FormSection from '@/@core/components/ui/forms/form-section'
import ToggleOption from '@/@core/components/ui/forms/toggle-option'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'
import { defaultMeta, useAppForm } from '#/hooks/form/form'
import { useSelector } from '@tanstack/react-form'
import { m } from '@/paraglide/messages'

interface FormProps extends BaseFormProps {
  productCategory?: ProductCategoryType
  modal?: NiceModalHandler
}

const ProductCategoryForm: FC<FormProps> = ({
  modal,
  productCategory,
  action,
  ...props
}) => {
  const { enterpriseId } = useAuthentication()

  const { data, loading, subscribeToMore } = useProductCategoriesQuery({
    variables: { id: enterpriseId },
  })

  const {
    handleSubmit,
    AppField,
    reset,
    store,
    AppForm,
    SubmitButton,
    setFieldValue,
  } = useAppForm({
    defaultValues: {
      name: productCategory?.name || '',
      description: productCategory?.description || '',
      active: productCategory ? productCategory.active : true,
      parentId: productCategory ? productCategory.parent : null,
    } as any,
    validators: {
      onChange: productCategoryZodSchema,
    },
    onSubmitMeta: defaultMeta,
    onSubmit({ value, meta }) {
      const id = productCategory ? Number(productCategory.id) : undefined
      const values = productCategoryZodSchema.parse(value)

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
        .then(async ({ data: result }) => {
          reset()
          toast.success(`Catégorie ${result.productCategory.name} ajoutée`, {
            ...TOAST_OPTIONS,
          })

          if (props.popover) {
            messageService.sendMessage(
              'productCategory',
              result.productCategory,
            )
            props.onModalClose?.()
          }
          if (meta.close) {
            modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(
            `Impossible d'ajouter la catégorie: ${formatError(error)}`,
          )
        })
    },
  })

  const active = useSelector(store, (state) => state.values.active)

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
    >
      <div className="grid grid-cols-1 gap-1">
        {/* General Info Section */}
        <FormSection
          title={m.label_generalInfo()}
          description={m.label_productCategoryDetails()}
          icon={<Tag size={18} />}
          color="#7367f0"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            <AppField
              name="name"
              children={(field) => (
                <field.Input
                  label={m.label_name()}
                  required
                  prepend={<Tag size={16} />}
                  placeholder={m.label_productCategoryName()}
                />
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
                <AppField
                  name="parentId"
                  children={(field) => (
                    <field.ControlledSelect
                      label={m.label_parent()}
                      prepend={<Layers size={16} />}
                      options={
                        productCategories
                          ? productCategories.filter(
                              (u: any) => u.id !== productCategory?.id,
                            )
                          : []
                      }
                      onChange={(val: any) => setFieldValue('parentId', val)}
                      getOptionLabel={(o: any) => o.name}
                      getOptionValue={(o: any) => o.id}
                      placeholder={m.label_selectParent()}
                    />
                  )}
                />
              )}
            </LiveView>
          </div>
        </FormSection>

        {/* Additional Details Section */}
        <FormSection
          title={m.label_additionalDetails()}
          icon={<FileText size={18} />}
          color="#ff9f43"
        >
          <div className="space-y-1">
            <AppField
              name="description"
              children={(field) => (
                <field.Input
                  label={m.label_description()}
                  type="textarea"
                  rows={4}
                  prepend={<FileText size={16} />}
                  placeholder={m.label_enterDescription()}
                />
              )}
            />

            <div className="pt-0">
              <ToggleOption
                icon={<Info size={16} />}
                title={m.label_active()}
                description={m.label_activeCategoryDesc()}
                isActive={active}
              >
                <AppField
                  name="active"
                  children={(field) => <field.Switch label="" />}
                />
              </ToggleOption>
            </div>
          </div>
        </FormSection>
      </div>

      <StickyActions>
        <AppForm>
          <SubmitButton
            cancelAction={modal?.hide}
            isSubmitting={props.loading}
            popover={props.popover}
            onSubmit={(_, meta) => handleSubmit(meta)}
          />
        </AppForm>
      </StickyActions>
    </Form>
  )
}

export default ProductCategoryForm
