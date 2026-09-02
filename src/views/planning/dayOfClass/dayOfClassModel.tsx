import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import ActiveRenderer from '@/@core/components/base-table/active-renderer'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useMemo } from 'react'
import { Calendar, Timer, TimerOff, Activity, Settings } from 'lucide-react'

import ActionRenderer from '@/@core/components/base-table/action-renderer'
import type { DayOfClassType } from './day.of.class.type'
import DayOfClassDelete from './DayOfClassDelete'
import type { AppFeatures } from '#/hooks/table'

const TimeCell = ({ value, icon: Icon }: { value?: string; icon: any }) => (
  <div className="flex items-center gap-2">
    <Icon size={14} className="text-gray-400" />
    <span className="font-medium text-gray-700 dark:text-gray-300">
      {value || '-'}
    </span>
  </div>
)

export function useTableColumns(modal?: NiceModalHandler) {
  const { t } = useTranslation()

  const columns: Array<ColumnDef<AppFeatures, DayOfClassType>> = useMemo(
    () => [
      {
        header: () => (
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Calendar size={14} />
            <span className="text-xs font-semibold uppercase tracking-wider">
              {t('label-dayOfWeek')}
            </span>
          </div>
        ),
        accessorKey: 'dayOfWeek',
        cell: ({ row: { original } }: any) => (
          <span className="font-bold text-gray-900 dark:text-gray-100">
            {t(original.dayOfWeek)}
          </span>
        ),
        size: 180,
      },
      {
        header: () => (
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Timer size={14} />
            <span className="text-xs font-semibold uppercase tracking-wider">
              {t('label-openingTime')}
            </span>
          </div>
        ),
        accessorKey: 'openingTime.startTime',
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
              {t('label-closingTime')}
            </span>
          </div>
        ),
        accessorKey: 'closingTime.endTime',
        cell: (info) => (
          <TimeCell value={info.getValue() as string} icon={TimerOff} />
        ),
        size: 150,
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
        accessorKey: 'active',
        cell: ({ row: { original } }: any) => (
          <div className="flex justify-center">
            <ActiveRenderer
              active={original.active}
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
          <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
            <Settings size={14} />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Actions
            </span>
          </div>
        ),
        accessorKey: 'id',
        meta: {
          align: 'right',
        },
        cell: ({ row: { original } }) => (
          <div className="">
            <ActionRenderer
              params={original}
              deleteElement={<DayOfClassDelete />}
              updateElement={<span />}
              formId="dayOfClass"
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
