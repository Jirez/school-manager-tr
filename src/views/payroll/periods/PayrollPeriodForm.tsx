import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { Form } from 'reactstrap'
import { toast } from 'react-toastify'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { Clock, CheckCircle, Settings, CalendarRange } from 'lucide-react'

import { useAuthentication } from '@/hooks/useAuthentication'
import type { PayrollPeriodType } from './payroll.period.type'
import DatePicker from '@/@core/components/ui/forms/date-picker'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import Input from '@/@core/components/ui/forms/input'
import dayjs from 'dayjs'
import { formatError } from '@/utils/ErrorHelper'
import { payrollPeriodValidationSchema } from './payrollPeriod.validation'
import { yupResolver } from '@hookform/resolvers/yup'
import { INPUT_DATE_FORMAT } from '@/utils/constants'
import FormSection from '@/@core/components/ui/forms/form-section'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'

interface PayrollPeriodFormProps extends BaseFormProps {
  period?: PayrollPeriodType
  modal?: NiceModalHandler
}

const initialValues: Partial<PayrollPeriodType> = {
  startDate: null,
  endDate: null,
  paymentDate: null,
}

const PayrollPeriodForm: FC<PayrollPeriodFormProps> = ({
  period,
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
  } = useForm<PayrollPeriodType>({
    defaultValues: {
      startDate: period ? dayjs(period.startDate).toDate() : null,
      endDate: period ? dayjs(period.endDate).toDate() : null,
      paymentDate: period ? dayjs(period.paymentDate).toDate() : null,
      type: period ? period.type : 'MONTHLY',
      status: period ? period.status : 'OPENED',
    },
    resolver: yupResolver(payrollPeriodValidationSchema),
  })

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    close?: boolean,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      const id = period?.id
      action({
        variables: {
          period: {
            ...values,
            id: id,
            startDate: dayjs(values.startDate).format(INPUT_DATE_FORMAT),
            endDate: dayjs(values.endDate).format(INPUT_DATE_FORMAT),
            paymentDate: dayjs(values.paymentDate).format(INPUT_DATE_FORMAT),
            enterpriseId: enterpriseId,
          },
        },
      })
        .then(async ({ data }) => {
          reset(initialValues)
          toast.info(`Période de paie enregistrée`)
          if (close) {
            modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(
            `Impossible d'enregistrer la période de paie : ${formatError(
              error,
            )}`,
          )
        })
    })(event)
  }

  return (
    <Form onSubmit={onSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-1 gap-y-1">
        <FormSection
          title={t('label-payrollPeriod') || 'Période de paie'}
          description={
            t('label-payrollPeriodDesc') || 'Configuration de la période'
          }
          icon={<Settings size={18} />}
          color="#7367f0"
        >
          <div className="space-y-3">
            <Input
              name="type"
              control={control}
              label={t('label-type')}
              type="select"
              required
              prepend={<Clock size={16} />}
            >
              <option value="">{t('label-select')}</option>
              <option value="WEEKLY">{t('WEEKLY')}</option>
              <option value="BI_WEEKLY">{t('BI_WEEKLY')}</option>
              <option value="SEMI_MONTHLY">{t('SEMI_MONTHLY')}</option>
              <option value="MONTHLY">{t('MONTHLY')}</option>
            </Input>

            <Input
              name="status"
              control={control}
              label={t('label-status')}
              type="select"
              required
              prepend={<CheckCircle size={16} />}
            >
              <option value="">{t('label-select')}</option>
              <option value="OPENED">{t('OPENED')}</option>
              <option value="PROCESSING">{t('PROCESSING')}</option>
              <option value="PAID">{t('PAID')}</option>
              <option value="CLOSED">{t('CLOSED')}</option>
            </Input>
          </div>
        </FormSection>

        <FormSection
          title={t('label-schedule') || 'Calendrier'}
          description={
            t('label-scheduleDesc') || 'Dates de début, de fin et de paiement'
          }
          icon={<CalendarRange size={18} />}
          color="#28c76f"
        >
          <div className="space-y-3">
            <DatePicker
              name="startDate"
              label={t('label-startDate')}
              control={control}
              required
            />

            <DatePicker
              name="endDate"
              label={t('label-endDate')}
              control={control}
              required
            />

            <DatePicker
              name="paymentDate"
              label={t('label-paymentDate')}
              control={control}
              required
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

export default PayrollPeriodForm
