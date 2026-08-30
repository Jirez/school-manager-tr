import type { FC } from 'react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { ColumnDef } from '@tanstack/react-table'

import { showDisplayedRowCount } from '@/utils/helpers'
import ActionRenderer from '@/@core/components/base-table/action-renderer'
import ActiveRenderer from '@/@core/components/base-table/active-renderer'
import PaymentGroupDelete from '@/views/payment/groups/PaymentGroupDelete'
import type { PaymentGroupType } from '@/views/payment/groups/PaymentGroup.type'
import CommonTable from '@/@core/components/react-table/common-react-table'

const PaymentGroupTable: FC<CommonTableProps> = (props) => {
  const { t } = useTranslation()

  const columns = useMemo<ColumnDef<PaymentGroupType>[]>(
    () => [
      {
        accessorKey: 'name',
        header: () => t('label-name'),
      },
      {
        accessorKey: 'name2',
        header: () => t('label-name2'),
      },
      {
        accessorKey: 'autoInclusion',
        header: () => t('label-autoInclusion'),
        cell: (info) => (
          <ActiveRenderer
            active={info.getValue() as boolean}
            activeText="label.yes"
            inactiveText="label.no"
          />
        ),
      },
      {
        accessorKey: 'formerStudent',
        header: () => t('label-formerStudent'),
        cell: (info) => (
          <ActiveRenderer
            active={info.getValue() as boolean}
            activeText="label.yes"
            inactiveText="label.no"
          />
        ),
      },
      {
        accessorKey: 'external',
        header: () => t('label-external'),
        cell: (info) => (
          <ActiveRenderer
            active={info.getValue() as boolean}
            activeText="label.yes"
            inactiveText="label.no"
          />
        ),
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
            deleteElement={<PaymentGroupDelete />}
            updateElement={<span />}
            formId="paymentGroup"
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

export default PaymentGroupTable
