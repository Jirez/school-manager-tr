import type { SchoolYearType } from '@/views/school/schoolYears/SchoolYear.type'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useAuthentication } from '@/hooks/useAuthentication'
import dayjs from 'dayjs'
import { Form } from 'reactstrap'
import { formatError } from '@/utils/ErrorHelper'
import {
  schoolYearSchema,
  type SchoolYearSchemaType,
} from '@/views/school/schoolYears/SchoolYear.validation'
import { messageService } from '@/utils/message.service'
import { TOAST_OPTIONS } from '@/utils/constants'
import {
  Settings,
  Users,
  Layout,
  Type,
  Hash,
  Activity,
  CalendarRange,
  Edit3,
} from 'lucide-react'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'
import FormSection from '@/@core/components/ui/forms/form-section'
import ToggleOption from '@/@core/components/ui/forms/toggle-option'
import { defaultMeta, useAppForm } from '#/hooks/form/form'
import { useSelector } from '@tanstack/react-form'

interface SchoolYearFormProps extends BaseFormProps {
  schoolYear?: SchoolYearType
  loading: boolean
}

const SchoolYearForm: FC<SchoolYearFormProps> = ({
  schoolYear,
  modal,
  action,
  loading,
  ...props
}) => {
  // ** Hooks
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const perioTypeOptions = [
    { value: 'TRIMESTER', label: t('label-trimester') },
    { value: 'SEMESTER', label: t('label-semester') },
  ]

  const {
    handleSubmit,
    reset,
    setFieldValue,
    store,
    AppField,
    AppForm,
    SubmitButton,
  } = useAppForm({
    defaultValues: {
      label: schoolYear?.label || '',
      label2: schoolYear?.label2 || '',
      current: schoolYear ? schoolYear.current : true,
      startDate: schoolYear ? dayjs(schoolYear.startDate).toDate() : new Date(),
      endDate: schoolYear ? dayjs(schoolYear.endDate).toDate() : new Date(),
      ageMax: schoolYear?.ageMax || '',
      ageMin: schoolYear?.ageMin || '',
      cycleCount: schoolYear?.cycleCount || undefined,
      periodType: schoolYear
        ? {
            value: schoolYear.periodType,
            label: perioTypeOptions.find(
              (option) => option.value === schoolYear.periodType,
            )?.label,
          }
        : undefined,
    } as SchoolYearSchemaType,
    onSubmitMeta: defaultMeta,
    validators: {
      onChange: schoolYearSchema,
    },
    onSubmit({ value, meta }) {
      const values = schoolYearSchema.parse(value)
      const id = schoolYear ? Number(schoolYear.id) : undefined

      action({
        variables: {
          schoolYear: {
            ...values,
            id,
            startDate: dayjs(values.startDate).format('YYYY-MM-DD'),
            endDate: dayjs(values.endDate).format('YYYY-MM-DD'),
            ageMin: values.ageMin ? Number(values.ageMin) : null,
            ageMax: values.ageMax ? Number(values.ageMax) : null,
            schoolId: enterpriseId,
            periodType: values.periodType.value,
          },
        },
      })
        .then(async ({ data }) => {
          reset()
          toast.success(`Année scolaire enregistrée`, { ...TOAST_OPTIONS })

          if (props.popover) {
            messageService.sendMessage('schoolYear', data.schoolYear)
            props.onModalClose?.()
          }

          if (meta.close) {
            modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(
            `Impossible d'ajouter l'année scolaire: ${formatError(error)}`,
          )
        })
    },
  })

  const current = useSelector(store, (state) => state.values.current)

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault()
        handleSubmit()
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
        {/* Configuration Section */}
        <FormSection
          title={t('label-configuration') || 'Configuration'}
          description={
            t('label-schoolYearSettingsDesc') ||
            'Configure cycle and period types'
          }
          icon={<Settings size={18} />}
          color="#7367f0"
          className="col-span-full"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
            <AppField
              name="periodType"
              children={(field) => (
                <field.ControlledSelect
                  label={t('label-periodType')}
                  required
                  prepend={<Layout size={16} />}
                  options={perioTypeOptions}
                  placeholder={t('label-select')}
                  onChange={(value) => {
                    setFieldValue('periodType', value)
                  }}
                />
              )}
            />

            <AppField
              name="cycleCount"
              children={(field) => (
                <field.NumericInput
                  label={t('label-cycleCount')}
                  // type="number"
                  required
                  prepend={<Hash size={16} />}
                />
              )}
            />

            <div className="flex flex-col gap-1">
              <ToggleOption
                icon={<Activity size={16} />}
                title={t('label-default')}
                description={
                  t('label-defaultSchoolYearDesc') ||
                  'Make this the active year'
                }
                isActive={current}
              >
                <AppField
                  name="current"
                  children={(field) => <field.Switch label="" />}
                />
              </ToggleOption>
            </div>
          </div>
        </FormSection>

        {/* Labels Section */}
        <FormSection
          title={t('label-designations') || 'Designations'}
          description={
            t('label-schoolYearLabelsDesc') || 'Naming for this academic year'
          }
          icon={<Type size={18} />}
          color="#ff9f43"
        >
          <div className="space-y-1">
            <AppField
              name="label"
              children={(field) => (
                <field.Input
                  label={t('label-designation')}
                  required
                  prepend={<Edit3 size={16} />}
                  placeholder="e.g. Année scolaire 2025-2026"
                />
              )}
            />

            <AppField
              name="label2"
              children={(field) => (
                <field.Input
                  label={t('label-designation2')}
                  required
                  prepend={<Type size={16} />}
                  placeholder="Alternative name"
                />
              )}
            />
          </div>
        </FormSection>

        {/* Dates Section */}
        <FormSection
          title={t('label-dates') || 'Dates'}
          description={
            t('label-schoolYearDatesDesc') || 'Academic calendar range'
          }
          icon={<CalendarRange size={18} />}
          color="#00cfe8"
        >
          <div className="space-y-1">
            <AppField
              name="startDate"
              children={(field) => (
                <field.DatePicker label={t('label-startDate')} required />
              )}
            />

            <AppField
              name="endDate"
              children={(field) => (
                <field.DatePicker label={t('label-endDate')} required />
              )}
            />
          </div>
        </FormSection>

        {/* Age Limits Section */}
        <FormSection
          title={t('label-ageLimits') || 'Age Limits'}
          description={t('label-ageLimitsDesc') || 'Age range for enrollment'}
          icon={<Users size={18} />}
          color="#ea5455"
          className="col-span-full"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            <AppField
              name="ageMin"
              children={(field) => (
                <field.Input
                  label={t('label-ageMin')}
                  type="number"
                  prepend={<Users size={16} className="text-success" />}
                  placeholder="Minimum age"
                />
              )}
            />

            <AppField
              name="ageMax"
              children={(field) => (
                <field.Input
                  label={t('label-ageMax')}
                  type="number"
                  prepend={<Users size={16} className="text-danger" />}
                  placeholder="Maximum age"
                />
              )}
            />
          </div>
        </FormSection>
      </div>

      {/* Action Buttons */}
      <StickyActions>
        <AppForm>
          <SubmitButton
            cancelAction={modal?.hide}
            isSubmitting={loading}
            popover={props.popover}
            onSubmit={(_, meta) => handleSubmit(meta)}
          />
        </AppForm>
      </StickyActions>
    </Form>
  )
}

export default SchoolYearForm
