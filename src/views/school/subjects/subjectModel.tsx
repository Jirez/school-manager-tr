import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import type { Subject } from './Subject.type'
import SubjectDelete from './SubjectDelete'
import ActiveRenderer from '@/@core/components/base-table/active-renderer'
import ActionRenderer from '@/@core/components/base-table/action-renderer'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useMemo } from 'react'
import { TypeBadge } from '@/@core/components/ui/table/table.style'
import type { AppFeatures } from '#/hooks/table'

export function useTableColumns(modal?: NiceModalHandler) {
  const { t } = useTranslation()

  const columns: Array<ColumnDef<AppFeatures, Subject>> = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: () => t('label-name'),
      },
      {
        accessorKey: 'displayName',
        header: () => t('label-displayName'),
      },
      {
        accessorKey: 'active',
        header: () => t('label-active'),
        cell: (info) => (
          <ActiveRenderer
            active={info.getValue() as boolean}
            inactiveText="label.no"
            activeText="label.yes"
          />
        ),
        size: 30,
      },
      {
        accessorFn: (row) => row.subjectDepartment?.name,
        id: 'subjectDepartment',
        header: () => t('label-department'),
        cell: (info) => {
          const val = info.getValue() as string
          return val ? <TypeBadge $color="info">{val}</TypeBadge> : '-'
        },
      },
      {
        accessorFn: (row) => row.subjectDepartment?.schoolSection?.name,
        id: 'schoolSection',
        header: () => t('label-schoolSection'),
        cell: (info) => {
          const val = info.getValue() as string
          return val ? <TypeBadge $color="warning">{val}</TypeBadge> : '-'
        },
      },
      {
        accessorKey: 'id',
        header: () => 'Id',
        size: 15,
      },
      {
        id: 'actions',
        header: () => t('label-actions'),
        meta: { align: 'right' },
        cell: (info) => (
          <ActionRenderer
            params={info.row.original}
            deleteElement={<SubjectDelete />}
            updateElement={<span />}
            formId="subject"
            modal={modal}
          />
        ),
        size: 50,
      },
    ],
    [modal, t],
  )

  return { columns }
}
