import { useTranslation } from 'react-i18next'
import type { InstallmentType } from '@/views/sale/installment/installment.type'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { toast } from 'react-toastify'
import type { FC } from 'react'
import { useForm } from 'react-hook-form'
import { Form } from 'reactstrap'
import { useAuthentication } from '@/hooks/useAuthentication'
import dayjs from 'dayjs'
import {
  FileText,
  Settings,
  Calendar,
  Hash,
  Percent,
  Clock,
  StickyNote,
  Power,
  Info,
  Undo2,
} from 'lucide-react'
import Input from '@/@core/components/ui/forms/input'
import Switch from '@/@core/components/ui/forms/swith'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import DatePicker from '@/@core/components/ui/forms/date-picker'
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import { yupResolver } from '@hookform/resolvers/yup'
import { INPUT_DATE_FORMAT, TOAST_OPTIONS } from '@/utils/constants'
import { installmentValidation } from './installment.validation'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'
import FormSection from '@/@core/components/ui/forms/form-section'
import ToggleOption from '@/@core/components/ui/forms/toggle-option'

interface InstallmentFormProps extends BaseFormProps {
  installment?: InstallmentType
  modal?: NiceModalHandler
}

const initialValues: Partial<InstallmentType> = {
  name: '',
  name2: '',
  numberOrder: undefined,
  dueDate: null,
  note: '',
  lateFeePercentage: undefined,
  gracePeriodDays: undefined,
  isActive: true,
}

const InstallmentForm: FC<InstallmentFormProps> = ({
  installment,
  modal,
  action,
  ...props
}) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const {
    control,
    formState: { isDirty },
    reset,
    getValues,
    handleSubmit,
  } = useForm<InstallmentType>({
    defaultValues: {
      numberOrder: installment?.numberOrder || undefined,
      name: installment?.name || '',
      name2: installment?.name2 || '',
      note: installment?.note || '',
      lateFeePercentage: installment ? installment.lateFeePercentage : 0,
      gracePeriodDays: installment ? installment.gracePeriodDays : 0,
      isActive: installment ? installment.isActive : true,
      isRefundable: installment ? installment.isRefundable : false,
      dueDate: installment ? dayjs(installment.dueDate).toDate() : null,
    },
    resolver: yupResolver(installmentValidation),
  })

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    close?: boolean,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      const id = installment ? Number(installment.id) : undefined

      action({
        variables: {
          installment: {
            ...values,
            id,
            dueDate: dayjs(values.dueDate).format(INPUT_DATE_FORMAT),
            schoolId: enterpriseId,
          },
        },
      })
        .then(async ({ data }) => {
          reset(initialValues)
          toast.success(
            `Tranche de paiement ${data.installment.name} enregistrée`,
            { ...TOAST_OPTIONS },
          )

          if (props.popover) {
            messageService.sendMessage('installment', data.installment)
            props.onModalClose?.()
          }
          if (close) {
            modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(
            `Impossible d'ajouter la tranche de paiement: ${formatError(error)}`,
          )
        })
    })(event)
  }

  return (
    <Form onSubmit={onSubmit}>
      <div className="pb-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          {/* Basic Information Section */}
          <FormSection
            title={t('label-basicInformation') || 'Informations de base'}
            description={t('label-installmentInfoDesc') || 'Nom et séquence'}
            icon={<FileText size={18} />}
            color="#7367f0"
            className="md:col-span-2"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
              <Input
                name="numberOrder"
                label={t('label-numberOrder')}
                control={control}
                required={true}
                type="number"
                prepend={<Hash size={14} />}
                placeholder={t('label-numberOrderPlaceholder') || 'Ex: 1'}
              />

              <Input
                name="name"
                label={t('label-name')}
                control={control}
                required={true}
                prepend={<FileText size={14} />}
                placeholder={t('label-namePlaceholder') || 'Ex: Tranche 1'}
              />

              <Input
                name="name2"
                label={t('label-name2')}
                control={control}
                prepend={<FileText size={14} />}
                placeholder={
                  t('label-name2Placeholder') || 'Code ou nom alternatif'
                }
              />
            </div>
          </FormSection>

          {/* Payment Terms Section */}
          <FormSection
            title={t('label-paymentTerms') || 'Conditions de paiement'}
            description={t('label-paymentTermsDesc') || 'Échéances et retards'}
            icon={<Calendar size={18} />}
            color="#00cfe8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
              <DatePicker
                name="dueDate"
                label={t('label-deadline')}
                control={control}
                required={true}
              />

              <Input
                name="gracePeriodDays"
                label={t('label-gracePeriodDays')}
                control={control}
                required={true}
                type="number"
                prepend={<Clock size={14} />}
                placeholder="0"
              />

              <Input
                name="lateFeePercentage"
                label={t('label-lateFeePercentage')}
                control={control}
                required={true}
                type="number"
                prepend={<Percent size={14} />}
                placeholder="0"
                className="col-span-2"
              />
            </div>
          </FormSection>

          {/* Options Section */}
          <FormSection
            title={t('label-options') || 'Options'}
            description={
              t('label-groupOptionsDesc') || "Paramètres d'activation"
            }
            icon={<Settings size={18} />}
            color="#28c76f"
          >
            <div className="grid grid-cols-1 gap-1">
              <ToggleOption
                title={t('label-refundable')}
                description={
                  t('label-refundableDesc') || "Remboursable à l'élève"
                }
                icon={<Undo2 size={18} />}
                isActive={getValues('isRefundable')}
              >
                <Switch
                  name="isRefundable"
                  control={control}
                  label=""
                  defaultChecked={getValues('isRefundable')}
                />
              </ToggleOption>

              <ToggleOption
                title={t('label-active')}
                description={t('label-activeDesc') || 'Tranche active'}
                icon={<Power size={18} />}
                isActive={getValues('isActive')}
              >
                <Switch
                  name="isActive"
                  control={control}
                  label=""
                  defaultChecked={getValues('isActive')}
                />
              </ToggleOption>
            </div>
          </FormSection>

          {/* Notes Section */}
          <FormSection
            title={t('label-note') || 'Note'}
            description={t('label-notesDesc') || 'Observations internes'}
            icon={<StickyNote size={18} />}
            color="#ff9f43"
            className="md:col-span-2"
          >
            <Input
              name="note"
              control={control}
              label={''}
              type="textarea"
              rows={3}
              prepend={<Info size={14} />}
              placeholder={
                t('label-notePlaceholder') || 'Saisir vos notes ici...'
              }
            />
          </FormSection>
        </div>
      </div>

      <StickyActions>
        <ActionButtons
          cancelAction={modal?.hide}
          isSubmitting={props.loading}
          popover={props.popover}
          dirty={isDirty}
          onSubmit={onSubmit}
          fixed={false}
        />
      </StickyActions>
    </Form>
  )
}

export default InstallmentForm
