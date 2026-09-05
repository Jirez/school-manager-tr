import type { InstallmentType } from '@/views/sale/installment/installment.type'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { toast } from 'react-toastify'
import type { FC } from 'react'
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
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import { INPUT_DATE_FORMAT, TOAST_OPTIONS } from '@/utils/constants'
import { installmentZodSchema } from './installment.validation'
import type { InstallmentZodSchemaType } from './installment.validation'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'
import FormSection from '@/@core/components/ui/forms/form-section'
import ToggleOption from '@/@core/components/ui/forms/toggle-option'
import { defaultMeta, useAppForm } from '#/hooks/form/form'
import { useSelector } from '@tanstack/react-form'
import { m } from '@/paraglide/messages'

interface InstallmentFormProps extends BaseFormProps {
  installment?: InstallmentType
  modal?: NiceModalHandler
}

const InstallmentForm: FC<InstallmentFormProps> = ({
  installment,
  modal,
  action,
  ...props
}) => {
  const { enterpriseId } = useAuthentication()

  const { handleSubmit, AppField, reset, store, AppForm, SubmitButton } =
    useAppForm({
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
      } as InstallmentZodSchemaType,
      validators: {
        // @ts-ignore validation is handled by Zod schema, so we can ignore the type error here
        onChange: installmentZodSchema,
      },
      onSubmitMeta: defaultMeta,
      onSubmit({ value, meta }) {
        const id = installment ? Number(installment.id) : undefined
        const values = installmentZodSchema.parse(value)

        action({
          variables: {
            installment: {
              ...values,
              id,
              dueDate: dayjs(values.dueDate as any).format(INPUT_DATE_FORMAT),
              schoolId: enterpriseId,
            },
          },
        })
          .then(async ({ data }) => {
            reset()
            toast.success(
              `Tranche de paiement ${data.installment.name} enregistrée`,
              { ...TOAST_OPTIONS },
            )

            if (props.popover) {
              messageService.sendMessage('installment', data.installment)
              props.onModalClose?.()
            }
            if (meta.close) {
              modal?.hide()
            }
          })
          .catch((error) => {
            toast.error(
              `Impossible d'ajouter la tranche de paiement: ${formatError(error)}`,
            )
          })
      },
    })

  const isRefundable = useSelector(store, (state) => state.values.isRefundable)
  const isActive = useSelector(store, (state) => state.values.isActive)

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
    >
      <div className="pb-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          {/* Basic Information Section */}
          <FormSection
            title={m.label_basicInformation()}
            description={m.label_installmentInfoDesc() || 'Nom et séquence'}
            icon={<FileText size={18} />}
            color="#7367f0"
            className="md:col-span-2"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
              <AppField
                name="numberOrder"
                children={(field) => (
                  <field.Input
                    label={m.label_numberOrder()}
                    required={true}
                    type="number"
                    prepend={<Hash size={14} />}
                    placeholder={m.label_numberOrderPlaceholder() || 'Ex: 1'}
                  />
                )}
              />

              <AppField
                name="name"
                children={(field) => (
                  <field.Input
                    label={m.label_name()}
                    required={true}
                    prepend={<FileText size={14} />}
                    placeholder={m.label_namePlaceholder() || 'Ex: Tranche 1'}
                  />
                )}
              />

              <AppField
                name="name2"
                children={(field) => (
                  <field.Input
                    label={m.label_name2()}
                    prepend={<FileText size={14} />}
                    placeholder={
                      m.label_name2Placeholder() || 'Code ou nom alternatif'
                    }
                  />
                )}
              />
            </div>
          </FormSection>

          {/* Payment Terms Section */}
          <FormSection
            title={m.label_paymentTerms() || 'Conditions de paiement'}
            description={m.label_paymentTermsDesc() || 'Échéances et retards'}
            icon={<Calendar size={18} />}
            color="#00cfe8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
              <AppField
                name="dueDate"
                children={(field) => (
                  <field.DatePicker
                    label={m.label_deadline()}
                    required={true}
                  />
                )}
              />

              <AppField
                name="gracePeriodDays"
                children={(field) => (
                  <field.Input
                    label={m.label_gracePeriodDays()}
                    required={true}
                    type="number"
                    prepend={<Clock size={14} />}
                    placeholder="0"
                  />
                )}
              />

              <AppField
                name="lateFeePercentage"
                children={(field) => (
                  <field.Input
                    label={m.label_lateFeePercentage()}
                    required={true}
                    type="number"
                    prepend={<Percent size={14} />}
                    placeholder="0"
                    className="col-span-2"
                  />
                )}
              />
            </div>
          </FormSection>

          {/* Options Section */}
          <FormSection
            title={m.label_options() || 'Options'}
            description={
              m.label_groupOptionsDesc() || "Paramètres d'activation"
            }
            icon={<Settings size={18} />}
            color="#28c76f"
          >
            <div className="grid grid-cols-1 gap-1">
              <ToggleOption
                title={m.label_refundable()}
                description={
                  m.label_refundableDesc() || "Remboursable à l'élève"
                }
                icon={<Undo2 size={18} />}
                isActive={isRefundable}
              >
                <AppField
                  name="isRefundable"
                  children={(field) => <field.Switch label="" />}
                />
              </ToggleOption>

              <ToggleOption
                title={m.label_active()}
                description={m.label_activeDesc() || 'Tranche active'}
                icon={<Power size={18} />}
                isActive={isActive}
              >
                <AppField
                  name="isActive"
                  children={(field) => <field.Switch label="" />}
                />
              </ToggleOption>
            </div>
          </FormSection>

          {/* Notes Section */}
          <FormSection
            title={m.label_note() || 'Note'}
            description={m.label_notesDesc() || 'Observations internes'}
            icon={<StickyNote size={18} />}
            color="#ff9f43"
            className="md:col-span-2"
          >
            <AppField
              name="note"
              children={(field) => (
                <field.Input
                  label={''}
                  type="textarea"
                  rows={3}
                  prepend={<Info size={14} />}
                  placeholder={
                    m.label_notePlaceholder() || 'Saisir vos notes ici...'
                  }
                />
              )}
            />
          </FormSection>
        </div>
      </div>

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

export default InstallmentForm
