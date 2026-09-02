import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useMemo } from 'react'
import ActiveRenderer from '@/@core/components/base-table/active-renderer'
import ActionRenderer from '@/@core/components/base-table/action-renderer'
import DeductionDelete from './DeductionDelete'
import type { DeductionType } from './deduction.type'
import {
  Type,
  Tag,
  Calculator,
  Activity,
  FileText,
  Settings,
  Hash,
} from 'lucide-react'
import { TypeBadge, SkuText } from '@/@core/components/ui/table/table.style'
import type { AppFeatures } from '#/hooks/table'

export function useTableColumns(modal?: NiceModalHandler) {
  const { t } = useTranslation()

  const columns: Array<ColumnDef<AppFeatures, DeductionType>> = useMemo(
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
        size: 180,
      },
      {
        accessorKey: 'category.name',
        header: () => (
          <div className="flex items-center gap-1">
            <Tag size={14} className="text-info" />
            {t('label-category')}
          </div>
        ),
        cell: (info) => (
          <TypeBadge $color="info" className="!py-0 !px-2 !text-[10px]">
            {info.getValue() as string}
          </TypeBadge>
        ),
        size: 150,
      },
      {
        accessorKey: 'calculationType',
        header: () => (
          <div className="flex items-center gap-1">
            <Calculator size={14} className="text-secondary" />
            {t('label-calculationType')}
          </div>
        ),
        cell: (info) => (
          <span className="text-[11px] font-medium uppercase">
            {t(info.getValue() as string)}
          </span>
        ),
        size: 120,
      },
      {
        accessorKey: 'active',
        header: () => (
          <div className="flex items-center gap-1 justify-center w-full">
            <Activity size={14} className="text-warning" />
            {t('label-active')}
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
        accessorKey: 'description',
        header: () => (
          <div className="flex items-center gap-1">
            <FileText size={14} className="text-muted" />
            {t('label-description')}
          </div>
        ),
        cell: (info) => (
          <span className="text-gray-600 dark:text-gray-400 truncate max-w-[150px] block text-[11px]">
            {(info.getValue() as string) || '-'}
          </span>
        ),
        size: 150,
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
              deleteElement={<DeductionDelete />}
              updateElement={<span />}
              formId="deduction"
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
