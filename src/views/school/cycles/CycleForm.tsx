import type { FC } from 'react'
import { Form } from 'reactstrap'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import {
  School,
  Repeat,
  Calendar,
  Grid,
  Hash,
  Type,
  Layers,
} from 'lucide-react'

import type { CycleType } from '@/views/school/cycles/Cycle.Type'
import { useAuthentication } from '@/hooks/useAuthentication'
import LiveView from '@/utils/LiveView'
import {
  schoolSectionOptions,
  schoolYearOptions,
} from '@/utils/select/selectComponents'
import SchoolYearAdd from '@/views/school/schoolYears/SchoolYearAdd'
import SchoolSectionAdd from '@/views/school/schoolSections/SchoolSectionAdd'
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import { cycleSchema } from '@/views/school/cycles/cycle.validation'
import type { CycleSchemaType } from '@/views/school/cycles/cycle.validation'
import { TOAST_OPTIONS } from '@/utils/constants'
import {
  SchoolSectionCreatedDocument,
  SchoolYearCreatedDocument,
  useSchoolSectionsQuery,
  useSchoolYearsQuery,
} from '@/gql/graphql'
import FormSection from '@/@core/components/ui/forms/form-section'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'
import { defaultMeta, useAppForm } from '#/hooks/form/form'

interface CycleFormProps extends BaseFormProps {
  cycle?: CycleType
  modal?: NiceModalHandler
  loading: boolean
}

const CycleForm: FC<CycleFormProps> = ({ cycle, action, modal, ...props }) => {
  // ** Hooks
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const { data, loading, subscribeToMore } = useSchoolYearsQuery({
    variables: { id: enterpriseId },
  })

  const {
    data: dataSection,
    loading: loadingSection,
    subscribeToMore: subscribeToMoreSection,
  } = useSchoolSectionsQuery({
    variables: { id: enterpriseId },
  })

  const {
    setFieldValue,
    handleSubmit,
    reset,
    AppField,
    AppForm,
    SubmitButton,
  } = useAppForm({
    defaultValues: {
      numberOrder: cycle?.numberOrder || '',
      name: cycle?.name || '',
      name2: cycle?.name2 || '',
      levelCount: cycle?.levelCount || '',
      schoolYearId: cycle ? cycle.schoolYear : null,
      schoolSectionId: cycle ? cycle.schoolSection : null,
    } as CycleSchemaType,
    onSubmitMeta: defaultMeta,
    validators: {
      onChange: cycleSchema,
    },
    onSubmit({ value, meta }) {
      const values = cycleSchema.parse(value)
      const id = cycle ? Number(cycle.id) : undefined

      action({
        variables: {
          cycle: {
            ...values,
            id,
            schoolYearId: Number(values.schoolYearId.id),
            schoolSectionId: Number(values.schoolSectionId.id),
          },
        },
      })
        .then(async ({ data: result }) => {
          reset()
          toast.success(`Cycle ${result.cycle.name} enregistrée`, {
            ...TOAST_OPTIONS,
          })

          if (props.popover) {
            messageService.sendMessage('cycle', result.cycle)
            props.onModalClose?.()
          }
          if (meta.close) {
            modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(`Impossible d'ajouter le cycle: ${formatError(error)}`)
        })
    },
  })

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault()
        handleSubmit()
      }}
      className="space-y-6"
    >
      {/* School Information Section */}
      <FormSection
        icon={<School className="w-5 h-5" />}
        title="Informations de l'école"
        description="Année scolaire et section"
        color="#7367f0"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LiveView
              document={SchoolYearCreatedDocument}
              singleVar="schoolYear"
              data={data}
              loading={loading}
              listVar="schoolYears"
              subscribeToMore={subscribeToMore}
              sortField="label"
              triggerUpdate={true}
              enterpriseId={enterpriseId}
            >
              {({ schoolYears }) => (
                <AppField
                  name="schoolYearId"
                  children={(field) => (
                    <field.ControlledSelect
                      label={t('label-schoolYear')}
                      loading={loading}
                      onChange={(val) => setFieldValue('schoolYearId', val)}
                      options={schoolYears || undefined}
                      getOptionLabel={(option) => option.label}
                      getOptionValue={(option) => option.id}
                      components={{ Option: schoolYearOptions }}
                      form={<SchoolYearAdd />}
                      formId="schoolYear"
                      optionLabel="label"
                      formTitle={t('action.add_schoolYear')}
                      prepend={<Calendar size={16} />}
                    />
                  )}
                />
              )}
            </LiveView>

            <LiveView
              document={SchoolSectionCreatedDocument}
              singleVar="schoolSection"
              data={dataSection}
              loading={loadingSection}
              listVar="schoolSections"
              subscribeToMore={subscribeToMoreSection}
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
                      loading={loadingSection}
                      onChange={(val) => setFieldValue('schoolSectionId', val)}
                      options={schoolSections || undefined}
                      getOptionLabel={(option) => option.name}
                      getOptionValue={(option) => option.id}
                      components={{ Option: schoolSectionOptions }}
                      form={<SchoolSectionAdd />}
                      formId="schoolSection"
                      optionLabel="name"
                      formTitle={t('action.add_schoolSection')}
                      prepend={<Grid size={16} />}
                    />
                  )}
                />
              )}
            </LiveView>
          </div>
        </div>
      </FormSection>

      {/* Cycle Details Section */}
      <FormSection
        icon={<Repeat className="w-5 h-5" />}
        title="Détails du cycle"
        description="Nom et ordre du cycle"
        color="#28c76f"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            <AppField
              name="numberOrder"
              children={(field) => (
                <field.Input
                  label={t('label-numberOrder')}
                  required
                  prepend={<Hash size={16} />}
                />
              )}
            />

            <AppField
              name="name"
              children={(field) => (
                <field.Input
                  label={t('label-designation')}
                  required
                  prepend={<Type size={16} />}
                />
              )}
            />

            <AppField
              name="name2"
              children={(field) => (
                <field.Input
                  label={t('label-designation2')}
                  prepend={<Type size={16} />}
                />
              )}
            />

            <AppField
              name="levelCount"
              children={(field) => (
                <field.Input
                  label={t('label-levelCount')}
                  prepend={<Layers size={16} />}
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

export default CycleForm
