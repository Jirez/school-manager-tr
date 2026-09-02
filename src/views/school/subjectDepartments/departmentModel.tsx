import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import ActiveRenderer from '@/@core/components/base-table/active-renderer'
import ActionRenderer from '@/@core/components/base-table/action-renderer'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useMemo } from 'react'
import type { DepartmentType } from './Department.type'
import SubjectDepartmentDelete from './SubjectDepartmentDelete'
import { Type, Activity, Grid } from 'lucide-react'
import { TypeBadge } from '@/@core/components/ui/table/table.style'
import type { AppFeatures } from '#/hooks/table'

export function useTableColumns(modal?: NiceModalHandler) {
  const { t } = useTranslation()

  const columns: Array<ColumnDef<AppFeatures, DepartmentType>> = useMemo(
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
        size: 250,
      },
      {
        accessorKey: 'active',
        id: 'active',
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
        size: 100,
      },
      {
        accessorFn: (row) => row.schoolSection?.name,
        id: 'schoolSection',
        header: () => (
          <div className="flex items-center gap-1">
            <Grid size={14} />
            {t('label-schoolSection')}
          </div>
        ),
        cell: (info) => (
          <TypeBadge $color="secondary" className="!py-0 !px-2">
            {info.getValue() as string}
          </TypeBadge>
        ),
        size: 150,
      },
      {
        id: 'actions',
        header: () => (
          <div className="text-right w-full">{t('label-actions')}</div>
        ),
        enableHiding: false,
        cell: (info) => (
          <div className="flex justify-end">
            <ActionRenderer
              params={info.row.original}
              deleteElement={<SubjectDepartmentDelete />}
              updateElement={<span />}
              formId="department"
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
