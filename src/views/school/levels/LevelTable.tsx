import type { FC } from 'react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { ColumnDef } from '@tanstack/react-table'

import { showDisplayedRowCount } from '@/utils/helpers'
import ActionRenderer from '@/@core/components/base-table/action-renderer'
import LevelDelete from '@/views/school/levels/LevelDelete'
import type { LevelType } from './Level.type'
import CommonTable from '@/@core/components/react-table/common-react-table'
import { Layers, ListOrdered, Grid, Type } from 'lucide-react'
import { TypeBadge } from '@/@core/components/ui/table/table.style'

const LevelTable: FC<CommonTableProps> = (props) => {
  const { t } = useTranslation()

  const columns = useMemo<ColumnDef<LevelType>[]>(
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
        size: 80,
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
        accessorFn: (row) => row.cycle?.name,
        id: 'cycle',
        header: () => (
          <div className="flex items-center gap-1">
            <Layers size={14} />
            {t('label-cycle')}
          </div>
        ),
        cell: (info) => (
          <TypeBadge $color="primary" className="!py-0 !px-2">
            {info.getValue() as string}
          </TypeBadge>
        ),
        size: 150,
      },
      {
        accessorFn: (row) => row.cycle?.schoolSection?.name,
        id: 'schoolSection',
        header: () => (
          <div className="flex items-center gap-1">
            <Grid size={14} />
            {t('label-schoolSection')}
          </div>
        ),
        cell: (info) => (
          <TypeBadge $color="secondary" className="!py-0 !px-2">
            {info.getValue() as string}
          </TypeBadge>
        ),
        size: 150,
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
              deleteElement={<LevelDelete />}
              updateElement={<span />}
              formId="level"
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

export default LevelTable
