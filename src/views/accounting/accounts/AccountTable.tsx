import { useMemo } from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import type { ColumnDef } from '@tanstack/react-table'

import { showDisplayedRowCount } from '@/utils/helpers'
import ActionRenderer from '@/@core/components/base-table/action-renderer'
import ActiveRenderer from '@/@core/components/base-table/active-renderer'
import AccountDelete from './AccountDelete'
import type { AccountType } from './Account.type'
import CommonTable from '@/@core/components/react-table/common-react-table'

const AccountTable: FC<CommonTableProps> = (props) => {
  const { t } = useTranslation()

  const columns = useMemo<ColumnDef<AccountType>[]>(
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
        accessorKey: 'displayName',
        header: () => t('label-displayNameAccount'),
      },
      {
        accessorKey: 'active',
        header: () => t('label-active'),
        cell: (info) => <ActiveRenderer active={info.getValue() as boolean} />,
      },
      {
        accessorFn: (row) => row.chartOfAccount.accountCategory.accountType,
        id: 'accountType',
        header: () => t('label-type'),
      },
      {
        accessorFn: (row) => row.chartOfAccount.accountCategory.name,
        id: 'accountCategory',
        header: () => t('label-detailedType'),
      },
      {
        id: 'actions',
        header: () => t('label-actions'),
        cell: ({ row: { original } }) => (
          <ActionRenderer
            params={original}
            deleteElement={<AccountDelete />}
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

export default AccountTable
