import { toast } from 'react-toastify'
import { Form } from 'reactstrap'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import type { FC } from 'react'
import { Globe, CheckCircle, FileText } from 'lucide-react'

import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import { TOAST_OPTIONS } from '@/utils/constants'
import type { LanguageType } from './Language.type'
import {
  languageValidation,
  type LanguageSchemaType,
} from './language.validation'
import FormSection from '@/@core/components/ui/forms/form-section'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'
import ToggleOption from '@/@core/components/ui/forms/toggle-option'
import { defaultMeta, useAppForm } from '#/hooks/form/form'
import { useSelector } from '@tanstack/react-form'
import { m } from '@/paraglide/messages'

interface LanguageFormProps extends BaseFormProps {
  language?: LanguageType
  modal?: NiceModalHandler
}

const LanguageForm: FC<LanguageFormProps> = ({
  language,
  action,
  modal,
  ...props
}) => {
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
      code: language?.code || {},
      name: language?.name || '',
      active: language ? language.active : true,
      description: language?.description || '',
    } as LanguageSchemaType,
    validators: {
      onChange: languageValidation,
    },
    onSubmitMeta: defaultMeta,
    onSubmit({ value, meta }) {
      const id = language?.id
      const values = languageValidation.parse(value)

      action({
        variables: {
          language: {
            ...values,
            id,
            description: values.description || null,
          },
        },
      })
        .then(async ({ data }) => {
          reset()
          toast.success(`Langue ${data.language.name} enregistrée`, {
            ...TOAST_OPTIONS,
          })

          if (props.popover) {
            messageService.sendMessage('language', data.language)
            props.onModalClose?.()
          }
          if (meta.close) {
            modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(`Impossible d'ajouter la langue: ${formatError(error)}`)
        })
    },
  })

  const active = useSelector(store, (state) => state.values.active)

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault()
        handleSubmit()
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-1 gap-x-1 gap-y-1">
        <FormSection
          title={m.label_languageInfo()}
          description={m.label_languageInfoDesc()}
          icon={<Globe size={18} />}
          color="#7367f0"
        >
          <div className="space-y-3">
            <AppField
              name="code"
              children={(field) => (
                <field.ControlledSelect
                  label={m.label_code()}
                  required={true}
                  prepend={<Globe size={16} />}
                  options={[
                    { value: 'EN', label: m.label_english() },
                    { value: 'FR', label: m.label_french() },
                  ]}
                  onChange={(value) => {
                    setFieldValue('code', value)
                  }}
                />
              )}
            />

            <AppField
              name="name"
              children={(field) => (
                <field.Input
                  label={m.label_name()}
                  required={true}
                  prepend={<Globe size={16} />}
                />
              )}
            />

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
          </div>
        </FormSection>

        <FormSection
          title={m.label_additionalInfo()}
          description={m.label_additionalInfoDesc()}
          icon={<FileText size={18} />}
          color="#28c76f"
        >
          <div className="">
            <AppField
              name="description"
              children={(field) => (
                <field.Input
                  label={m.label_description()}
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

export default LanguageForm
