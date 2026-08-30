import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { useModal } from '@ebay/nice-modal-react'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useMemo } from 'react'
import dayjs from 'dayjs'
import {
  Calendar,
  Hash,
  User,
  Clock,
  DollarSign,
  TrendingDown,
  Activity,
  FileText,
  Settings,
  Printer,
  Edit,
} from 'lucide-react'
import { BsCashCoin } from 'react-icons/bs'
import { toast } from 'react-toastify'

import { toCurrency } from '@/utils/helpers'
import type { PayrollType } from './payroll.type'
import PayrollDelete from './PayrollDelete'
import PayrollReceiptModal from './PayrollReceiptModal'
import MyDropdown, {
  DeleteMenuItem,
  MyDivider,
  MyMenuItem,
} from '@/@core/components/dropdown'
import { usePayrollMarkAsPaidMutation } from '@/gql/graphql'
import { SkuText } from '@/@core/components/ui/table/table.style'

const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig: Record<
    string,
    { color: string; bgColor: string; label: string }
  > = {
    PAID: { color: 'text-success', bgColor: 'bg-success/10', label: 'Paid' },
    DRAFT: { color: 'text-warning', bgColor: 'bg-warning/10', label: 'Draft' },
    PENDING: { color: 'text-info', bgColor: 'bg-info/10', label: 'Pending' },
    CANCELLED: {
      color: 'text-danger',
      bgColor: 'bg-danger/10',
      label: 'Cancelled',
    },
  }

  const config = statusConfig[status] || statusConfig.DRAFT

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${config.bgColor} ${config.color}`}
    >
      {config.label}
    </span>
  )
}

const CurrencyCell = ({
  value,
  highlight = false,
}: {
  value: number
  highlight?: boolean
}) => (
  <span
    className={`font-semibold ${highlight ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}
  >
    {toCurrency(value)}
  </span>
)

const DeductionCell = ({ value }: { value: number }) => (
  <span className="text-danger font-medium">-{toCurrency(value)}</span>
)

const EmployeeCell = ({ row }: { row: any }) => {
  const lastName = row.employee.personnel.lastName
  const firstName = row.employee.personnel.firstName

  return (
    <div className="flex items-center gap-1">
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
        <span className="text-primary font-semibold text-xs">
          {lastName?.charAt(0)}
          {firstName?.charAt(0)}
        </span>
      </div>
      <div>
        <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
          {lastName} {firstName}
        </div>
        {row.employee.personnel.email && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {row.employee.personnel.email}
          </div>
        )}
      </div>
    </div>
  )
}

const DateCell = ({ value }: { value: string }) => (
  <div className="flex items-center gap-1">
    <Calendar size={14} className="text-gray-400" />
    <span className="text-sm text-gray-700 dark:text-gray-300">
      {dayjs(value).format('DD MMM YYYY')}
    </span>
  </div>
)

const PeriodCell = ({ value }: { value: string }) => (
  <div className="flex items-center gap-1">
    <Clock size={14} className="text-info" />
    <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
      {dayjs(value).format('MMM YYYY')}
    </span>
  </div>
)

export function useTableColumns(
  modal?: NiceModalHandler,
  refetch?: () => void,
) {
  const { t } = useTranslation()
  const receiptModal = useModal(PayrollReceiptModal)
  const [markAsPaid] = usePayrollMarkAsPaidMutation()

  const columns: Array<ColumnDef<PayrollType>> = useMemo(
    () => [
      {
        accessorKey: 'operationDate',
        header: () => (
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Calendar size={14} />
            <span className="text-xs font-semibold uppercase tracking-wider">
              {t('label-date')}
            </span>
          </div>
        ),
        cell: (info) => <DateCell value={info.getValue() as string} />,
        size: 150,
      },
      {
        accessorKey: 'number',
        header: () => (
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Hash size={14} />
            <span className="text-xs font-semibold uppercase tracking-wider">
              {t('label-number')}
            </span>
          </div>
        ),
        cell: (info) => (
          <SkuText className="text-xs font-medium text-gray-600 dark:text-gray-400">
            {(info.getValue() as string) || '-'}
          </SkuText>
        ),
        size: 130,
      },
      {
        id: 'earner',
        accessorFn: (row) =>
          `${row.employee.personnel.lastName} ${row.employee.personnel.firstName}`,
        header: () => (
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <User size={14} />
            <span className="text-xs font-semibold uppercase tracking-wider">
              {t('label-earner')}
            </span>
          </div>
        ),
        cell: ({ row }) => <EmployeeCell row={row.original} />,
        size: 250,
      },
      {
        id: 'period',
        accessorFn: (row) => row.period.startDate,
        header: () => (
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Clock size={14} />
            <span className="text-xs font-semibold uppercase tracking-wider">
              {t('label-period')}
            </span>
          </div>
        ),
        cell: (info) => <PeriodCell value={info.getValue() as string} />,
        size: 150,
      },
      {
        accessorKey: 'grossSalary',
        header: () => (
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <DollarSign size={14} className="text-success" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              {t('label-grossSalary')}
            </span>
          </div>
        ),
        cell: (info) => <CurrencyCell value={info.getValue() as number} />,
        size: 150,
      },
      {
        accessorKey: 'totalEmployeeDeduction',
        header: () => (
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <TrendingDown size={14} className="text-danger" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              {t('label-deductions')}
            </span>
          </div>
        ),
        cell: (info) => <DeductionCell value={info.getValue() as number} />,
        size: 150,
      },
      {
        accessorKey: 'netSalary',
        header: () => (
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <DollarSign size={14} className="text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              {t('label-netSalary')}
            </span>
          </div>
        ),
        cell: (info) => (
          <CurrencyCell value={info.getValue() as number} highlight />
        ),
        size: 160,
      },
      {
        accessorKey: 'status',
        header: () => (
          <div className="flex items-center gap-2 justify-center text-gray-600 dark:text-gray-400">
            <Activity size={14} />
            <span className="text-xs font-semibold uppercase tracking-wider">
              {t('label-status')}
            </span>
          </div>
        ),
        cell: (info) => (
          <div className="flex justify-center">
            <StatusBadge status={info.getValue() as string} />
          </div>
        ),
        size: 120,
      },
      {
        accessorKey: 'note',
        header: () => (
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <FileText size={14} />
            <span className="text-xs font-semibold uppercase tracking-wider">
              {t('label-note')}
            </span>
          </div>
        ),
        cell: (info) => (
          <span className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[150px] block">
            {(info.getValue() as string) || '-'}
          </span>
        ),
        size: 180,
      },
      {
        id: 'actions',
        header: () => (
          <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
            <Settings size={14} />
            <span className="text-xs font-semibold uppercase tracking-wider">
              {t('label-actions')}
            </span>
          </div>
        ),
        cell: ({ row: { original } }) => (
          <div className="flex justify-center">
            <MyDropdown
              label={t('label-print')}
              onClick={() =>
                receiptModal.show({
                  id: original?.id,
                })
              }
            >
              <MyMenuItem
                label={t('label-print')}
                onClick={() =>
                  receiptModal.show({
                    id: original?.id,
                  })
                }
                icon={<Printer size={15} />}
              />

              {original.status === 'DRAFT' && (
                <MyMenuItem
                  label={t('label-markAsPaid')}
                  onClick={() =>
                    markAsPaid({ variables: { id: original?.id } })
                      .then(() => {
                        refetch?.()
                        toast.success(t('toast-markAsPaidSuccess'))
                      })
                      .catch((error) => {
                        toast.error(error.message)
                      })
                  }
                  icon={<BsCashCoin size={15} />}
                />
              )}

              <span>
                <MyDivider />
                <MyMenuItem
                  label={t('label-update')}
                  onClick={() => {
                    modal?.show({
                      payroll: original,
                      update: true,
                      refetch: refetch,
                    })
                  }}
                  icon={<Edit size={15} />}
                />
              </span>

              <DeleteMenuItem>
                <MyDivider />
                <PayrollDelete refetch={refetch} id={original?.id} />
              </DeleteMenuItem>
            </MyDropdown>
          </div>
        ),
        size: 100,
      },
    ],
    [t, modal, refetch, markAsPaid, receiptModal],
  )

  return { columns }
}
