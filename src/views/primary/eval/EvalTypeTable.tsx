import type { FC } from 'react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { ColumnDef } from '@tanstack/react-table'
import { FileText, CheckCircle, Info } from 'lucide-react'

import { showDisplayedRowCount } from '@/utils/helpers'
import ActionRenderer from '@/@core/components/base-table/action-renderer'
import ActiveRenderer from '@/@core/components/base-table/active-renderer'
import CommonTable from '@/@core/components/react-table/common-react-table'
import EvalTypeDelete from './EvaltypeDelete'
import type { EvalTypeType } from './evaltype.type'
import type { AppFeatures } from '#/hooks/table'

interface Props extends CommonTableProps {
  onRowClicked?: (row: any) => void
  initialFilter?: string
}

const EvalTypeTable: FC<Props> = (props) => {
  const { t } = useTranslation()

  const columns = useMemo<ColumnDef<AppFeatures, EvalTypeType>[]>(
    () => [
      {
        accessorKey: 'name',
        header: () => (
          <div className="flex items-center gap-0.5">
            <FileText size={14} className="text-primary" />
            {t('label-name')}
          </div>
        ),
        cell: ({ row: { original } }) => (
          <div className="flex flex-col">
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              {original.name}
            </span>
          </div>
        ),
        size: 250,
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
            <ActiveRenderer
              active={info.getValue() as boolean}
              //activeText="label.active"
              //inactiveText="label-inactive"
            />
          </div>
        ),
        size: 120,
      },
      {
        accessorKey: 'description',
        header: () => (
          <div className="flex items-center gap-0.5">
            <Info size={14} />
            {t('label-description')}
          </div>
        ),
        cell: ({ row: { original } }) => (
          <div className="flex flex-col">
            <span className="font-medium text-gray-600 dark:text-gray-400 truncate max-w-[300px]">
              {original.description || '-'}
            </span>
          </div>
        ),
        size: 350,
      },
      {
        id: 'actions',
        header: () => <div className="text-right">{t('label-actions')}</div>,
        meta: { align: 'right' },
        cell: (info) => (
          <div className="flex justify-end">
            <ActionRenderer
              params={info.row.original}
              deleteElement={<EvalTypeDelete />}
              updateElement={<span />}
              formId="evalType"
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
      onGlobalFilterChanged={props.onGlobalFilterChanged}
      modal={props.modal}
    />
  )
}

export default EvalTypeTable
