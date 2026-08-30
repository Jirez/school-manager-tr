import { Form } from 'reactstrap'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Clock, Settings, Timer } from 'lucide-react'

import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import Input from '@/@core/components/ui/forms/input'
import Switch from '@/@core/components/ui/forms/swith'
import { useAuthentication } from '@/hooks/useAuthentication'
import { TOAST_OPTIONS } from '@/utils/constants'
import { formatError } from '@/utils/ErrorHelper'
import { messageService } from '@/utils/message.service'
import type { TimeSlotType } from './time.slot.type'
import { timeSlotValidation } from './time.slot.validation'
import {
  FormCard,
  FormSection,
  FormSectionCard,
  TimeInputRow,
  TimeSeparator,
  SwitchCardEnhanced,
  SwitchLabel,
  SwitchTitle,
  SwitchDescription,
  FormDivider,
  SectionBadge,
  FieldGroup,
} from '@/views/school/configuration/config-form-helper'

interface FormProps extends BaseFormProps {
  timeSlot?: TimeSlotType
  modal?: NiceModalHandler
}

const TimeSlotForm: React.FC<FormProps> = ({
  timeSlot,
  modal,
  action,
  ...props
}) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const {
    control,
    handleSubmit,
    getValues,
    formState: { isDirty },
    reset,
  } = useForm<TimeSlotType>({
    defaultValues: {
      name: timeSlot?.name || '',
      startTime: timeSlot ? timeSlot?.startTime : '',
      endTime: timeSlot ? timeSlot?.endTime : '',
      isBreakTime: timeSlot ? timeSlot?.isBreakTime : false,
      isActive: timeSlot ? timeSlot?.isActive : true,
    },
    //@ts-ignore
    resolver: yupResolver(timeSlotValidation),
  })

  const onSubmit = (
    event: React.FormEvent<HTMLFormElement>,
    close?: boolean,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      const id = timeSlot ? Number(timeSlot.id) : undefined

      action({
        variables: {
          timeSlot: {
            id: id,
            name: values.name,
            startTime: values.startTime,
            endTime: values.endTime,
            isBreakTime: values.isBreakTime,
            isActive: values.isActive,
            schoolId: enterpriseId,
          },
        },
      })
        .then(async ({ data }) => {
          reset()
          toast.success(`Tranche horaire ${data.timeSlot.name} ajoutée`, {
            ...TOAST_OPTIONS,
          })
          if (close) {
            modal?.hide()
          }

          if (props.popover) {
            messageService.sendMessage('timeSlot', data.timeSlot)
            props.onModalClose?.()
          }
        })
        .catch((error) => {
          toast.error(
            `Impossible d'ajouter la tranche horaire ${formatError(error)}`,
          )
        })
    })(event)
  }

  return (
    <Form onSubmit={onSubmit}>
      <FormCard>
        <FormSection>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '1.25rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #7367f0 0%, #9e95f5 100%)',
                boxShadow: '0 4px 12px rgba(115, 103, 240, 0.35)',
                marginRight: '0.75rem',
              }}
            >
              <Clock size={20} color="white" />
            </div>
            <div>
              <h4
                style={{
                  margin: 0,
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#2c3e50',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                {t('label-basicInformation')}
                <SectionBadge $variant={timeSlot ? 'secondary' : 'primary'}>
                  {timeSlot ? t('label-edit') : t('label-new')}
                </SectionBadge>
              </h4>
              <p
                style={{
                  margin: '0.25rem 0 0 0',
                  fontSize: '0.8rem',
                  color: '#6c757d',
                }}
              >
                Renseignez les informations de base de la tranche horaire
              </p>
            </div>
          </div>

          <FormSectionCard>
            <FieldGroup style={{ marginBottom: '1.25rem' }}>
              <Input
                name="name"
                control={control}
                label={t('label-name')}
                placeholder="Ex: Matin, Après-midi, Pause..."
                required
              />
            </FieldGroup>

            <div
              style={{
                marginBottom: '0.5rem',
                fontSize: '0.85rem',
                fontWeight: 500,
                color: '#6c757d',
                textTransform: 'uppercase',
                letterSpacing: '0.03em',
              }}
            >
              <Timer
                size={14}
                style={{
                  display: 'inline',
                  marginRight: '0.375rem',
                  verticalAlign: 'text-bottom',
                }}
              />
              {t('label-timeSlotDuration')}
            </div>
            <TimeInputRow>
              <FieldGroup>
                <Input
                  name="startTime"
                  control={control}
                  label={t('label-startTime')}
                  placeholder="08:00"
                  required
                />
              </FieldGroup>
              <TimeSeparator>→</TimeSeparator>
              <FieldGroup>
                <Input
                  name="endTime"
                  control={control}
                  label={t('label-endTime')}
                  placeholder="09:00"
                  required
                />
              </FieldGroup>
            </TimeInputRow>
          </FormSectionCard>
        </FormSection>

        <FormDivider />

        <FormSection>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '1.25rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(115, 103, 240, 0.1)',
                boxShadow: '0 2px 8px rgba(115, 103, 240, 0.15)',
                marginRight: '0.75rem',
              }}
            >
              <Settings size={20} color="#7367f0" />
            </div>
            <div>
              <h4
                style={{
                  margin: 0,
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#2c3e50',
                }}
              >
                {t('label-options')}
              </h4>
              <p
                style={{
                  margin: '0.25rem 0 0 0',
                  fontSize: '0.8rem',
                  color: '#6c757d',
                }}
              >
                Configurez les options de la tranche horaire
              </p>
            </div>
          </div>

          <SwitchCardEnhanced
            $selected={getValues('isBreakTime')}
            style={{ marginBottom: '0.75rem' }}
          >
            <SwitchLabel>
              <SwitchTitle>{t('label-isBreakTime')}</SwitchTitle>
              <SwitchDescription>
                Marquer cette tranche comme une pause
              </SwitchDescription>
            </SwitchLabel>
            <Switch
              name="isBreakTime"
              control={control}
              label=""
              defaultChecked={getValues('isBreakTime')}
            />
          </SwitchCardEnhanced>

          <SwitchCardEnhanced $selected={getValues('isActive')}>
            <SwitchLabel>
              <SwitchTitle>{t('label-active')}</SwitchTitle>
              <SwitchDescription>
                Activer ou désactiver cette tranche horaire
              </SwitchDescription>
            </SwitchLabel>
            <Switch
              name="isActive"
              control={control}
              label=""
              defaultChecked={getValues('isActive')}
            />
          </SwitchCardEnhanced>
        </FormSection>
      </FormCard>

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

export default TimeSlotForm
