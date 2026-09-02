import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import ActionRenderer from '@/@core/components/base-table/action-renderer'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useMemo } from 'react'
import ActiveRenderer from '@/@core/components/base-table/active-renderer'
import SchoolSectionDelete from './SchoolSectionDelete'
import type { SchoolSectionType } from './SchoolSectionType'
import { Type, Globe, Activity } from 'lucide-react'
import { TypeBadge } from '@/@core/components/ui/table/table.style'
import type { AppFeatures } from '#/hooks/table'

export function useTableColumns(modal?: NiceModalHandler) {
  const { t } = useTranslation()

  const columns: Array<ColumnDef<AppFeatures, SchoolSectionType>> = useMemo(
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
        id: 'language',
        header: () => (
          <div className="flex items-center gap-1">
            <Globe size={14} />
            {t('label-language')}
          </div>
        ),
        accessorFn: (row) => row.language?.name,
        cell: (info) => (
          <TypeBadge $color="primary" className="!py-0 !px-2">
            {info.getValue() as string}
          </TypeBadge>
        ),
        size: 150,
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
        id: 'actions',
        header: () => (
          <div className="text-right w-full">{t('label-actions')}</div>
        ),
        cell: (info) => (
          <div className="flex justify-end">
            <ActionRenderer
              params={info.row.original}
              deleteElement={<SchoolSectionDelete />}
              updateElement={<span />}
              formId="schoolSection"
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
