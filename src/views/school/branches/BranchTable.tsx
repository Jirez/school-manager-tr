import type { FC } from 'react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { ColumnDef } from '@tanstack/react-table'

import { showDisplayedRowCount } from '@/utils/helpers'
import ActionRenderer from '@/@core/components/base-table/action-renderer'
import BranchDelete from '@/views/school/branches/BranchDelete'
import CommonTable from '@/@core/components/react-table/common-react-table'
import type { BranchType } from './Branch.type'

const BranchTable: FC<CommonTableProps> = (props) => {
  const { t } = useTranslation()

  const columns = useMemo<ColumnDef<BranchType>[]>(
    () => [
      {
        header: () => t('label-name'),
        accessorKey: 'name',
      },
      {
        id: 'level',
        header: () => t('label-level'),
        accessorFn: (row) => row.level.name,
      },
      {
        id: 'cycle',
        header: () => t('label-cycle'),
        accessorFn: (row) => row.level.cycle.name,
      },
      {
        id: 'subjectCount',
        header: () => t('label-subjectCount'),
        cell: (info) => (
          <span>
            {info.row.original?.subjectBranchCollection
              ? info.row.original?.subjectBranchCollection.length
              : 0}
          </span>
        ),
      },
      {
        id: 'totalCoefficient',
        header: () => t('label-totalCoefficient'),
        cell: (info) => {
          let total = 0
          if (
            info.row.original?.subjectBranchCollection &&
            info.row.original?.subjectBranchCollection.length > 0
          ) {
            total = info.row.original?.subjectBranchCollection
              .filter(({ coefficient }: any) => coefficient !== null)
              .map(({ coefficient }: any) => coefficient)
              .reduce((a: number, b: number) => a + b)
          }
          return <span>{total}</span>
        },
      },
      {
        id: 'actions',
        header: () => t('label-actions'),
        cell: (info) => (
          <ActionRenderer
            params={info.row.original}
            deleteElement={<BranchDelete />}
            updateElement={<span />}
            formId="branch"
            modal={props.modal}
          />
        ),
      },
    ],
    [t, props.modal],
  )

  return (
    <CommonTable
      data={props.dataSource!}
      columns={columns}
      onModelUpdate={(rows) => showDisplayedRowCount(rows)}
      showQuickFilter={false}
      onGlobalFilterChanged={props.onGlobalFilterChanged}
    />
  )
}

export default BranchTable
