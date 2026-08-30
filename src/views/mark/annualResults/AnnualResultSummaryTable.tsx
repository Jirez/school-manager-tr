import type { FC } from 'react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { ColumnDef } from '@tanstack/react-table'

import { showDisplayedRowCount } from '@/utils/helpers'
import CommonTable from '@/@core/components/react-table/common-react-table'

interface Props extends CommonTableProps {
  onRowClicked?: (data: any) => void
}

type TResult = {
  className: string
  girlsCount: number
  boysCount: number
  totalCount: number
  repeaterCount: number
}

const AnnualResultSummaryTable: FC<Props> = (props) => {
  const { t } = useTranslation()

  const columns = useMemo<ColumnDef<TResult>[]>(
    () => [
      {
        accessorKey: 'className',
        header: () => t('label-class'),
      },
      {
        accessorKey: 'girlsCount',
        header: () => t('label-girlsCount'),
      },
      {
        accessorKey: 'boysCount',
        header: () => t('label-boysCount'),
      },
      {
        accessorKey: 'totalCount',
        header: () => t('label-totalCount'),
      },
      {
        accessorKey: 'repeaterCount',
        header: () => t('label-repeaterCount'),
      },
    ],
    [],
  )

  return (
    <CommonTable
      data={props.dataSource!}
      columns={columns}
      onModelUpdate={(rows) => showDisplayedRowCount(rows)}
      showQuickFilter={true}
      onGlobalFilterChanged={props.onGlobalFilterChanged}
      showCheckbox={false}
      //onRowClicked={props.onRowClicked}
      pageSize={10}
    />
  )
}

export default AnnualResultSummaryTable
