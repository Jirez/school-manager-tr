import { Form } from 'reactstrap'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  ListOrdered,
  Type,
  CheckCircle,
  FileText,
  Settings,
  ShieldAlert,
} from 'lucide-react'

import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import Input from '@/@core/components/ui/forms/input'
import Switch from '@/@core/components/ui/forms/swith'
import { useAuthentication } from '@/hooks/useAuthentication'
import { TOAST_OPTIONS } from '@/utils/constants'
import { formatError } from '@/utils/ErrorHelper'
import { messageService } from '@/utils/message.service'
import type { DeductionCategoryType } from './deduction.category.type'
import { deductionCategoryValidation } from './deduction.category.validation'
import FormSection from '@/@core/components/ui/forms/form-section'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'
import ToggleOption from '@/@core/components/ui/forms/toggle-option'

interface FormProps extends BaseFormProps {
  category?: DeductionCategoryType
  modal?: NiceModalHandler
}

const DeductionCategoryForm: React.FC<FormProps> = ({
  category,
  modal,
  action,
  ...props
}) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const {
    control,
    handleSubmit,
    getValues,
    formState: { isDirty },
    reset,
    watch,
    setValue,
  } = useForm<DeductionCategoryType>({
    defaultValues: {
      numberOrder: category?.numberOrder || null,
      name: category?.name || '',
      description: category?.description || '',
      active: category ? category.active : true,
      mandatory: category ? category.mandatory : true,
    },
    //@ts-ignore
    resolver: yupResolver(deductionCategoryValidation),
  })

  const onSubmit = (
    event: React.FormEvent<HTMLFormElement>,
    close?: boolean,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      const id = category ? Number(category.id) : undefined

      action({
        variables: {
          category: {
            id: id,
            name: values.name,
            active: values.active,
            mandatory: values.mandatory,
            description: values.description,
            enterpriseId,
            numberOrder: values.numberOrder ? Number(values.numberOrder) : null,
          },
        },
      })
        .then(async ({ data }) => {
          reset()
          toast.success(`Catégorie ${data.deductionCategory.name} ajoutée`, {
            ...TOAST_OPTIONS,
          })
          if (close) {
            modal?.hide()
          }

          if (props.popover) {
            messageService.sendMessage(
              'deductionCategory',
              data.deductionCategory,
            )
            props.onModalClose?.()
          }
        })
        .catch((error) => {
          toast.error(`Impossible d'ajouter la catégorie ${formatError(error)}`)
        })
    })(event)
  }

  return (
    <Form onSubmit={onSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-x-1 gap-y-1">
        <FormSection
          title={
            t('label-deductionCategoryInfo') || 'Informations de la catégorie'
          }
          description={
            t('label-deductionCategoryInfoDesc') ||
            'Détails de base de la catégorie'
          }
          icon={<Settings size={18} />}
          color="#7367f0"
        >
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
              <Input
                name="numberOrder"
                control={control}
                label={t('label-numberOrder')}
                required
                prepend={<ListOrdered size={16} />}
                className="col-span-1"
              />
              <Input
                name="name"
                control={control}
                label={t('label-name')}
                required
                prepend={<Type size={16} />}
                className="md:col-span-2"
              />
            </div>

            <div className="space-y-2">
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

              <ToggleOption
                icon={<ShieldAlert size={16} />}
                title={t('label-mandatory')}
                description={
                  t('label-mandatoryDesc') || 'Déduction obligatoire'
                }
                isActive={watch('mandatory')}
              >
                <Switch
                  name="mandatory"
                  control={control}
                  label=""
                  defaultChecked={getValues('mandatory')}
                  onChange={(e: any) =>
                    setValue('mandatory', e.target.checked, {
                      shouldDirty: true,
                    })
                  }
                />
              </ToggleOption>
            </div>
          </div>
        </FormSection>

        <FormSection
          title={t('label-additionalInfo') || 'Informations complémentaires'}
          description={
            t('label-additionalInfoDesc') || 'Description de la catégorie'
          }
          icon={<FileText size={18} />}
          color="#28c76f"
        >
          <div className="">
            <Input
              name="description"
              control={control}
              label={t('label-description')}
              type="textarea"
              rows={6}
              prepend={<FileText size={16} />}
            />
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

export default DeductionCategoryForm
