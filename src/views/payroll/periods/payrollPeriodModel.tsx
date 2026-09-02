import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useMemo } from 'react'
import PayrollPeriodDelete from './PayrollPeriodDelete'
import ActionRenderer from '@/@core/components/base-table/action-renderer'
import type { PayrollPeriodType } from './payroll.period.type'
import dayjs from 'dayjs'
import { Calendar, Clock, Activity, CreditCard, Settings } from 'lucide-react'
import { TypeBadge } from '@/@core/components/ui/table/table.style'
import type { AppFeatures } from '#/hooks/table'

export function useTableColumns(modal?: NiceModalHandler) {
  const { t } = useTranslation()

  const columns: Array<ColumnDef<AppFeatures, PayrollPeriodType>> = useMemo(
    () => [
      {
        header: () => (
          <div className="flex items-center gap-1">
            <Calendar size={14} className="text-primary" />
            {t('label-startDate')}
          </div>
        ),
        accessorKey: 'startDate',
        cell: (info) => (
          <span className="font-semibold text-dark">
            {dayjs(info.getValue() as string).format('DD MMM YYYY')}
          </span>
        ),
        size: 150,
      },
      {
        header: () => (
          <div className="flex items-center gap-1">
            <Calendar size={14} className="text-primary" />
            {t('label-endDate')}
          </div>
        ),
        accessorKey: 'endDate',
        cell: (info) => (
          <span className="font-semibold text-dark">
            {dayjs(info.getValue() as string).format('DD MMM YYYY')}
          </span>
        ),
        size: 150,
      },
      {
        header: () => (
          <div className="flex items-center gap-1">
            <CreditCard size={14} className="text-success" />
            {t('label-paymentDate')}
          </div>
        ),
        accessorKey: 'paymentDate',
        cell: (info) => (
          <span className="text-muted">
            {dayjs(info.getValue() as string).format('DD MMM YYYY')}
          </span>
        ),
        size: 150,
      },
      {
        header: () => (
          <div className="flex gap-1">
            <Clock size={14} className="text-info" />
            {t('label-type')}
          </div>
        ),
        accessorKey: 'type',
        cell: (info) => {
          const type = info.getValue() as string
          return (
            <div className="text-center0 w-full">
              <TypeBadge $color="info" className="!py-0 !px-2 !text-[11px]">
                {t(type)}
              </TypeBadge>
            </div>
          )
        },
        size: 120,
      },
      {
        header: () => (
          <div className="flex gap-1">
            <Activity size={14} className="text-warning" />
            {t('label-status')}
          </div>
        ),
        accessorKey: 'status',
        cell: (info) => {
          const status = info.getValue() as string
          let color: any = 'secondary'
          if (status === 'OPENED') color = 'primary'
          if (status === 'PROCESSING') color = 'warning'
          if (status === 'PAID') color = 'success'
          if (status === 'CLOSED') color = 'secondary'

          return (
            <div className="text-center0 w-full">
              <TypeBadge $color={color} className="!py-0 !px-2 !text-[11px]">
                {t(status)}
              </TypeBadge>
            </div>
          )
        },
        size: 120,
      },
      {
        header: () => (
          <div className="flex gap-1 justify-center w-full text-secondary">
            <Settings size={14} />
            {t('label-actions')}
          </div>
        ),
        id: 'actions',
        meta: {
          align: 'right',
        },
        cell: ({ row: { original } }) => (
          <div className="">
            <ActionRenderer
              params={original}
              deleteElement={<PayrollPeriodDelete />}
              updateElement={<span />}
              formId="period"
              modal={modal}
            />
          </div>
        ),
        size: 100,
      },
    ],
    [modal, t],
  )

  return { columns }
}
