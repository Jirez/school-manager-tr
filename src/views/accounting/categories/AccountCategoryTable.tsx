import { useMemo } from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import type { ColumnDef } from '@tanstack/react-table'

import { showDisplayedRowCount } from '@/utils/helpers'
import ActionRenderer from '@/@core/components/base-table/action-renderer'
import ActiveRenderer from '@/@core/components/base-table/active-renderer'
import AccountCategoryDelete from '@/views/accounting/categories/AccountCategoryDelete'
import type { AccountCategoryType } from '@/views/accounting/categories/AccountCategory.type'
import CommonTable from '@/@core/components/react-table/common-react-table'

const AccountCategoryTable: FC<CommonTableProps> = (props) => {
  const { t } = useTranslation()

  const columns = useMemo<ColumnDef<AccountCategoryType>[]>(
    () => [
      {
        accessorKey: 'name',
        header: () => t('label-name'),
      },
      {
        accessorKey: 'accountType',
        header: () => t('label-accountType'),
        cell: (info) => t(info.getValue() as string),
      },
      {
        accessorKey: 'active',
        header: () => t('label-active'),
        cell: (info) => <ActiveRenderer active={info.getValue() as boolean} />,
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
            deleteElement={<AccountCategoryDelete />}
            updateElement={<span />}
            formId="category"
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

export default AccountCategoryTable
