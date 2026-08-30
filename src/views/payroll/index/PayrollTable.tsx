import type { FC } from 'react'

import { showDisplayedRowCount } from '@/utils/helpers'
import CommonTable from '@/@core/components/react-table/common-react-table'
import { useTableColumns } from './payrollModel'

const PayrollTable: FC<CommonTableProps> = (props) => {
  const { columns } = useTableColumns(
    props.modal,
    props.refetch as (() => void) | undefined,
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

export default PayrollTable
