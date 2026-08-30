import type { FC } from 'react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { ColumnDef } from '@tanstack/react-table'

import { showDisplayedRowCount } from '@/utils/helpers'
import ActionRenderer from '@/@core/components/base-table/action-renderer'
import CycleDelete from '@/views/school/cycles/CycleDelete'
import type { CycleType } from './Cycle.Type'
import CommonTable from '@/@core/components/react-table/common-react-table'
import { ListOrdered, Type, Calendar, Grid, Hash } from 'lucide-react'
import { TypeBadge, SkuText } from '@/@core/components/ui/table/table.style'

const CycleTable: FC<CommonTableProps> = (props) => {
  const { t } = useTranslation()

  const columns = useMemo<ColumnDef<CycleType>[]>(
    () => [
      {
        accessorKey: 'numberOrder',
        header: () => (
          <div className="flex items-center gap-1 justify-center w-full">
            <ListOrdered size={14} />
            {t('label-numberOrder')}
          </div>
        ),
        cell: (info) => (
          <div className="flex justify-center">
            <span className="font-semibold text-primary">
              {info.getValue() as number}
            </span>
          </div>
        ),
        size: 40,
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
        id: 'schoolYear',
        header: () => (
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            {t('label-schoolYear')}
          </div>
        ),
        accessorFn: (row) => row.schoolYear?.label,
        cell: (info) => (
          <TypeBadge $color="primary" className="!py-0 !px-2">
            {info.getValue() as string}
          </TypeBadge>
        ),
        size: 150,
      },
      {
        id: 'schoolSection',
        header: () => (
          <div className="flex items-center gap-1">
            <Grid size={14} />
            {t('label-schoolSection')}
          </div>
        ),
        accessorFn: (row) => row.schoolSection?.name,
        cell: (info) => (
          <TypeBadge $color="secondary" className="!py-0 !px-2">
            {info.getValue() as string}
          </TypeBadge>
        ),
        size: 150,
      },
      {
        accessorKey: 'id',
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
          <div className="text-right w-full">{t('label-actions')}</div>
        ),
        cell: (info) => (
          <div className="flex justify-end">
            <ActionRenderer
              params={info.row.original}
              deleteElement={<CycleDelete />}
              updateElement={<span />}
              formId="cycle"
              modal={props.modal}
            />
          </div>
        ),
        size: 80,
      },
    ],
    [props.modal, t],
  )

  return (
    <CommonTable
      data={props.dataSource!}
      columns={columns}
      onModelUpdate={(rows) => showDisplayedRowCount(rows)}
      showQuickFilter={false}
      onGlobalFilterChanged={props.onGlobalFilterChanged}
    />
  )
}

export default CycleTable
