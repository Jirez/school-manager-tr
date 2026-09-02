import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import type { BankTransactionType } from './bank.transaction.type'
import BankTransactionDelete from './BankTransactionDelete'
import ActionRenderer from '@/@core/components/base-table/action-renderer'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useMemo } from 'react'
import { toCurrency } from '@/utils/helpers'
import type { AppFeatures } from '#/hooks/table'

export function useTableColumns(modal?: NiceModalHandler) {
  const { t } = useTranslation()

  const columns: Array<ColumnDef<AppFeatures, BankTransactionType>> = useMemo(
    () => [
      {
        header: () => t('label-transactionNumber'),
        accessorKey: 'referenceNumber',
      },
      {
        accessorKey: 'type',
        header: () => t('label-type'),
        cell: (info) => t(info.getValue() as string),
      },
      {
        accessorKey: 'status',
        header: () => t('label-status'),
        cell: (info) => t(info.getValue() as string),
      },
      {
        accessorKey: 'amount',
        header: () => t('label-amount'),
        cell: (info) => toCurrency(info.getValue() as number),
      },
      {
        accessorKey: 'bankAccount.name',
        header: () => t('label-bankAccount'),
      },
      {
        header: 'Id',
        accessorKey: 'id',
        size: 10,
      },
      {
        id: 'actions',
        header: () => t('label-actions'),
        cell: (info) => (
          <ActionRenderer
            params={info.row.original}
            deleteElement={<BankTransactionDelete />}
            updateElement={<span />}
            formId="bankTransaction"
            modal={modal}
          />
        ),
        size: 50,
      },
    ],
    [modal, t],
  )

  return { columns }
}
