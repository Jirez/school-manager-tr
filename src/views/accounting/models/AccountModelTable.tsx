import { useMemo } from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import type { ColumnDef } from '@tanstack/react-table'

import { showDisplayedRowCount } from '@/utils/helpers'
import ActionRenderer from '@/@core/components/base-table/action-renderer'
import ActiveRenderer from '@/@core/components/base-table/active-renderer'
import AccountModelDelete from '@/views/accounting/models/AccountModelDelete'
import type { AccountModelType } from './AccountModel.type'
import CommonTable from '@/@core/components/react-table/common-react-table'

const AccountModelTable: FC<CommonTableProps> = (props) => {
  const { t } = useTranslation()

  const columns = useMemo<ColumnDef<AccountModelType>[]>(
    () => [
      {
        accessorKey: 'code',
        header: () => t('label-code'),
      },
      {
        accessorKey: 'name',
        header: () => t('label-name'),
      },
      {
        accessorKey: 'languageType',
        header: () => t('label-language'),
        cell: (info) => t(info.getValue() as string),
      },
      {
        accessorKey: 'active',
        header: () => t('label-active'),
        cell: (info) => <ActiveRenderer active={info.getValue() as boolean} />,
      },
      {
        accessorKey: 'current',
        header: () => t('label-default'),
        cell: (info) => (
          <ActiveRenderer
            active={info.getValue() as boolean}
            activeText="label.yes"
            inactiveText="label.no"
          />
        ),
      },
      {
        accessorKey: 'country',
        header: () => t('label-country'),
      },
      {
        id: 'actions',
        header: () => t('label-actions'),
        cell: ({ row: { original } }) => (
          <ActionRenderer
            params={original}
            deleteElement={<AccountModelDelete />}
            updateElement={<span />}
            formId="accountModel"
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

export default AccountModelTable
