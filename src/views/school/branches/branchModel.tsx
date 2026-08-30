import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import type { BranchType } from './Branch.type'
import BranchDelete from './BranchDelete'
import ActionRenderer from '@/@core/components/base-table/action-renderer'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useMemo } from 'react'
import {
  GitBranch,
  GraduationCap,
  Trophy,
  BookOpen,
  LineChart,
  Hash,
} from 'lucide-react'
import {
  TypeBadge,
  SkuText,
  PriceText,
} from '@/@core/components/ui/table/table.style'

export function useTableColumns(modal?: NiceModalHandler) {
  const { t } = useTranslation()

  const columns: Array<ColumnDef<BranchType>> = useMemo(
    () => [
      {
        id: 'name',
        accessorKey: 'name',
        header: () => (
          <div className="flex items-center gap-0.5">
            <GitBranch size={14} className="text-primary" /> {t('label-name')}
          </div>
        ),
        cell: ({ row: { original } }) => (
          <div className="flex flex-col">
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              {original.name}
            </span>
          </div>
        ),
        size: 200,
      },
      {
        id: 'level',
        header: () => (
          <div className="flex items-center gap-0.5">
            <GraduationCap size={14} /> {t('label-level')}
          </div>
        ),
        accessorFn: (row) => row.level.name,
        cell: (info) => (
          <TypeBadge $color="success">{info.getValue() as string}</TypeBadge>
        ),
        size: 150,
      },
      {
        id: 'cycle',
        header: () => (
          <div className="flex items-center gap-0.5">
            <Trophy size={14} /> {t('label-cycle')}
          </div>
        ),
        accessorFn: (row) => row.level.cycle.name,
        cell: (info) => (
          <TypeBadge $color="warning">{info.getValue() as string}</TypeBadge>
        ),
        size: 150,
      },
      {
        id: 'subjectCount',
        header: () => (
          <div className="flex items-center gap-0.5">
            <BookOpen size={14} /> {t('label-subjectCount')}
          </div>
        ),
        cell: (info) => {
          const count = info.row.original?.subjectBranchCollection?.length || 0
          return (
            <div className="flex justify-center">
              <TypeBadge $color="info">{count}</TypeBadge>
            </div>
          )
        },
        size: 100,
      },
      {
        id: 'totalCoefficient',
        header: () => (
          <div className="flex items-center gap-0.5">
            <LineChart size={14} /> {t('label-totalCoefficient')}
          </div>
        ),
        cell: (info) => {
          let total = 0
          const subjects = info.row.original?.subjectBranchCollection
          if (subjects && subjects.length > 0) {
            total = subjects
              .filter(({ coefficient }: any) => coefficient !== null)
              .reduce(
                (sum: number, { coefficient }: any) => sum + coefficient,
                0,
              )
          }
          return (
            <div className="flex justify-center">
              <PriceText>{total}</PriceText>
            </div>
          )
        },
        size: 100,
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
        cell: (info) => (
          <div className="flex justify-end">
            <ActionRenderer
              params={info.row.original}
              deleteElement={<BranchDelete />}
              updateElement={<span />}
              formId="branch"
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
