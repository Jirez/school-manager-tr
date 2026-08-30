import type { FC } from 'react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import type { ColumnDef } from '@tanstack/react-table'

import { showDisplayedRowCount } from '@/utils/helpers'
import ActionRenderer from '@/@core/components/base-table/action-renderer'
import ActiveRenderer from '@/@core/components/base-table/active-renderer'
import PaymentSliceDelete from '@/views/payment/slices/PaymentSliceDelete'
import type { PaymentSliceType } from './PaymentSlice.type'
import CommonTable from '@/@core/components/react-table/common-react-table'

const PaymentSliceTable: FC<CommonTableProps> = (props) => {
  const { t } = useTranslation()

  const columns = useMemo<ColumnDef<PaymentSliceType>[]>(
    () => [
      {
        accessorKey: 'numberOrder',
        header: () => t('label-numberOrder'),
      },
      {
        accessorKey: 'name',
        header: () => t('label-name'),
      },
      {
        accessorKey: 'name2',
        header: () => t('label-name2'),
      },
      {
        accessorKey: 'refundable',
        header: () => t('label-refundable'),
        cell: (info) => (
          <ActiveRenderer
            active={info.getValue() as boolean}
            activeText="label.yes"
            inactiveText="label.no"
          />
        ),
      },
      {
        accessorKey: 'deadline',
        header: () => t('label-deadline'),
        cell: (info) => dayjs(info.getValue() as string).format('DD MMM YYYY'),
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
            deleteElement={<PaymentSliceDelete />}
            updateElement={<span />}
            formId="paymentSlice"
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

export default PaymentSliceTable
