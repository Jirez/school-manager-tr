import React from 'react'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { Form } from 'reactstrap'
import { yupResolver } from '@hookform/resolvers/yup'

import ControlledSelect from '@/@core/components/ui/forms/controlled-select'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import Switch from '@/@core/components/ui/forms/swith'
import Input from '@/@core/components/ui/forms/input'
import {
  Tag,
  Layers,
  Settings,
  CheckCircle,
  FileText,
  AlignLeft,
} from 'lucide-react'
import FormSection from '@/@core/components/ui/forms/form-section'
import ToggleOption from '@/@core/components/ui/forms/toggle-option'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'
import { useAuthentication } from '@/hooks/useAuthentication'
import { TOAST_OPTIONS } from '@/utils/constants'
import { formatError } from '@/utils/ErrorHelper'
import LiveView from '@/utils/LiveView'
import { messageService } from '@/utils/message.service'
import {
  CustomerCategoryCreatedDocument,
  useCustomerCategoriesQuery,
} from '@/gql/graphql'
import type { CustomerCategoryType } from './customer.category.type'
import { customerCategoryValidation } from './customer.category.validation'

interface FormProps extends BaseFormProps {
  customerCategory?: CustomerCategoryType
  modal?: NiceModalHandler
}

const initialValues: Partial<CustomerCategoryType> = {
  name: '',
  active: true,
  description: '',
  parentId: null,
}

const CustomerCategoryForm: React.FC<FormProps> = ({
  customerCategory,
  modal,
  action,
  ...props
}) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const { data, loading, subscribeToMore } = useCustomerCategoriesQuery({
    variables: { id: enterpriseId },
  })

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { isDirty },
    reset,
    watch,
  } = useForm<CustomerCategoryType>({
    defaultValues: {
      name: customerCategory?.name || '',
      description: customerCategory?.description || '',
      active: customerCategory ? customerCategory.active : true,
      parentId: customerCategory ? customerCategory.parent : null,
    },
    resolver: yupResolver(customerCategoryValidation),
  })

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    close?: boolean,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      const id = customerCategory ? Number(customerCategory.id) : undefined

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
          reset(initialValues)
          toast.success(`Catégorie ${data.customerCategory.name} ajoutée`, {
            ...TOAST_OPTIONS,
          })
          if (props.popover) {
            messageService.sendMessage(
              'customerCategory',
              data.customerCategory,
            )
            props.onModalClose?.()
          }

          if (close) {
            modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(
            `Impossible d'ajouter la catégorie : ${formatError(error)}`,
          )
        })
    })(event)
  }

  /* useEffect(() => {
        messageService.getMessage().subscribe(message => {
            if (message) {

                if (message.name === "priceGroup") {
                    setValue('priceGroupId', message.value);
                }
            }
        })
    }, [messageService]); */

  return (
    <Form onSubmit={onSubmit} className="space-y-1">
      <FormSection
        icon={<Tag size={20} />}
        title={
          t('label-customerCategoryInformation') ||
          'Informations de la catégorie'
        }
        description={
          t('label-customerCategoryInformationDesc') ||
          'Détails généraux et parenté'
        }
        color="#7367f0"
      >
        <div className="grid grid-cols-1 md:grid-cols-1 gap-1">
          <Input
            name="name"
            control={control}
            label={t('label-name')}
            required
            prepend={<Tag size={16} />}
            placeholder={t('placeholder-name')}
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
                name="parentId"
                label={t('label-parent')}
                prepend={<Layers size={16} />}
                options={
                  customerCategories
                    ? customerCategories.filter(
                        (u: any) => u.id !== customerCategory?.id,
                      )
                    : []
                }
                onChange={(val) =>
                  setValue('parentId', val, { shouldDirty: true })
                }
                getOptionLabel={(o) => o.name}
                getOptionValue={(o) => o.id}
                placeholder={t('label-selectParent')}
              />
            )}
          </LiveView>
        </div>
      </FormSection>

      <FormSection
        icon={<Settings size={20} />}
        title={t('label-status') || 'Statut'}
        description={t('label-statusDesc') || "Configuration de l'état"}
        color="#28c76f"
      >
        <ToggleOption
          icon={<CheckCircle size={16} />}
          title={t('label-active')}
          description={
            t('label-activeCustomerCategoryDesc') || 'Catégorie activée'
          }
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

      <FormSection
        icon={<FileText size={20} />}
        title={t('label-description') || 'Description'}
        description={t('label-descriptionDesc') || 'Notes supplémentaires'}
        color="#ff9f43"
      >
        <Input
          name="description"
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

export default CustomerCategoryForm
