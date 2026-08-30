import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import ActiveRenderer from '@/@core/components/base-table/active-renderer'
import ActionRenderer from '@/@core/components/base-table/action-renderer'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useMemo } from 'react'
import { cutText } from '@/utils/helpers'
import type { SupplierCategoryType } from './supplier.category.type'
import SupplierCategoryDelete from './SupplierCategoryDelete'
import { Tag, GitBranch, AlignLeft, CheckCircle, Hash } from 'lucide-react'
import { TypeBadge, SkuText } from '@/@core/components/ui/table/table.style'
import TextWithAvatar from '@/@core/components/ui/text-with-avatar'

export function useTableColumns(modal?: NiceModalHandler) {
  const { t } = useTranslation()

  const columns: Array<ColumnDef<SupplierCategoryType>> = useMemo(
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
              original.description
                ? cutText(original.description, 40)
                : t('label-category')
            }
          />
        ),
        size: 250,
      },
      {
        id: 'parent',
        header: () => (
          <div className="flex items-center gap-0.5">
            <GitBranch size={14} /> {t('label-parent')}
          </div>
        ),
        accessorFn: (row) => row.parent?.name,
        cell: (info) => (
          <div className="flex items-center gap-1">
            {info.getValue() ? (
              <TypeBadge $color="secondary" className="!py-0 !px-1.5">
                {info.getValue() as string}
              </TypeBadge>
            ) : (
              <span className="text-gray-400 text-xs italic">
                {t('label-none')}
              </span>
            )}
          </div>
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
        size: 100,
      },
      {
        id: 'description',
        accessorKey: 'description',
        header: () => (
          <div className="flex items-center gap-0.5">
            <AlignLeft size={14} /> {t('label-description')}
          </div>
        ),
        cell: (info) => (
          <span
            className="text-gray-500 dark:text-gray-400 text-xs"
            title={info.getValue() as string}
          >
            {info.getValue() ? cutText(info.getValue() as string, 60) : '-'}
          </span>
        ),
        size: 250,
      },
      {
        id: 'id',
        header: () => (
          <div className="flex items-center gap-0.5 justify-center w-full">
            <Hash size={14} /> ID
          </div>
        ),
        accessorKey: 'id',
        cell: (info) => (
          <div className="flex justify-center">
            <SkuText>{info.getValue() as string}</SkuText>
          </div>
        ),
        size: 80,
      },
      {
        id: 'actions',
        header: () => <div className="text-right">{t('label-actions')}</div>,
        meta: { align: 'right' },
        cell: (info) => (
          <div className="flex justify-end">
            <ActionRenderer
              params={info.row.original}
              deleteElement={<SupplierCategoryDelete />}
              updateElement={<span />}
              formId="supplierCategory"
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
