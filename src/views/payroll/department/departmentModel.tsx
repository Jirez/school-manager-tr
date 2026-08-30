import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import ActiveRenderer from '@/@core/components/base-table/active-renderer'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useMemo } from 'react'
import DepartmentDelete from './DepartmentDelete'
import ActionRenderer from '@/@core/components/base-table/action-renderer'
import type { DepartmentType } from './department.type'
import {
  User,
  Activity,
  FileText,
  Hash,
  Settings,
  Building,
} from 'lucide-react'
import styled from 'styled-components'
import { SkuText } from '@/@core/components/ui/table/table.style'

const ManagerText = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8125rem;
  color: #5e5873;

  .dark-layout & {
    color: #b4b7bd;
  }
`

export function useTableColumns(modal?: NiceModalHandler) {
  const { t } = useTranslation()

  const columns: Array<ColumnDef<DepartmentType>> = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: () => (
          <div className="flex items-center gap-1">
            <Building size={14} className="text-primary" />
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
        accessorKey: 'manager',
        header: () => (
          <div className="flex items-center gap-1">
            <User size={14} className="text-info" />
            {t('label-manager')}
          </div>
        ),
        cell: (info) =>
          info.getValue() ? (
            <ManagerText>
              <User size={12} className="text-muted" />
              {info.getValue() as string}
            </ManagerText>
          ) : (
            '-'
          ),
        size: 180,
      },
      {
        accessorKey: 'active',
        header: () => (
          <div className="flex items-center gap-1 justify-center w-full">
            <Activity size={14} className="text-warning" />
            {t('label-active')}
          </div>
        ),
        cell: ({ row: { original } }) => (
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
        size: 220,
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
              deleteElement={<DepartmentDelete />}
              updateElement={<span />}
              formId="department"
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
