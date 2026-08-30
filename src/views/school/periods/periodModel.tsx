import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import ActionRenderer from '@/@core/components/base-table/action-renderer'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useMemo } from 'react'
import dayjs from 'dayjs'
import PeriodDelete from './PeriodDelete'
import type { PeriodType } from './Period.type'
import { Calendar, Tag, Hash, Layers, ListOrdered } from 'lucide-react'
import { SkuText, CompactDate } from '@/@core/components/ui/table/table.style'

export function useTableColumns(modal?: NiceModalHandler) {
  const { t } = useTranslation()

  const columns: Array<ColumnDef<PeriodType>> = useMemo(
    () => [
      {
        accessorKey: 'numberOrder',
        header: () => (
          <div className="flex items-center gap-1 justify-center w-full">
            <ListOrdered size={14} />
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
        size: 200,
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
        size: 140,
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
        size: 140,
      },
      {
        accessorKey: 'coefficient',
        header: () => (
          <div className="flex items-center gap-1 justify-center w-full">
            <Layers size={14} />
            {t('label-coefficient')}
          </div>
        ),
        cell: (info) => (
          <div className="flex justify-center">
            <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">
              {info.getValue() as number}
            </span>
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
              deleteElement={<PeriodDelete />}
              updateElement={<span />}
              formId="period"
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
