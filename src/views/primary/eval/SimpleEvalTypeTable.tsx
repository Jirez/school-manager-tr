import type { FC } from 'react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { ColumnDef } from '@tanstack/react-table'
import { Info, CheckCircle, FileText } from 'lucide-react'

import { showDisplayedRowCount } from '@/utils/helpers'
import CommonTable from '@/@core/components/react-table/common-react-table'
import ActiveRenderer from '@/@core/components/base-table/active-renderer'
import type { EvalTypeType } from './evaltype.type'
import type { AppFeatures } from '#/hooks/table'

interface Props extends CommonTableProps {
  onRowClicked: (data: any) => void
  onAddButtonClick?: () => void
  initialFilter?: string
}

const SimpleEvalTypeTable: FC<Props> = (props) => {
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
    ],
    [t],
  )

  return (
    <div className="!text-sm">
      <CommonTable
        data={props.dataSource!}
        columns={columns}
        onModelUpdate={(rows) => showDisplayedRowCount(rows)}
        showQuickFilter={true}
        onGlobalFilterChanged={props.onGlobalFilterChanged}
        modal={props.modal}
        showCheckbox={false}
        onRowClicked={props.onRowClicked}
        pageSize={15}
        initialFilter={props.initialFilter}
        showAddButton={!!props.onAddButtonClick}
        onAddButtonClick={props.onAddButtonClick}
      />
    </div>
  )
}

export default SimpleEvalTypeTable
