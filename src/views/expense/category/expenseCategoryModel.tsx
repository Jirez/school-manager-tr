import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import ActiveRenderer from '@/@core/components/base-table/active-renderer'
import ActionRenderer from '@/@core/components/base-table/action-renderer'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useMemo } from 'react'
import { cutText, toCurrency } from '@/utils/helpers'
import ExpenseCategoryDelete from './ExpenseCategoryDelete'
import type { ExpenseCategoryType } from './expense.category.type'
import { Tag, Wallet, DollarSign, CheckCircle } from 'lucide-react'
import { SkuText, PriceText } from '@/@core/components/ui/table/table.style'
import TextWithAvatar from '@/@core/components/ui/text-with-avatar'

export function useTableColumns(modal?: NiceModalHandler) {
  const { t } = useTranslation()

  const columns: Array<ColumnDef<ExpenseCategoryType>> = useMemo(
    () => [
      {
        id: 'name',
        accessorKey: 'name',
        header: () => (
          <div className="flex items-center gap-0.5">
            <Tag size={14} className="text-primary" /> {t('label-name')}
          </div>
        ),
        cell: ({ row: { original } }) => (
          <TextWithAvatar
            letter={original.name.charAt(0)}
            title={original.name}
            titleClassName="!font-semibold"
            subtitle={
              original.description ? cutText(original.description, 40) : ''
            }
          />
        ),
        size: 250,
      },
      {
        id: 'account',
        header: () => (
          <div className="flex items-center gap-0.5">
            <Wallet size={14} /> {t('label-account')}
          </div>
        ),
        accessorFn: (row) =>
          `${row.account?.number || ''} ${row.account?.name || ''}`,
        cell: ({ row: { original } }) =>
          original.account ? (
            <div className="flex flex-col">
              <span className="font-medium text-sm">
                {original.account.name}
              </span>
              <SkuText className="w-fit">{original.account.number}</SkuText>
            </div>
          ) : (
            <span className="text-gray-400 italic">N/A</span>
          ),
        size: 200,
      },
      {
        id: 'maxAllowedAmount',
        header: () => (
          <div className="flex items-center gap-0.5">
            <DollarSign size={14} /> {t('label-maxAllowedAmount')}
          </div>
        ),
        accessorKey: 'maxAllowedAmount',
        cell: (info) =>
          info.getValue() ? (
            <PriceText className="font-bold text-danger">
              {toCurrency(info.getValue() as number)}
            </PriceText>
          ) : (
            <span className="text-gray-400">∞</span>
          ),
        size: 150,
      },
      {
        id: 'active',
        accessorKey: 'active',
        header: () => (
          <div className="flex items-center gap-0.5 justify-center w-full">
            <CheckCircle size={14} /> {t('label-active')}
          </div>
        ),
        cell: (info) => (
          <div className="flex justify-center">
            <ActiveRenderer active={info.getValue() as boolean} />
          </div>
        ),
        size: 80,
      },
      {
        id: 'actions',
        header: () => <div className="text-right">{t('label-actions')}</div>,
        cell: (info) => (
          <div className="flex justify-end">
            <ActionRenderer
              params={info.row.original}
              deleteElement={<ExpenseCategoryDelete />}
              updateElement={<span />}
              formId="expenseCategory"
              modal={modal}
            />
          </div>
        ),
        size: 80,
      },
    ],
    [modal, t],
  )

  return { columns }
}
