import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Form } from 'reactstrap'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import type { FC } from 'react'
import { Building, User, CheckCircle, FileText } from 'lucide-react'

import Input from '@/@core/components/ui/forms/input'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import Switch from '@/@core/components/ui/forms/swith'
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import { useAuthentication } from '@/hooks/useAuthentication'
import { yupResolver } from '@hookform/resolvers/yup'
import { TOAST_OPTIONS } from '@/utils/constants'
import type { DepartmentType } from './department.type'
import { departmentValidation } from './department.validation'
import FormSection from '@/@core/components/ui/forms/form-section'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'
import ToggleOption from '@/@core/components/ui/forms/toggle-option'

interface DepartmentFormProps extends BaseFormProps {
  department?: DepartmentType
  modal?: NiceModalHandler
}

const initialValues: Partial<DepartmentType> = {
  name: '',
  active: true,
  note: '',
  manager: '',
}

const DepartmentForm: FC<DepartmentFormProps> = ({
  department,
  action,
  modal,
  ...props
}) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const {
    control,
    handleSubmit,
    formState: { isDirty },
    reset,
    getValues,
    watch,
    setValue,
  } = useForm<DepartmentType>({
    defaultValues: {
      name: department?.name || '',
      active: department ? department.active : true,
      note: department?.note || '',
      manager: department?.manager || '',
    },
    resolver: yupResolver(departmentValidation),
  })

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    close?: boolean,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      const id = department ? Number(department.id) : undefined

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
          reset(initialValues)
          toast.success(`Departement ${data.department.name} enregistré`, {
            ...TOAST_OPTIONS,
          })

          if (props.popover) {
            messageService.sendMessage('department', data.department)
            props.onModalClose?.()
          }
          if (close) {
            modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(
            `Impossible d'ajouter le département: ${formatError(error)}`,
          )
        })
    })(event)
  }

  return (
    <Form onSubmit={onSubmit}>
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
            <Input
              name="name"
              label={t('label-name')}
              control={control}
              required={true}
              prepend={<Building size={16} />}
            />

            <Input
              name="manager"
              label={t('label-manager')}
              control={control}
              required={false}
              prepend={<User size={16} />}
            />

            <ToggleOption
              icon={<CheckCircle size={16} />}
              title={t('label-active')}
              description={t('label-activeDesc') || 'Département actif'}
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

        <FormSection
          title={t('label-additionalInfo') || 'Informations complémentaires'}
          description={
            t('label-additionalInfoDesc') || 'Notes et détails supplémentaires'
          }
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

export default DepartmentForm
