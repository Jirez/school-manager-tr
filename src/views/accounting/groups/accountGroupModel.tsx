import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import ActiveRenderer from '@/@core/components/base-table/active-renderer'
import ActionRenderer from '@/@core/components/base-table/action-renderer'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useMemo } from 'react'
import AccountGroupDelete from './AccountGroupDelete'
import type { AccountGroupType } from './AccountGroup.type'
import {
  Layers,
  Tag,
  CheckCircle,
  Hash,
  GitBranch,
  BookOpen,
} from 'lucide-react'
import { TypeBadge, SkuText } from '@/@core/components/ui/table/table.style'
import TextWithAvatar from '@/@core/components/ui/text-with-avatar'

export function useTableColumns(modal?: NiceModalHandler) {
  const { t } = useTranslation()

  const columns: Array<ColumnDef<AccountGroupType>> = useMemo(
    () => [
      {
        id: 'name',
        accessorKey: 'name',
        header: () => (
          <div className="flex items-center gap-0.5">
            <Layers size={14} className="text-primary" /> {t('label-name')}
          </div>
        ),
        cell: ({ row: { original } }) => (
          <TextWithAvatar
            letter={original.name.charAt(0)}
            title={original.name}
            titleClassName="!font-semibold"
            subtitle={original.description}
          />
        ),
        size: 250,
      },
      {
        id: 'sectionType',
        accessorKey: 'sectionType',
        header: () => (
          <div className="flex items-center gap-0.5">
            <Tag size={14} /> {t('label-section')}
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
        size: 120,
      },
      {
        id: 'parent',
        accessorFn: (row) => row.parent?.name,
        header: () => (
          <div className="flex items-center gap-0.5">
            <GitBranch size={14} /> {t('label-parent')}
          </div>
        ),
        cell: (info) =>
          info.getValue() ? (
            <TypeBadge
              $color="secondary"
              className="!py-0 !px-1.5 !text-[10px]"
            >
              {info.getValue() as string}
            </TypeBadge>
          ) : (
            <span className="text-gray-400 italic text-[10px]">None</span>
          ),
        size: 180,
      },
      {
        id: 'accountModel',
        accessorFn: (row) => row.accountModel.name,
        header: () => (
          <div className="flex items-center gap-0.5">
            <BookOpen size={14} /> {t('label-accountModel')}
          </div>
        ),
        cell: (info) => (
          <TypeBadge $color="info" className="!py-0 !px-1.5 !text-[10px]">
            {info.getValue() as string}
          </TypeBadge>
        ),
        size: 180,
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
              deleteElement={<AccountGroupDelete />}
              updateElement={<span />}
              formId="accountGroup"
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
