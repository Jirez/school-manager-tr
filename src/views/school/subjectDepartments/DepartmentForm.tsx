import { useTranslation } from 'react-i18next'
import type { DepartmentType } from '@/views/school/subjectDepartments/Department.type'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { toast } from 'react-toastify'
import type { FC } from 'react'
import { useEffect } from 'react'
import { Form } from 'reactstrap'
import {
  subjectDepartmentSchema,
  type SubjectDepartmentSchemaType,
} from '@/views/school/subjectDepartments/department.validation'
import LiveView from '@/utils/LiveView'
import { useAuthentication } from '@/hooks/useAuthentication'
import SchoolSectionAdd from '@/views/school/schoolSections/SchoolSectionAdd'
import { messageService } from '@/utils/message.service'
import { schoolSectionOptions } from '@/utils/select/selectComponents'
import { formatError } from '@/utils/ErrorHelper'
import { TOAST_OPTIONS } from '@/utils/constants'
import {
  SchoolSectionCreatedDocument,
  useSchoolSectionsQuery,
} from '@/gql/graphql'
import { Building2, FileText, Settings, Type } from 'lucide-react'
import FormSection from '@/@core/components/ui/forms/form-section'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'
import { defaultMeta, useAppForm } from '#/hooks/form/form'

interface DepartmentFormProps extends BaseFormProps {
  department?: DepartmentType
  modal?: NiceModalHandler
}

const DepartmentForm: FC<DepartmentFormProps> = ({
  department,
  modal,
  action,
  ...props
}) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const { data, loading, subscribeToMore } = useSchoolSectionsQuery({
    variables: { id: enterpriseId },
  })

  const { handleSubmit, setFieldValue, AppField, AppForm, SubmitButton } =
    useAppForm({
      defaultValues: {
        name: department?.name || '',
        code: department?.code || '',
        active: department ? department.active : true,
        schoolSectionId: department ? department.schoolSection : null,
        note: department?.note || '',
      } as SubjectDepartmentSchemaType,
      onSubmitMeta: defaultMeta,
      validators: {
        onChange: subjectDepartmentSchema,
      },
      onSubmit({ value, meta }) {
        const values = subjectDepartmentSchema.parse(value)
        const id = department ? Number(department.id) : undefined

        action({
          variables: {
            department: {
              ...values,
              id,
              schoolSectionId: Number(values.schoolSectionId.id),
              schoolId: enterpriseId,
              // code: values.code || null,
            },
          },
        })
          .then(async ({ data }) => {
            //form.resetFields();
            toast.success(
              `Département ${data.subjectDepartment.name} enregistrée`,
              { ...TOAST_OPTIONS },
            )

            if (props.popover) {
              messageService.sendMessage(
                'subjectDepartment',
                data.subjectDepartment,
              )
              props.onModalClose?.()
            }
            if (meta.close) {
              modal?.hide()
            }
          })
          .catch((error) => {
            toast.error(
              `Impossible d'ajouter le département: ${formatError(error)}`,
            )
          })
      },
    })

  useEffect(() => {
    messageService.getMessage().subscribe((message) => {
      if (message) {
        if (message.name === 'schoolSection') {
          setFieldValue('schoolSectionId', message.value)
        }
      }
    })
  })

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault()
        handleSubmit()
      }}
      className="space-y-6"
    >
      {/* Basic Information Section */}
      <FormSection
        icon={<Building2 className="w-5 h-5" />}
        title="Informations de base"
        description="Section scolaire et détails du département"
        color="#7367f0"
      >
        <div className="space-y-4">
          <LiveView
            document={SchoolSectionCreatedDocument}
            singleVar="schoolSection"
            data={data}
            //loading={loading}
            listVar="schoolSections"
            subscribeToMore={subscribeToMore}
            sortField="name"
            triggerUpdate={true}
            enterpriseId={enterpriseId}
          >
            {({ schoolSections }) => (
              <AppField
                name="schoolSectionId"
                children={(field) => (
                  <field.ControlledSelect
                    label={t('label-schoolSection')}
                    required={true}
                    loading={loading}
                    onChange={(val) => setFieldValue('schoolSectionId', val)}
                    options={schoolSections || undefined}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.id}
                    components={{ Option: schoolSectionOptions }}
                    form={<SchoolSectionAdd />}
                    formId="schoolSection"
                    optionLabel="name"
                    formTitle={t('action.add_schoolSection')}
                    isLoading={loading}
                    prepend={<Building2 size={16} />}
                  />
                )}
              />
            )}
          </LiveView>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-1">
            {/* <AppField
              name="code"
              children={(field) => (
                <field.Input label={t('label-code')}
              prepend={<Hash size={16} />} />
              )}
            /> */}
            <AppField
              name="name"
              children={(field) => (
                <field.Input
                  label={t('label-name')}
                  required={true}
                  prepend={<Type size={16} />}
                />
              )}
            />
          </div>
        </div>
      </FormSection>

      {/* Options Section */}
      <FormSection
        icon={<Settings className="w-5 h-5" />}
        title="Options"
        description="Configuration du département"
        color="#2f8724"
      >
        <div className="space-y-4">
          <AppField
            name="active"
            children={(field) => <field.Switch label={t('label-active')} />}
          />
        </div>
      </FormSection>

      {/* Description Section */}
      <FormSection
        icon={<FileText className="w-5 h-5" />}
        title="Description"
        description="Notes et remarques sur le département"
        color="#00cfe8"
      >
        <div className="space-y-4">
          <AppField
            name="note"
            children={(field) => (
              <field.Input
                label={t('label-note')}
                type="textarea"
                rows={3}
                prepend={<FileText size={16} />}
              />
            )}
          />
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

export default DepartmentForm
