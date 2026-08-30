import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import type { OfficialFunctionType } from '@/views/school/officialFunctions/OfficialFunction.type'
import { Form } from 'reactstrap'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import Switch from '@/@core/components/ui/forms/swith'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import { yupResolver } from '@hookform/resolvers/yup'
import { officialFunctionValidation } from '@/views/school/officialFunctions/officialFunction.validation'
import { TOAST_OPTIONS } from '@/utils/constants'
import { Type, Hash, FileText, Activity } from 'lucide-react'
import { default as FormItem } from '@/@core/components/ui/forms/input'
import FormSection from '@/@core/components/ui/forms/form-section'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'

interface OfficialFunctionFormProps extends BaseFormProps {
  officialFunction?: OfficialFunctionType
  modal?: NiceModalHandler
}

const initialValues: Partial<OfficialFunctionType> = {
  name: '',
  prefix: '',
  active: true,
  note: '',
}

const OfficialFunctionForm: FC<OfficialFunctionFormProps> = ({
  officialFunction,
  modal,
  action,
  ...props
}) => {
  const { t } = useTranslation()

  const {
    control,
    handleSubmit,
    formState: { isDirty },
    reset,
    getValues,
  } = useForm<OfficialFunctionType>({
    defaultValues: {
      name: officialFunction?.name || '',
      prefix: officialFunction?.prefix || '',
      active: officialFunction ? officialFunction.active : true,
      note: officialFunction?.note || '',
    },
    resolver: yupResolver(officialFunctionValidation),
  })

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    close?: boolean,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      const id = officialFunction ? Number(officialFunction.id) : undefined

      action({ variables: { type: { ...values, id } } })
        .then(async ({ data }) => {
          reset(initialValues)
          toast.success(
            `Type responsable ${data.officialType.name} enregistrée`,
            { ...TOAST_OPTIONS },
          )

          if (props.popover) {
            messageService.sendMessage('officialFunction', data.officialType)
            props.onModalClose?.()
          }
          if (close) {
            modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(
            `Impossible d'ajouter le type de responsable: ${formatError(error)}`,
          )
        })
    })(event)
  }

  return (
    <Form onSubmit={onSubmit} className="space-y-1">
      <FormSection
        icon={<Activity className="w-5 h-5" />}
        title={t('label-functionDetails') || 'Détails de la fonction'}
        description="Nom et préfixe de la fonction"
        color="#7367f0"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            <FormItem
              name="name"
              label={t('label-name')}
              control={control}
              required
              prepend={<Type size={16} />}
              className="w-full md:w-8/12"
            />

            <FormItem
              name="prefix"
              label={t('label-prefix')}
              control={control}
              required
              prepend={<Hash size={16} />}
              className="w-full md:w-4/12"
            />
          </div>
        </div>
      </FormSection>

      <FormSection
        icon={<FileText className="w-5 h-5" />}
        title={t('label-additionalInfo') || 'Informations complémentaires'}
        description="Statut et notes"
        color="#28c76f"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            <Switch
              name="active"
              label={t('label-active')}
              control={control}
              defaultChecked={getValues('active')}
            />

            <FormItem
              name="note"
              label={t('label-note')}
              control={control}
              type="textarea"
              prepend={<FileText size={16} />}
            />
          </div>
        </div>
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

export default OfficialFunctionForm
