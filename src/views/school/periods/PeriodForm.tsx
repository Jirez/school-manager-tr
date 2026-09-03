import { toast } from 'react-toastify'
import type { PeriodType } from '@/views/school/periods/Period.type'
import { Form } from 'reactstrap'
import { useAuthentication } from '@/hooks/useAuthentication'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import type { FC } from 'react'
import { useEffect } from 'react'
import { Calendar, FileText, Hash, MessageSquare, Settings } from 'lucide-react'
import LiveView from '@/utils/LiveView'
import { schoolYearOptions } from '@/utils/select/selectComponents'
import SchoolYearAdd from '@/views/school/schoolYears/SchoolYearAdd'
import dayjs from 'dayjs'
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import { periodSchema } from '@/views/school/periods/period.validation'
// import type { PeriodSchemaType } from '@/views/school/periods/period.validation'
import { TOAST_OPTIONS } from '@/utils/constants'
import {
  SchoolYearCreatedDocument,
  useSchoolYearActiveQuery,
  useSchoolYearsQuery,
} from '@/gql/graphql'
import FormSection from '@/@core/components/ui/forms/form-section'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'
import { defaultMeta, useAppForm } from '#/hooks/form/form'
import { m } from '@/paraglide/messages'

interface PeriodFormProps extends BaseFormProps {
  period?: PeriodType
  modal?: NiceModalHandler
}

const PeriodForm: FC<PeriodFormProps> = ({
  period,
  modal,
  action,
  ...props
}) => {
  const { enterpriseId } = useAuthentication()

  const { data: schoolYearData } = useSchoolYearActiveQuery({
    variables: { schoolId: enterpriseId },
  })

  const { data, loading, subscribeToMore } = useSchoolYearsQuery({
    variables: { id: enterpriseId },
  })

  const {
    handleSubmit,
    AppField,
    reset,
    AppForm,
    SubmitButton,
    setFieldValue,
  } = useAppForm({
    defaultValues: {
      label: period?.label || '',
      label2: period?.label2 || '',
      message: period?.message || '',
      message2: period?.message2 || '',
      startDate: period ? dayjs(period.startDate).toDate() : new Date(),
      endDate: period ? dayjs(period.endDate).toDate() : new Date(),
      numberOrder: period?.numberOrder || '',
      schoolYearId: period ? period.schoolYear : null,
      coefficient: period?.coefficient || 1,
    } as any,
    validators: {
      onChange: periodSchema,
    },
    onSubmitMeta: defaultMeta,
    onSubmit({ value, meta }) {
      const id = period ? Number(period.id) : undefined
      const parsed = periodSchema.parse(value)

      action({
        variables: {
          period: {
            ...parsed,
            id,
            startDate: dayjs(parsed.startDate as any).format('YYYY-MM-DD'),
            endDate: dayjs(parsed.endDate as any).format('YYYY-MM-DD'),
            coefficient: parsed.coefficient ? Number(parsed.coefficient) : null,
            schoolYearId: Number(parsed.schoolYearId?.id),
          },
        },
      })
        .then(async ({ data: result }) => {
          reset()
          toast.success(`Période ${result.period.label} enregistrée`, {
            ...TOAST_OPTIONS,
          })

          if (props.popover) {
            messageService.sendMessage('period', result.period)
            props.onModalClose?.()
          }
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          if (meta.close) {
            modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(`Impossible d'ajouter la période: ${formatError(error)}`)
        })
    },
  })

  useEffect(() => {
    if (!period?.id && schoolYearData?.schoolYear) {
      setFieldValue('schoolYearId', schoolYearData.schoolYear)
    }
  }, [schoolYearData, setFieldValue])

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        // handleSubmit()
      }}
    >
      <div className="space-y-4">
        {/* Basic Information Section */}
        <FormSection
          icon={<Calendar className="w-5 h-5" />}
          title={m.label_basicInfo()}
          description={m.label_periodInfo()}
          color="#7367f0"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
              <LiveView
                document={SchoolYearCreatedDocument}
                singleVar="schoolYear"
                data={data}
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
                        label={m.label_schoolYear()}
                        required={true}
                        loading={loading}
                        options={schoolYears || undefined}
                        getOptionLabel={(option: any) => option.label}
                        getOptionValue={(option: any) => option.id}
                        components={{ Option: schoolYearOptions }}
                        form={<SchoolYearAdd />}
                        formId="schoolYear"
                        optionLabel="label"
                        prepend={<Calendar size={16} />}
                        onChange={(val: any) =>
                          setFieldValue('schoolYearId', val)
                        }
                      />
                    )}
                  />
                )}
              </LiveView>

              <AppField
                name="numberOrder"
                children={(field) => (
                  <field.Input
                    label={m.label_numberOrder()}
                    required={true}
                    prepend={<Hash size={16} />}
                    type="select"
                  >
                    <option value="">{m.label_select()}</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </field.Input>
                )}
              />
            </div>
          </div>
        </FormSection>

        {/* Designations Section */}
        <FormSection
          icon={<FileText className="w-5 h-5" />}
          title={m.label_designation()}
          description={m.label_designationDesc()}
          color="#28c76f"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
              <AppField
                name="label"
                children={(field) => (
                  <field.Input
                    label={m.label_designation()}
                    required={true}
                    prepend={<FileText size={16} />}
                  />
                )}
              />

              <AppField
                name="label2"
                children={(field) => (
                  <field.Input
                    label={m.label_designation2()}
                    prepend={<FileText size={16} />}
                  />
                )}
              />
            </div>
          </div>
        </FormSection>

        {/* Date Range Section */}
        <FormSection
          icon={<Hash className="w-5 h-5" />}
          title={m.label_schedule()}
          description={m.label_scheduleDesc()}
          color="#ff9f43"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
              <AppField
                name="startDate"
                children={(field) => (
                  <field.DatePicker
                    label={m.label_startDate()}
                    required={true}
                  />
                )}
              />

              <AppField
                name="endDate"
                children={(field) => (
                  <field.DatePicker label={m.label_endDate()} required={true} />
                )}
              />
            </div>
          </div>
        </FormSection>

        {/* Settings Section */}
        <FormSection
          icon={<Settings className="w-5 h-5" />}
          title={m.label_settings()}
          description={m.label_periodSettingsDesc()}
          color="#2f8724"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
              <AppField
                name="coefficient"
                children={(field) => (
                  <field.Input
                    label={m.label_coefficient()}
                    type="number"
                    prepend={<Hash size={16} />}
                  />
                )}
              />
            </div>
          </div>
        </FormSection>

        {/* Messages Section */}
        <FormSection
          icon={<MessageSquare className="w-5 h-5" />}
          title={m.label_message()}
          description={m.label_messageDesc()}
          color="#00cfe8"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
              <AppField
                name="message"
                children={(field) => (
                  <field.Input
                    label={m.label_message()}
                    type="textarea"
                    rows={3}
                    prepend={<MessageSquare size={16} />}
                  />
                )}
              />

              <AppField
                name="message2"
                children={(field) => (
                  <field.Input
                    label={m.label_message2()}
                    type="textarea"
                    rows={3}
                    prepend={<MessageSquare size={16} />}
                  />
                )}
              />
            </div>
          </div>
        </FormSection>
      </div>

      {/* Action Buttons */}
      <StickyActions>
        <AppForm>
          <SubmitButton
            cancelAction={modal?.hide}
            popover={props.popover}
            isSubmitting={props.loading}
            onSubmit={(_, meta) => handleSubmit(meta)}
          />
        </AppForm>
      </StickyActions>
    </Form>
  )
}

export default PeriodForm
