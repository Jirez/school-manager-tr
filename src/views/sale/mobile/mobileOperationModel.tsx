import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useModal } from '@ebay/nice-modal-react'
import { useMemo } from 'react'
import MyDropdown, { MyMenuItem } from '@/@core/components/dropdown'
import { useNavigate } from '@tanstack/react-router'
import { useAbility } from '@/context/Can'
import { toCurrency } from '@/utils/helpers'
import { CheckCircle, Printer } from 'react-feather'
import dayjs from 'dayjs'
import PaymentOfStudentModal from '../payment/PaymentOfStudentModal'
import type { MobileOperationType } from './mobile.operation.type'
import { useCheckAndConfirmPaymentMutation } from '@/gql/graphql'
import { toast } from 'react-toastify'
import { formatError } from '@/utils/ErrorHelper'
import Avatar from '@/@core/components/avatar'
import { FileText, Wallet, CreditCard, Clock, ChevronDown } from 'lucide-react'

export function useTableColumns(
  modal?: NiceModalHandler,
  refetch?: () => void,
) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const ability = useAbility()
  const receiptModal = useModal('StudentInvoiceModalNew')
  const studentPaymentModal = useModal(PaymentOfStudentModal)
  const paymentModal = useModal('StudentPaymentModalNew')

  const [checkAndConfirmPayment, { loading: loadingCheckAndConfirmPayment }] =
    useCheckAndConfirmPaymentMutation()

  const printReceipt = (original: any, duplicated: boolean) => {
    if (
      original.invoiceType === 'INVOICE' ||
      original.invoiceType === 'SCHOOL_FEES'
    ) {
      receiptModal.show({
        id: original?.operationId,
        type: original.invoiceType,
        duplicated,
      })
    } else if (original.invoiceType === 'PAYMENT') {
      paymentModal.show({
        id: original?.operationId,
        type: original.invoiceType,
        duplicated,
      })
    }
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'VALID':
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-400/10',
          text: 'text-emerald-600 dark:text-emerald-400',
          border: 'border-emerald-200 dark:border-emerald-400/20',
          label: 'Validé',
        }
      case 'INVALID':
        return {
          bg: 'bg-rose-50 dark:bg-rose-400/10',
          text: 'text-rose-600 dark:text-rose-400',
          border: 'border-rose-200 dark:border-rose-400/20',
          label: 'Invalide',
        }
      case 'TRANSMITTED':
      default:
        return {
          bg: 'bg-blue-50 dark:bg-blue-400/10',
          text: 'text-blue-600 dark:text-blue-400',
          border: 'border-blue-200 dark:border-blue-400/20',
          label: 'Transmis',
        }
    }
  }

  const getTypeIcon = (type: string) => {
    const iconBaseClasses =
      'p-1.5 rounded-lg flex items-center justify-center transition-all duration-200'
    switch (type) {
      case 'INVOICE':
        return (
          <div className={`${iconBaseClasses} bg-blue-50 dark:bg-blue-400/10`}>
            <FileText size={14} className="text-blue-600 dark:text-blue-400" />
          </div>
        )
      case 'PAYMENT':
        return (
          <div
            className={`${iconBaseClasses} bg-emerald-50 dark:bg-emerald-400/10`}
          >
            <CreditCard
              size={14}
              className="text-emerald-600 dark:text-emerald-400"
            />
          </div>
        )
      case 'SCHOOL_FEES':
        return (
          <div
            className={`${iconBaseClasses} bg-amber-50 dark:bg-amber-400/10`}
          >
            <Wallet size={14} className="text-amber-600 dark:text-amber-400" />
          </div>
        )
      default:
        return (
          <div
            className={`${iconBaseClasses} bg-slate-100 dark:bg-slate-400/10`}
          >
            <FileText
              size={14}
              className="text-slate-600 dark:text-slate-400"
            />
          </div>
        )
    }
  }

  const columns = useMemo<ColumnDef<MobileOperationType>[]>(
    () => [
      {
        header: `${t('label-date')}`,
        cell: ({ row: { original } }) => (
          <div className="flex items-center gap-2 group whitespace-nowrap">
            <div className="flex flex-col leading-tight">
              <div className="flex items-center gap-1">
                <Clock
                  size={12}
                  className="text-gray-400 group-hover:text-primary transition-colors"
                />
                <span className="text-[0.8125rem] font-semibold text-gray-900 dark:text-gray-100">
                  {dayjs(original.operationDate).format('DD MMM YYYY')}
                </span>
              </div>
              <span className="text-[10.5px] text-gray-400 font-mono ml-4">
                {dayjs(original.operationDate).format('HH:mm:ss')}
              </span>
            </div>
          </div>
        ),
        size: 130,
      },
      {
        header: `${t('label-type')}`,
        accessorKey: 'type',
        cell: ({ row: { original } }) => (
          <div className="flex items-center gap-2">
            <div className="shrink-0">{getTypeIcon(original.type)}</div>
            <div className="flex flex-col leading-tight overflow-hidden">
              <span className="text-[0.8125rem] font-semibold text-gray-800 dark:text-gray-200 truncate">
                {t(original.type)}
              </span>
              <span className="text-[10.5px] text-gray-400 font-mono truncate">
                {original.paymentNumber || '-'}
              </span>
            </div>
          </div>
        ),
        size: 140,
      },
      {
        header: `${t('label-recipient')}`,
        cell: ({ row: { original } }) => (
          <div className="flex items-center gap-2 max-w-[180px]">
            <Avatar
              content={original.person}
              initials={2}
              size="sm"
              color="light-primary"
              className="shrink-0 scale-90 origin-left"
            />
            <div className="flex flex-col leading-tight min-w-0">
              <span className="text-[0.8125rem] font-semibold text-gray-900 dark:text-gray-100 truncate">
                {original.person}
              </span>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">
                {t(original.personType)}
              </span>
            </div>
          </div>
        ),
        size: 180,
      },
      {
        header: `${t('label-object')}`,
        accessorKey: 'payObject',
        cell: ({ row: { original } }) => (
          <div className="max-w-[150px]">
            <span
              className="text-[0.8125rem] text-gray-600 dark:text-gray-400 truncate block"
              title={t(original.payObject)}
            >
              {t(original.payObject)}
            </span>
          </div>
        ),
        size: 140,
      },
      {
        header: `${t('label-amount')}`,
        accessorKey: 'amount',
        meta: { align: 'right' },
        cell: ({
          row: {
            original: { amount, fee },
          },
        }) => (
          <div className="flex flex-col items-end leading-tight">
            <span className="text-[0.875rem] font-bold text-gray-900 dark:text-gray-100 font-mono">
              {toCurrency(amount)}
            </span>
            {fee > 0 && (
              <span className="text-[10px] text-gray-500 font-mono">
                +{toCurrency(fee)} {t('label-fee')}
              </span>
            )}
          </div>
        ),
        size: 110,
      },
      {
        header: `${t('label-operationState')}`,
        accessorKey: 'status',
        cell: ({ row: { original } }) => {
          const style = getStatusStyle(original.status)
          return (
            <div
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border ${style.bg} ${style.text} ${style.border} scale-90 origin-left`}
            >
              <div className="w-1 h-1 rounded-full bg-current" />
              <span className="text-[10.5px] font-bold uppercase tracking-tight">
                {t(original.status)}
              </span>
            </div>
          )
        },
        size: 100,
      },
      {
        header: 'Actions',
        id: 'operations',
        meta: { align: 'right' },
        cell: ({ row: { original } }) => (
          <div className="flex justify-end pr-1">
            <MyDropdown
              trigger="icon"
              icon={<ChevronDown size={18} />}
              onClick={() => {}}
            >
              <MyMenuItem
                label={t('label-print')}
                onClick={() => printReceipt(original, false)}
                icon={<Printer size={14} />}
              />
              <MyMenuItem
                label={t('label-printWithDuplicata')}
                onClick={() => printReceipt(original, true)}
                icon={<Printer size={14} />}
              />
              {original.type === 'TRANSMITTED' && original.reference && (
                <>
                  <div className="h-px bg-gray-100 dark:bg-gray-700 my-1" />
                  <MyMenuItem
                    label={t('label-checkPayment')}
                    onClick={() => {
                      checkAndConfirmPayment({
                        variables: {
                          input: {
                            reference: original.reference,
                          },
                        },
                      })
                        .then(() => {
                          refetch?.()
                        })
                        .catch((error: any) => {
                          toast.error(formatError(error))
                        })
                    }}
                    icon={<CheckCircle size={14} className="text-success" />}
                  />
                </>
              )}
            </MyDropdown>
          </div>
        ),
        size: 60,
      },
    ],
    [modal, t, checkAndConfirmPayment, refetch],
  )

  return { columns }
}
