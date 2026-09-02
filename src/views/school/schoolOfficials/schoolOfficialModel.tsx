import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import ActionRenderer from '@/@core/components/base-table/action-renderer'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useMemo } from 'react'
import SchoolOfficialDelete from './SchoolOfficialDelete'
import type { SchoolOfficialType } from './SchoolOfficial.type'
import { Type, Mail, UserCog, Calendar } from 'lucide-react'
import { TypeBadge } from '@/@core/components/ui/table/table.style'
import type { AppFeatures } from '#/hooks/table'

export function useTableColumns(modal?: NiceModalHandler) {
  const { t } = useTranslation()

  const columns: Array<ColumnDef<AppFeatures, SchoolOfficialType>> = useMemo(
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
        accessorKey: 'email',
        header: () => (
          <div className="flex items-center gap-1">
            <Mail size={14} />
            {t('label-email')}
          </div>
        ),
        cell: (info) => (
          <span className="text-gray-600 dark:text-gray-400 text-sm">
            {info.getValue() as string}
          </span>
        ),
        size: 200,
      },
      {
        id: 'liableType',
        header: () => (
          <div className="flex items-center gap-1">
            <UserCog size={14} />
            {t('label-officialType')}
          </div>
        ),
        accessorFn: (row) => row.liableType?.name,
        cell: (info) => (
          <TypeBadge $color="primary" className="!py-0 !px-2">
            {info.getValue() as string}
          </TypeBadge>
        ),
        size: 150,
      },
      {
        id: 'schoolYear',
        header: () => (
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            {t('label-schoolYear')}
          </div>
        ),
        accessorFn: (row) => row.schoolYear?.label,
        cell: (info) => (
          <TypeBadge $color="secondary" className="!py-0 !px-2">
            {info.getValue() as string}
          </TypeBadge>
        ),
        size: 120,
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
              deleteElement={<SchoolOfficialDelete />}
              updateElement={<span />}
              formId="schoolOfficial"
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
