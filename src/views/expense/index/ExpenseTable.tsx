import { useMemo } from 'react'
import type { FC } from 'react'
import { showDisplayedRowCount, toCurrency } from '@/utils/helpers'
import ActionRenderer from '@/@core/components/base-table/action-renderer'
import { useTranslation } from 'react-i18next'
import type { ColumnDef } from '@tanstack/react-table'
import CommonTable from '@/@core/components/react-table/common-react-table'
import dayjs from 'dayjs'
import type { ExpenseType } from './expense.type'
import ExpenseDelete from './ExpenseDelete'
import {
  Calendar,
  Hash,
  DollarSign,
  Package,
  FileText,
  MoreVertical,
} from 'lucide-react'

const ExpenseTable: FC<CommonTableProps> = (props) => {
  const { t } = useTranslation()

  const columns = useMemo<ColumnDef<ExpenseType>[]>(
    () => [
      {
        id: 'operationDate',
        header: () => (
          <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-semibold">
            <Calendar size={16} />
            {t('label-operationDate')}
          </div>
        ),
        accessorFn: (row) => row.operationDate,
        cell: ({ getValue }) => {
          const date = getValue() as string
          return (
            <div className="flex flex-col">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {dayjs(date).format('DD MMM YYYY')}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {dayjs(date).format('HH:mm')}
              </span>
            </div>
          )
        },
        size: 140,
      },
      {
        id: 'number',
        header: () => (
          <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-semibold">
            <Hash size={16} />
            {t('label-number')}
          </div>
        ),
        accessorKey: 'number',
        cell: ({ getValue }) => (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-mono font-medium border border-indigo-200 dark:border-indigo-800">
            {getValue() as string}
          </span>
        ),
        size: 120,
      },
      {
        id: 'amount',
        header: () => (
          <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-semibold">
            <DollarSign size={16} />
            {t('label-amount')}
          </div>
        ),
        accessorKey: 'amount',
        cell: ({ getValue }) => {
          const amount = getValue() as number
          return (
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {toCurrency(amount)}
              </span>
            </div>
          )
        },
        size: 150,
      },
      {
        id: 'quantity',
        header: () => (
          <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-semibold">
            <Package size={16} />
            {t('label-quantity')}
          </div>
        ),
        accessorKey: 'quantity',
        cell: ({ getValue }) => {
          const quantity = getValue() as number
          return (
            <span className="inline-flex items-center justify-center min-w-[3rem] px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-semibold">
              {toCurrency(quantity)}
            </span>
          )
        },
        size: 120,
      },
      {
        id: 'note',
        header: () => (
          <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-semibold">
            <FileText size={16} />
            {t('label-note')}
          </div>
        ),
        accessorKey: 'note',
        cell: ({ getValue }) => {
          const note = getValue() as string
          return (
            <div className="max-w-xs truncate" title={note}>
              <span className="text-gray-700 dark:text-gray-300 text-sm">
                {note || (
                  <span className="text-gray-400 dark:text-gray-500 italic">
                    {t('label-noNote') || 'Aucune note'}
                  </span>
                )}
              </span>
            </div>
          )
        },
        size: 250,
      },
      {
        id: 'expenseId',
        header: () => (
          <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-semibold">
            ID
          </div>
        ),
        accessorKey: 'id',
        cell: ({ getValue }) => (
          <span className="text-xs font-mono text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
            #{getValue() as number}
          </span>
        ),
        size: 80,
      },
      {
        id: 'operations',
        header: () => (
          <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-semibold">
            <MoreVertical size={16} />
          </div>
        ),
        meta: {
          align: 'right',
        },
        cell: ({ row: { original } }) => (
          <div className="">
            <ActionRenderer
              params={original}
              deleteElement={<ExpenseDelete />}
              updateElement={<span />}
              formId="expense"
              modal={props.modal}
            />
          </div>
        ),
        size: 100,
      },
    ],
    [t, props.modal],
  )

  return (
    <div className="">
      <CommonTable
        data={props.dataSource!}
        columns={columns}
        onModelUpdate={(rows) => showDisplayedRowCount(rows)}
        showQuickFilter={false}
        onGlobalFilterChanged={props.onGlobalFilterChanged}
        modal={props.modal}
      />
    </div>
  )
}

export default ExpenseTable
