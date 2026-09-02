import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import type { SchoolYearType } from './SchoolYear.type'
import SchoolYearDelete from './SchoolYearDelete'
import ActiveRenderer from '@/@core/components/base-table/active-renderer'
import ActionRenderer from '@/@core/components/base-table/action-renderer'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useMemo } from 'react'
import dayjs from 'dayjs'
import { Calendar, Tag, Archive, Hash, Activity } from 'lucide-react'
import { SkuText, CompactDate } from '@/@core/components/ui/table/table.style'
import type { AppFeatures } from '#/hooks/table'

export function useTableColumns(modal?: NiceModalHandler) {
  const { t } = useTranslation()

  const columns: Array<ColumnDef<AppFeatures, SchoolYearType>> = useMemo(
    () => [
      {
        accessorKey: 'label',
        header: () => (
          <div className="flex items-center gap-1">
            <Tag size={14} className="text-primary" />
            {t('label-designation')}
          </div>
        ),
        cell: (info) => (
          <span className="font-bold text-gray-800 dark:text-gray-200">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: 'startDate',
        header: () => (
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            {t('label-startDate')}
          </div>
        ),
        cell: (info) => (
          <CompactDate>
            <Calendar size={12} />
            {dayjs(info.getValue() as string).format('DD MMM YYYY')}
          </CompactDate>
        ),
      },
      {
        accessorKey: 'endDate',
        header: () => (
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            {t('label-endDate')}
          </div>
        ),
        cell: (info) => (
          <CompactDate>
            <Calendar size={12} />
            {dayjs(info.getValue() as string).format('DD MMM YYYY')}
          </CompactDate>
        ),
      },
      {
        accessorKey: 'current',
        header: () => (
          <div className="flex items-center gap-1 justify-center w-full">
            <Activity size={14} />
            {t('label-default')}
          </div>
        ),
        cell: (info) => (
          <div className="flex justify-center">
            <ActiveRenderer
              active={info.getValue() as boolean}
              activeText="label.yes"
              inactiveText="label.no"
            />
          </div>
        ),
        size: 100,
      },
      {
        accessorKey: 'archived',
        header: () => (
          <div className="flex items-center gap-1 justify-center w-full">
            <Archive size={14} />
            {t('label-archived')}
          </div>
        ),
        cell: (info) => (
          <div className="flex justify-center">
            <ActiveRenderer
              active={info.getValue() as boolean}
              activeText="label.yes"
              inactiveText="label.no"
            />
          </div>
        ),
        size: 100,
      },
      {
        accessorKey: 'id',
        header: () => (
          <div className="flex items-center gap-1 justify-center w-full">
            <Hash size={14} />
            ID
          </div>
        ),
        cell: (info) => (
          <div className="flex justify-center">
            <SkuText>{info.getValue() as string}</SkuText>
          </div>
        ),
        size: 80,
      },
      {
        id: 'actions',
        header: () => (
          <div className="text-right w-full">{t('label-actions')}</div>
        ),
        cell: (info) => (
          <div className="flex justify-end">
            <ActionRenderer
              params={info.row.original}
              deleteElement={<SchoolYearDelete />}
              updateElement={<span />}
              formId="schoolYear"
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
