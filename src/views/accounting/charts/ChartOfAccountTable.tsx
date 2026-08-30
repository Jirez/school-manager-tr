import { useMemo } from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import type { ColumnDef } from '@tanstack/react-table'

import { showDisplayedRowCount } from '@/utils/helpers'
import ActionRenderer from '@/@core/components/base-table/action-renderer'
import ActiveRenderer from '@/@core/components/base-table/active-renderer'
import ChartOfAccountDelete from './ChartOfAccountDelete'
import type { ChartOfAccountType } from './ChartOfAccount.type'
import CommonTable from '@/@core/components/react-table/common-react-table'

const ChartOfAccountTable: FC<CommonTableProps> = (props) => {
  const { t } = useTranslation()

  const columns = useMemo<ColumnDef<ChartOfAccountType>[]>(
    () => [
      {
        accessorKey: 'number',
        header: () => t('label-number'),
      },
      {
        accessorKey: 'name',
        header: () => t('label-name'),
      },
      {
        accessorFn: (row) => row.parent?.name,
        id: 'parent',
        header: () => t('label-parent'),
      },
      {
        accessorKey: 'active',
        header: () => t('label-active'),
        cell: (info) => <ActiveRenderer active={info.getValue() as boolean} />,
      },
      {
        accessorFn: (row) => row.accountGroup?.name,
        id: 'accountGroup',
        header: () => t('label-parent'),
      },
      {
        accessorFn: (row) => row.accountCategory?.name,
        id: 'accountCategory',
        header: () => t('label-parent'),
      },
      {
        accessorKey: 'note',
        header: () => t('label-note'),
      },
      {
        id: 'actions',
        header: () => t('label-actions'),
        cell: ({ row: { original } }) => (
          <ActionRenderer
            params={original}
            deleteElement={<ChartOfAccountDelete />}
            updateElement={<span />}
            formId="account"
            modal={props.modal}
          />
        ),
      },
    ],
    [],
  )

  return (
    <CommonTable
      data={props.dataSource!}
      columns={columns}
      onModelUpdate={(rows) => showDisplayedRowCount(rows)}
      showQuickFilter={false}
      onGlobalFilterChanged={props.onGlobalFilterChanged}
      modal={props.modal}
    />
  )
}

export default ChartOfAccountTable
