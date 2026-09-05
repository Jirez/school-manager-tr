import { toast } from 'react-toastify'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import type { FC } from 'react'
import { Tag, GitBranch, AlignLeft, Layers, CheckCircle } from 'lucide-react'

import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import { useAuthentication } from '@/hooks/useAuthentication'
import { supplierCategoryZodSchema } from './supplier.category.validation'
// import type { SupplierCategoryZodSchemaType } from './supplier.category.validation'
import { TOAST_OPTIONS } from '@/utils/constants'
import type { SupplierCategoryType } from './supplier.category.type'
import {
  SupplierCategoryCreatedDocument,
  useSupplierCategoriesQuery,
} from '@/gql/graphql'
import LiveView from '@/utils/LiveView'
import FormSection from '@/@core/components/ui/forms/form-section'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'
import ToggleOption from '@/@core/components/ui/forms/toggle-option'
import { defaultMeta, useAppForm } from '#/hooks/form/form'
import { useSelector } from '@tanstack/react-form'
import { m } from '@/paraglide/messages'
import { Form } from 'reactstrap'

interface SupplierCategoryFormProps extends BaseFormProps {
  supplierCategory?: SupplierCategoryType
  modal?: NiceModalHandler
}

const SupplierCategoryForm: FC<SupplierCategoryFormProps> = ({
  supplierCategory,
  action,
  modal,
  ...props
}) => {
  const { enterpriseId } = useAuthentication()

  const { data, loading, subscribeToMore } = useSupplierCategoriesQuery({
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
      name: supplierCategory?.name || '',
      active: supplierCategory ? supplierCategory.active : true,
      description: supplierCategory?.description || '',
      parentId: supplierCategory ? supplierCategory.parent : null,
    } as any,
    validators: {
      onChange: supplierCategoryZodSchema,
    },
    onSubmitMeta: defaultMeta,
    onSubmit({ value, meta }) {
      const id = supplierCategory ? Number(supplierCategory.id) : undefined
      const values = supplierCategoryZodSchema.parse(value)

      action({
        variables: {
          category: {
            ...values,
            id,
            enterpriseId,
            parentId: !values.parentId ? null : Number(values.parentId.id),
          },
        },
      })
        .then(async ({ data: _data }) => {
          reset()
          toast.success(
            `Catégorie ${_data.supplierCategory.name} enregistrée`,
            {
              ...TOAST_OPTIONS,
            },
          )

          if (props.popover) {
            messageService.sendMessage(
              'supplierCategory',
              _data.supplierCategory,
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
      <FormSection
        icon={<Layers size={20} />}
        title={m.label_category()}
        description={m.label_supplierCategoryInfo()}
        color="#7367f0"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <div className="md:col-span-2">
            <ToggleOption
              icon={<CheckCircle size={16} />}
              title={m.label_active()}
              description={m.label_activeDesc() || 'Catégorie activée'}
              isActive={active}
            >
              <AppField
                name="active"
                children={(field) => <field.Switch label="" />}
              />
            </ToggleOption>
          </div>

          <div className="md:col-span-2">
            <AppField
              name="name"
              children={(field) => (
                <field.Input
                  label={m.label_name()}
                  required={true}
                  prepend={<Tag size={16} />}
                  placeholder={m.placeholder_name()}
                />
              )}
            />
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
                <AppField
                  name="parentId"
                  children={(field) => (
                    <field.ControlledSelect
                      label={m.label_parent()}
                      prepend={<GitBranch size={16} />}
                      options={
                        supplierCategories
                          ? supplierCategories.filter(
                              (u: any) => u.id !== supplierCategory?.id,
                            )
                          : []
                      }
                      onChange={(val: any) => setFieldValue('parentId', val)}
                      getOptionLabel={(o: any) => o.name}
                      getOptionValue={(o: any) => o.id}
                      placeholder={m.placeholder_parent()}
                    />
                  )}
                />
              )}
            </LiveView>
          </div>

          <div className="md:col-span-2">
            <AppField
              name="description"
              children={(field) => (
                <field.Input
                  label={m.label_description()}
                  type="textarea"
                  rows={3}
                  prepend={<AlignLeft size={16} />}
                  placeholder={m.placeholder_description()}
                />
              )}
            />
          </div>
        </div>
      </FormSection>

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

export default SupplierCategoryForm
