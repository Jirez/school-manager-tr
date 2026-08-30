import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import ActiveRenderer from '@/@core/components/base-table/active-renderer'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useMemo } from 'react'
import { Coffee, Settings, Type, Timer, TimerOff, Activity } from 'lucide-react'

import TimeSlotDelete from './TimeSlotDelete'
import ActionRenderer from '@/@core/components/base-table/action-renderer'
import type { TimeSlotType } from './time.slot.type'

const TimeCell = ({ value, icon: Icon }: { value: string; icon: any }) => (
  <div className="flex items-center gap-2">
    <Icon size={14} className="text-gray-400" />
    <span className="font-medium text-gray-700 dark:text-gray-300">
      {value}
    </span>
  </div>
)

export function useTableColumns(modal?: NiceModalHandler) {
  const { t } = useTranslation()

  const columns: Array<ColumnDef<TimeSlotType>> = useMemo(
    () => [
      {
        header: () => (
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Type size={14} />
            <span className="text-xs font-semibold uppercase tracking-wider">
              {t('label-name')}
            </span>
          </div>
        ),
        accessorKey: 'name',
        cell: (info) => (
          <span className="font-bold text-gray-900 dark:text-gray-100">
            {info.getValue() as string}
          </span>
        ),
        size: 180,
      },
      {
        header: () => (
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Timer size={14} />
            <span className="text-xs font-semibold uppercase tracking-wider">
              {t('label-startTime')}
            </span>
          </div>
        ),
        accessorKey: 'startTime',
        cell: (info) => (
          <TimeCell value={info.getValue() as string} icon={Timer} />
        ),
        size: 150,
      },
      {
        header: () => (
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <TimerOff size={14} />
            <span className="text-xs font-semibold uppercase tracking-wider">
              {t('label-endTime')}
            </span>
          </div>
        ),
        accessorKey: 'endTime',
        cell: (info) => (
          <TimeCell value={info.getValue() as string} icon={TimerOff} />
        ),
        size: 150,
      },
      {
        header: () => (
          <div className="flex items-center gap-2 justify-center text-gray-600 dark:text-gray-400">
            <Coffee size={14} />
            <span className="text-xs font-semibold uppercase tracking-wider">
              {t('label-isBreakTime')}
            </span>
          </div>
        ),
        accessorKey: 'isBreakTime',
        cell: ({ row: { original } }: any) => (
          <div className="flex justify-center">
            <ActiveRenderer
              active={original.isBreakTime}
              activeText="label.yes"
              inactiveText="label.no"
              size="sm"
            />
          </div>
        ),
        size: 130,
      },
      {
        header: () => (
          <div className="flex items-center gap-2 justify-center text-gray-600 dark:text-gray-400">
            <Activity size={14} />
            <span className="text-xs font-semibold uppercase tracking-wider">
              {t('label-active')}
            </span>
          </div>
        ),
        accessorKey: 'isActive',
        cell: ({ row: { original } }: any) => (
          <div className="flex justify-center">
            <ActiveRenderer active={original.isActive} size="sm" />
          </div>
        ),
        size: 120,
      },
      {
        header: () => (
          <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
            <Settings size={14} />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Actions
            </span>
          </div>
        ),
        accessorKey: 'id',
        meta: { align: 'right' },
        cell: ({ row: { original } }) => (
          <div className="">
            <ActionRenderer
              params={original}
              deleteElement={<TimeSlotDelete />}
              updateElement={<span />}
              formId="timeSlot"
              modal={modal}
            />
          </div>
        ),
        size: 120,
      },
    ],
    [modal, t],
  )

  return { columns }
}
