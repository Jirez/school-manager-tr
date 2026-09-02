import type { FC } from 'react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import type { ColumnDef } from '@tanstack/react-table'

import { showDisplayedRowCount } from '@/utils/helpers'
import ActionRenderer from '@/@core/components/base-table/action-renderer'
import PayrollPeriodDelete from './PayrollPeriodDelete'
import type { PayrollPeriodType } from './payroll.period.type'
import CommonTable from '@/@core/components/react-table/common-react-table'
import type { AppFeatures } from '#/hooks/table'

const PayrollPeriodTable: FC<CommonTableProps> = (props) => {
  const { t } = useTranslation()

  const columns = useMemo<ColumnDef<AppFeatures, PayrollPeriodType>[]>(
    () => [
      {
        accessorFn: (row) => row.exercise.designation,
        id: 'exercise',
        header: () => t('label-exercise'),
      },
      {
        accessorKey: 'designation',
        header: () => t('label-designation'),
      },
      {
        accessorKey: 'startDate',
        header: () => t('label-startDate'),
        cell: (info) => dayjs(info.getValue() as string).format('DD MMM YYYY'),
      },
      {
        accessorKey: 'endDate',
        header: () => t('label-endDate'),
        cell: (info) => dayjs(info.getValue() as string).format('DD MMM YYYY'),
      },
      {
        accessorKey: 'paymentDate',
        header: () => t('label-paymentDate'),
        cell: (info) => dayjs(info.getValue() as string).format('DD MMM YYYY'),
      },
      {
        accessorKey: 'closingDate',
        header: () => t('label-closingDate'),
        cell: (info) =>
          info.getValue()
            ? dayjs(info.getValue() as string).format('DD MMM YYYY')
            : '-',
      },
      {
        id: 'actions',
        header: () => t('label-actions'),
        cell: ({ row: { original } }) => (
          <ActionRenderer
            params={original}
            deleteElement={<PayrollPeriodDelete />}
            updateElement={<span />}
            formId="period"
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

export default PayrollPeriodTable
