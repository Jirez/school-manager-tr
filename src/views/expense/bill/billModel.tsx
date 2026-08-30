import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import type { NiceModalHandler, useModal } from '@ebay/nice-modal-react'
import { useMemo } from 'react'
import MyDropdown, {
  DeleteMenuItem,
  MyDivider,
  MyMenuItem,
} from '@/@core/components/dropdown'
import { useAbility } from '@/context/Can'
import { toCurrency } from '@/utils/helpers'
import { Edit, Printer } from 'react-feather'
import dayjs from 'dayjs'
import { BsCashCoin } from 'react-icons/bs'
import type { BillType } from './bill.type'
import VendorOperationDelete from '../vendorOperations/VendorOperationDelete'
import {
  Calendar,
  Hash,
  FileText,
  User,
  DollarSign,
  Percent,
  CircleDollarSign,
  Package,
  Layers,
  Activity,
} from 'lucide-react'
import {
  PriceText,
  StatusBadge,
  TypeBadge,
  CompactDate,
} from '@/@core/components/ui/table/table.style'

export function useTableColumns(
  modal?: NiceModalHandler,
  refetch?: () => void,
) {
  const { t } = useTranslation()
  const ability = useAbility()
  const receiptModal = useModal('StudentInvoiceModalNew')
  const studentPaymentModal = useModal('PaymentOfStudentModal')
  const paymentModal = useModal('StudentPaymentModalNew')

  const canUpdate = (operationType: string) => {
    switch (operationType) {
      case 'SALES_RECEIPT':
        return ability.can('update', 'invoice')
      case 'INVOICE':
        return ability.can('update', 'invoice')
      case 'SCHOOL_FEES':
        return ability.can('update', 'invoice')
      case 'PROFORMA':
        return true
      default:
        return false
    }
  }

  const receivePayment = (original: BillType) => {
    if (original.invoiceType === 'INVOICE') {
      modal?.show?.({
        invoiceId: original.operationId,
        update: true,
        refetch: refetch,
        operation: original,
        type: 'PAYMENT',
        convert: true,
      })
    }
  }

  const printReceipt = (original: any, duplicated: boolean) => {
    if (original.invoiceType === 'INVOICE') {
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

  const columns = useMemo<ColumnDef<BillType>[]>(
    () => [
      {
        id: 'operationDate',
        accessorKey: 'operationDate',
        header: () => (
          <div className="flex items-center gap-0.5">
            <Calendar size={14} className="text-[#a8a1f7]" /> {t('label-date')}
          </div>
        ),
        cell: ({ row: { original } }) => (
          <div
            className="cursor-pointer hover:text-[#7367f0] transition-colors"
            onClick={() =>
              modal?.show({
                operation: original,
                update: true,
                refetch: refetch,
                type: original.invoiceType,
                id: original.operationId,
              })
            }
          >
            <CompactDate>
              {dayjs(original.operationDate).format('DD/MM/YYYY')}
            </CompactDate>
          </div>
        ),
        size: 110,
      },
      {
        header: () => (
          <div className="flex items-center gap-0.5">
            <Hash size={14} /> {t('label-number')}
          </div>
        ),
        accessorKey: 'number',
        cell: (info) => (
          <span className="font-mono text-xs font-semibold text-gray-500">
            {info.getValue() as string}
          </span>
        ),
        size: 80,
      },
      {
        header: () => (
          <div className="flex items-center gap-0.5">
            <FileText size={14} /> {t('label-type')}
          </div>
        ),
        accessorKey: 'invoiceType',
        cell: ({
          row: {
            original: { invoiceType },
          },
        }) => {
          let color: 'primary' | 'success' | 'warning' | 'info' | 'secondary' =
            'secondary'
          switch (invoiceType) {
            case 'SALES_RECEIPT':
              color = 'success'
              break
            case 'INVOICE':
              color = 'primary'
              break
            case 'CREDIT':
              color = 'warning'
              break
            case 'PAYMENT':
              color = 'info'
              break
          }
          return <TypeBadge $color={color}>{t(invoiceType)}</TypeBadge>
        },
        size: 100,
      },
      {
        id: 'supplier',
        header: () => (
          <div className="flex items-center gap-0.5">
            <User size={14} /> {t('label-supplier')}
          </div>
        ),
        accessorFn: (row) => row.supplier || '',
        cell: (info) => (
          <span className="font-semibold text-gray-700">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        header: () => (
          <div className="flex items-center gap-0.5">
            <DollarSign size={14} /> {t('label-balance')}
          </div>
        ),
        accessorKey: 'balance',
        cell: ({
          row: {
            original: { balance },
          },
        }) => (
          <PriceText className={balance > 0 ? 'text-danger' : ''}>
            {toCurrency(balance)}
          </PriceText>
        ),
        size: 120,
      },
      {
        header: () => (
          <div className="flex items-center gap-0.5">
            <Percent size={14} /> {t('label-discount')}
          </div>
        ),
        accessorKey: 'discount',
        cell: ({
          row: {
            original: { discount },
          },
        }) => <PriceText>{toCurrency(discount || 0)}</PriceText>,
        size: 100,
      },
      {
        header: () => (
          <div className="flex items-center gap-0.5 font-bold">
            <CircleDollarSign size={14} /> {t('label-total')}
          </div>
        ),
        accessorKey: 'amount',
        cell: ({
          row: {
            original: { amount, discount },
          },
        }) => (
          <PriceText className="font-bold text-[#7367f0]">
            {toCurrency(amount - (discount || 0))}
          </PriceText>
        ),
        size: 120,
      },
      {
        id: 'quantity',
        header: () => (
          <div className="flex items-center gap-0.5">
            <Layers size={14} /> Qte
          </div>
        ),
        accessorFn: (row) => row.quantity,
        cell: (info) => (
          <span className="font-mono text-gray-600">
            {info.getValue() as number}
          </span>
        ),
        size: 80,
      },
      {
        id: 'distinctProduct',
        header: () => (
          <div className="flex items-center gap-0.5">
            <Package size={14} /> {t('label-products')}
          </div>
        ),
        accessorFn: (row) => row.distinctProduct,
        cell: (info) => (
          <span className="text-gray-500 text-xs italic">
            {(info.getValue() as string) || '-'}
          </span>
        ),
        size: 120,
      },
      {
        id: 'operationState',
        header: () => (
          <div className="flex items-center gap-0.5">
            <Activity size={14} /> {t('label-operationState')}
          </div>
        ),
        cell: ({ row: { original } }) => {
          let variant:
            'success' | 'warning' | 'info' | 'primary' | 'secondary' =
            'secondary'
          let label = ''

          switch (original.invoiceType) {
            case 'SALES_RECEIPT':
              variant = 'success'
              label = t('label-paid')
              break
            case 'PAYMENT':
              variant = 'primary'
              label = t('label-closed')
              break
            case 'CREDIT':
              if (original.balance == 0) {
                variant = 'primary'
                label = t('label-closed')
              } else {
                variant = 'secondary'
                label = t('label-notApplied')
              }
              break
            case 'INVOICE':
            case 'SCHOOL_FEES':
              if (original.balance == 0) {
                variant = 'primary'
                label = t('label-closed')
              } else if (original.balance == original.amount) {
                variant = 'warning'
                label = t('label-inProgress')
              } else {
                variant = 'info'
                label = t('label-partial')
              }
              break
          }

          if (!label) return null
          return <StatusBadge $variant={variant}>{label}</StatusBadge>
        },
        size: 110,
      },
      {
        header: () => (
          <div className="flex items-center gap-0.5">
            <Hash size={14} /> ID
          </div>
        ),
        accessorKey: 'operationId',
        cell: (info) => (
          <span className="text-xs text-gray-400 font-mono">
            {info.getValue() as string}
          </span>
        ),
        size: 80,
      },
      {
        header: () => <div className="text-right">{t('label-actions')}</div>,
        id: 'bills',
        cell: ({ row: { original } }) => (
          <div className="flex justify-end w-full">
            <MyDropdown
              label={t('label-print')}
              onClick={() => printReceipt(original, false)}
            >
              <MyMenuItem
                label={t('label-print')}
                onClick={() => printReceipt(original, false)}
                icon={<Printer size={15} />}
              />
              {/* <MyMenuItem
                label={t("label-printWithDuplicata")}
                onClick={() => printReceipt(original, true)}
                icon={<Printer size={15} />}
              /> */}
              {canUpdate(original.invoiceType) && (
                <span>
                  <MyDivider />
                  <MyMenuItem
                    label={t('label-update')}
                    onClick={() => {
                      modal?.show({
                        operation: original,
                        update: true,
                        refetch: refetch,
                        type: 'INVOICE',
                      })
                    }}
                    icon={<Edit size={15} />}
                  />
                </span>
              )}
              <DeleteMenuItem>
                <MyDivider />
                <VendorOperationDelete
                  refetch={refetch}
                  id={original?.operationId}
                  type={original.invoiceType}
                />
              </DeleteMenuItem>

              {/* Receive payment */}
              {original.invoiceType === 'INVOICE' && original.balance !== 0 && (
                <span>
                  <MyDivider />
                  <MyMenuItem
                    label={t('label-receivePayment')}
                    onClick={() => receivePayment(original)}
                    icon={<BsCashCoin size={15} />}
                  />
                </span>
              )}
            </MyDropdown>
          </div>
        ),
        size: 80,
      },
    ],
    [modal, t],
  )

  return { columns }
}
