import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useMemo } from 'react'
import ActionRenderer from '@/@core/components/base-table/action-renderer'
import CouncilDecisionDelete from './CouncilDecisionDelete'
import type { CouncilDecisionType } from './CouncilDecision.type'
import { Hash, Type, Gavel } from 'lucide-react'
import { TypeBadge } from '@/@core/components/ui/table/table.style'

export function useTableColumns(modal?: NiceModalHandler) {
  const { t } = useTranslation()

  const columns: Array<ColumnDef<CouncilDecisionType>> = useMemo(
    () => [
      {
        accessorKey: 'code',
        header: () => (
          <div className="flex items-center gap-1">
            <Hash size={14} />
            {t('label-code')}
          </div>
        ),
        cell: (info) => (
          <span className="font-mono text-sm bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
            {info.getValue() as string}
          </span>
        ),
        size: 100,
      },
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
        accessorKey: 'decisionType',
        header: () => (
          <div className="flex items-center gap-1">
            <Gavel size={14} />
            {t('label-decisionType')}
          </div>
        ),
        cell: (info) => {
          const value = info.getValue() as string
          const label = t(value) || value
          let $color:
            | 'primary'
            | 'secondary'
            | 'success'
            | 'danger'
            | 'warning'
            | 'info' = 'primary'
          if (value === 'ADMISSIBLE') $color = 'success'
          else if (value === 'REPEAT') $color = 'warning'
          else if (value === 'EXCLUDED') $color = 'danger'
          return (
            <TypeBadge $color={$color} className="!py-0 !px-2">
              {label}
            </TypeBadge>
          )
        },
        size: 150,
      },
      {
        id: 'actions',
        header: () => (
          <div className="text-right w-full">{t('label-actions')}</div>
        ),
        cell: ({ row: { original } }) => (
          <div className="flex justify-end">
            <ActionRenderer
              params={original}
              deleteElement={<CouncilDecisionDelete />}
              updateElement={<span />}
              formId="councilDecision"
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
