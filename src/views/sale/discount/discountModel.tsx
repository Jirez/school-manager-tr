import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import ActiveRenderer from '@/@core/components/base-table/active-renderer'
import ActionRenderer from '@/@core/components/base-table/action-renderer'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useMemo } from 'react'
import { cutText } from '@/utils/helpers'
import DiscountDelete from './DiscountDelete'
import type { DiscountType } from './discount.type'

export function useTableColumns(modal?: NiceModalHandler) {
  const { t } = useTranslation()

  const columns: Array<ColumnDef<DiscountType>> = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: () => t('label-name'),
      },
      {
        header: `${t('label-discountType')}`,
        accessorFn: (row) => row.discountType,
      },
      {
        header: `${t('label-value')}`,
        accessorFn: (row) => row.value,
      },
      {
        accessorKey: 'active',
        header: () => t('label-active'),
        cell: (info) => <ActiveRenderer active={info.getValue() as boolean} />,
        size: 10,
      },
      {
        accessorKey: 'note',
        header: () => t('label-note'),
        cell: (info) => (
          <span title={info.getValue() as string}>
            {cutText(info.getValue() as string, 60)}
          </span>
        ),
        size: 200,
      },
      {
        id: 'actions',
        header: () => t('label-actions'),
        cell: (info) => (
          <ActionRenderer
            params={info.row.original}
            deleteElement={<DiscountDelete />}
            updateElement={<span />}
            formId="discount"
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
