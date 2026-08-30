import type { FC } from 'react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { ColumnDef } from '@tanstack/react-table'

import { showDisplayedRowCount } from '@/utils/helpers'
import ActionRenderer from '@/@core/components/base-table/action-renderer'
import PaymentModeDelete from '@/views/payment/modes/PaymentModeDelete'
import ActiveRenderer from '@/@core/components/base-table/active-renderer'
import CommonTable from '@/@core/components/react-table/common-react-table'

type TPaymentMode = {
  id: number
  name: string
  active: boolean
  description: string
}

const PaymentModeTable: FC<CommonTableProps> = (props) => {
  const { t } = useTranslation()

  const columns = useMemo<ColumnDef<TPaymentMode>[]>(
    () => [
      {
        accessorKey: 'name',
        header: () => t('label-name'),
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
        cell: (info) => (
          <ActionRenderer
            params={info.row.original}
            deleteElement={<PaymentModeDelete />}
            updateElement={<span />}
            formId="paymentMode"
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
      onGlobalFilterChanged={props.onGlobalFilterChanged}
      modal={props.modal}
    />
  )
}

export default PaymentModeTable
