import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import ActiveRenderer from '@/@core/components/base-table/active-renderer'
import ActionRenderer from '@/@core/components/base-table/action-renderer'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useMemo } from 'react'
import AccountDelete from './AccountDelete'
import type { AccountType } from './Account.type'
import { Hash, Wallet, Tag, CheckCircle, Layers } from 'lucide-react'
import { TypeBadge, SkuText } from '@/@core/components/ui/table/table.style'
import TextWithAvatar from '@/@core/components/ui/text-with-avatar'
import { cutText } from '@/utils/helpers'
import type { AppFeatures } from '#/hooks/table'

export function useTableColumns(modal?: NiceModalHandler) {
  const { t } = useTranslation()

  const columns: Array<ColumnDef<AppFeatures, AccountType>> = useMemo(
    () => [
      {
        id: 'name',
        accessorKey: 'name',
        header: () => (
          <div className="flex items-center gap-0.5">
            <Wallet size={14} className="text-primary" /> {t('label-name')}
          </div>
        ),
        cell: ({ row: { original } }) => (
          <TextWithAvatar
            letter={original.name.charAt(0)}
            title={original.name}
            titleClassName="!font-semibold"
            subtitle={
              <div className="flex items-center gap-1">
                <SkuText className="!text-[10px]">{original.number}</SkuText>
                {original.displayName &&
                  original.displayName !== original.name && (
                    <span className="text-gray-400 text-[10px] italic">
                      • {cutText(original.displayName, 30)}
                    </span>
                  )}
              </div>
            }
          />
        ),
        size: 250,
      },
      {
        id: 'accountType',
        accessorFn: (row) => t(row.chartOfAccount.accountCategory.accountType),
        header: () => (
          <div className="flex items-center gap-0.5">
            <Tag size={14} /> {t('label-type')}
          </div>
        ),
        cell: (info) => (
          <TypeBadge
            $color="primary"
            className="!py-0 !px-1.5 uppercase font-bold !text-[10px]"
          >
            {info.getValue() as string}
          </TypeBadge>
        ),
        size: 150,
      },
      {
        id: 'accountCategory',
        accessorFn: (row) => row.chartOfAccount.accountCategory.name,
        header: () => (
          <div className="flex items-center gap-0.5">
            <Layers size={14} /> {t('label-detailedType')}
          </div>
        ),
        cell: (info) => (
          <TypeBadge $color="secondary" className="!py-0 !px-1.5 !text-[10px]">
            {info.getValue() as string}
          </TypeBadge>
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
        cell: ({ row: { original } }) => (
          <div className="flex justify-end">
            <ActionRenderer
              params={original}
              deleteElement={<AccountDelete />}
              updateElement={<span />}
              formId="account"
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
