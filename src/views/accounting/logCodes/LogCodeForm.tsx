import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Form } from 'reactstrap'
import { toast } from 'react-toastify'
import Input from '@/@core/components/ui/forms/input'
import ControlledSelect from '@/@core/components/ui/forms/controlled-select'
import Switch from '@/@core/components/ui/forms/swith'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import { useForm } from 'react-hook-form'
import type { LogCodeType } from '@/views/accounting/logCodes/LogCode.type'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import { useAuthentication } from '@/hooks/useAuthentication'
import { yupResolver } from '@hookform/resolvers/yup'
import { logCodeValidationSchema } from './logCode.validation'
import { TOAST_OPTIONS } from '@/utils/constants'
import { BookOpen, Tag, FileText, CheckCircle } from 'lucide-react'
import FormSection from '@/@core/components/ui/forms/form-section'
import ToggleOption from '@/@core/components/ui/forms/toggle-option'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'

interface LogCodeFormProps extends BaseFormProps {
  logCode?: LogCodeType
  modal?: NiceModalHandler
}

const initialValues: Partial<LogCodeType> = {
  name: '',
  active: true,
  note: '',
  logType: '',
}

const LogCodeForm: FC<LogCodeFormProps> = ({
  logCode,
  modal,
  action,
  ...props
}) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const options = [
    { label: t('label-expenses'), value: 'EXPENSES' },
    { label: t('label-sales'), value: 'SALES' },
    { label: t('label-bank'), value: 'BANK' },
    { label: t('label-postponement'), value: 'POSTPONEMENT' },
    { label: t('label-remuneration'), value: 'REMUNERATION' },
    { label: t('label-treasury'), value: 'TREASURY' },
    { label: t('label-others'), value: 'OTHERS' },
    { label: t('label-special'), value: 'SPECIAL' },
  ]

  const {
    control,
    setValue,
    getValues,
    formState: { isDirty },
    reset,
    handleSubmit,
    watch,
  } = useForm<LogCodeType>({
    defaultValues: {
      name: logCode?.name || '',
      note: logCode?.note || '',
      active: logCode ? logCode.active : true,
      logType: logCode
        ? options.filter(({ value }) => value === logCode.logType)[0]
        : undefined,
    },
    resolver: yupResolver(logCodeValidationSchema),
  })

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    close?: boolean,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      const id = logCode ? Number(logCode.id) : undefined

      action({
        variables: {
          logCode: {
            ...values,
            id,
            logType: values.logType.value,
            enterpriseId: enterpriseId,
          },
        },
      })
        .then(async ({ data }) => {
          reset(initialValues)
          toast.success(
            t('message-logCodeSaved', { name: data.logCode.name }),
            {
              ...TOAST_OPTIONS,
            },
          )

          if (props.popover) {
            messageService.sendMessage('logCode', data.logCode)
            props.onModalClose?.()
          }
          if (close) {
            modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(
            t('message-logCodeSaveError', { error: formatError(error) }),
          )
        })
    })(event)
  }

  return (
    <Form onSubmit={onSubmit} className="space-y-6">
      <FormSection
        icon={<BookOpen size={20} />}
        title={t('label-logCodeInfo') || 'Informations du code journal'}
        description={
          t('label-logCodeInfoDesc') || 'Configuration du journal comptable'
        }
        color="#7367f0"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <div className="md:col-span-2">
            <ToggleOption
              icon={<CheckCircle size={16} />}
              title={t('label-active')}
              description={t('label-activeDesc') || 'Code journal activé'}
              isActive={watch('active')}
            >
              <Switch
                name="active"
                control={control}
                label=""
                defaultChecked={getValues('active')}
                onChange={(e: any) =>
                  setValue('active', e.target.checked, { shouldDirty: true })
                }
              />
            </ToggleOption>
          </div>

          <div className="md:col-span-2">
            <ControlledSelect
              name="logType"
              control={control}
              label={t('label-logType')}
              prepend={<BookOpen size={16} />}
              onChange={(value) => setValue('logType', value)}
              options={options}
              required
            />
          </div>

          <div className="md:col-span-2">
            <Input
              name="name"
              label={t('label-name')}
              control={control}
              required={true}
              prepend={<Tag size={16} />}
              placeholder={t('placeholder-name')}
            />
          </div>

          <div className="md:col-span-2">
            <Input
              name="note"
              label={t('label-note')}
              control={control}
              type="textarea"
              rows={3}
              prepend={<FileText size={16} />}
              placeholder={t('placeholder-description')}
            />
          </div>
        </div>
      </FormSection>

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

export default LogCodeForm
