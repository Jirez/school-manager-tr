import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { Form } from 'reactstrap'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import type { FC } from 'react'
import { Building, User, CheckCircle, FileText } from 'lucide-react'

import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import { useAuthentication } from '@/hooks/useAuthentication'
import { TOAST_OPTIONS } from '@/utils/constants'
import type { DepartmentType } from './department.type'
import {
  departmentValidation,
  type DepartmentSchemaType,
} from './department.validation'
import FormSection from '@/@core/components/ui/forms/form-section'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'
import ToggleOption from '@/@core/components/ui/forms/toggle-option'
import { defaultMeta, useAppForm } from '#/hooks/form/form'
import { useSelector } from '@tanstack/react-form'

interface DepartmentFormProps extends BaseFormProps {
  department?: DepartmentType
  modal?: NiceModalHandler
}

const DepartmentForm: FC<DepartmentFormProps> = ({
  department,
  action,
  modal,
  ...props
}) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const { handleSubmit, AppField, reset, store, AppForm, SubmitButton } =
    useAppForm({
      defaultValues: {
        name: department?.name || '',
        active: department ? department.active : true,
        note: department?.note || '',
        manager: department?.manager || '',
      } as DepartmentSchemaType,
      validators: {
        onChange: departmentValidation,
      },
      onSubmitMeta: defaultMeta,
      onSubmit({ value, meta }) {
        const id = department ? Number(department.id) : undefined
        const values = departmentValidation.parse(value)

        action({
          variables: {
            department: {
              ...values,
              id,
              enterpriseId,
              manager: values.manager || null,
              note: values.note || null,
            },
          },
        })
          .then(async ({ data }) => {
            reset()
            toast.success(`Departement ${data.department.name} enregistré`, {
              ...TOAST_OPTIONS,
            })

            if (props.popover) {
              messageService.sendMessage('department', data.department)
              props.onModalClose?.()
            }
            if (meta.close) {
              modal?.hide()
            }
          })
          .catch((error) => {
            toast.error(
              `Impossible d'ajouter le département: ${formatError(error)}`,
            )
          })
      },
    })

  const active = useSelector(store, (state) => state.values.active)

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault()
        handleSubmit()
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-1 gap-x-1 gap-y-1">
        <FormSection
          title={t('label-departmentInfo') || 'Informations du département'}
          description={
            t('label-departmentInfoDesc') || 'Détails de base du département'
          }
          icon={<Building size={18} />}
          color="#7367f0"
        >
          <div className="space-y-3">
            <AppField
              name="name"
              children={(field) => (
                <field.Input
                  label={t('label-name')}
                  required={true}
                  prepend={<Building size={16} />}
                />
              )}
            />

            <AppField
              name="manager"
              children={(field) => (
                <field.Input
                  label={t('label-manager')}
                  required={false}
                  prepend={<User size={16} />}
                />
              )}
            />

            <ToggleOption
              icon={<CheckCircle size={16} />}
              title={t('label-active')}
              description={t('label-activeDesc') || 'Département actif'}
              isActive={active}
            >
              <AppField
                name="active"
                children={(field) => <field.Switch label="" />}
              />
            </ToggleOption>
          </div>
        </FormSection>

        <FormSection
          title={t('label-additionalInfo') || 'Informations complémentaires'}
          description={
            t('label-additionalInfoDesc') || 'Notes et détails supplémentaires'
          }
          icon={<FileText size={18} />}
          color="#28c76f"
        >
          <div className="">
            <AppField
              name="note"
              children={(field) => (
                <field.Input
                  label={t('label-note')}
                  type="textarea"
                  rows={5}
                  prepend={<FileText size={16} />}
                />
              )}
            />
          </div>
        </FormSection>
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

export default DepartmentForm
