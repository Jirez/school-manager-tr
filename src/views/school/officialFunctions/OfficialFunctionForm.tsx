import type { FC } from 'react'
import { toast } from 'react-toastify'
import type { OfficialFunctionType } from '@/views/school/officialFunctions/OfficialFunction.type'
import { Form } from 'reactstrap'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import {
  officialFunctionValidation,
  type OfficialFunctionSchemaType,
} from '@/views/school/officialFunctions/officialFunction.validation'
import { TOAST_OPTIONS } from '@/utils/constants'
import { Type, Hash, FileText, Activity, CheckCircle } from 'lucide-react'
import FormSection from '@/@core/components/ui/forms/form-section'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'
import ToggleOption from '@/@core/components/ui/forms/toggle-option'
import { defaultMeta, useAppForm } from '#/hooks/form/form'
import { useSelector } from '@tanstack/react-form'
import { m } from '@/paraglide/messages'

interface OfficialFunctionFormProps extends BaseFormProps {
  officialFunction?: OfficialFunctionType
  modal?: NiceModalHandler
}

const OfficialFunctionForm: FC<OfficialFunctionFormProps> = ({
  officialFunction,
  modal,
  action,
  ...props
}) => {
  const { handleSubmit, AppField, reset, store, AppForm, SubmitButton } =
    useAppForm({
      defaultValues: {
        name: officialFunction?.name || '',
        prefix: officialFunction?.prefix || '',
        active: officialFunction ? officialFunction.active : true,
        note: officialFunction?.note || '',
      } as OfficialFunctionSchemaType,
      validators: {
        onChange: officialFunctionValidation,
      },
      onSubmitMeta: defaultMeta,
      onSubmit({ value, meta }) {
        const id = officialFunction ? Number(officialFunction.id) : undefined
        const parsed = officialFunctionValidation.parse(value)

        action({ variables: { type: { ...parsed, id } } })
          .then(async ({ data }) => {
            reset()
            toast.success(
              `Type responsable ${data.officialType.name} enregistrée`,
              { ...TOAST_OPTIONS },
            )

            if (props.popover) {
              messageService.sendMessage('officialFunction', data.officialType)
              props.onModalClose?.()
            }
            if (meta.close) {
              modal?.hide()
            }
          })
          .catch((error) => {
            toast.error(
              `Impossible d'ajouter le type de responsable: ${formatError(error)}`,
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
        // handleSubmit()
      }}
    >
      <div className="space-y-4">
        <FormSection
          icon={<Activity className="w-5 h-5" />}
          title={m.label_functionDetails()}
          description={m.label_functionDetailsDesc()}
          color="#7367f0"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
              <AppField
                name="name"
                children={(field) => (
                  <field.Input
                    label={m.label_name()}
                    required={true}
                    prepend={<Type size={16} />}
                  />
                )}
              />

              <AppField
                name="prefix"
                children={(field) => (
                  <field.Input
                    label={m.label_prefix()}
                    required={true}
                    prepend={<Hash size={16} />}
                  />
                )}
              />
            </div>
          </div>
        </FormSection>

        <FormSection
          icon={<FileText className="w-5 h-5" />}
          title={m.label_additionalInfo()}
          description={m.label_additionalInfoDesc()}
          color="#28c76f"
        >
          <div className="space-y-4">
            <ToggleOption
              icon={<CheckCircle size={16} />}
              title={m.label_active()}
              description={m.label_activeDesc()}
              isActive={active}
            >
              <AppField
                name="active"
                children={(field) => <field.Switch label="" />}
              />
            </ToggleOption>

            <AppField
              name="note"
              children={(field) => (
                <field.Input
                  label={m.label_note()}
                  type="textarea"
                  rows={5}
                  prepend={<FileText size={16} />}
                />
              )}
            />
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

export default OfficialFunctionForm
