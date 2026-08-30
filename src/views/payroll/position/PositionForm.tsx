import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Form } from 'reactstrap'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import type { FC } from 'react'
import {
  Briefcase,
  DollarSign,
  CheckCircle,
  FileText,
  Percent,
  Clock,
} from 'lucide-react'

import Input from '@/@core/components/ui/forms/input'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import Switch from '@/@core/components/ui/forms/swith'
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import { useAuthentication } from '@/hooks/useAuthentication'
import { yupResolver } from '@hookform/resolvers/yup'
import { TOAST_OPTIONS } from '@/utils/constants'
import type { PositionType } from './position.type'
import { positionValidation } from './position.validation'
import FormSection from '@/@core/components/ui/forms/form-section'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'
import ToggleOption from '@/@core/components/ui/forms/toggle-option'
import NumericInput from '@/@core/components/ui/forms/numeric-input'

interface PositionFormProps extends BaseFormProps {
  position?: PositionType
  modal?: NiceModalHandler
}

const initialValues: Partial<PositionType> = {
  title: '',
  active: true,
  note: '',
}

const PositionForm: FC<PositionFormProps> = ({
  position,
  action,
  modal,
  ...props
}) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const {
    control,
    handleSubmit,
    formState: { isDirty, errors },
    reset,
    getValues,
    setValue,
    watch,
    register,
  } = useForm<PositionType>({
    defaultValues: {
      title: position?.title || '',
      active: position ? position.active : true,
      note: position?.note || '',
      baseSalary: position?.baseSalary || '',
      baseSalaryF: position?.baseSalaryF || '',
      bonusPercentage: position?.bonusPercentage || '',
      overtimeRate: position?.overtimeRate || '',
    },
    resolver: yupResolver(positionValidation),
  })

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    close?: boolean,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      const id = position ? Number(position.id) : undefined

      action({
        variables: {
          position: {
            id,
            enterpriseId,
            title: values.title,
            active: values.active,
            note: values.note || null,
            baseSalary: values.baseSalary ? Number(values.baseSalary) : null,
            bonusPercentage: values.bonusPercentage
              ? Number(values.bonusPercentage)
              : null,
            overtimeRate: values.overtimeRate
              ? Number(values.overtimeRate)
              : null,
          },
        },
      })
        .then(async ({ data }) => {
          reset(initialValues)
          toast.success(`Position ${data.position.title} enregistré`, {
            ...TOAST_OPTIONS,
          })

          if (props.popover) {
            messageService.sendMessage('position', data.position)
            props.onModalClose?.()
          }
          if (close) {
            modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(`Impossible d'ajouter la position: ${formatError(error)}`)
        })
    })(event)
  }

  return (
    <Form onSubmit={onSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-x-1 gap-y-1">
        {/* Position Information */}
        <FormSection
          title={t('label-positionInfo') || 'Informations du poste'}
          description={
            t('label-positionInfoDesc') || 'Détails de base du poste'
          }
          icon={<Briefcase size={18} />}
          color="#7367f0"
          className="col-span-full"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            <Input
              name="title"
              label={t('label-title')}
              control={control}
              required={true}
              prepend={<Briefcase size={16} />}
            />

            <ToggleOption
              icon={<CheckCircle size={16} />}
              title={t('label-active')}
              description={t('label-activeDesc') || 'Poste actif'}
              isActive={watch('active')}
            >
              <Switch
                name="active"
                label=""
                control={control}
                defaultChecked={getValues('active')}
                onChange={(e: any) =>
                  setValue('active', e.target.checked, { shouldDirty: true })
                }
              />
            </ToggleOption>
          </div>
        </FormSection>

        {/* Compensation Details */}
        <FormSection
          title={t('label-compensation') || 'Rémunération'}
          description={t('label-compensationDesc') || 'Salaires et primes'}
          icon={<DollarSign size={18} />}
          color="#ea5455"
        >
          <div className="space-y-3">
            <NumericInput
              name="baseSalary"
              nameF="baseSalaryF"
              control={control}
              setValue={setValue}
              label={t('label-baseSalary')}
              prepend={<DollarSign size={16} />}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
              <Input
                name="bonusPercentage"
                control={control}
                label={t('label-bonusPercentage')}
                prepend={<Percent size={16} />}
              />

              <Input
                name="overtimeRate"
                control={control}
                label={t('label-overtimeRate')}
                prepend={<Clock size={16} />}
              />
            </div>
          </div>
        </FormSection>

        {/* Notes Section */}
        <FormSection
          title={t('label-additionalInfo') || 'Informations complémentaires'}
          description={t('label-additionalInfoDesc') || 'Notes supplémentaires'}
          icon={<FileText size={18} />}
          color="#28c76f"
        >
          <div className="">
            <Input
              name="note"
              label={t('label-note')}
              control={control}
              type="textarea"
              rows={5}
              prepend={<FileText size={16} />}
            />
          </div>
        </FormSection>
      </div>

      <StickyActions>
        <ActionButtons
          cancelAction={modal?.hide}
          isSubmitting={props.loading}
          popover={props.popover}
          dirty={isDirty}
          onSubmit={onSubmit}
        />
      </StickyActions>
    </Form>
  )
}

export default PositionForm
