import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import type { PeriodType } from '@/views/school/periods/Period.type'
import { Form } from 'reactstrap'
import { useAuthentication } from '@/hooks/useAuthentication'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import type { FC } from 'react'
import {
  Calendar,
  FileText,
  Hash,
  MessageSquare,
  Settings,
} from 'react-feather'
import LiveView from '@/utils/LiveView'
import ControlledSelect from '@/@core/components/ui/forms/controlled-select'
import { schoolYearOptions } from '@/utils/select/selectComponents'
import SchoolYearAdd from '@/views/school/schoolYears/SchoolYearAdd'
import { default as FormItem } from '@/@core/components/ui/forms/input'
import DatePicker from '@/@core/components/ui/forms/date-picker'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import dayjs from 'dayjs'
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import { yupResolver } from '@hookform/resolvers/yup'
import { periodValidationSchema } from '@/views/school/periods/period.validation'
import { TOAST_OPTIONS } from '@/utils/constants'
import { SchoolYearCreatedDocument, useSchoolYearsQuery } from '@/gql/graphql'
import FormSection from '@/@core/components/ui/forms/form-section'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'

interface PeriodFormProps extends BaseFormProps {
  period?: PeriodType
  modal?: NiceModalHandler
}

const initialValues: Partial<PeriodType> = {
  label: '',
  label2: '',
  startDate: new Date(),
  endDate: new Date(),
  schoolYearId: null,
  numberOrder: undefined,
  message: '',
  message2: '',
  coefficient: 1,
}

const PeriodForm: FC<PeriodFormProps> = ({
  period,
  modal,
  action,
  ...props
}) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const { data, loading, subscribeToMore } = useSchoolYearsQuery({
    variables: { id: enterpriseId },
  })

  const {
    control,
    handleSubmit,
    formState: { isDirty },
    setValue,
    reset,
  } = useForm<PeriodType>({
    mode: 'onBlur',
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
    },
    resolver: yupResolver(periodValidationSchema),
  })

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    close?: boolean,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      const id = period ? Number(period.id) : undefined

      action({
        variables: {
          period: {
            ...values,
            id,
            startDate: dayjs(values.startDate).format('YYYY-MM-DD'),
            endDate: dayjs(values.endDate).format('YYYY-MM-DD'),
            coefficient: values.coefficient ? Number(values.coefficient) : null,
            schoolYearId: Number(values.schoolYearId.id),
          },
        },
      })
        .then(async ({ data }) => {
          reset(initialValues)
          toast.success(`Période ${data.period.label} enregistrée`, {
            ...TOAST_OPTIONS,
          })

          if (props.popover) {
            messageService.sendMessage('period', data.period)
            props.onModalClose?.()
          }
          if (close) {
            modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(`Impossible d'ajouter la période: ${formatError(error)}`)
        })
    })(event)
  }

  return (
    <Form onSubmit={onSubmit} className="space-y-6">
      {/* Basic Information Section */}
      <FormSection
        icon={<Calendar className="w-5 h-5" />}
        title="Informations de base"
        description="Année scolaire et ordre de la période"
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
                <ControlledSelect
                  name="schoolYearId"
                  label={t('label-schoolYear')}
                  control={control}
                  required={true}
                  loading={loading}
                  onChange={(val) => setValue('schoolYearId', val)}
                  options={schoolYears || undefined}
                  getOptionLabel={(option) => option.label}
                  getOptionValue={(option) => option.id}
                  components={{ Option: schoolYearOptions }}
                  form={<SchoolYearAdd />}
                  formId="schoolYear"
                  optionLabel="label"
                  prepend={<Calendar size={16} />}
                />
              )}
            </LiveView>

            <FormItem
              type="select"
              name="numberOrder"
              control={control}
              label={t('label-numberOrder')}
              required
              prepend={<Hash size={16} />}
            >
              <option value="">{t('label-select')}</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </FormItem>
          </div>
        </div>
      </FormSection>

      {/* Designations Section */}
      <FormSection
        icon={<FileText className="w-5 h-5" />}
        title="Désignations"
        description="Libellés de la période dans les deux langues"
        color="#28c76f"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            <FormItem
              name="label"
              label={t('label-designation')}
              control={control}
              required={true}
              prepend={<FileText size={16} />}
            />

            <FormItem
              name="label2"
              label={t('label-designation2')}
              control={control}
              required={true}
              prepend={<FileText size={16} />}
            />
          </div>
        </div>
      </FormSection>

      {/* Date Range Section */}
      <FormSection
        icon={<Hash className="w-5 h-5" />}
        title="Période"
        description="Dates de début et de fin de la période"
        color="#ff9f43"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            <DatePicker
              name="startDate"
              label={t('label-startDate')}
              control={control}
              required={true}
            />

            <DatePicker
              name="endDate"
              label={t('label-endDate')}
              control={control}
              required={true}
            />
          </div>
        </div>
      </FormSection>

      {/* Settings Section */}
      <FormSection
        icon={<Settings className="w-5 h-5" />}
        title="Paramètres"
        description="Configuration avancée de la période"
        color="#2f8724"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            <FormItem
              name="coefficient"
              label={t('label-coefficient')}
              control={control}
              type="number"
              prepend={<Hash size={16} />}
            />
          </div>
        </div>
      </FormSection>

      {/* Messages Section */}
      <FormSection
        icon={<MessageSquare className="w-5 h-5" />}
        title="Messages"
        description="Messages à afficher sur les bulletins"
        color="#00cfe8"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            <FormItem
              name="message"
              label={t('label-message')}
              control={control}
              type="textarea"
              prepend={<MessageSquare size={16} />}
            />

            <FormItem
              name="message2"
              label={t('label-message2')}
              control={control}
              type="textarea"
              prepend={<MessageSquare size={16} />}
            />
          </div>
        </div>
      </FormSection>

      {/* Action Buttons */}
      <StickyActions>
        <ActionButtons
          cancelAction={modal?.hide}
          popover={props.popover}
          isSubmitting={props.loading}
          dirty={isDirty}
          onSubmit={onSubmit}
        />
      </StickyActions>
    </Form>
  )
}

export default PeriodForm
