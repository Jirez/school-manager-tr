import { useMemo } from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import type { ColumnDef } from '@tanstack/react-table'

import { formatNumber, showDisplayedRowCount } from '@/utils/helpers'
import ActionRenderer from '@/@core/components/base-table/action-renderer'
import AccountingEntryDelete from './AccountingEntryDelete'
import type { AccountingEntryType } from './AccountingEntry.type'
import CommonTable from '@/@core/components/react-table/common-react-table'
import type { AppFeatures } from '#/hooks/table'

const AccountingEntryTable: FC<CommonTableProps> = (props) => {
  const { t, i18n } = useTranslation()

  const columns = useMemo<ColumnDef<AppFeatures, AccountingEntryType>[]>(
    () => [
      {
        accessorKey: 'operationDate',
        header: () => t('label-operationDate'),
        cell: (info) => dayjs(info.getValue() as string).format('DD MMM YYYY'),
      },
      {
        accessorKey: 'number',
        header: () => t('label-number'),
      },
      {
        accessorKey: 'amount',
        header: () => t('label-total'),
        cell: (info) => formatNumber(Number(info.getValue()), i18n.language),
      },
      {
        accessorKey: 'id',
        header: 'Id',
      },
      {
        id: 'actions',
        header: () => t('label-actions'),
        cell: ({ row: { original } }) => (
          <ActionRenderer
            params={original}
            deleteElement={<AccountingEntryDelete />}
            updateElement={<span />}
            formId="journal"
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

export default AccountingEntryTable
