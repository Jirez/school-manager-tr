import { useMemo } from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import type { ColumnDef } from '@tanstack/react-table'

import { showDisplayedRowCount } from '@/utils/helpers'
import ActionRenderer from '@/@core/components/base-table/action-renderer'
import ActiveRenderer from '@/@core/components/base-table/active-renderer'
import AccountGroupDelete from '@/views/accounting/groups/AccountGroupDelete'
import type { AccountGroupType } from '@/views/accounting/groups/AccountGroup.type'
import CommonTable from '@/@core/components/react-table/common-react-table'

const AccountGroupTable: FC<CommonTableProps> = (props) => {
  const { t } = useTranslation()

  const columns = useMemo<ColumnDef<AccountGroupType>[]>(
    () => [
      {
        accessorKey: 'name',
        header: () => t('label-name'),
      },
      {
        accessorKey: 'sectionType',
        header: () => t('label-section'),
        cell: (info) => t(info.getValue() as string),
      },
      {
        accessorKey: 'active',
        header: () => t('label-active'),
        cell: (info) => <ActiveRenderer active={info.getValue() as boolean} />,
      },
      {
        accessorFn: (row) => row.parent?.name,
        id: 'parent',
        header: () => t('label-name'),
      },
      {
        accessorFn: (row) => row.accountModel.name,
        id: 'accountModel',
        header: () => t('label-name'),
      },
      {
        accessorKey: 'description',
        header: () => t('label-description'),
      },
      {
        id: 'actions',
        header: () => t('label-actions'),
        cell: ({ row: { original } }) => (
          <ActionRenderer
            params={original}
            deleteElement={<AccountGroupDelete />}
            updateElement={<span />}
            formId="accountGroup"
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

export default AccountGroupTable
