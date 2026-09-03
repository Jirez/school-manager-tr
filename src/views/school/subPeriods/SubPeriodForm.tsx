import { toast } from 'react-toastify'
import { useAuthentication } from '@/hooks/useAuthentication'
import type { SubPeriodType } from '@/views/school/subPeriods/SubPeriod.type'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import type { FC } from 'react'
import { Calendar, FileText, Hash, MessageSquare, Settings } from 'lucide-react'
import LiveView from '@/utils/LiveView'
import { periodOptions } from '@/utils/select/selectComponents'
import PeriodAdd from '@/views/school/periods/PeriodAdd'
import dayjs from 'dayjs'
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import { subPeriodValidation } from '@/views/school/subPeriods/subPeriod.validation'
// import type { SubPeriodSchemaType } from '@/views/school/subPeriods/subPeriod.validation'
import { TOAST_OPTIONS } from '@/utils/constants'
import { PeriodCreatedDocument, usePeriodsQuery } from '@/gql/graphql'
import FormSection from '@/@core/components/ui/forms/form-section'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'
import { defaultMeta, useAppForm } from '#/hooks/form/form'
import { m } from '@/paraglide/messages'

interface SubPeriodFormProps extends BaseFormProps {
  subPeriod?: SubPeriodType
  modal?: NiceModalHandler
}

const SubPeriodForm: FC<SubPeriodFormProps> = ({
  subPeriod,
  modal,
  action,
  ...props
}) => {
  const { enterpriseId } = useAuthentication()

  const { data, loading, subscribeToMore } = usePeriodsQuery({
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
      label: subPeriod?.label || '',
      label2: subPeriod?.label2 || '',
      message: subPeriod?.message || '',
      message2: subPeriod?.message2 || '',
      startDate: subPeriod ? dayjs(subPeriod.startDate).toDate() : new Date(),
      endDate: subPeriod ? dayjs(subPeriod.endDate).toDate() : new Date(),
      numberOrder: subPeriod?.numberOrder || '',
      periodId: subPeriod ? subPeriod.period : null,
      coefficient: subPeriod?.coefficient || 1,
    } as any,
    validators: {
      onChange: subPeriodValidation,
    },
    onSubmitMeta: defaultMeta,
    onSubmit({ value, meta }) {
      const id = subPeriod ? Number(subPeriod.id) : undefined
      const parsed = subPeriodValidation.parse(value)

      action({
        variables: {
          subPeriod: {
            ...parsed,
            id,
            startDate: dayjs(parsed.startDate as any).format('YYYY-MM-DD'),
            endDate: dayjs(parsed.endDate as any).format('YYYY-MM-DD'),
            periodId: Number(parsed.periodId?.id),
          },
        },
      })
        .then(async ({ data: result }) => {
          reset()
          toast.success(`Sous-période ${result.subPeriod.label} enregistrée`, {
            ...TOAST_OPTIONS,
          })

          if (props.popover) {
            messageService.sendMessage('subPeriod', result.subPeriod)
            props.onModalClose?.()
          }
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          if (meta.close) {
            modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(
            `Impossible d'ajouter la sous-période: ${formatError(error)}`,
          )
        })
    },
  })

  return (
    <form
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
          description={m.label_subPeriodInfo()}
          color="#7367f0"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
              <LiveView
                document={PeriodCreatedDocument}
                singleVar="period"
                data={data}
                listVar="periods"
                subscribeToMore={subscribeToMore}
                sortField="label"
                triggerUpdate={true}
                enterpriseId={enterpriseId}
              >
                {({ periods }) => (
                  <AppField
                    name="periodId"
                    children={(field) => (
                      <field.ControlledSelect
                        label={m.label_period()}
                        required={true}
                        loading={loading}
                        options={periods || undefined}
                        getOptionLabel={(option: any) => option.label}
                        getOptionValue={(option: any) => option.id}
                        components={{ Option: periodOptions }}
                        form={<PeriodAdd />}
                        formId="period"
                        optionLabel="label"
                        formTitle={m.action_add_period()}
                        prepend={<Calendar size={16} />}
                        onChange={(val: any) => setFieldValue('periodId', val)}
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
                    type="select"
                    prepend={<Hash size={16} />}
                  >
                    <option value="">{m.label_select()}</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
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
          description={m.label_subPeriodSettingsDesc()}
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
    </form>
  )
}

export default SubPeriodForm
