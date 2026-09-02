import type { FC } from 'react'
import { useEffect } from 'react'
import { Form } from 'reactstrap'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import {
  BookOpen,
  Settings,
  FileText,
  CheckCircle,
  CalendarDays,
  Hash,
  Type,
  Tag,
} from 'lucide-react'

import type { Subject } from '@/views/school/subjects/Subject.type'
import { useAuthentication } from '@/hooks/useAuthentication'
import LiveView from '@/utils/LiveView'
import { departmentOptions } from '@/utils/select/selectComponents'
import { formatError } from '@/utils/ErrorHelper'
import { messageService } from '@/utils/message.service'
import DepartmentAdd from '@/views/school/subjectDepartments/DepartmentAdd'
import { TOAST_OPTIONS } from '@/utils/constants'
import {
  SubjectDepartmentCreatedDocument,
  useSubjectDepartmentsQuery,
} from '@/gql/graphql'
import FormSection from '@/@core/components/ui/forms/form-section'
import ToggleOption from '@/@core/components/ui/forms/toggle-option'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'
import { defaultMeta, useAppForm } from '#/hooks/form/form'
import { useSelector } from '@tanstack/react-form'
import { subjectSchema, type SubjectSchemaType } from './subject.validation'
import { m } from '@/paraglide/messages'

interface SubjectFormProps extends BaseFormProps {
  subject?: Subject
  modal?: NiceModalHandler
  loading: boolean
}

const SubjectForm: FC<SubjectFormProps> = ({
  subject,
  modal,
  action,
  ...props
}) => {
  const { enterpriseId } = useAuthentication()
  const { t } = useTranslation()

  const {
    data,
    loading: loadingDepartment,
    subscribeToMore,
  } = useSubjectDepartmentsQuery({
    variables: { id: enterpriseId },
  })

  const {
    reset,
    handleSubmit,
    AppField,
    AppForm,
    SubmitButton,
    setFieldValue,
    store,
  } = useAppForm({
    defaultValues: {
      code: subject?.code || '',
      name: subject?.name || '',
      displayName: subject?.displayName || '',
      active: subject ? subject.active : true,
      subjectDepartmentId: subject ? subject.subjectDepartment : undefined,
      showInTimeTable: subject ? subject.showInTimeTable : true,
      note: subject?.note || '',
    } as SubjectSchemaType,
    validators: {
      onChange: subjectSchema,
    },
    onSubmitMeta: defaultMeta,
    onSubmit({ value, meta }) {
      const values = subjectSchema.parse(value)
      const id = subject ? Number(subject.id) : undefined

      action({
        variables: {
          subject: {
            ...values,
            id,
            subjectDepartmentId: Number(values.subjectDepartmentId.id),
          },
        },
      })
        .then(async ({ data }) => {
          reset()
          toast.success(`Matière ${data.subject.name} enregistrée`, {
            ...TOAST_OPTIONS,
          })
          props.refetch?.()

          if (props.popover) {
            messageService.sendMessage('subject', data.subject)
            props.onModalClose?.()
          }

          if (meta.close) {
            modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(
            `Impossible d'ajouter la matière: ${formatError(error)}`,
            {},
          )
        })
    },
  })

  // Watch toggle values for visual feedback
  const active = useSelector(store, (state) => state.values.active)
  const showInTimeTable = useSelector(
    store,
    (state) => state.values.showInTimeTable,
  )

  useEffect(() => {
    const subscription = messageService.getMessage().subscribe((message) => {
      if (message) {
        if (message.name === 'subjectDepartment') {
          setFieldValue('subjectDepartmentId', message.value)
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [setFieldValue])

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault()
        handleSubmit()
      }}
    >
      <div className="flex flex-col gap-1">
        {/* Basic Information Section */}
        <FormSection
          icon={<BookOpen className="w-4 h-4" />}
          title="Informations"
          description="Détails généraux de la matière"
          color="#7367f0"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-1">
            {/* Department Selection */}
            <div className="md:col-span-12">
              <LiveView
                document={SubjectDepartmentCreatedDocument}
                singleVar="subjectDepartment"
                data={data}
                listVar="subjectDepartments"
                subscribeToMore={subscribeToMore}
                triggerUpdate={true}
                enterpriseId={enterpriseId}
              >
                {({ subjectDepartments }) => (
                  <AppField
                    name="subjectDepartmentId"
                    children={(field) => (
                      <field.ControlledSelect
                        label={m.department()}
                        required={true}
                        onChange={(value) =>
                          setFieldValue('subjectDepartmentId', value)
                        }
                        options={subjectDepartments || undefined}
                        getOptionLabel={(option: any) => option.name}
                        getOptionValue={(option: any) => option.id}
                        components={{ Option: departmentOptions }}
                        form={<DepartmentAdd />}
                        formId="subjectDepartment"
                        optionLabel="name"
                        isLoading={loadingDepartment}
                        formTitle={t('action.add_department')}
                        placeholder={t('label-selectPlaceholder')}
                      />
                    )}
                  />
                )}
              </LiveView>
            </div>

            {/* Code */}
            <div className="md:col-span-4">
              <AppField
                name="code"
                children={(field) => (
                  <field.Input label={m.code()} prepend={<Hash size={16} />} />
                )}
              />
            </div>

            {/* Name */}
            <div className="md:col-span-8">
              <AppField
                name="name"
                children={(field) => (
                  <field.Input
                    label={m.subject_name()}
                    required={true}
                    prepend={<Tag size={16} />}
                    onChange={(event) => {
                      setFieldValue('name', event.target.value)
                      if (!subject) {
                        setFieldValue('displayName', event.target.value)
                      }
                    }}
                  />
                )}
              />
            </div>

            {/* Display Name */}
            <div className="md:col-span-12">
              <AppField
                name="displayName"
                children={(field) => (
                  <field.Input
                    label={m.label_displayName()}
                    prepend={<Type size={16} />}
                  />
                )}
              />
            </div>
          </div>
        </FormSection>

        {/* Settings Section - Grid Layout for Compactness */}
        <FormSection
          icon={<Settings className="w-4 h-4" />}
          title="Paramètres"
          description="Configuration"
          color="#ff9f43"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            <ToggleOption
              icon={<CheckCircle className="w-4 h-4" />}
              title={m.label_active()}
              description="Disponible pour l'évaluation"
              isActive={active}
            >
              <AppField
                name="active"
                children={(field) => <field.Switch label="" />}
              />
            </ToggleOption>

            <ToggleOption
              icon={<CalendarDays className="w-4 h-4" />}
              title={m.label_showInTimeTable()}
              description="Afficher dans l'horaire"
              isActive={showInTimeTable}
            >
              <AppField
                name="showInTimeTable"
                children={(field) => <field.Switch label="" />}
              />
            </ToggleOption>
          </div>
        </FormSection>

        {/* Notes Section */}
        <FormSection
          icon={<FileText className="w-4 h-4" />}
          title={m.label_notes()}
          description="Description additionnelle"
          color="#00cfe8"
        >
          <AppField
            name="note"
            children={(field) => (
              <field.Input
                label={''}
                type="textarea"
                placeholder="Ajouter une note..."
              />
            )}
          />
        </FormSection>
      </div>

      {/* Action Buttons */}
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

export default SubjectForm
