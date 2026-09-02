import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import ActiveRenderer from '@/@core/components/base-table/active-renderer'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useMemo } from 'react'
import InstallmentDelete from './InstallmentDelete'
import ActionRenderer from '@/@core/components/base-table/action-renderer'
import type { InstallmentType } from './installment.type'
import dayjs from 'dayjs'
import {
  ListOrdered,
  Type,
  Activity,
  RotateCcw,
  Calendar,
  Clock,
  Percent,
  Settings,
} from 'lucide-react'
import { TypeBadge } from '@/@core/components/ui/table/table.style'
import type { AppFeatures } from '#/hooks/table'

export function useTableColumns(modal?: NiceModalHandler) {
  const { t } = useTranslation()

  const columns: Array<ColumnDef<AppFeatures, InstallmentType>> = useMemo(
    () => [
      {
        accessorKey: 'numberOrder',
        header: () => (
          <div className="flex items-center gap-1 justify-center w-full">
            <ListOrdered size={14} className="text-primary" />
            {t('label-numberOrder')}
          </div>
        ),
        cell: (info) => (
          <div className="flex justify-center">
            <span className="font-semibold text-primary">
              {info.getValue() as number}
            </span>
          </div>
        ),
        size: 80,
      },
      {
        accessorKey: 'name',
        header: () => (
          <div className="flex items-center gap-1">
            <Type size={14} className="text-primary" />
            {t('label-name')}
          </div>
        ),
        cell: (info) => (
          <span className="font-bold text-gray-800 dark:text-gray-200">
            {info.getValue() as string}
          </span>
        ),
        size: 200,
      },
      {
        accessorKey: 'name2',
        header: () => (
          <div className="flex items-center gap-1">
            <Type size={14} className="text-muted" />
            {t('label-name2')}
          </div>
        ),
        cell: (info) => (
          <span className="text-muted text-[11px]">
            {(info.getValue() as string) || '-'}
          </span>
        ),
        size: 180,
      },
      {
        accessorKey: 'isActive',
        header: () => (
          <div className="flex items-center gap-1 justify-center w-full">
            <Activity size={14} className="text-warning" />
            {t('label-active')}
          </div>
        ),
        cell: (info) => (
          <div className="flex justify-center">
            <ActiveRenderer active={info.getValue() as boolean} />
          </div>
        ),
        size: 100,
      },
      {
        accessorKey: 'isRefundable',
        header: () => (
          <div className="flex items-center gap-1 justify-center w-full">
            <RotateCcw size={14} className="text-info" />
            {t('label-refundable')}
          </div>
        ),
        cell: (info) => (
          <div className="flex justify-center">
            <TypeBadge
              $color={info.getValue() ? 'info' : 'secondary'}
              className="!py-0 !px-2 !text-[10px]"
            >
              {info.getValue() ? t('label-yes') : t('label-no')}
            </TypeBadge>
          </div>
        ),
        size: 110,
      },
      {
        accessorKey: 'dueDate',
        header: () => (
          <div className="flex items-center gap-1">
            <Calendar size={14} className="text-danger" />
            {t('label-deadline')}
          </div>
        ),
        cell: (info) => (
          <span className="text-danger font-medium text-[11px]">
            {dayjs(info.getValue() as string).format('DD MMM YYYY')}
          </span>
        ),
        size: 130,
      },
      {
        accessorKey: 'gracePeriodDays',
        header: () => (
          <div className="flex items-center gap-1 justify-center w-full">
            <Clock size={14} className="text-secondary" />
            {t('label-gracePeriodDays')}
          </div>
        ),
        cell: (info) => (
          <div className="text-center font-medium">
            {info.getValue() as number}
          </div>
        ),
        size: 120,
      },
      {
        accessorKey: 'lateFeePercentage',
        header: () => (
          <div className="flex items-center gap-1 justify-center w-full">
            <Percent size={14} className="text-danger" />
            {t('label-lateFeePercentage')}
          </div>
        ),
        cell: (info) => (
          <div className="text-center font-bold text-danger">
            {info.getValue() as number}%
          </div>
        ),
        size: 120,
      },
      {
        id: 'actions',
        header: () => (
          <div className="flex items-center gap-1 justify-center w-full text-secondary">
            <Settings size={14} />
            {t('label-actions')}
          </div>
        ),
        cell: ({ row: { original } }) => (
          <div className="flex justify-center">
            <ActionRenderer
              params={original}
              deleteElement={<InstallmentDelete />}
              updateElement={<span />}
              formId="installment"
              modal={modal}
            />
          </div>
        ),
        size: 80,
      },
    ],
    [modal, t],
  )

  return { columns }
}
