import type { FC } from 'react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import type { ColumnDef } from '@tanstack/react-table'

import { showDisplayedRowCount } from '@/utils/helpers'
import ActionRenderer from '@/@core/components/base-table/action-renderer'
import SubPeriodDelete from '@/views/school/subPeriods/SubPeriodDelete'
import type { SubPeriodType } from './SubPeriod.type'
import CommonTable from '@/@core/components/react-table/common-react-table'
import type { AppFeatures } from '#/hooks/table'

const SubPeriodTable: FC<CommonTableProps> = (props) => {
  const { t } = useTranslation()

  const columns = useMemo<ColumnDef<AppFeatures, SubPeriodType>[]>(
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
        accessorFn: (row) => row.period.label,
        id: 'period',
        header: () => t('label-period'),
      },
      {
        id: 'actions',
        header: () => t('label-actions'),
        cell: ({ row: { original } }) => (
          <ActionRenderer
            params={original}
            deleteElement={<SubPeriodDelete />}
            updateElement={<span />}
            formId="subPeriod"
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

export default SubPeriodTable
