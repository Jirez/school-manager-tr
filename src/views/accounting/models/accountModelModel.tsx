import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import ActiveRenderer from '@/@core/components/base-table/active-renderer'
import ActionRenderer from '@/@core/components/base-table/action-renderer'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useMemo } from 'react'
import AccountModelDelete from './AccountModelDelete'
import type { AccountModelType } from './AccountModel.type'
import { Hash, Globe, Tag, CheckCircle, Star } from 'lucide-react'
import { SkuText } from '@/@core/components/ui/table/table.style'
import TextWithAvatar from '@/@core/components/ui/text-with-avatar'

export function useTableColumns(modal?: NiceModalHandler) {
  const { t } = useTranslation()

  const columns: Array<ColumnDef<AccountModelType>> = useMemo(
    () => [
      {
        id: 'code',
        accessorKey: 'code',
        header: () => (
          <div className="flex items-center gap-0.5">
            <Hash size={14} className="text-primary" /> {t('label-code')}
          </div>
        ),
        cell: ({ row: { original } }) => <SkuText>{original.code}</SkuText>,
        size: 120,
      },
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
            subtitle={t(`label-${original.languageType.toLowerCase()}`)}
          />
        ),
        size: 200,
      },
      {
        id: 'country',
        accessorKey: 'country',
        header: () => (
          <div className="flex items-center gap-0.5">
            <Globe size={14} /> {t('label-country')}
          </div>
        ),
        cell: ({ row: { original } }) => (
          <span className="text-gray-600 dark:text-gray-400 text-sm">
            {original.country || '-'}
          </span>
        ),
        size: 120,
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
        id: 'current',
        accessorKey: 'current',
        header: () => (
          <div className="flex items-center gap-0.5 justify-center w-full">
            <Star size={14} /> {t('label-default')}
          </div>
        ),
        cell: (info) => (
          <div className="flex justify-center">
            <ActiveRenderer
              active={info.getValue() as boolean}
              activeText="label.yes"
              inactiveText="label.no"
            />
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
              deleteElement={<AccountModelDelete />}
              updateElement={<span />}
              formId="accountModel"
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
