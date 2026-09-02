import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import ActiveRenderer from '@/@core/components/base-table/active-renderer'
import ActionRenderer from '@/@core/components/base-table/action-renderer'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useMemo } from 'react'
import AccountCategoryDelete from './AccountCategoryDelete'
import type { AccountCategoryType } from './AccountCategory.type'
import { Tag, CheckCircle, Hash, AlignLeft } from 'lucide-react'
import { TypeBadge, SkuText } from '@/@core/components/ui/table/table.style'
import TextWithAvatar from '@/@core/components/ui/text-with-avatar'
import { cutText } from '@/utils/helpers'
import type { AppFeatures } from '#/hooks/table'

export function useTableColumns(modal?: NiceModalHandler) {
  const { t } = useTranslation()

  const columns: Array<ColumnDef<AppFeatures, AccountCategoryType>> = useMemo(
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
                ? cutText(original.description.replace(/<[^>]*>?/gm, ''), 50)
                : ''
            }
          />
        ),
        size: 250,
      },
      {
        id: 'accountType',
        accessorKey: 'accountType',
        header: () => (
          <div className="flex items-center gap-0.5">
            <Tag size={14} /> {t('label-accountType')}
          </div>
        ),
        cell: (info) => (
          <TypeBadge
            $color="primary"
            className="!py-0 !px-1.5 uppercase font-bold !text-[10px]"
          >
            {t(info.getValue() as string)}
          </TypeBadge>
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
        id: 'description',
        accessorKey: 'description',
        header: () => (
          <div className="flex items-center gap-0.5">
            <AlignLeft size={14} /> {t('label-description')}
          </div>
        ),
        cell: (info) => (
          <div
            className="text-[11px] text-gray-500 max-w-[300px] truncate"
            dangerouslySetInnerHTML={{ __html: info.getValue() as string }}
          />
        ),
        size: 300,
      },
      {
        id: 'id',
        accessorKey: 'id',
        header: () => (
          <div className="flex items-center gap-0.5 justify-center w-full">
            <Hash size={14} /> ID
          </div>
        ),
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
        cell: ({ row: { original } }) => (
          <div className="flex justify-end">
            <ActionRenderer
              params={original}
              deleteElement={<AccountCategoryDelete />}
              updateElement={<span />}
              formId="category"
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
