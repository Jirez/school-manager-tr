import type { FC } from 'react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { ColumnDef } from '@tanstack/react-table'
import { Hash, Award, Layers, CheckCircle, Settings } from 'lucide-react'

import { showDisplayedRowCount } from '@/utils/helpers'
import ActionRenderer from '@/@core/components/base-table/action-renderer'
import ActiveRenderer from '@/@core/components/base-table/active-renderer'
import TextWithAvatar from '@/@core/components/ui/text-with-avatar'
import CommonTable from '@/@core/components/react-table/common-react-table'
import type { CompetenceType } from './competence.type'
import CompetenceDelete from './CompetenceDelete'

const CompetenceTable: FC<CommonTableProps> = (props) => {
  const { t } = useTranslation()

  const columns = useMemo<ColumnDef<CompetenceType>[]>(
    () => [
      {
        accessorKey: 'numberOrder',
        header: () => (
          <div className="flex items-center gap-0.5">
            <Hash size={14} className="text-primary" />
            {t('label-order')}
          </div>
        ),
        cell: ({ row: { original } }) => (
          <div className="flex justify-center">
            <span
              className="
                inline-flex items-center justify-center
                w-7 h-7
                text-xs font-bold
                rounded-full
              "
              style={{
                background:
                  'linear-gradient(135deg, #7367f022 0%, #7367f011 100%)',
                color: '#7367f0',
                border: '1px solid #7367f033',
              }}
            >
              {original.numberOrder}
            </span>
          </div>
        ),
        size: 80,
      },
      {
        accessorKey: 'name',
        header: () => (
          <div className="flex items-center gap-0.5">
            <Award size={14} className="text-success" />
            {t('label-name')}
          </div>
        ),
        cell: ({ row: { original } }) => (
          <TextWithAvatar
            letter={original.name?.charAt(0) || 'C'}
            title={original.name}
            subtitle={original.description || undefined}
            titleMaxLength={40}
            avatarColor="#28c76f"
          />
        ),
        size: 300,
      },
      {
        accessorKey: 'marks',
        header: () => (
          <div className="flex items-center gap-0.5 justify-center w-full">
            <Award size={14} className="text-warning" />
            {t('label-marks')}
          </div>
        ),
        cell: ({ row: { original } }) => (
          <div className="flex justify-center">
            <span
              className="
                inline-flex items-center justify-center
                px-2.5 py-0.5
                text-xs font-semibold
                rounded-full
              "
              style={{
                background:
                  'linear-gradient(135deg, #ff9f4322 0%, #ff9f4311 100%)',
                color: '#ff9f43',
                border: '1px solid #ff9f4333',
              }}
            >
              {original.marks}
            </span>
          </div>
        ),
        size: 100,
      },
      {
        accessorFn: (row) => row.level?.name,
        id: 'cycle',
        header: () => (
          <div className="flex items-center gap-0.5">
            <Layers size={14} className="text-info" />
            {t('label-level')}
          </div>
        ),
        cell: ({ row: { original } }) => (
          <span
            className="
              inline-flex items-center
              px-2 py-0.5
              text-xs font-medium
              rounded-md
              bg-blue-50 text-blue-600
              dark:bg-blue-900/20 dark:text-blue-400
              border border-blue-100 dark:border-blue-800/30
            "
          >
            {original.level?.name || '-'}
          </span>
        ),
        size: 150,
      },
      {
        accessorKey: 'active',
        header: () => (
          <div className="flex items-center gap-0.5 justify-center w-full">
            <CheckCircle size={14} className="text-success" />
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
        id: 'actions',
        header: () => (
          <div className="flex items-center gap-0.5 justify-end w-full">
            <Settings size={14} />
            {t('label-actions')}
          </div>
        ),
        meta: { align: 'right' },
        cell: (info) => (
          <div className="flex justify-end">
            <ActionRenderer
              params={info.row.original}
              deleteElement={<CompetenceDelete />}
              updateElement={<span />}
              formId="competence"
              modal={props.modal}
            />
          </div>
        ),
        size: 80,
      },
    ],
    [],
  )

  return (
    <CommonTable
      data={props.dataSource!}
      columns={columns}
      onModelUpdate={(rows) => showDisplayedRowCount(rows)}
      showQuickFilter={false}
      onGlobalFilterChanged={props.onGlobalFilterChanged}
      modal={props.modal}
    />
  )
}

export default CompetenceTable
