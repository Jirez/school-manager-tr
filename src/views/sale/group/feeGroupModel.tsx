import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useMemo } from 'react'
import ActionRenderer from '@/@core/components/base-table/action-renderer'
import type { FeeGroupType } from './fee.group.type'
import FeeGroupDelete from './FeeGroupDelete'
import { Type, Users, Globe, Settings, Hash, AlertCircle } from 'lucide-react'
import { TypeBadge, SkuText } from '@/@core/components/ui/table/table.style'

export function useTableColumns(modal?: NiceModalHandler) {
  const { t } = useTranslation()

  const columns: Array<ColumnDef<FeeGroupType>> = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: () => (
          <div className="flex items-center gap-1">
            <Type size={14} className="text-primary" />
            {t('label-name')}
          </div>
        ),
        cell: (info) => (
          <span className="font-bold text-gray-800 dark:text-gray-200">
            {info.getValue() as string}
          </span>
        ),
        size: 200,
      },
      {
        accessorKey: 'name2',
        header: () => (
          <div className="flex items-center gap-1">
            <Type size={14} className="text-muted" />
            {t('label-name2')}
          </div>
        ),
        cell: (info) => (
          <span className="text-muted text-[11px]">
            {(info.getValue() as string) || '-'}
          </span>
        ),
        size: 180,
      },
      {
        accessorKey: 'useAsFallback',
        header: () => (
          <div className="flex items-center gap-1 justify-center w-full">
            <AlertCircle size={14} className="text-warning" />
            {t('label-useAsFallback')}
          </div>
        ),
        cell: (info) => (
          <div className="flex justify-center">
            <TypeBadge
              $color={info.getValue() ? 'warning' : 'secondary'}
              className="!py-0 !px-2 !text-[10px]"
            >
              {info.getValue() ? t('label-yes') : t('label-no')}
            </TypeBadge>
          </div>
        ),
        size: 120,
      },
      {
        accessorKey: 'isAlumni',
        header: () => (
          <div className="flex items-center gap-1 justify-center w-full">
            <Users size={14} className="text-info" />
            {t('label-isAlumni')}
          </div>
        ),
        cell: (info) => (
          <div className="flex justify-center">
            <TypeBadge
              $color={info.getValue() ? 'info' : 'secondary'}
              className="!py-0 !px-2 !text-[10px]"
            >
              {info.getValue() ? t('label-yes') : t('label-no')}
            </TypeBadge>
          </div>
        ),
        size: 120,
      },
      {
        accessorKey: 'isExternalStudent',
        header: () => (
          <div className="flex items-center gap-1 justify-center w-full">
            <Globe size={14} className="text-primary" />
            {t('label-external')}
          </div>
        ),
        cell: (info) => (
          <div className="flex justify-center">
            <TypeBadge
              $color={info.getValue() ? 'primary' : 'secondary'}
              className="!py-0 !px-2 !text-[10px]"
            >
              {info.getValue() ? t('label-yes') : t('label-no')}
            </TypeBadge>
          </div>
        ),
        size: 120,
      },
      {
        accessorKey: 'id',
        id: 'id',
        header: () => (
          <div className="flex items-center gap-1 justify-center w-full">
            <Hash size={14} />
            ID
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
        header: () => (
          <div className="flex items-center gap-1 justify-center w-full text-secondary">
            <Settings size={14} />
            {t('label-actions')}
          </div>
        ),
        cell: ({ row: { original } }) => (
          <div className="flex justify-center">
            <ActionRenderer
              params={original}
              deleteElement={<FeeGroupDelete />}
              updateElement={<span />}
              formId="feeGroup"
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
