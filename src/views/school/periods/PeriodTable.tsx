import type { FC } from 'react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import type { ColumnDef } from '@tanstack/react-table'

import { showDisplayedRowCount } from '@/utils/helpers'
import ActionRenderer from '@/@core/components/base-table/action-renderer'
import PeriodDelete from '@/views/school/periods/PeriodDelete'
import type { PeriodType } from './Period.type'
import CommonTable from '@/@core/components/react-table/common-react-table'

const PeriodTable: FC<CommonTableProps> = (props) => {
  const { t } = useTranslation()

  const columns = useMemo<ColumnDef<PeriodType>[]>(
    () => [
      {
        accessorKey: 'numberOrder',
        header: () => t('label-numberOrder'),
      },
      {
        accessorKey: 'label',
        header: () => t('label-designation'),
      },
      {
        accessorKey: 'startDate',
        header: () => t('label-startDate'),
        cell: (info) => dayjs(info.getValue() as string).format('DD MMM YYYY'),
      },
      {
        accessorKey: 'endDate',
        header: () => t('label-endDate'),
        cell: (info) => dayjs(info.getValue() as string).format('DD MMM YYYY'),
      },
      {
        accessorKey: 'coefficient',
        header: () => t('label-coefficient'),
      },
      {
        accessorKey: 'id',
        header: () => 'Id',
      },
      {
        id: 'actions',
        header: () => t('label-actions'),
        cell: (info) => (
          <ActionRenderer
            params={info.row.original}
            deleteElement={<PeriodDelete />}
            updateElement={<span />}
            formId="period"
            modal={props.modal}
          />
        ),
      },
    ],
    [t, props.modal],
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

export default PeriodTable
