import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import ActionRenderer from '@/@core/components/base-table/action-renderer'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useMemo } from 'react'
import ActiveRenderer from '@/@core/components/base-table/active-renderer'
import OfficialFunctionDelete from './OfficialFunctionDelete'
import type { OfficialFunctionType } from './OfficialFunction.type'
import { Type, Hash, FileText, Activity } from 'lucide-react'

export function useTableColumns(modal?: NiceModalHandler) {
  const { t } = useTranslation()

  const columns: Array<ColumnDef<OfficialFunctionType>> = useMemo(
    () => [
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
        accessorKey: 'prefix',
        header: () => (
          <div className="flex items-center gap-1">
            <Hash size={14} />
            {t('label-prefix')}
          </div>
        ),
        cell: (info) => (
          <span className="font-mono text-sm bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
            {info.getValue() as string}
          </span>
        ),
        size: 100,
      },
      {
        accessorKey: 'active',
        header: () => (
          <div className="flex items-center gap-1 justify-center w-full">
            <Activity size={14} />
            {t('label-active')}
          </div>
        ),
        cell: (info) => (
          <div className="flex justify-center">
            <ActiveRenderer active={info.getValue() as boolean} />
          </div>
        ),
        size: 80,
      },
      {
        accessorKey: 'note',
        header: () => (
          <div className="flex items-center gap-1">
            <FileText size={14} />
            {t('label-note')}
          </div>
        ),
        cell: (info) => {
          const note = info.getValue() as string
          return note ? (
            <span
              className="text-gray-600 dark:text-gray-400 text-sm truncate max-w-[200px] block"
              title={note}
            >
              {note}
            </span>
          ) : (
            <span className="text-gray-400 italic">-</span>
          )
        },
        size: 250,
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
              deleteElement={<OfficialFunctionDelete />}
              updateElement={<span />}
              formId="officialFunction"
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
