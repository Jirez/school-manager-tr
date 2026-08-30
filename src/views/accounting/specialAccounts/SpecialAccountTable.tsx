import { useMemo } from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import type { ColumnDef } from '@tanstack/react-table'

import { showDisplayedRowCount } from '@/utils/helpers'
import ActionRenderer from '@/@core/components/base-table/action-renderer'
import ActiveRenderer from '@/@core/components/base-table/active-renderer'
import SpecialAccountDelete from './SpecialAccountDelete'
import type { SpecialAccountType } from './SpecialAccount.type'
import CommonTable from '@/@core/components/react-table/common-react-table'

const SpecialAccountTable: FC<CommonTableProps> = (props) => {
  const { t } = useTranslation()

  const columns = useMemo<ColumnDef<SpecialAccountType>[]>(
    () => [
      {
        accessorKey: 'specialAccountType',
        header: () => t('label-type'),
        cell: (info) => t(info.getValue() as string),
      },
      {
        accessorFn: (row) => row.account.number,
        id: 'accountNumber',
        header: () => t('label-number'),
      },
      {
        accessorFn: (row) => row.account.name,
        id: 'accountName',
        header: () => t('label-name'),
      },
      {
        accessorKey: 'selected',
        header: () => t('label-default'),
        cell: (info) => <ActiveRenderer active={info.getValue() as boolean} />,
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
            deleteElement={<SpecialAccountDelete />}
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

export default SpecialAccountTable
