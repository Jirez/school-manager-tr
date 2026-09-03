import type { SchoolSectionType } from '@/views/school/schoolSections/SchoolSectionType'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import type { FC } from 'react'
import { toast } from 'react-toastify'
import { Form } from 'reactstrap'
import { messageService } from '@/utils/message.service'
import { useAuthentication } from '@/hooks/useAuthentication'
import LiveView from '@/utils/LiveView'
import LanguageAdd from '@/views/school/languages/LanguageAdd'
import { TOAST_OPTIONS } from '@/utils/constants'
import { LanguageCreatedDocument, useLanguagesQuery } from '@/gql/graphql'
import { Type, Globe, FileText, CheckCircle } from 'lucide-react'
import FormSection from '@/@core/components/ui/forms/form-section'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'
import ToggleOption from '@/@core/components/ui/forms/toggle-option'
import { defaultMeta, useAppForm } from '#/hooks/form/form'
import { useSelector } from '@tanstack/react-form'
import {
  schoolSectionValidation,
  type SchoolSectionSchemaType,
} from '@/views/school/schoolSections/schoolSection.validation'
import { m } from '@/paraglide/messages'

interface SchoolSectionFormProps extends BaseFormProps {
  schoolSection?: SchoolSectionType
  modal?: NiceModalHandler
}

const SchoolSectionForm: FC<SchoolSectionFormProps> = ({
  schoolSection,
  modal,
  action,
  ...props
}) => {
  const { enterpriseId } = useAuthentication()
  const { data, loading, subscribeToMore } = useLanguagesQuery()

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
      name: schoolSection?.name || '',
      active: schoolSection ? schoolSection.active : true,
      languageId: schoolSection ? schoolSection.language : null,
      note: schoolSection?.note || '',
    } as SchoolSectionSchemaType,
    validators: {
      onChange: schoolSectionValidation,
    },
    onSubmitMeta: defaultMeta,
    onSubmit({ value, meta }) {
      const id = schoolSection ? Number(schoolSection.id) : undefined
      const parsed = schoolSectionValidation.parse(value)

      action({
        variables: {
          section: {
            ...parsed,
            id,
            languageId: Number(parsed.languageId?.id),
            schoolId: enterpriseId,
          },
        },
      })
        .then(async ({ data }) => {
          reset()
          toast.success(`Section ${data.schoolSection.name} enregistrée`, {
            ...TOAST_OPTIONS,
          })

          if (props.popover) {
            messageService.sendMessage('schoolSection', data.schoolSection)
            props.onModalClose?.()
          }
          if (meta.close) {
            modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(`Impossible d'ajouter la section: ${error.message}`)
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
      <div className="space-y-4">
        <FormSection
          icon={<Globe className="w-5 h-5" />}
          title={m.label_language()}
          description={m.label_languageInfoDesc()}
          color="#7367f0"
        >
          <div className="space-y-4">
            <LiveView
              document={LanguageCreatedDocument}
              singleVar="language"
              data={data}
              listVar="languages"
              subscribeToMore={subscribeToMore}
              sortField="name"
              triggerUpdate={true}
              enterpriseId={enterpriseId}
            >
              {({ languages }) => (
                <AppField
                  name="languageId"
                  children={(field) => (
                    <field.ControlledSelect
                      label={m.label_mainLanguage()}
                      required={true}
                      prepend={<Globe size={16} />}
                      options={languages || undefined}
                      getOptionLabel={(option: any) => option.name}
                      getOptionValue={(option: any) => option.id}
                      loading={loading}
                      form={<LanguageAdd />}
                      formId="language"
                      optionLabel="name"
                      modalClassName="modal-md"
                      formTitle={m.action_add_language()}
                      onChange={(value: any) =>
                        setFieldValue('languageId', value)
                      }
                    />
                  )}
                />
              )}
            </LiveView>
          </div>
        </FormSection>

        <FormSection
          icon={<Type className="w-5 h-5" />}
          title={m.label_section()}
          description={
            m.label_sectionInfoDesc() || 'Nom et statut de la section'
          }
          color="#28c76f"
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
          </div>
        </FormSection>

        <FormSection
          icon={<FileText className="w-5 h-5" />}
          title={m.label_note()}
          description={m.label_notesDesc()}
          color="#ea5455"
        >
          <div className="space-y-4">
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

export default SchoolSectionForm
