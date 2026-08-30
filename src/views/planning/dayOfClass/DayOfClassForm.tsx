import { Form } from 'reactstrap'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Calendar, Clock, Settings, CheckCircle } from 'lucide-react'

import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import Input from '@/@core/components/ui/forms/input'
import Switch from '@/@core/components/ui/forms/swith'
import { useAuthentication } from '@/hooks/useAuthentication'
import { TOAST_OPTIONS } from '@/utils/constants'
import { formatError } from '@/utils/ErrorHelper'
import { messageService } from '@/utils/message.service'
import type { DayOfClassType } from './day.of.class.type'
import { dayOfClassValidation } from './day.of.class.validation'
import { TimeSlotCreatedDocument, useTimeSlotsQuery } from '@/gql/graphql'
import LiveView from '@/utils/LiveView'
import ControlledSelect from '@/@core/components/ui/forms/controlled-select'
import TimeSlotAdd from '../timeSlot/TimeSlotAdd'
import { timeSlotOptions } from '@/utils/select/selectComponents'
import FormSection from '@/@core/components/ui/forms/form-section'
import ToggleOption from '@/@core/components/ui/forms/toggle-option'

interface FormProps extends BaseFormProps {
  dayOfClass?: DayOfClassType
  modal?: NiceModalHandler
}

const DayOfClassForm: React.FC<FormProps> = ({
  dayOfClass,
  modal,
  action,
  ...props
}) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const {
    control,
    handleSubmit,
    formState: { isDirty },
    reset,
    setValue,
    watch,
  } = useForm<DayOfClassType>({
    defaultValues: {
      dayOfWeek: dayOfClass?.dayOfWeek || '',
      active: dayOfClass ? dayOfClass?.active : true,
      openingTimeId: dayOfClass ? dayOfClass?.openingTime : '',
      closingTimeId: dayOfClass ? dayOfClass?.closingTime : '',
    },
    //@ts-ignore
    resolver: yupResolver(dayOfClassValidation),
  })

  const isActive = watch('active')

  const { data, loading, subscribeToMore } = useTimeSlotsQuery({
    variables: {
      id: enterpriseId,
    },
  })

  const onSubmit = (
    event: React.FormEvent<HTMLFormElement>,
    close?: boolean,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      const id = dayOfClass ? Number(dayOfClass.id) : undefined

      action({
        variables: {
          dayOfClass: {
            id: id,
            dayOfWeek: values.dayOfWeek,
            active: values.active,
            openingTimeId: values.openingTimeId
              ? Number(values.openingTimeId.id)
              : undefined,
            closingTimeId: values.closingTimeId
              ? Number(values.closingTimeId.id)
              : undefined,
            schoolId: enterpriseId,
          },
        },
      })
        .then(async ({ data }) => {
          reset()
          toast.success(
            t('toast-dayOfClassAdded', { day: data.dayOfClass.dayOfWeek }),
            {
              ...TOAST_OPTIONS,
            },
          )
          if (close) {
            modal?.hide()
          }

          if (props.popover) {
            messageService.sendMessage('dayOfClass', data.dayOfClass)
            props.onModalClose?.()
          }
        })
        .catch((error) => {
          toast.error(
            `Impossible d'ajouter le jour de classe ${formatError(error)}`,
          )
        })
    })(event)
  }

  return (
    <Form onSubmit={onSubmit} className="space-y-1">
      <FormSection
        title={t('label-basicInformation')}
        description={
          t('label-dayOfClassIdentityDesc') ||
          'Sélectionnez le jour de la semaine'
        }
        icon={<Calendar size={20} />}
        color="#7367f0"
      >
        <div className="grid grid-cols-1 gap-1">
          <Input
            name="dayOfWeek"
            label={t('label-dayOfWeek')}
            type="select"
            control={control}
            required
            prepend={<Calendar size={14} />}
          >
            <option value="">{t('label-select')}</option>
            <option value="MONDAY">{t('MONDAY')}</option>
            <option value="TUESDAY">{t('TUESDAY')}</option>
            <option value="WEDNESDAY">{t('WEDNESDAY')}</option>
            <option value="THURSDAY">{t('THURSDAY')}</option>
            <option value="FRIDAY">{t('FRIDAY')}</option>
            <option value="SATURDAY">{t('SATURDAY')}</option>
            <option value="SUNDAY">{t('SUNDAY')}</option>
          </Input>
        </div>
      </FormSection>

      <FormSection
        title={t('label-timeSlots')}
        description={
          t('label-dayOfClassTimeSlotsDesc') ||
          "Définissez les heures d'ouverture et de fermeture"
        }
        icon={<Clock size={20} />}
        color="#00cfe8"
      >
        <LiveView
          document={TimeSlotCreatedDocument}
          singleVar="timeSlot"
          data={data}
          loading={loading}
          listVar="timeSlots"
          subscribeToMore={subscribeToMore}
          sortField="label"
          triggerUpdate={true}
          enterpriseId={enterpriseId}
        >
          {({ timeSlots }) => {
            const filteredSlots =
              timeSlots?.filter((t: any) => !t.isBreakTime) || []
            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                <ControlledSelect
                  name="openingTimeId"
                  label={t('label-openingTime')}
                  control={control}
                  required={true}
                  loading={loading}
                  onChange={(val) => setValue('openingTimeId', val)}
                  options={filteredSlots}
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option.id}
                  components={{ Option: timeSlotOptions }}
                  form={<TimeSlotAdd />}
                  formId="timeSlot"
                  optionLabel="name"
                  formTitle={t('action.add_timeSlot')}
                />

                <ControlledSelect
                  name="closingTimeId"
                  label={t('label-closingTime')}
                  control={control}
                  required={true}
                  loading={loading}
                  onChange={(val) => setValue('closingTimeId', val)}
                  options={filteredSlots}
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option.id}
                  components={{ Option: timeSlotOptions }}
                  form={<TimeSlotAdd />}
                  formId="timeSlot"
                  optionLabel="name"
                  formTitle={t('action.add_timeSlot')}
                />
              </div>
            )
          }}
        </LiveView>
      </FormSection>

      <FormSection
        title={t('label-options')}
        description={
          t('label-dayOfClassOptionsDesc') || 'Paramètres supplémentaires'
        }
        icon={<Settings size={20} />}
        color="#ff9f43"
      >
        <ToggleOption
          icon={<CheckCircle size={20} />}
          title={t('label-active')}
          description={
            t('label-dayOfClassActiveDesc') ||
            'Activer ou désactiver ce jour de classe'
          }
          isActive={isActive}
        >
          <Switch
            name="active"
            control={control}
            label=""
            defaultChecked={watch('active')}
          />
        </ToggleOption>
      </FormSection>

      <ActionButtons
        cancelAction={modal?.hide}
        isSubmitting={props.loading}
        popover={props.popover}
        dirty={isDirty}
        onSubmit={onSubmit}
      />
    </Form>
  )
}

export default DayOfClassForm
