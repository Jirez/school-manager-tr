import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import type { BankAccountType } from './bank.account.type'
import BankAccountDelete from './BankAccountDelete'
import ActionRenderer from '@/@core/components/base-table/action-renderer'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useMemo } from 'react'
import type { AppFeatures } from '#/hooks/table'

export function useTableColumns(modal?: NiceModalHandler) {
  const { t } = useTranslation()

  const columns: Array<ColumnDef<AppFeatures, BankAccountType>> = useMemo(
    () => [
      {
        header: () => t('label-name'),
        accessorKey: 'name',
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
        accessorKey: 'balance',
        header: () => t('label-balance'),
      },
      {
        accessorKey: 'account.name',
        header: () => t('label-internalAccount'),
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
            deleteElement={<BankAccountDelete />}
            updateElement={<span />}
            formId="bankAccount"
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
