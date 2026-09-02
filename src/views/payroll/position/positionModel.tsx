import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import ActiveRenderer from '@/@core/components/base-table/active-renderer'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useMemo } from 'react'
import ActionRenderer from '@/@core/components/base-table/action-renderer'
import type { PositionType } from './position.type'
import PositionDelete from './PositionDelete'
import { toCurrency } from '@/utils/helpers'
import {
  Briefcase,
  DollarSign,
  Percent,
  Clock,
  Activity,
  FileText,
  Settings,
  Hash,
} from 'lucide-react'
import { SkuText } from '@/@core/components/ui/table/table.style'
import type { AppFeatures } from '#/hooks/table'

export function useTableColumns(modal?: NiceModalHandler) {
  const { t } = useTranslation()

  const columns: Array<ColumnDef<AppFeatures, PositionType>> = useMemo(
    () => [
      {
        accessorKey: 'title',
        header: () => (
          <div className="flex items-center gap-1">
            <Briefcase size={14} className="text-primary" />
            {t('label-title')}
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
        accessorKey: 'baseSalary',
        header: () => (
          <div className="flex items-center gap-1">
            <DollarSign size={14} className="text-success" />
            {t('label-baseSalary')}
          </div>
        ),
        cell: ({ row: { original } }: any) => (
          <div className="font-semibold text-success">
            {toCurrency(original.baseSalary)}
          </div>
        ),
        size: 150,
      },
      {
        accessorKey: 'bonusPercentage',
        header: () => (
          <div className="flex items-center gap-1">
            <Percent size={14} className="text-info" />
            {t('label-bonusPercentage')}
          </div>
        ),
        cell: (info) => (
          <span className="text-info font-medium">
            {info.getValue() ? `${info.getValue()}%` : '-'}
          </span>
        ),
        size: 120,
      },
      {
        accessorKey: 'overtimeRate',
        header: () => (
          <div className="flex items-center gap-1">
            <Clock size={14} className="text-warning" />
            {t('label-overtimeRate')}
          </div>
        ),
        cell: (info) => (
          <div className="text-warning">
            {info.getValue() ? toCurrency(info.getValue() as number) : '-'}
          </div>
        ),
        size: 120,
      },
      {
        accessorKey: 'active',
        header: () => (
          <div className="flex items-center gap-1 justify-center w-full">
            <Activity size={14} className="text-danger" />
            {t('label-active')}
          </div>
        ),
        cell: ({ row: { original } }: any) => (
          <div className="flex justify-center">
            <ActiveRenderer active={original.active} />
          </div>
        ),
        size: 100,
      },
      {
        accessorKey: 'note',
        header: () => (
          <div className="flex items-center gap-1">
            <FileText size={14} className="text-secondary" />
            {t('label-note')}
          </div>
        ),
        cell: (info) => (
          <span className="text-gray-600 dark:text-gray-400 truncate max-w-[200px] block text-[11px]">
            {(info.getValue() as string) || '-'}
          </span>
        ),
        size: 200,
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
              deleteElement={<PositionDelete />}
              updateElement={<span />}
              formId="position"
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
