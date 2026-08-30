import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Form } from 'reactstrap'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import type { FC } from 'react'
import { Calendar, FileText, UserMinus, ShieldAlert } from 'lucide-react'
import Input from '@/@core/components/ui/forms/input'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import Switch from '@/@core/components/ui/forms/swith'
import { formatError } from '@/utils/ErrorHelper'
import { useAuthentication } from '@/hooks/useAuthentication'
import { yupResolver } from '@hookform/resolvers/yup'
import { frequentExcludeValidation } from './frequent.validation'
import { INPUT_DATE_FORMAT, TOAST_OPTIONS } from '@/utils/constants'
import FormSection from '@/@core/components/ui/forms/form-section'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'
import ToggleOption from '@/@core/components/ui/forms/toggle-option'
import type { FrequentExcludeInput } from './Frequent.type'
import DatePicker from '@/@core/components/ui/forms/date-picker'
import { useFrequentExcludeMutation } from '@/gql/graphql'
import dayjs from 'dayjs'

interface FrequentExcludeFormProps extends BaseFormProps {
  input?: FrequentExcludeInput
  modal?: NiceModalHandler
}

const FrequentExcludeForm: FC<FrequentExcludeFormProps> = ({
  input,
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
    watch,
  } = useForm<FrequentExcludeInput>({
    defaultValues: {
      exclusionDate: input?.exclusionDate || dayjs().format(INPUT_DATE_FORMAT),
      exclusionReason: input?.exclusionReason || '',
      excluded: input?.excluded || false,
    },
    resolver: yupResolver(frequentExcludeValidation) as any,
  })

  const isExcluded = watch('excluded')
  const [exclude, { loading: excludeLoading }] = useFrequentExcludeMutation()

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    close?: boolean,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      exclude({
        variables: {
          input: {
            studentId: input?.studentId,
            schoolYearId: input?.schoolYearId as any,
            classId: input?.classId as any,
            exclusionReason: values.exclusionReason,
            exclusionDate: dayjs(values.exclusionDate).format(
              INPUT_DATE_FORMAT,
            ),
            excluded: values.excluded,
          },
        },
      })
        .then(async () => {
          toast.success(t('toast-studentStatusChanged'), {
            ...TOAST_OPTIONS,
          })

          if (close) {
            modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(
            `Impossible de modifier le statut : ${formatError(error)}`,
          )
        })
    })(event)
  }

  return (
    <Form onSubmit={onSubmit} className="p-0">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
        {/* Exclusion Date Section */}
        <FormSection
          title={t('label-exclusionInfo')}
          description={t('label-exclusionInfoDesc')}
          icon={<Calendar size={20} />}
          color="#7367f0"
        >
          <div className="mt-1">
            <DatePicker
              name="exclusionDate"
              label={t('label-exclusionDate')}
              control={control}
              required={true}
            />
          </div>
        </FormSection>

        {/* Exclusion Status Section */}
        <FormSection
          title={t('label-exclusionStatus')}
          description={t('label-exclusionStatusDesc')}
          icon={<UserMinus size={20} />}
          color="#ea5455"
        >
          <div className="mt-1">
            <ToggleOption
              icon={<ShieldAlert size={18} className="text-danger" />}
              title={t('label-excluded')}
              description={t('label-frequentExcludedDesc')}
              isActive={isExcluded}
            >
              <Switch name="excluded" control={control} label="" />
            </ToggleOption>
          </div>
        </FormSection>

        {/* Reason Section */}
        <FormSection
          title={t('label-exclusionReason')}
          description={t('label-exclusionReasonDesc')}
          icon={<FileText size={20} />}
          color="#ff9f43"
          className="col-span-full"
        >
          <div className="mt-1">
            <Input
              name="exclusionReason"
              label={t('label-exclusionReason')}
              control={control}
              type="textarea"
              prepend={<FileText size={14} />}
              placeholder="..."
              rows={3}
            />
          </div>
        </FormSection>
      </div>

      <StickyActions>
        <ActionButtons
          cancelAction={modal?.hide}
          isSubmitting={excludeLoading}
          popover={props.popover}
          dirty={isDirty}
          onSubmit={onSubmit}
        />
      </StickyActions>
    </Form>
  )
}

export default FrequentExcludeForm
