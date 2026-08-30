import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useAuthentication } from '@/hooks/useAuthentication'
import type { SubPeriodType } from '@/views/school/subPeriods/SubPeriod.type'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import type { FC } from 'react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Form } from 'reactstrap'
import {
  Calendar,
  FileText,
  Hash,
  MessageSquare,
  Settings,
} from 'react-feather'
import LiveView from '@/utils/LiveView'
import ControlledSelect from '@/@core/components/ui/forms/controlled-select'
import { periodOptions } from '@/utils/select/selectComponents'
import DatePicker from '@/@core/components/ui/forms/date-picker'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import { default as FormItem } from '@/@core/components/ui/forms/input'
import PeriodAdd from '@/views/school/periods/PeriodAdd'
import dayjs from 'dayjs'
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import { yupResolver } from '@hookform/resolvers/yup'
import { subPeriodValidationSchema } from '@/views/school/subPeriods/subPeriod.validation'
import { TOAST_OPTIONS } from '@/utils/constants'
import {
  PeriodCreatedDocument,
  usePeriodsQuery,
  useSchoolByIdQuery,
} from '@/gql/graphql'
import FormSection from '@/@core/components/ui/forms/form-section'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'

interface SubPeriodFormProps extends BaseFormProps {
  subPeriod?: SubPeriodType
  modal?: NiceModalHandler
}

const initialValues: Partial<SubPeriodType> = {
  label: '',
  label2: '',
  startDate: new Date(),
  endDate: new Date(),
  periodId: null,
  numberOrder: undefined,
  message: '',
  message2: '',
  coefficient: 1,
}

const SubPeriodForm: FC<SubPeriodFormProps> = ({
  subPeriod,
  modal,
  action,
  ...props
}) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const { data, loading, subscribeToMore } = usePeriodsQuery({
    variables: { id: enterpriseId },
  })

  const { data: dataSchool } = useSchoolByIdQuery({
    variables: { id: enterpriseId },
  })

  const {
    control,
    handleSubmit,
    formState: { isDirty },
    reset,
    setValue,
  } = useForm<SubPeriodType>({
    mode: 'onBlur',
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
    },
    resolver: yupResolver(subPeriodValidationSchema),
  })

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    close?: boolean,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      const id = subPeriod ? Number(subPeriod.id) : undefined

      action({
        variables: {
          subPeriod: {
            ...values,
            id,
            startDate: dayjs(values.startDate).format('YYYY-MM-DD'),
            endDate: dayjs(values.endDate).format('YYYY-MM-DD'),
            periodId: Number(values.periodId.id),
          },
        },
      })
        .then(async ({ data }) => {
          reset(initialValues)
          toast.success(`Sous-période ${data.subPeriod.label} enregistrée`, {
            ...TOAST_OPTIONS,
          })

          if (props.popover) {
            messageService.sendMessage('subPeriod', data.subPeriod)
            props.onModalClose?.()
          }
          if (close) {
            modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(
            `Impossible d'ajouter la sous-période: ${formatError(error)}`,
          )
        })
    })(event)
  }

  useEffect(() => {
    messageService.getMessage().subscribe((message) => {
      if (message) {
        if (message.name === 'period') {
          setValue('periodId', message.value)
        }
      }
    })
  })

  return (
    <Form onSubmit={onSubmit} className="space-y-6">
      {/* Basic Information Section */}
      <FormSection
        icon={<Calendar className="w-5 h-5" />}
        title="Informations de base"
        description="Période parente et ordre de la sous-période"
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
                <ControlledSelect
                  name="periodId"
                  label={t('label-period')}
                  control={control}
                  required={true}
                  loading={loading}
                  onChange={(val) => setValue('periodId', val)}
                  options={periods || undefined}
                  getOptionLabel={(option) => option.label}
                  getOptionValue={(option) => option.id}
                  components={{ Option: periodOptions }}
                  form={<PeriodAdd />}
                  formId="period"
                  optionLabel="label"
                  formTitle={t('action.add_period')}
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
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              {dataSchool?.schools?.schoolCategory?.includes('PRIMARY') && (
                <>
                  <option value="7">7</option>
                  <option value="8">8</option>
                </>
              )}
            </FormItem>
          </div>
        </div>
      </FormSection>

      {/* Designations Section */}
      <FormSection
        icon={<FileText className="w-5 h-5" />}
        title="Désignations"
        description="Libellés de la sous-période dans les deux langues"
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
        description="Dates de début et de fin de la sous-période"
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
        description="Configuration avancée de la sous-période"
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

export default SubPeriodForm
