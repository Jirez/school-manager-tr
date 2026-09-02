import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import ActiveRenderer from '@/@core/components/base-table/active-renderer'
import ActionRenderer from '@/@core/components/base-table/action-renderer'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useMemo } from 'react'
import SpecialAccountDelete from './SpecialAccountDelete'
import type { SpecialAccountType } from './SpecialAccount.type'
import { Tag, Wallet, Star, Hash } from 'lucide-react'
import { TypeBadge, SkuText } from '@/@core/components/ui/table/table.style'
import TextWithAvatar from '@/@core/components/ui/text-with-avatar'
import type { AppFeatures } from '#/hooks/table'

export function useTableColumns(modal?: NiceModalHandler) {
  const { t } = useTranslation()

  const columns: Array<ColumnDef<AppFeatures, SpecialAccountType>> = useMemo(
    () => [
      {
        id: 'specialAccountType',
        accessorKey: 'specialAccountType',
        header: () => (
          <div className="flex items-center gap-0.5">
            <Tag size={14} className="text-primary" /> {t('label-type')}
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
        id: 'account',
        accessorFn: (row) => row.account.name,
        header: () => (
          <div className="flex items-center gap-0.5">
            <Wallet size={14} /> {t('label-account')}
          </div>
        ),
        cell: ({ row: { original } }) => (
          <TextWithAvatar
            letter={original.account.name.charAt(0)}
            title={original.account.name}
            titleClassName="!font-semibold"
            subtitle={
              <SkuText className="!text-[10px]">
                {original.account.number}
              </SkuText>
            }
          />
        ),
        size: 250,
      },
      {
        id: 'selected',
        accessorKey: 'selected',
        header: () => (
          <div className="flex items-center gap-0.5 justify-center w-full">
            <Star size={14} /> {t('label-default')}
          </div>
        ),
        cell: (info) => (
          <div className="flex justify-center">
            <ActiveRenderer
              active={info.getValue() as boolean}
              inactiveText="label.no"
              activeText="label.yes"
            />
          </div>
        ),
        size: 100,
      },
      {
        id: 'note',
        accessorKey: 'note',
        header: () => (
          <div className="flex items-center gap-0.5">
            <Hash size={14} /> {t('label-note')}
          </div>
        ),
        cell: (info) => (
          <span className="text-[11px] text-gray-500 truncate max-w-[200px]">
            {info.getValue() as string}
          </span>
        ),
        size: 200,
      },
      {
        id: 'actions',
        header: () => <div className="text-right">{t('label-actions')}</div>,
        cell: ({ row: { original } }) => (
          <div className="flex justify-end">
            <ActionRenderer
              params={original}
              deleteElement={<SpecialAccountDelete />}
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
