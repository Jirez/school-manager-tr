import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import type { FC } from 'react'
import Input from '@/@core/components/ui/forms/input'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import Switch from '@/@core/components/ui/forms/swith'
import FormSection from '@/@core/components/ui/forms/form-section'
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import { useAuthentication } from '@/hooks/useAuthentication'
import { yupResolver } from '@hookform/resolvers/yup'
import { supplierCategoryValidation } from './supplier.category.validation'
import { TOAST_OPTIONS } from '@/utils/constants'
import type { SupplierCategoryType } from './supplier.category.type'
import {
  SupplierCategoryCreatedDocument,
  useSupplierCategoriesQuery,
} from '@/gql/graphql'
import LiveView from '@/utils/LiveView'
import ControlledSelect from '@/@core/components/ui/forms/controlled-select'
import { Tag, GitBranch, AlignLeft, Layers, CheckCircle } from 'lucide-react'
import ToggleOption from '@/@core/components/ui/forms/toggle-option'

interface SupplierCategoryFormProps extends BaseFormProps {
  supplierCategory?: SupplierCategoryType
  modal?: NiceModalHandler
}

const initialValues: Partial<SupplierCategoryType> = {
  name: '',
  active: true,
  description: '',
  parentId: null,
}

const SupplierCategoryForm: FC<SupplierCategoryFormProps> = ({
  supplierCategory,
  action,
  modal,
  ...props
}) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const {
    control,
    handleSubmit,
    formState: { isDirty },
    reset,
    getValues,
    setValue,
    watch,
  } = useForm<SupplierCategoryType>({
    defaultValues: {
      name: supplierCategory?.name || '',
      active: supplierCategory ? supplierCategory.active : true,
      description: supplierCategory?.description || '',
      parentId: supplierCategory ? supplierCategory.parent : null,
    },
    resolver: yupResolver(supplierCategoryValidation),
  })

  const { data, loading, subscribeToMore } = useSupplierCategoriesQuery({
    variables: { id: enterpriseId },
  })

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    close?: boolean,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      const id = supplierCategory ? Number(supplierCategory.id) : undefined

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
        .then(async ({ data }) => {
          reset(initialValues)
          toast.success(
            t('message-supplierCategorySaved', {
              name: data.supplierCategory.name,
            }),
            {
              ...TOAST_OPTIONS,
            },
          )

          if (props.popover) {
            messageService.sendMessage(
              'supplierCategory',
              data.supplierCategory,
            )
            props.onModalClose?.()
          }
          if (close) {
            modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(
            t('message-supplierCategorySaveError', {
              error: formatError(error),
            }),
          )
        })
    })(event)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <FormSection
        icon={<Layers size={20} />}
        title={t('label-category')}
        description={t('label-supplierCategoryInfo')}
        color="#7367f0"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <div className="md:col-span-2">
            <ToggleOption
              icon={<CheckCircle size={16} />}
              title={t('label-active')}
              description={t('label-activeDesc') || 'Catégorie activée'}
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
          </div>

          <div className="md:col-span-2">
            <Input
              name="name"
              label={t('label-name')}
              control={control}
              required={true}
              prepend={<Tag size={16} />}
              placeholder={t('placeholder-name')}
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
                <ControlledSelect
                  control={control}
                  name="parentId"
                  label={t('label-parent')}
                  prepend={<GitBranch size={16} />}
                  options={
                    supplierCategories
                      ? supplierCategories.filter(
                          (u: any) => u.id !== supplierCategory?.id,
                        )
                      : []
                  }
                  onChange={(val) => setValue('parentId', val)}
                  getOptionLabel={(o) => o.name}
                  getOptionValue={(o) => o.id}
                  placeholder={t('placeholder-parent')}
                />
              )}
            </LiveView>
          </div>

          <div className="md:col-span-2">
            <Input
              name="description"
              label={t('label-description')}
              control={control}
              type="textarea"
              rows={3}
              prepend={<AlignLeft size={16} />}
              placeholder={t('placeholder-description')}
            />
          </div>
        </div>
      </FormSection>

      <ActionButtons
        cancelAction={modal?.hide}
        isSubmitting={props.loading}
        popover={props.popover}
        dirty={isDirty}
        onSubmit={onSubmit}
      />
    </form>
  )
}

export default SupplierCategoryForm
