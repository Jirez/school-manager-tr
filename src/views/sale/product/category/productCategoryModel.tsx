import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import ActiveRenderer from '@/@core/components/base-table/active-renderer'
import ActionRenderer from '@/@core/components/base-table/action-renderer'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useMemo } from 'react'
import { cutText } from '@/utils/helpers'
import type { ProductCategoryType } from './product.category.type'
import ProductCategoryDelete from './ProductCategoryDelete'
import { Tag, Layers, FileText, CheckCircle } from 'lucide-react'
import TextWithAvatar from '@/@core/components/ui/text-with-avatar'
import type { AppFeatures } from '#/hooks/table'

export function useTableColumns(modal?: NiceModalHandler) {
  const { t } = useTranslation()

  const columns: Array<ColumnDef<AppFeatures, ProductCategoryType>> = useMemo(
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
                : undefined
            }
          />
        ),
        size: 300,
      },
      {
        id: 'parent',
        accessorFn: (row) => row.parent?.name,
        header: () => (
          <div className="flex items-center gap-0.5">
            <Layers size={14} className="text-muted" /> {t('label-parent')}
          </div>
        ),
        cell: ({ row: { original } }) =>
          original.parent ? (
            <div className="flex items-center gap-0.5">
              <Layers size={14} className="text-muted" />
              <span className="text-sm text-muted">{original.parent.name}</span>
            </div>
          ) : (
            <span className="text-sm text-muted italic">-</span>
          ),
        size: 200,
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
        id: 'description',
        accessorKey: 'description',
        header: () => (
          <div className="flex items-center gap-0.5">
            <FileText size={14} /> {t('label-description')}
          </div>
        ),
        cell: (info) => (
          <span
            className="text-sm text-muted"
            title={info.getValue() as string}
          >
            {cutText(info.getValue() as string, 60)}
          </span>
        ),
        size: 250,
      },
      {
        id: 'actions',
        header: () => <div className="text-right">{t('label-actions')}</div>,
        cell: (info) => (
          <div className="flex justify-end">
            <ActionRenderer
              params={info.row.original}
              deleteElement={<ProductCategoryDelete />}
              updateElement={<span />}
              formId="productCategory"
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
